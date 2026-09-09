import { ThemeToggle } from '@/components/ThemeToggle';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSessionPayload } from '@/lib/storage';
import { achievements, isAchievementUnlocked } from '@/lib/achievements';
import { getWorldCompletion } from '@/lib/progress';
import { worlds } from '@/lib/data';
import { AchievementMedal } from '@/components/AchievementMedal';
import { ShareAchievement } from '@/components/ShareAchievement';

export const metadata = { title: 'Meu perfil e conquistas | Politika' };

export default async function ProfilePage() {
  const { user, progress } = await getSessionPayload();
  if (!user) redirect('/');
  const unlockedCount = achievements.filter((item) => isAchievementUnlocked(item.worldId, progress)).length;
  return <div className="page-shell"><div className="app-layout">
    <aside className="sidebar">
      <Link href="/" className="brand"><span className="brand-mark">P</span><span>politika<span className="brand-dot">.</span></span></Link>
      <nav className="nav-list" aria-label="Navegação do perfil">
        <Link className="nav-link" href="/" aria-label="Painel principal / Home"><span aria-hidden="true">⌂</span> Painel principal</Link>
        <Link className="nav-link" href="/#trilhas" aria-label="Trilhas"><span aria-hidden="true">◈</span> Trilhas</Link>
        <Link className="nav-link active" href="/perfil" aria-current="page" aria-label="Meu perfil"><span aria-hidden="true">◎</span> Meu perfil</Link>
      </nav>
    </aside>
    <main className="main-panel">
      <header className="topbar"><div><div className="eyebrow">Sua jornada, suas conquistas</div><h1 className="title">Meu perfil</h1></div><div className="topbar-right"><ThemeToggle /><span className="pill">✦ {unlockedCount}/{achievements.length} conquistas</span></div></header>
      <section className="profile-summary"><div className="avatar">{user.name.slice(0, 2).toUpperCase()}</div><div><h2>{user.name}</h2><p>{progress.completedTasks.length} tarefas concluídas · Cada passo conta.</p></div></section>
      <div className="section-head"><h2>Uma medalha a cada mundo</h2></div>
      <p className="achievement-intro">Conclua todas as tarefas de um mundo para revelar sua conquista. Seu progresso é reconhecido automaticamente.</p>
      <div className="achievement-grid">{achievements.map((achievement) => {
        const unlocked = isAchievementUnlocked(achievement.worldId, progress);
        const summary = getWorldCompletion(achievement.worldId, progress);
        return <article data-world={achievement.worldId} key={achievement.worldId} className={`achievement-card ${unlocked ? 'unlocked' : 'is-locked'}`} style={{ borderTopColor: `var(--world-accent, ${achievement.color})` }}>
          <span className="achievement-state">{unlocked ? '✓ Desbloqueada' : '🔒 Bloqueada'} · Conquista {achievement.number}</span>
          <AchievementMedal achievement={achievement}/>
          <div className="eyebrow">Mundo {achievement.number} · {worlds.find((world) => world.id === achievement.worldId)?.name}</div>
          <h3>{achievement.title}</h3><p className="achievement-phrase">{achievement.phrase}</p>
          <div className="achievement-progress"><span>{summary.completed}/{summary.total} tarefas concluídas</span><progress max={summary.total} value={summary.completed} aria-label={`Progresso da conquista ${achievement.number}`}/></div>
          {unlocked ? <ShareAchievement worldId={achievement.worldId}/> : <p className="achievement-requirement">Conclua o Mundo {achievement.number} para desbloquear esta medalha e seu link público.</p>}
        </article>;
      })}</div>
    </main>
  </div></div>;
}
