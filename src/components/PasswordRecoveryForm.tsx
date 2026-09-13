'use client';
import Link from 'next/link';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { passwordError, passwordHint } from '@/lib/password-policy';

export function PasswordRecoveryForm({ reset = false }: { reset?: boolean }) {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [loaded, setLoaded] = useState(!reset);
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const submitting = useRef(false);
  const generation = useRef(0);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [wait, setWait] = useState(0);
  useEffect(() => {
    if (!reset) return;
    const readLink = () => {
      generation.current++;
      submitting.current = false;
      setDone(false); setBusy(false); setError(''); setMessage(''); setWait(0);
      setPassword(''); setConfirmation(''); setVisible(false);
      const url = new URL(window.location.href);
      const value = new URLSearchParams(url.hash.slice(1)).get('token') ?? url.searchParams.get('token') ?? '';
      setToken(value); setLoaded(true);
      if (!/^[A-Za-z0-9_-]{43}$/.test(value)) setError('Este link é inválido ou expirou. Solicite uma nova recuperação de senha.');
      window.history.replaceState(null, '', window.location.pathname);
    };
    const timer = window.setTimeout(readLink, 0);
    window.addEventListener('hashchange', readLink);
    return () => { window.clearTimeout(timer); window.removeEventListener('hashchange', readLink); };
  }, [reset]);
  useEffect(() => {
    if (!wait) return;
    const timer = window.setTimeout(() => setWait(value => Math.max(0, value - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [wait]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current || wait || done) return;
    setError(''); setMessage('');
    if (reset) {
      const problem = passwordError(password);
      if (problem) { setError(problem); return; }
      if (password !== confirmation) { setError('As senhas devem ser iguais.'); return; }
    }
    submitting.current = true; setBusy(true);
    const current = generation.current;
    try {
      const response = await fetch('/api/auth/' + (reset ? 'reset-password' : 'forgot-password'), {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reset ? { token, password, confirmPassword: confirmation } : { email }),
      });
      const data: unknown = await response.json();
      if (current !== generation.current) return;
      const result = data && typeof data === 'object' ? data : {};
      const retry = Number(response.headers.get('Retry-After'));
      if (Number.isFinite(retry) && retry > 0) setWait(Math.min(3600, Math.ceil(retry)));
      if (!response.ok) {
        setError('error' in result && typeof result.error === 'string' ? result.error : 'Não foi possível concluir. Tente novamente.');
        return;
      }
      setMessage('message' in result && typeof result.message === 'string' ? result.message : 'Solicitação concluída.');
      if (reset) { setDone(true); setToken(''); setPassword(''); setConfirmation(''); }
      else setWait(60);
    } catch { if (current === generation.current) setError('Falha de conexão. Confira sua internet e tente novamente.'); }
    finally { if (current === generation.current) { submitting.current = false; setBusy(false); } }
  }
  return <main className="auth-screen"><div className="auth-card">
    <header className="auth-header"><ThemeToggle /></header>
    <div className="eyebrow">Politika</div><h1>{reset ? 'Redefinir senha' : 'Recuperar senha'}</h1>
    <p>{reset ? 'Crie uma nova senha para voltar à sua trilha.' : 'Informe o e-mail da sua conta para receber um link válido por 30 minutos.'}</p>
    {!loaded && <p role="status">Preparando formulário…</p>}
    {loaded && !done && (!reset || /^[A-Za-z0-9_-]{43}$/.test(token)) && <form className="auth-form" onSubmit={submit} aria-busy={busy}>
      {!reset ? <><label htmlFor="recovery-email">E-mail</label><input id="recovery-email" type="email" autoComplete="email" autoCapitalize="none" spellCheck={false} required maxLength={254} disabled={busy} value={email} onChange={e => setEmail(e.target.value)} /></> : <>
        <p id="password-policy">{passwordHint}</p>
        <label htmlFor="new-password">Nova senha</label><input id="new-password" type={visible ? 'text' : 'password'} autoComplete="new-password" aria-describedby="password-policy" required disabled={busy} value={password} onChange={e => setPassword(e.target.value)} />
        <label htmlFor="confirm-password">Confirmar nova senha</label><input id="confirm-password" type={visible ? 'text' : 'password'} autoComplete="new-password" required disabled={busy} value={confirmation} onChange={e => setConfirmation(e.target.value)} />
        <button type="button" disabled={busy} aria-pressed={visible} aria-controls="new-password confirm-password" onClick={() => setVisible(value => !value)}>{visible ? 'Ocultar senhas' : 'Mostrar senhas'}</button>
      </>}
      <button type="submit" disabled={busy || wait > 0}>{busy ? 'Aguarde…' : wait ? `Tente novamente em ${wait}s` : reset ? 'Redefinir senha' : 'Enviar link de recuperação'}</button>
    </form>}
    {error && <p role="alert" style={{ color: 'var(--danger-text)' }}>{error}</p>}
    {message && <p role="status">{message}</p>}
    {reset && !done && <p><Link href="/recuperar-senha">Solicitar nova recuperação</Link></p>}
    <p><Link href="/">{done ? 'Ir para o login' : 'Voltar para o login'}</Link></p>
  </div></main>;
}
