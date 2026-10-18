'use client';

import { AuthForm } from '@/components/AuthForm';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { worlds } from '@/lib/catalog';
import { getWorldStatus, isWorldUnlocked, type UserProgress } from '@/lib/progress';
import { WorldCard } from '@/components/WorldCard';

type SessionUser = { id: string; name: string };
type SessionData = { user: SessionUser | null; progress: UserProgress };

type BlockState = {
  worldId: string;
  worldName: string;
  completed: number;
  total: number;
  missing: number;
};

export default function HomePage() {
  const router = useRouter();
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [block, setBlock] = useState<BlockState | null>(null);

  const loadSession = async () => {
    try {
      const response = await fetch('/api/session', { method: 'GET' });
      const data = await response.json();
      if (!response.ok) { setError(data.error ?? 'Falha ao carregar sua conta.'); return; }
      setSession(data); setError('');
    } catch { setError('Falha de conexao. Tente novamente.'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => void loadSession(), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const logout = async () => {
    try {
      const response = await fetch('/api/session', { method: 'DELETE', headers: { 'Content-Type': 'application/json' } });
      if (!response.ok) { setError('Não foi possível sair. Tente novamente.'); return; }
      await loadSession();
      router.refresh();
    } catch { setError('Não foi possível sair. Tente novamente.'); }
  };

  if (loading) {
    return (
      <main className="auth-screen">
        <div className="auth-card">
          <header className="auth-header"><ThemeToggle /></header>
          <div className="eyebrow">Carregando</div>
          <h1>Preparando a trilha</h1>
        </div>
      </main>
    );
  }

  if (!session?.user) {
    return <AuthForm externalError={error} onAuthenticated={async () => { await loadSession(); router.refresh(); }} />;
  }

  const progress = session.progress;
  const total = worlds.reduce((sum, world) => sum + world.tasks.length, 0);
  const completed = worlds.flatMap(world => world.tasks).filter(task => progress.completedTasks.includes(task.id)).length;
  const overall = total ? Math.round(completed / total * 100) : 0;
  return <div className="page-shell"><div className="app-layout">
    <aside className="sidebar"><Link className="brand" href="/"><span className="brand-mark">P</span><span>politika<span className="brand-dot">.</span></span></Link>
      <nav className="nav-list" aria-label="Navegação principal"><Link className="nav-link active" href="/">⌂ Visão geral</Link><Link className="nav-link" href="/#trilhas">◈ Mundos e trilhas</Link><Link className="nav-link" href="/biblioteca">▤ Biblioteca de consulta</Link><Link className="nav-link" href="/perfil">◎ Meu perfil e certificados</Link></nav>
      <div className="user-summary"><strong>{session.user.name}</strong><button className="secondary-button" type="button" onClick={logout}>Sair</button></div>
    </aside>
    <main className="main-panel">{error && <p role="alert">{error}</p>}
      <header className="topbar"><div><div className="eyebrow">Seu mapa de aprendizagem</div><h1 className="title">Bem-vindo, {session.user.name}</h1></div><div className="topbar-right"><ThemeToggle/></div></header>
      <div className="dashboard-grid"><div className="metric-card warm"><small>Lições concluídas</small><strong>{completed}</strong></div><div className="metric-card calm"><small>Progresso geral</small><strong>{overall}%</strong></div><div className="metric-card golden"><small>Mundos concluídos</small><strong>{progress.completedWorlds.length}/{worlds.length}</strong></div></div>
      <section className="highlight-panel education-intro"><div className="eyebrow">Sua jornada de aprendizagem</div><h2>Conheça os mundos da Politika</h2><p>Comece pelos três mundos iniciais. Ao concluir os três, Executivo, Legislativo, Judiciário e Economia serão liberados juntos.</p><Link className="primary-button" href="/mundo-1">Estudar Fundamentos →</Link><Link className="secondary-button" href="/biblioteca">Consultar biblioteca</Link></section>
      <div className="section-head" id="trilhas"><h2>Mundos e trilhas</h2></div>
      <div className="world-grid">{worlds.map(world => <WorldCard key={world.id} world={world} progress={progress} onOpen={() => {
        if (isWorldUnlocked(world.id, progress)) router.push('/' + world.id);
        else setBlock({ worldId: world.id, worldName: world.name, completed: 0, total: 0, missing: 0 });
      }}/>)}</div>
      {block && <section className="block-card" role="status"><h2>🔒 {block.worldName}</h2><p>{getWorldStatus(block.worldId, progress).blockedReason}</p><button className="secondary-button" onClick={() => setBlock(null)}>Entendi</button></section>}
    </main>
  </div></div>;
}
