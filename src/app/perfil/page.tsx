import { prisma } from '@/lib/prisma';
import { ThemeToggle } from '@/components/ThemeToggle';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSessionPayload, worldCompleted } from '@/lib/storage';
import { achievements, isAchievementUnlocked } from '@/lib/achievements';
import { achievements as legacyAchievements } from '@/lib/legacy-achievements';
import { getWorldCompletion } from '@/lib/progress';
import { CertificateButton } from '@/components/CertificateButton';
import { ShareAchievement } from '@/components/ShareAchievement';
import { AchievementMedal } from '@/components/AchievementMedal';
import { WorldIcon } from '@/components/WorldIcon';
import { worlds } from '@/lib/catalog';
export const metadata = { title: 'Meu perfil e certificados | Politika' };
export default async function ProfilePage() {
 const { user, progress } = await getSessionPayload();
 if (!user) redirect('/');
 const [certificates, shares] = await Promise.all([
  prisma.certificate.findMany({ where: { userId: user.id }, orderBy: { issuedAt: 'desc' } }),
  prisma.achievementShare.findMany({ where: { userId: user.id } }),
 ]);
 const legacy = await Promise.all(legacyAchievements.map(async achievement => ({ achievement, done: await worldCompleted(user.id, achievement.worldId) })));
 return <main className="task-page"><header className="task-header"><Link href="/" className="back-button">← Painel principal</Link><Link href="/biblioteca" className="secondary-button">Biblioteca</Link><ThemeToggle/></header><div className="task-body"><div className="eyebrow">Sua jornada</div><h1>Meu perfil</h1><h2>{user.name}</h2><p>{progress.completedTasks.length} atividades concluídas.</p><div className="section-head"><h2>Certificados por mundo</h2></div>
 <div className="certificate-grid">{achievements.map(achievement => {
  const world = worlds.find(world => world.id === achievement.worldId)!;
  const unlocked = isAchievementUnlocked(world.id, progress);
  const summary = getWorldCompletion(world.id, progress);
  const certificate = certificates.find(item => item.worldId === world.id);
  return <article className="achievement-card" data-world={world.id} key={world.id}>{world.original ? <AchievementMedal achievement={legacyAchievements.find(item => item.worldId === world.id)!}/> : <span className="world-icon"><WorldIcon kind={world.icon}/></span>}<h3>{achievement.title}</h3><p>{summary.total ? summary.completed + '/' + summary.total + ' lições concluídas' : 'Conteúdo em preparação'}</p><progress max={Math.max(1, summary.total)} value={summary.completed}/>{certificate ? <Link className="primary-button" href={'/certificados/' + certificate.id}>Visualizar / baixar PDF</Link> : unlocked ? <CertificateButton worldId={world.id}/> : <p className="achievement-requirement">Conclua todas as lições deste mundo para emitir seu certificado.</p>}</article>;
 })}</div>
 {certificates.length > 0 && <section><h2>Todos os certificados emitidos</h2>{certificates.map(certificate => <p key={certificate.id}><Link href={'/certificados/' + certificate.id}>{certificate.title} · {certificate.issuedAt.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</Link></p>)}</section>}
 <section className="legacy-achievements"><h2>Histórico preservado</h2><p>Seu progresso anterior e suas conquistas continuam guardados. A conclusão dos três mundos iniciais libera os quatro mundos seguintes.</p>{legacy.filter(item => item.done || shares.some(share => share.worldId === item.achievement.worldId)).map(({ achievement }) => <article className="keybox" key={achievement.worldId}><h3>{achievement.title}</h3><ShareAchievement worldId={achievement.worldId} initialPath={shares.find(share => share.worldId === achievement.worldId) ? '/conquistas/' + shares.find(share => share.worldId === achievement.worldId)!.token : undefined}/></article>)}<Link className="secondary-button" href="/biblioteca">Consultar acervo anterior</Link></section>
 </div></main>;
}
