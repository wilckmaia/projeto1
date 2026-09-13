import 'server-only';
import { randomUUID } from 'node:crypto';
import { Prisma } from '@prisma/client';
import { worlds, getTaskById } from '@/lib/data';
import { defaultProgress, buildTaskCompletion, isWorldUnlocked, type UserProgress } from '@/lib/progress';
import { prisma } from '@/lib/prisma';
import { sessionUser } from './session';
import { HttpError } from './errors';
export type UserRecord = { id: string; name: string; email: string; createdAt: string };
type DB = Prisma.TransactionClient;
export async function getCurrentUser(): Promise<UserRecord | null> {
  const user = await sessionUser();
  return user ? { ...user, createdAt: user.createdAt.toISOString() } : null;
}
export async function getProgressByUserId(userId: string, db: DB = prisma): Promise<UserProgress> {
  const records = await db.taskProgress.findMany({ where: { userId }, include: { answers: true }, orderBy: [{ completedAt: { sort: 'asc', nulls: 'first' } }, { id: 'asc' }] });
  const taskProgress = Object.fromEntries(records.map(record => {
    const task = getTaskById(record.taskId);
    const answers = [...record.answers].sort((a, b) => Number(a.questionId.slice(record.taskId.length + 1)) - Number(b.questionId.slice(record.taskId.length + 1))).map(answer => ({
      questionId: answer.questionId, selectedIndex: answer.selectedIndex, correctIndex: answer.correctIndex, isCorrect: answer.isCorrect,
      explanation: task?.questions[Number(answer.questionId.slice(record.taskId.length + 1))]?.explanation ?? '',
    }));
    return [record.taskId, { taskId: record.taskId, worldId: record.worldId, completed: record.completed, completedAt: record.completedAt?.toISOString() ?? null, answers, acertos: record.acertos, erros: record.erros }];
  }));
  const completedTasks = records.filter(record => record.completed).map(record => record.taskId);
  const completedWorlds = worlds.filter(world => world.tasks.every(task => completedTasks.includes(task.id))).map(world => world.id);
  const lastRecord = records.at(-1);
  return { ...defaultProgress, completedTasks, completedWorlds, taskProgress, currentWorldId: lastRecord?.worldId ?? defaultProgress.currentWorldId, lastUpdated: lastRecord?.completedAt?.toISOString() ?? null };
}
export async function worldCompleted(userId: string, worldId: string, db: DB = prisma) {
  const tasks = worlds.find(world => world.id === worldId)?.tasks.map(task => task.id);
  return Boolean(tasks?.length && await db.taskProgress.count({ where: { userId, completed: true, taskId: { in: tasks } } }) === tasks.length);
}
export async function saveAnswers(userId: string, taskId: string, worldId: string, answers: unknown[]) {
  const task = getTaskById(taskId);
  if (!task) throw new HttpError(404, 'Tarefa não encontrada.');
  if (task.worldId !== worldId) throw new HttpError(400, 'Tarefa inválida para este mundo.');
  if (!answers.length || answers.length > task.questions.length || (!task.sequential && answers.length !== task.questions.length)) throw new HttpError(400, 'Responda todas as questões com opções válidas antes de concluir.');
  const verified = answers.map((value, index) => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new HttpError(400, 'Resposta inválida.');
    const answer = value as Record<string, unknown>;
    if (Object.keys(answer).some(key => !['questionId', 'selectedIndex'].includes(key)) || answer.questionId !== task.id + '-' + index ||
      typeof answer.selectedIndex !== 'number' || !Number.isInteger(answer.selectedIndex) || answer.selectedIndex < 0 || answer.selectedIndex >= task.questions[index].options.length) throw new HttpError(400, 'Resposta inválida.');
    return { questionId: task.id + '-' + index, selectedIndex: answer.selectedIndex, correctIndex: task.questions[index].correctIndex, isCorrect: answer.selectedIndex === task.questions[index].correctIndex };
  });
  // All writes for one account serialize on an existing row, including first attempts.
  // The state is read AFTER the lock under PostgreSQL READ COMMITTED.
  return prisma.$transaction(async tx => {
    const users = await tx.$queryRaw<{ id: string }[]>`SELECT "id" FROM "User" WHERE "id" = ${userId} FOR UPDATE`;
    if (!users.length) throw new HttpError(401, 'Entre novamente na sua conta.');
    const progress = await getProgressByUserId(userId, tx);
    if (!isWorldUnlocked(worldId, progress)) throw new HttpError(403, 'Mundo bloqueado. Complete as tarefas anteriores primeiro.');
    const previous = progress.taskProgress[taskId];
    if (task.sequential && previous && previous.answers.length > verified.length) throw new HttpError(409, 'Há respostas mais recentes. Recarregue a página para continuar.');
    if (previous && previous.answers.length === verified.length && previous.answers.every((a, i) => a.selectedIndex === verified[i].selectedIndex)) return progress;
    const updated = buildTaskCompletion(taskId, worldId, verified, new Date().toISOString(), progress);
    const current = updated.taskProgress[taskId];
    const id = 'progress-' + userId + '-' + taskId;
    const data = { worldId, completed: current.completed, completedAt: current.completedAt ? new Date(current.completedAt) : null, acertos: current.acertos, erros: current.erros };
    const saved = await tx.taskProgress.upsert({ where: { userId_taskId: { userId, taskId } }, create: { id, userId, taskId, ...data }, update: data });
    for (const answer of verified) {
      await tx.answerAttempt.upsert({
        where: { taskProgressId_questionId: { taskProgressId: saved.id, questionId: answer.questionId } },
        create: { id: randomUUID(), userId, taskId, taskProgressId: saved.id, ...answer },
        update: { ...answer, answeredAt: new Date() },
      });
    }
    return getProgressByUserId(userId, tx);
  }, { maxWait: 10000, timeout: 15000 });
}
export async function getSessionPayload() {
  const user = await getCurrentUser();
  return user ? { user, progress: await getProgressByUserId(user.id) } : { user: null, progress: { ...defaultProgress } };
}
