import { getWorldCompletion, type UserProgress } from '@/lib/progress';

export const achievements = [
  { worldId: 'mundo-1', number: 1, title: 'A chama do conhecimento', symbol: 'flame', color: '#d97961', phrase: 'Cada pergunta abriu um caminho. Agora, seus conhecimentos têm raízes para ir além.' },
  { worldId: 'mundo-2', number: 2, title: 'Pilares da cidadania', symbol: 'temple', color: '#568d7b', phrase: 'Compreender a democracia é um passo para participar dela. Sua voz cresce com o que você aprende.' },
  { worldId: 'mundo-3', number: 3, title: 'Novos horizontes', symbol: 'star', color: '#647cbb', phrase: 'Você conectou ideias, desvendou desafios e ampliou seu olhar. Continue transformando curiosidade em consciência.' },
  { worldId: 'mundo-4', number: 4, title: 'Certificação — MUNDO FLÁVIO BOLSONARO', symbol: 'star', color: '#568d7b', phrase: 'Conclusão dos 8 tópicos e das 40 perguntas do MUNDO FLÁVIO BOLSONARO.' },
  { worldId: 'mundo-5', number: 5, title: 'Certificação — MUNDO LULA', symbol: 'star', color: '#568d7b', phrase: 'Conclusão dos 8 tópicos e das 39 perguntas do MUNDO LULA.' },
  { worldId: 'mundo-6', number: 6, title: 'Certificação — MUNDO RENAN SANTOS', symbol: 'star', color: '#568d7b', phrase: 'Conclusão dos 8 tópicos e das 38 perguntas do MUNDO RENAN SANTOS.' },
  { worldId: 'mundo-7', number: 7, title: 'Certificação — MUNDO AUGUSTO CURY', symbol: 'star', color: '#568d7b', phrase: 'Conclusão dos 8 tópicos e das 36 perguntas do MUNDO AUGUSTO CURY.' },
] as const;

export type Achievement = typeof achievements[number];
export function isAchievementUnlocked(worldId: string, progress: UserProgress) {
  const { total, completed } = getWorldCompletion(worldId, progress);
  return total > 0 && completed === total;
}
