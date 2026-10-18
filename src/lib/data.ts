import 'server-only';
import { educationWorlds } from './education';
import type { Track } from './education';
import { worlds as legacyWorlds } from './legacy-data';
import { achievements } from './legacy-achievements';
export type { Lesson as Task } from './education';
const foundations = legacyWorlds.map((world, index) => ({
  ...world, original: true, color: achievements[index].color, icon: ['executive', 'legislative', 'judicial'][index],
  certificateTitle: achievements[index].title,
  prerequisiteWorldIds: index ? [legacyWorlds[index - 1].id] : [],
  tracks: [{ id: `trilha-${world.id}`, title: world.name, description: world.description, lessons: world.tasks }] as Track[],
}));
export const worlds = [...foundations, ...educationWorlds.map((world, index) => ({ ...world, original: false,
  number: String(index + 4), prerequisiteWorldIds: legacyWorlds.map(world => world.id),
  tasks: world.tracks.flatMap(track => track.lessons),
}))];
export const getWorldById = (id: string) => worlds.find(world => world.id === id);
export const allTasks = worlds.flatMap(world => world.tracks.flatMap(track => track.lessons.map(task => ({ ...task, worldId: world.id, worldName: world.name, trackId: track.id }))));
export const getTaskById = (id: string) => allTasks.find(task => task.id === id) ?? null;
