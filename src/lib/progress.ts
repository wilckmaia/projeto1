import { worlds } from "@/lib/data";

export type ProgressAnswer = {
  questionId: string;
  selectedIndex: number;
  correctIndex: number;
  isCorrect: boolean;
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

export const isWorldUnlocked = (worldId: string, progress: UserProgress) => {
  const worldOrder = worlds.map((world) => world.id);
  const currentIndex = worldOrder.indexOf(worldId);
  if (currentIndex === -1) return false;
  if (worldId === "mundo-1") return true;
  const previousWorldId = worldOrder[currentIndex - 1];
  if (!previousWorldId) return false;
  const previousTasks = worlds.find((world) => world.id === previousWorldId)?.tasks ?? [];
  return previousTasks.every((task) => progress.completedTasks.includes(task.id));
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
    blockedReason: unlocked ? "" : worldId === "mundo-2"
      ? "Complete todas as atividades do Mundo 1 para desbloquear este mundo."
      : "Complete todas as atividades do Mundo 2 para continuar.",
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
  const completed = taskAnswers.length > 0;
  const taskProgress: TaskProgress = {
    taskId,
    worldId,
    completed,
    completedAt,
    answers: taskAnswers,
    acertos,
    erros,
  };

  const completedTasks = new Set(existing.completedTasks);
  if (completed) completedTasks.add(taskId);

  const worldTasks = worlds.find((world) => world.id === worldId)?.tasks ?? [];
  const completedWorlds = new Set(existing.completedWorlds);
  if (worldTasks.every((task) => completedTasks.has(task.id))) {
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
