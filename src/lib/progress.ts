import { worlds } from "@/lib/catalog";

export type ProgressAnswer = {
  questionId: string;
  selectedIndex: number;
  correctIndex: number;
  isCorrect: boolean;
  explanation?: string;
};

export type TaskProgress = {
  taskId: string;
  worldId: string;
  completed: boolean;
  completedAt: string | null;
  answers: ProgressAnswer[];
  acertos: number;
  erros: number;
};

export type UserProgress = {
  completedTasks: string[];
  completedWorlds: string[];
  taskProgress: Record<string, TaskProgress>;
  currentWorldId: string;
  lastUpdated: string | null;
};

export const defaultProgress: UserProgress = {
  completedTasks: [],
  completedWorlds: [],
  taskProgress: {},
  currentWorldId: "mundo-1",
  lastUpdated: null,
};

export const isWorldUnlocked = (worldId: string, progress: UserProgress): boolean => {
  const world = worlds.find(world => world.id === worldId);
  if (!world) return false;
  return world.prerequisiteWorldIds.every(id => {
    const required = worlds.find(world => world.id === id);
    return Boolean(required?.tasks.length && isWorldUnlocked(id, progress) && required.tasks.every(task => progress.completedTasks.includes(task.id)));
  });
};

export const getWorldCompletion = (worldId: string, progress: UserProgress) => {
  const world = worlds.find((item) => item.id === worldId);
  if (!world) return { total: 0, completed: 0, percent: 0 };
  const total = world.tasks.length;
  const completed = world.tasks.filter((task) => progress.completedTasks.includes(task.id)).length;
  return { total, completed, percent: total === 0 ? 0 : Math.round((completed / total) * 100) };
};

export const getWorldStatus = (worldId: string, progress: UserProgress) => {
  const unlocked = isWorldUnlocked(worldId, progress);
  const summary = getWorldCompletion(worldId, progress);
  return {
    unlocked,
    summary,
    blockedReason: unlocked ? "" : worlds.find(world => world.id === worldId)?.original
      ? `Conclua o mundo ${worlds.find(world => world.id === worlds.find(item => item.id === worldId)?.prerequisiteWorldIds[0])?.name ?? 'anterior'} para desbloquear este mundo.`
      : 'Conclua os três mundos iniciais para desbloquear este mundo.',
  };
};

export const getReviewTasks = (progress: UserProgress) => {
  return Object.values(progress.taskProgress)
    .filter((task) => task.completed && task.erros > 0)
    .map((task) => task.taskId);
};

export const buildTaskCompletion = (
  taskId: string,
  worldId: string,
  answers: ProgressAnswer[],
  completedAt: string,
  existing: UserProgress,
) => {
  const taskAnswers = answers.map((answer) => ({ ...answer }));
  const acertos = taskAnswers.filter((answer) => answer.isCorrect).length;
  const erros = taskAnswers.filter((answer) => !answer.isCorrect).length;
  const task = worlds.find((world) => world.id === worldId)?.tasks.find((item) => item.id === taskId);
  if (!task) return existing;
  const completed = !worlds.find(world => world.id === worldId)?.original || taskAnswers.length === task.questionCount;
  const taskProgress: TaskProgress = {
    taskId,
    worldId,
    completed,
    completedAt: completed ? completedAt : null,
    answers: taskAnswers,
    acertos,
    erros,
  };

  const completedTasks = new Set(existing.completedTasks);
  if (completed) completedTasks.add(taskId);

  const worldTasks = worlds.find((world) => world.id === worldId)?.tasks ?? [];
  const completedWorlds = new Set(existing.completedWorlds);
  if (worldTasks.length > 0 && worldTasks.every((task) => completedTasks.has(task.id))) {
    completedWorlds.add(worldId);
  }

  const updated: UserProgress = {
    ...existing,
    completedTasks: Array.from(completedTasks),
    completedWorlds: Array.from(completedWorlds),
    currentWorldId: worldId,
    lastUpdated: completedAt,
    taskProgress: {
      ...existing.taskProgress,
      [taskId]: taskProgress,
    },
  };

  return updated;
};
