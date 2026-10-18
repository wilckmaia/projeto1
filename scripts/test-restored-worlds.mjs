import assert from 'node:assert/strict';
import { load } from './education-test-harness.mjs';
const catalog = load('src/lib/catalog.ts');
const { worlds } = catalog;
const progress = load('src/lib/progress.ts', { '@/lib/catalog': catalog });
assert.equal(worlds.length, 7);
const originals = worlds.filter(world => world.original);
const following = worlds.filter(world => !world.original);
assert.deepEqual(originals.map(world => world.id), ['mundo-1', 'mundo-2', 'mundo-3']);
assert.equal(originals.flatMap(world => world.tasks).length, 20);
let saved = { ...progress.defaultProgress };
for (const [index, world] of originals.entries()) {
  assert.equal(progress.isWorldUnlocked(world.id, saved), true);
  for (const next of following) assert.equal(progress.isWorldUnlocked(next.id, saved), false);
  for (const task of world.tasks) {
    const empty = progress.buildTaskCompletion(task.id, world.id, [], new Date().toISOString(), saved);
    assert.equal(empty.taskProgress[task.id].completed, false, 'original exercises require all answers');
    saved = progress.buildTaskCompletion(task.id, world.id, Array.from({length:task.questionCount}, (_,i)=>({questionId:task.id+'-'+i,selectedIndex:0,correctIndex:0,isCorrect:true})), new Date().toISOString(), saved);
  }
  assert.ok(saved.completedWorlds.includes(world.id));
  if(index < 2) for(const next of following) assert.equal(progress.isWorldUnlocked(next.id, saved), false);
}
for (const world of following) {
  assert.equal(world.tasks.length, world.id === 'economia' ? 7 : 0);
  assert.equal(progress.isWorldUnlocked(world.id, saved), true, 'four worlds unlock together');
  assert.deepEqual(progress.getWorldCompletion(world.id,saved),{total:world.id === 'economia' ? 7 : 0,completed:0,percent:0});
}
for(const taskId of originals.flatMap(world=>world.tasks.map(task=>task.id))){
  const incomplete={...saved,completedTasks:saved.completedTasks.filter(id=>id!==taskId)};
  for(const world of following)assert.equal(progress.isWorldUnlocked(world.id,incomplete),false,'every original activity is required');
}
console.log('PASS: original 20 lessons, original completion rules, saved progress, all four worlds unlocked together only after all three originals.');
