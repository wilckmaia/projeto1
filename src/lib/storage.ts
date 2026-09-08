import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { worlds } from "@/lib/data";
import { defaultProgress, type ProgressAnswer, type UserProgress } from "@/lib/progress";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "politika_user";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30;
export type UserRecord = { id: string; name: string; email: string; createdAt: string };
const publicUser = (user: { id: string; name: string; email: string; createdAt: Date }): UserRecord => ({ id: user.id, name: user.name, email: user.email, createdAt: user.createdAt.toISOString() });
const normalizeEmail = (email: string) => email.trim().toLowerCase();

export async function registerUser(name: string, email: string, password: string) {
  const normalizedName = name.trim().slice(0, 40);
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedName) throw new Error("Informe seu nome.");
  if (!normalizedEmail || !normalizedEmail.includes("@")) throw new Error("Informe um e-mail válido.");
  if (password.length < 6) throw new Error("A senha deve ter pelo menos 6 caracteres.");
  if (await prisma.user.findUnique({ where: { email: normalizedEmail } })) throw new Error("Já existe uma conta com este e-mail.");
  const user = await prisma.user.create({ data: { id: `user-${randomUUID()}`, name: normalizedName, email: normalizedEmail, passwordHash: await bcrypt.hash(password, 12) } });
  await setSession(user.id);
  return publicUser(user);
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email: normalizeEmail(email) } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) throw new Error("E-mail ou senha inválidos.");
  await setSession(user.id);
  return publicUser(user);
}

async function setSession(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, userId, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: SESSION_MAX_AGE });
}

export async function logoutUser() { (await cookies()).delete(SESSION_COOKIE); }

export async function getCurrentUser() {
  const userId = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!userId) return null;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user ? publicUser(user) : null;
}

export async function getProgressByUserId(userId: string): Promise<UserProgress> {
  const records = await prisma.taskProgress.findMany({ where: { userId }, include: { answers: { orderBy: { answeredAt: "asc" } } }, orderBy: { completedAt: "asc" } });
  const taskProgress = Object.fromEntries(records.map((record) => [record.taskId, { taskId: record.taskId, worldId: record.worldId, completed: record.completed, completedAt: record.completedAt?.toISOString() ?? null, answers: record.answers.map((answer) => ({ questionId: answer.questionId, selectedIndex: answer.selectedIndex, correctIndex: answer.correctIndex, isCorrect: answer.isCorrect })), acertos: record.acertos, erros: record.erros }]));
  const completedTasks = records.filter((record) => record.completed).map((record) => record.taskId);
  const completedWorlds = worlds.filter((world) => world.tasks.every((task) => completedTasks.includes(task.id))).map((world) => world.id);
  const lastRecord = records.at(-1);
  return { ...defaultProgress, completedTasks, completedWorlds, taskProgress, currentWorldId: lastRecord?.worldId ?? defaultProgress.currentWorldId, lastUpdated: lastRecord?.completedAt?.toISOString() ?? null };
}

export async function saveProgress(userId: string, progress: UserProgress) {
  await prisma.$transaction(async (transaction) => {
    const taskRecords = Object.values(progress.taskProgress).filter((task) => task.completedAt === progress.lastUpdated);
    for (const task of taskRecords) {
      const taskProgressId = `progress-${userId}-${task.taskId}`;
      await transaction.taskProgress.upsert({ where: { userId_taskId: { userId, taskId: task.taskId } }, create: { id: taskProgressId, userId, taskId: task.taskId, worldId: task.worldId, completed: task.completed, completedAt: task.completedAt ? new Date(task.completedAt) : null, acertos: task.acertos, erros: task.erros }, update: { worldId: task.worldId, completed: task.completed, completedAt: task.completedAt ? new Date(task.completedAt) : null, acertos: task.acertos, erros: task.erros } });
      if (task.answers.length > 0) await transaction.answerAttempt.createMany({ data: task.answers.map((answer: ProgressAnswer) => ({ id: randomUUID(), userId, taskProgressId, taskId: task.taskId, questionId: answer.questionId, selectedIndex: answer.selectedIndex, correctIndex: answer.correctIndex, isCorrect: answer.isCorrect, answeredAt: task.completedAt ? new Date(task.completedAt) : new Date() })) });
    }
  });
  return getProgressByUserId(userId);
}

export async function getSessionPayload() {
  const user = await getCurrentUser();
  if (!user) return { user: null, progress: { ...defaultProgress } };
  return { user, progress: await getProgressByUserId(user.id) };
}
