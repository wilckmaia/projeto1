import { NextResponse } from 'next/server';
import { achievements, isAchievementUnlocked } from '@/lib/achievements';
import { getSessionPayload } from '@/lib/storage';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const session = await getSessionPayload();
  if (!session.user) return NextResponse.json({ error: 'Entre na sua conta para compartilhar.' }, { status: 401 });
  const body = await request.json().catch(() => null);
  const achievement = achievements.find((item) => item.worldId === body?.worldId);
  if (!achievement) return NextResponse.json({ error: 'Conquista não encontrada.' }, { status: 404 });
  if (!isAchievementUnlocked(achievement.worldId, session.progress)) return NextResponse.json({ error: 'Conclua este mundo para compartilhar a conquista.' }, { status: 403 });
  const share = await prisma.achievementShare.upsert({
    where: { userId_worldId: { userId: session.user.id, worldId: achievement.worldId } },
    create: { userId: session.user.id, worldId: achievement.worldId }, update: {},
  });
  return NextResponse.json({ path: `/conquistas/${share.token}` });
}
