import { getWorldCompletion, type UserProgress } from '@/lib/progress';

export const achievements = [
  { worldId: 'mundo-1', number: 1, title: 'A chama do conhecimento', symbol: 'flame', color: '#d97961', phrase: 'Cada pergunta abriu um caminho. Agora, seus conhecimentos têm raízes para ir além.' },
  { worldId: 'mundo-2', number: 2, title: 'Pilares da cidadania', symbol: 'temple', color: '#568d7b', phrase: 'Compreender a democracia é um passo para participar dela. Sua voz cresce com o que você aprende.' },
  { worldId: 'mundo-3', number: 3, title: 'Novos horizontes', symbol: 'star', color: '#647cbb', phrase: 'Você conectou ideias, desvendou desafios e ampliou seu olhar. Continue transformando curiosidade em consciência.' },
] as const;

export type Achievement = typeof achievements[number];
export function isAchievementUnlocked(worldId: string, progress: UserProgress) {
  const { total, completed } = getWorldCompletion(worldId, progress);
  return total > 0 && completed === total;
}
