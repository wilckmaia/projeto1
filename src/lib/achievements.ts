import { worlds } from './catalog';
import { getWorldCompletion, type UserProgress } from './progress';
export const achievements = worlds.map(world => ({ worldId: world.id, number: Number(world.number), title: world.certificateTitle, symbol: 'temple', color: world.color, phrase: 'Conclusão integral do mundo ' + world.name + '.' }));
export type Achievement = typeof achievements[number];
export function isAchievementUnlocked(worldId: string, progress: UserProgress) {
 const { total, completed } = getWorldCompletion(worldId, progress);
 return total > 0 && completed === total;
}
