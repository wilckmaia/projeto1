'use client';
import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
type Mode = 'login' | 'register' | 'resend';
export function AuthForm({ initialMode = 'login', onAuthenticated, externalError = '' }: {
  initialMode?: Mode; onAuthenticated?: () => Promise<void>; externalError?: string;
}) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [wait, setWait] = useState(0);
  const isEmailOnly = mode === 'resend';
  useEffect(() => {
    if (!wait) return;
    const timer = window.setTimeout(() => setWait(value => Math.max(0, value - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [wait]);
  function changeMode(next: Mode) {
    setMode(next); setError(''); setMessage(''); setPassword(''); setWait(0);
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || wait) return;
    setBusy(true); setError(''); setMessage('');
    try {
      const action = mode === 'resend' ? 'verify-resend' : mode;
      const response = await fetch('/api/session', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, email, ...(isEmailOnly ? {} : { password }), ...(mode === 'register' ? { name } : {}) }),
      });
      const data = await response.json();
      const retry = Number(response.headers.get('Retry-After'));
      if (retry > 0 && Number.isFinite(retry)) setWait(Math.min(3600, Math.ceil(retry)));
      if (!response.ok) { setError(data.error ?? 'Não foi possível concluir. Tente novamente.'); return; }
      setPassword('');
      if (mode === 'login') { await onAuthenticated?.(); }
      else if (mode === 'register') { setMode('login'); setMessage(data.message); setWait(0); }
      else { setMessage(data.message); setWait(60); }
    } catch { setError('Falha de conexão. Confira sua internet e tente novamente.'); }
    finally { setBusy(false); }
  }
  const title = { login: 'Entrar na sua trilha', register: 'Criar sua conta', resend: 'Verificação opcional' }[mode];
  const label = { login: 'Entrar', register: 'Criar conta', resend: 'Reenviar verificação' }[mode];
  return <main className="auth-screen"><div className="auth-card">
    <header className="auth-header"><ThemeToggle /></header>
    <div className="eyebrow">Usuário</div><h1>{title}</h1>
    <p>{isEmailOnly ? 'Informe seu e-mail para receber as instruções. O link expira em 30 minutos.' :
      mode === 'register' ? 'Crie sua conta e entre com seu e-mail e senha, sem precisar confirmar o e-mail.' :
      'Seu progresso fica vinculado à conta e continua disponível quando você voltar.'}</p>
    {!isEmailOnly && <div className="auth-tabs" aria-label="Acesso">
      <button type="button" disabled={busy} className={mode === 'login' ? 'active' : ''} onClick={() => changeMode('login')}>Entrar</button>
      <button type="button" disabled={busy} className={mode === 'register' ? 'active' : ''} onClick={() => changeMode('register')}>Criar conta</button>
    </div>}
    <form className="auth-form" onSubmit={submit} aria-busy={busy}>
      {mode === 'register' && <input required maxLength={40} disabled={busy} value={name} onChange={event => setName(event.target.value)} placeholder="Seu nome" aria-label="Seu nome" autoComplete="name" />}
      <input required type="email" maxLength={254} disabled={busy} value={email} onChange={event => setEmail(event.target.value)} placeholder="Seu e-mail" aria-label="Seu e-mail" autoComplete="email" autoCapitalize="none" spellCheck={false} />
      {!isEmailOnly && <input required type="password" disabled={busy} value={password} onChange={event => setPassword(event.target.value)}
        placeholder={mode === 'register' ? 'Sua senha (mínimo 15 caracteres)' : 'Sua senha'} aria-label="Sua senha" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />}
      {(error || externalError) && <p role="alert" style={{ color: 'var(--danger-text)', margin: 0 }}>{error || externalError}</p>}
      {message && <p role="status" style={{ margin: 0 }}>{message}</p>}
      <button type="submit" disabled={busy || wait > 0}>{busy ? 'Aguarde…' : wait ? 'Tente novamente em ' + wait + 's' : label}</button>
      {isEmailOnly && <Link href="/">Voltar para entrar ou criar conta</Link>}
      {/* Password recovery entry point temporarily hidden. */}
    </form>
  </div></main>;
}
