import 'server-only';
import { prisma } from './prisma';
import { getWorldById } from './data';
import { getProgressByUserId } from './storage';
import { getWorldCompletion, isWorldUnlocked } from './progress';
import { HttpError } from './errors';

export async function issueCertificate(userId: string, worldId: string) {
  return prisma.$transaction(async tx => {
    const users = await tx.$queryRaw<{ id: string; name: string }[]>`SELECT "id", "name" FROM "User" WHERE "id" = ${userId} FOR UPDATE`;
    if (!users[0]) throw new HttpError(401, 'Entre novamente na sua conta.');
    const existing = await tx.certificate.findUnique({ where: { userId_worldId: { userId, worldId } } });
    if (existing) return existing;
    const world = getWorldById(worldId);
    if (!world) throw new HttpError(404, 'Mundo não encontrado.');
    const progress = await getProgressByUserId(userId, tx);
    const { total, completed } = getWorldCompletion(worldId, progress);
    if (!total || completed !== total || !isWorldUnlocked(worldId, progress)) throw new HttpError(403, 'Conclua todas as lições deste mundo para emitir o certificado.');
    const dates = world.tasks.map(task => progress.taskProgress[task.id]?.completedAt);
    if (dates.some(date => !date)) throw new HttpError(409, 'Progresso incompleto. Recarregue a página.');
    const completedAt = new Date(Math.max(...dates.map(date => new Date(date!).getTime())));
    return tx.certificate.create({ data: { userId, worldId, userName: users[0].name, worldName: world.name, title: world.certificateTitle, color: world.color, completedAt } });
  });
}
