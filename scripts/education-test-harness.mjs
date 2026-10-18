import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';
const require = createRequire(import.meta.url);
export function load(file, dependencies = {}) {
  const exports = {};
  const code = ts.transpileModule(readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  new Function('exports', 'require', code)(exports, name => name === 'server-only' ? {} : name in dependencies ? dependencies[name] : require(name));
  return exports;
}
// Deliberately non-educational fixtures, injected only into test module instances.
export function fixtures() {
  const worlds = load('src/lib/data.ts', { './education': load('src/lib/education.ts'), './legacy-data': load('src/lib/legacy-data.ts'), './legacy-achievements': load('src/lib/legacy-achievements.ts') }).worlds.map(world => {
    const lesson = { id: 'fixture-' + world.id, title: 'Test fixture', summary: 'Test fixture', explanation: '', deepContent: '', keyConcepts: [], examples: [], questions: world.original ? [{prompt:'Fixture',options:['Fixture'],correctIndex:0,explanation:'Fixture'}] : [] };
    return { ...world, tasks: [{ ...lesson, questionCount: lesson.questions.length }], tracks: [{ id: 'track-' + world.id, title: 'Test fixture', description: '', lessons: [lesson] }] };
  });
  const catalog = { worlds };
  const data = { worlds, getWorldById: id => worlds.find(world => world.id === id), getTaskById: id => worlds.flatMap(world => world.tasks.map(task => ({ ...task, worldId: world.id, worldName: world.name, trackId: world.tracks[0].id }))).find(task => task.id === id) };
  return { worlds, data, progress: load('src/lib/progress.ts', { '@/lib/catalog': catalog }) };
}
