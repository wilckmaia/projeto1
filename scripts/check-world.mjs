import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

function load(path, dependencies = {}) {
  const source = ts.transpileModule(readFileSync(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  const loaded = { exports: {} };
  new Function('exports', 'module', 'require', source)(loaded.exports, loaded, name => {
    assert.ok(name in dependencies, `Unexpected dependency: ${name}`);
    return dependencies[name];
  });
  return loaded.exports;
}
const data = load('src/lib/data.ts');
const progress = load('src/lib/progress.ts', { '@/lib/data': data });
const achievements = load('src/lib/achievements.ts', { '@/lib/progress': progress });
const world = data.getWorldById(process.argv[2] ?? 'mundo-4');
const prerequisites = data.worlds.slice(0, 3).flatMap(item => item.tasks.map(task => task.id));
const ready = { ...progress.defaultProgress, completedTasks: prerequisites };
assert.ok(progress.isWorldUnlocked(world.id, ready));
for (const missing of prerequisites) {
  assert.equal(progress.isWorldUnlocked(world.id, { ...ready, completedTasks: prerequisites.filter(id => id !== missing) }), false);
}
assert.equal(progress.isWorldUnlocked(world.id, progress.defaultProgress), false);
assert.equal(achievements.isAchievementUnlocked(world.id, ready), false);
for (const candidate of data.worlds.filter(item => item.prerequisiteWorldIds)) {
  assert.ok(progress.isWorldUnlocked(candidate.id, ready));
  assert.ok(!ready.completedWorlds.includes(candidate.id));
}
const expected = {
  'mundo-5': { name: 'MUNDO LULA', counts: [5, 5, 5, 4, 5, 5, 5, 5] },
  'mundo-6': { name: 'MUNDO RENAN SANTOS', counts: [5, 5, 5, 4, 4, 5, 5, 5] },
  'mundo-7': { name: 'MUNDO AUGUSTO CURY', counts: [4, 3, 5, 5, 5, 4, 5, 5] },
}[world.id];
if (expected) {
  assert.equal(world.name, expected.name);
  assert.deepEqual(world.tasks.map(task => task.questions.length), expected.counts);
  if (process.argv[3]) {
    const original = readFileSync(process.argv[3], 'utf8').replace(/\r\n/g, '\n');
    for (const [index, task] of world.tasks.entries()) {
      assert.ok(original.includes(`# ${index + 1}. ${task.title}\n\n## Resumo\n\n${task.summary}\n\n## Perguntas`));
      for (const [questionIndex, question] of task.questions.entries()) {
        const text = `### ${questionIndex + 1}. ${question.prompt}\n\n${question.options.map((option, i) => `${String.fromCharCode(65 + i)}) ${option}`).join('\n\n')}\n\nResposta correta: ${String.fromCharCode(65 + question.correctIndex)}`;
        assert.ok(original.includes(text), `Exact source match: ${task.id}/${questionIndex}`);
      }
    }
  }
}

// Exercise the existing component's event handlers with a minimal hook/JSX harness.
let state = [], cursor = 0;
const hook = initial => {
  const index = cursor++;
  if (!(index in state)) state[index] = initial;
  return [state[index], value => { state[index] = typeof value === 'function' ? value(state[index]) : value; }];
};
const jsx = (type, props) => ({ type, props });
const { TaskExperience } = load('src/components/TaskExperience.tsx', {
  react: { useState: hook, useRef: initial => hook({ current: initial })[0], useMemo: fn => fn() },
  'react/jsx-runtime': { jsx, jsxs: jsx },
  'next/link': { default: 'a' },
});
function nodes(tree) {
  if (!tree || typeof tree !== 'object') return [];
  if (Array.isArray(tree)) return tree.flatMap(nodes);
  return [tree, ...nodes(tree.props?.children)];
}
let saved = ready;
let destination;
const originalFetch = globalThis.fetch;
const originalWindow = globalThis.window;
globalThis.window = { location: { assign: href => { destination = href; } } };
try {
  for (const task of world.tasks) {
    state = [];
    const props = { task: { ...task, worldId: world.id, worldName: world.name }, worldId: world.id, nextHref: `/${world.id}/${world.tasks[world.tasks.indexOf(task) + 1]?.id ?? ''}` };
    const render = () => { cursor = 0; return nodes(TaskExperience(props)); };
    globalThis.fetch = async (_url, options) => {
      const body = JSON.parse(options.body);
      saved = progress.buildTaskCompletion(task.id, world.id, body.answers, new Date().toISOString(), saved);
      return { ok: true, json: async () => ({ ok: true, progress: saved }) };
    };
    for (let index = 0; index < task.questions.length; index++) {
      let tree = render();
      assert.equal(tree.filter(node => node.props?.className === 'question-card').length, 1);
      await tree.find(node => node.props?.children === 'Corrigir').props.onClick();
      assert.equal(render().some(node => node.props?.children === 'Próxima'), false);
      tree.filter(node => node.type === 'button' && node.props.className.startsWith('option-button'))[(task.questions[index].correctIndex + (index === 0 ? 1 : 0)) % 4].props.onClick();
      await render().find(node => node.props?.children === 'Corrigir').props.onClick();
      tree = render();
      assert.ok(tree.some(node => node.props?.className === `feedback-box ${index === 0 ? 'incorrect' : 'correct'}`));
      assert.equal(saved.taskProgress[task.id].completed, index === task.questions.length - 1);
      assert.equal(achievements.isAchievementUnlocked(world.id, saved), task === world.tasks.at(-1) && index === task.questions.length - 1);
      tree.find(node => node.props?.children === 'Próxima').props.onClick();
      if (index < task.questions.length - 1) assert.equal(destination, undefined);
    }
    assert.equal(destination, props.nextHref);
    destination = undefined;
  }
  assert.ok(achievements.isAchievementUnlocked(world.id, saved));
  assert.equal(progress.getWorldCompletion(world.id, saved).percent, 100);
  assert.ok(saved.completedWorlds.includes(world.id));
} finally {
  globalThis.fetch = originalFetch;
  globalThis.window = originalWindow;
}
console.log(`PASS: ${world.name}, ${world.tasks.flatMap(task => task.questions).length} questions, prerequisites, independence, Corrigir/Próxima, correct/incorrect feedback, navigation and certification.`);
