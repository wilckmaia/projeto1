'use client';

import { ThemeToggle } from '@/components/ThemeToggle';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { worlds } from '@/lib/data';
import { getWorldStatus, isWorldUnlocked, type UserProgress } from '@/lib/progress';

type SessionUser = { id: string; name: string };
type SessionData = { user: SessionUser | null; progress: UserProgress };

type BlockState = {
  worldId: string;
  worldName: string;
  completed: number;
  total: number;
  missing: number;
};

const worldMeta: Record<string, { color: string; label: string }> = {
  'mundo-1': { color: 'coral', label: 'Mundo 1' },
  'mundo-2': { color: 'mint', label: 'Mundo 2' },
  'mundo-3': { color: 'gold', label: 'Mundo 3' },
};

export default function HomePage() {
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [block, setBlock] = useState<BlockState | null>(null);

  const loadSession = async () => {
    const response = await fetch('/api/session', { method: 'GET' });
    const data = await response.json();
    setSession(data);
    setLoading(false);
  };

  useEffect(() => {
    const timer = window.setTimeout(() => void loadSession(), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const submitAuth = async () => {
    const response = await fetch('/api/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: authMode, name, email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? 'Não foi possível criar o usuário.');
      return;
    }

    setError('');
    setName('');
    setEmail('');
    setPassword('');
    await loadSession();
  };

  const logout = async () => {
    await fetch('/api/session', { method: 'DELETE' });
    await loadSession();
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
    return (
      <main className="auth-screen">
        <div className="auth-card">
          <header className="auth-header"><ThemeToggle /></header>
          <div className="eyebrow">Usuário</div>
          <h1>{authMode === 'login' ? 'Entrar na sua trilha' : 'Criar sua conta'}</h1>
          <p>Seu progresso fica vinculado à conta e continua disponível quando você voltar.</p>
          <div className="auth-tabs" role="tablist" aria-label="Acesso">
            <button type="button" className={authMode === 'login' ? 'active' : ''} onClick={() => { setAuthMode('login'); setError(''); }}>Entrar</button>
            <button type="button" className={authMode === 'register' ? 'active' : ''} onClick={() => { setAuthMode('register'); setError(''); }}>Criar conta</button>
          </div>
          <div className="auth-form">
            {authMode === 'register' && <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Seu nome" aria-label="Seu nome" />}
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Seu e-mail" aria-label="Seu e-mail" autoComplete="email" />
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Sua senha (mínimo 6 caracteres)" aria-label="Sua senha" autoComplete={authMode === 'login' ? 'current-password' : 'new-password'} />
            {error && <p style={{ color: 'var(--danger-text)', margin: 0 }}>{error}</p>}
            <button type="button" onClick={submitAuth}>{authMode === 'login' ? 'Entrar' : 'Criar conta'}</button>
          </div>
        </div>
      </main>
    );
  }

  const progress = session.progress;
  const completedTaskCount = progress.completedTasks.length;
  const totalTaskCount = worlds.reduce((sum, world) => sum + world.tasks.length, 0);
  const overall = totalTaskCount === 0 ? 0 : Math.round((completedTaskCount / totalTaskCount) * 100);

  const openWorld = (worldId: string) => {
    const world = worlds.find((item) => item.id === worldId);
    if (!world) return;

    if (isWorldUnlocked(worldId, progress)) {
      window.location.assign(`/${worldId}`);
      return;
    }

    const requiredTasks = world.prerequisiteWorldIds ? worlds.filter((item) => world.prerequisiteWorldIds?.includes(item.id)).flatMap((item) => item.tasks) : world.tasks;
    const completed = requiredTasks.filter((task) => progress.completedTasks.includes(task.id)).length;
    setBlock({
      worldId,
      worldName: world.name,
      completed,
      total: requiredTasks.length,
      missing: requiredTasks.length - completed,
    });
  };

  return (
    <div className="page-shell">
      <div className="app-layout">
        <aside className="sidebar">
          <div className="brand">
            <span className="brand-mark">P</span>
            <span>politika<span className="brand-dot">.</span></span>
          </div>

          <nav className="nav-list">
            <Link className="nav-link" href="/perfil" aria-label="Meu perfil"><span aria-hidden="true">◎</span> Meu perfil</Link>
            <button className="nav-link active" type="button">
              <span>⌂</span> Visão geral
            </button>
            <button className="nav-link" type="button" onClick={() => window.location.assign('/mundo-1')}>
              <span>◈</span> Trilhas
            </button>
          </nav>

          <div className="user-summary">
            <div className="user-pill">
              <div className="avatar">{session.user.name.slice(0, 2).toUpperCase()}</div>
              <div>
                <strong>{session.user.name}</strong>
                <small>Usuário ativo</small>
              </div>
            </div>
            <button className="secondary-button" type="button" style={{ marginTop: 16, width: '100%', backgroundColor: 'var(--danger-button)', color: 'var(--on-danger)', fontSize: 12, justifyContent: 'center', padding: '11px 8px' }} onClick={logout}>Sair</button>
          </div>
        </aside>

        <main className="main-panel">
          <header className="topbar">
            <div>
              <div className="eyebrow">Mapa de aprendizagem</div>
              <h1 className="title" style={{ fontSize: 'clamp(2rem, 3vw, 2.8rem)', marginBottom: 0 }}>Bem-vindo, {session.user.name}</h1>
            </div>
            <div className="topbar-right">
              <ThemeToggle />
              <span className="pill"><span className="spark">✦</span> {progress.completedTasks.length} tarefas</span>
              <span className="pill"><span className="spark">⚡</span> {overall}% concluído</span>
            </div>
          </header>

          <div className="dashboard-grid">
            <div className="metric-card warm">
              <span className="icon">✦</span>
              <small>Sequência</small>
              <strong>{progress.completedTasks.length}</strong>
              <div className="progress-bar"><span style={{ width: `${overall}%` }} /></div>
            </div>
            <div className="metric-card calm">
              <span className="icon">⚡</span>
              <small>Progresso geral</small>
              <strong>{overall}%</strong>
              <div className="progress-bar"><span style={{ width: `${overall}%` }} /></div>
            </div>
            <div className="metric-card golden">
              <span className="icon">◈</span>
              <small>Mundos</small>
              <strong>{progress.completedWorlds.length}/{worlds.length}</strong>
              <div className="progress-bar"><span style={{ width: `${(progress.completedWorlds.length / worlds.length) * 100}%` }} /></div>
            </div>
          </div>

          <div className="two-col">
            <section className="highlight-panel">
              <div className="eyebrow" style={{ color: 'var(--hero-muted)' }}>Continuar</div>
              <h2>{worlds[0].tasks[0].title}</h2>
              <div className="meta">Mundo 1 · Fundamentos</div>
              <div className="task-progress progress-bar"><span style={{ width: `${overall}%` }} /></div>
              <button className="primary-button" type="button" onClick={() => window.location.assign('/mundo-1/m1-t1')}>Continuar tarefa →</button>
            </section>

            <aside className="quote-box">
              <div className="mark">“</div>
              <p>O objetivo do conhecimento não é acumular respostas, mas fazer perguntas melhores.</p>
            </aside>
          </div>

          <div className="section-head">
            <h2>Seleção de mundos</h2>
          </div>

          <div className="world-grid" id="trilhas">
            {worlds.map((world) => {
              const unlocked = isWorldUnlocked(world.id, progress);
              const total = world.tasks.length;
              const completed = world.tasks.filter((task) => progress.completedTasks.includes(task.id)).length;
              const status = completed === total ? 'Concluído ✓' : unlocked ? 'Em andamento' : 'Bloqueado';

              return (
                <button
                  key={world.id}
                  data-world={world.id}
                  type="button"
                  className={`world-card ${worldMeta[world.id]?.color ?? 'coral'} ${unlocked ? '' : 'locked'} ${progress.currentWorldId === world.id ? 'selected' : ''}`}
                  onClick={() => openWorld(world.id)}
                  aria-label={`${world.name} ${status}`}
                >
                  <span className="world-icon">{world.number === '1' ? '◒' : world.number === '2' ? '◌' : '✺'}</span>
                  <div style={{ flex: 1 }}>
                    <small>MUNDO {world.number}</small>
                    <strong>{world.name}</strong>
                    <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: 6 }}>{completed}/{total} tarefas</div>
                  </div>
                  <span className="lock">{unlocked ? (completed === total ? '✓' : '→') : '🔒'}</span>
                </button>
              );
            })}
          </div>

          {block && (
            <div style={{ marginTop: 28, display: 'grid', placeItems: 'center' }}>
              <div className="block-card" data-world={block.worldId}>
                <div className="eyebrow">🔒 Mundo bloqueado</div>
                <h2>{block.worldName}</h2>
                <p>{getWorldStatus(block.worldId, progress).blockedReason}</p>
                <div className="stats">
                  <span>Progresso atual: {block.completed}/{block.total} atividades concluídas.</span>
                  <span>Faltam: {block.missing} atividades.</span>
                </div>
                <button
                  className="primary-button"
                  type="button"
                  onClick={() => {
                    setBlock(null);
                    window.location.assign(worlds.find((world) => world.id === block.worldId)?.prerequisiteWorldIds ? `/${worlds.slice(0, 3).find((world) => world.tasks.some((task) => !progress.completedTasks.includes(task.id)))?.id ?? 'mundo-1'}` : block.worldId === 'mundo-2' ? '/mundo-1' : '/mundo-2');
                  }}
                >
                  Continuar atividades
                </button>
              </div>
            </div>
          )}

          <div className="section-head">
            <h2>Tarefas em andamento</h2>
          </div>

          <div className="task-list">
            {worlds.flatMap((world) =>
              world.tasks.map((task) => {
                const done = progress.completedTasks.includes(task.id);
                return (
                  <button data-world={world.id} key={task.id} type="button" className="task-item" onClick={() => window.location.assign(`/${world.id}/${task.id}`)}>
                    <span className={`dot ${done ? '' : 'pending'}`} />
                    <div className="meta">
                      <strong>{task.title}</strong>
                      <small>{world.name}</small>
                    </div>
                    <span className="status">{done ? 'Concluída' : 'Abrir'}</span>
                  </button>
                );
              }),
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
