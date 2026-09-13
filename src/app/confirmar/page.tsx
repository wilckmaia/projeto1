'use client';
import Link from 'next/link';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
export default function ConfirmPage() {
  const generation = useRef(0);
  const [token, setToken] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [wait, setWait] = useState(0);
  useEffect(() => {
    const readLink = () => {
      generation.current++;
      setDone(false); setBusy(false); setInvalid(false); setError(''); setMessage(''); setWait(0);
      const params = new URLSearchParams(window.location.hash.slice(1));
      const value = params.get('token') ?? '', purpose = params.get('kind') ?? '';
      setToken(value); setLoaded(true);
      if (!/^[A-Za-z0-9_-]{43}$/.test(value) || purpose !== 'register') {
        setInvalid(true); setError('Link inválido ou incompleto. Abra novamente o link do e-mail ou solicite outro.');
      }
      window.history.replaceState(null, '', window.location.pathname);
    };
    const timer = window.setTimeout(readLink, 0);
    window.addEventListener('hashchange', readLink);
    return () => { window.clearTimeout(timer); window.removeEventListener('hashchange', readLink); };
  }, []);
  useEffect(() => {
    if (!wait) return;
    const timer = window.setTimeout(() => setWait(value => Math.max(0, value - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [wait]);
  async function confirm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || invalid || wait) return;
    setError('');
    const current = generation.current;
    setBusy(true);
    try {
      const response = await fetch('/api/session', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'confirm', token }) });
      const data = await response.json();
      if (generation.current !== current) return;
      if (!response.ok) {
        setError(data.error ?? 'Não foi possível confirmar. Tente novamente.');
        if (response.status === 400 && typeof data.error === 'string' && data.error.startsWith('Link ')) setInvalid(true);
        const retry = Number(response.headers.get('Retry-After'));
        if (retry > 0 && Number.isFinite(retry)) setWait(Math.min(3600, Math.ceil(retry)));
        return;
      }
      setMessage('Solicitação confirmada. Se você iniciou um cadastro, já pode entrar com seu e-mail e senha.');
      setDone(true); setToken('');
    } catch { if (generation.current === current) setError('Falha de conexão. Tente confirmar novamente. Se o link já foi usado, entre na conta ou solicite outro.'); }
    finally { if (generation.current === current) setBusy(false); }
  }
  return <main className="auth-screen"><div className="auth-card"><header className="auth-header"><ThemeToggle /></header>
    <h1>{!loaded ? 'Preparando confirmação' : 'Verificar e-mail'}</h1>
    {!done && loaded && !invalid && <form className="auth-form" onSubmit={confirm} aria-busy={busy}>
      <p>Confirme que você controla este endereço de e-mail para continuar.</p>
      <button type="submit" className="primary-button" disabled={busy || wait > 0}>{busy ? 'Confirmando…' : wait ? 'Tente novamente em ' + wait + 's' : 'Confirmar e-mail'}</button>
    </form>}
    {error && <p role="alert" style={{ color: 'var(--danger-text)' }}>{error}</p>}
    {message && <p role="status">{message}</p>}
    {!done && loaded && <p><Link href="/verificar-email">Solicitar novo link</Link></p>}
    <Link href="/">Voltar para entrar</Link>
  </div></main>;
}
