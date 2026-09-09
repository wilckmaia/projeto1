import { ThemeToggle } from '@/components/ThemeToggle';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getProgressByUserId } from '@/lib/storage';
import { achievements, isAchievementUnlocked } from '@/lib/achievements';
import { AchievementMedal } from '@/components/AchievementMedal';
import { worlds } from '@/lib/data';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Uma conquista para celebrar | Politika', description: 'Conhecimento que se transforma em conquista. Celebre mais um mundo concluído na Politika.', robots: { index: false, follow: false } };

export default async function PublicAchievement({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const share = await prisma.achievementShare.findUnique({ where: { token }, select: { worldId: true, userId: true, user: { select: { name: true } } } });
  if (!share) notFound();
  const achievement = achievements.find((item) => item.worldId === share.worldId);
  if (!achievement || !isAchievementUnlocked(share.worldId, await getProgressByUserId(share.userId))) notFound();
  return <main className="public-achievement" data-world={share.worldId} data-world-page={share.worldId}><header className="lesson-theme-header"><ThemeToggle /></header><Link className="brand" href="/"><span className="brand-mark">P</span><span>politika<span className="brand-dot">.</span></span></Link>
    <article className="achievement-card unlocked" style={{ borderTopColor: `var(--world-accent, ${achievement.color})` }}>
      <div className="eyebrow">Conhecimento que merece ser celebrado</div><AchievementMedal achievement={achievement}/>
      <span className="achievement-state">✓ Conquista {achievement.number} verificada</span>
      <h1>{achievement.title}</h1><p><strong>{share.user.name}</strong> concluiu o Mundo {achievement.number}: {worlds.find((world) => world.id === share.worldId)?.name}.</p>
      <p className="achievement-phrase">{achievement.phrase}</p><Link className="primary-button" href="/">Começar minha jornada →</Link>
    </article>
  </main>;
}
