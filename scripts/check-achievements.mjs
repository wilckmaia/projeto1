// Run after npm run build. Uses a temporary account, removed in finally.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import ts from 'typescript';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const source = ts.transpileModule(readFileSync('src/lib/data.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const dataModule = { exports: {} };
new Function('exports', 'module', source)(dataModule.exports, dataModule);
const { worlds } = dataModule.exports;
const newWorld = worlds.find(world => world.id === 'mundo-4');
assert.equal(newWorld.name, 'MUNDO FLÁVIO BOLSONARO');
assert.equal(newWorld.tasks.length, 8);
assert.ok(newWorld.tasks.every(task => task.questions.length === 5));
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', '3197'], { windowsHide: true, stdio: 'pipe' });
const base = 'http://localhost:3197';
let userId;
let cookie;
let secondUserId;
const email = `achievement-${randomUUID()}@example.test`;
const password = randomUUID();
server.stdout.resume();
server.stderr.resume();
async function post(path, body, authenticated = true) {
  return fetch(base + path, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(authenticated && cookie ? { Cookie: cookie } : {}) }, body: JSON.stringify(body) });
}
(async () => {
  try {
    let ready = false;
    for (let i = 0; i < 60; i++) {
      try { if ((await fetch(base)).ok) { ready = true; break; } } catch {}
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    assert.ok(ready, 'Server starts');
    assert.equal((await fetch(base + '/icon.svg')).status, 200);
    assert.equal((await post('/api/achievements/share', { worldId: 'mundo-1' }, false)).status, 401);
    const registration = await post('/api/session', { action: 'register', name: 'Teste de conquistas', email, password });
    if (registration.status !== 200) throw new Error(`Test account registration failed: ${(await registration.text()).replace(/postgres(?:ql)?:\/\/[^\s"\\]+/g, '[database URL]')}`);
    const account = await registration.json();
    userId = account.user.id;
    cookie = registration.headers.get('set-cookie').split(';')[0];
    assert.match(registration.headers.get('set-cookie'), /HttpOnly/i);
    assert.match(registration.headers.get('set-cookie'), /Secure/i);
    assert.equal((await (await fetch(base + '/api/session', { headers: { Cookie: `politika_user=${userId}` } })).json()).user, null);
    assert.equal((await (await fetch(base + '/api/session', { headers: { Cookie: cookie + 'tampered' } })).json()).user, null);
    assert.equal((await post('/api/session', { action: 'register', name: 'Duplicado', email, password }, false)).status, 400);
    assert.equal((await post('/api/session', { action: 'login', email, password: 'incorrect' }, false)).status, 400);
    assert.equal((await post('/api/progress', { worldId: 'mundo-1', taskId: 'm1-t1', answers: [] }, false)).status, 401);
    assert.equal((await post('/api/progress', { worldId: 'mundo-2', taskId: worlds[1].tasks[0].id, answers: [] })).status, 403);
    const profile = await (await fetch(base + '/perfil', { headers: { Cookie: cookie } })).text();
    assert.equal((profile.match(/class="achievement-card is-locked"/g) || []).length, worlds.length);
    for (const world of worlds) {
      console.log(`Testing ${world.name}...`);
      if (worlds.indexOf(world) < 3) {
        assert.equal((await post('/api/progress', { worldId: 'mundo-7', taskId: 'm7-t1', answers: [] })).status, 403);
        assert.equal((await fetch(base + '/mundo-7/m7-t1', { headers: { Cookie: cookie }, redirect: 'manual' })).status, 307);
        assert.equal((await post('/api/progress', { worldId: 'mundo-6', taskId: 'm6-t1', answers: [] })).status, 403);
        assert.equal((await fetch(base + '/mundo-6/m6-t1', { headers: { Cookie: cookie }, redirect: 'manual' })).status, 307);
        assert.equal((await post('/api/progress', { worldId: 'mundo-5', taskId: 'm5-t1', answers: [] })).status, 403);
        assert.equal((await fetch(base + '/mundo-5/m5-t1', { headers: { Cookie: cookie }, redirect: 'manual' })).status, 307);
        assert.equal((await post('/api/progress', { worldId: 'mundo-4', taskId: 'm4-t1', answers: [] })).status, 403);
        assert.equal((await fetch(base + '/mundo-4/m4-t1', { headers: { Cookie: cookie }, redirect: 'manual' })).status, 307);
      }
      if (world.prerequisiteWorldIds) {
        for (const independent of worlds.filter(item => item.prerequisiteWorldIds)) {
          assert.equal((await fetch(base + `/${independent.id}/${independent.tasks[0].id}`, { headers: { Cookie: cookie }, redirect: 'manual' })).status, 200);
        }
      }
      assert.equal((await post('/api/achievements/share', { worldId: world.id })).status, 403);
      assert.equal((await post('/api/progress', { worldId: world.id, taskId: world.tasks[0].id, answers: [] })).status, 400);
      for (const task of world.tasks) {
        console.log(`Testing ${task.id}: ${task.questions.length} questions`);
        if (task.sequential) {
          for (let count = 1; count <= task.questions.length; count++) {
            assert.equal((await post('/api/achievements/share', { worldId: world.id })).status, 403);
            const answers = task.questions.slice(0, count).map((question, index) => ({ questionId: `${task.id}-${index}`, selectedIndex: question.correctIndex, correctIndex: -1, isCorrect: false }));
            const response = await post('/api/progress', { worldId: world.id, taskId: task.id, answers });
            assert.equal(response.status, 200);
            const result = await response.json();
            assert.equal(result.progress.taskProgress[task.id].completed, count === task.questions.length);
            assert.ok(result.progress.taskProgress[task.id].answers.every(answer => answer.isCorrect));
            const persisted = await (await fetch(base + '/api/session', { headers: { Cookie: cookie } })).json();
            assert.equal(persisted.progress.taskProgress[task.id].answers.length, count);
            const page = await (await fetch(base + `/${world.id}/${task.id}`, { headers: { Cookie: cookie } })).text();
            assert.ok(page.includes(count < task.questions.length ? 'Corrigir' : 'Próxima'));
            assert.ok(page.includes(task.questions[Math.min(count, task.questions.length - 1)].prompt));
            if (count === 2) {
              await fetch(base + '/api/session', { method: 'DELETE', headers: { Cookie: cookie } });
              const login = await post('/api/session', { action: 'login', email, password }, false);
              assert.equal(login.status, 200);
              cookie = login.headers.get('set-cookie').split(';')[0];
              assert.deepEqual((await login.json()).progress, persisted.progress);
            }
          }
          continue;
        }
        const response = await post('/api/progress', { worldId: world.id, taskId: task.id, answers: task.questions.map((question, index) => ({ questionId: `${task.id}-${index}`, selectedIndex: 0, correctIndex: -1, isCorrect: true })) });
        assert.equal(response.status, 200);
        const result = await response.json();
        assert.equal(result.progress.taskProgress[task.id].answers[0].correctIndex, task.questions[0].correctIndex);
      }
      const shared = await post('/api/achievements/share', { worldId: world.id });
      assert.equal(shared.status, 200);
      const { path } = await shared.json();
      assert.equal((await (await post('/api/achievements/share', { worldId: world.id })).json()).path, path);
      const publicResponse = await fetch(base + path);
      assert.equal(publicResponse.status, 200);
      const publicHtml = await publicResponse.text();
      assert.ok(publicHtml.includes('Teste de conquistas'));
      assert.ok(!publicHtml.includes(userId));
      assert.ok(!publicHtml.includes(account.user.email));
    }
    const completedProfile = await (await fetch(base + '/perfil', { headers: { Cookie: cookie } })).text();
    assert.equal((completedProfile.match(/class="achievement-card unlocked"/g) || []).length, worlds.length);
    assert.equal((await fetch(base + '/conquistas/invalid-token')).status, 404);
    const persisted = await (await fetch(base + '/api/session', { headers: { Cookie: cookie } })).json();
    assert.equal(persisted.progress.completedTasks.length, worlds.flatMap(world => world.tasks).length);
    const logout = await fetch(base + '/api/session', { method: 'DELETE', headers: { Cookie: cookie } });
    assert.equal(logout.status, 200);
    assert.match(logout.headers.get('set-cookie'), /politika_user=;.*(?:Max-Age=0|Expires=Thu, 01 Jan 1970)/i);
    assert.equal((await (await fetch(base + '/api/session')).json()).user, null);
    const login = await post('/api/session', { action: 'login', email: email.toUpperCase(), password }, false);
    assert.equal(login.status, 200);
    const restored = await login.json();
    assert.equal(restored.user.id, userId);
    assert.deepEqual(restored.progress, persisted.progress);
    const second = await post('/api/session', { action: 'register', name: 'Outra conta', email: `isolation-${randomUUID()}@example.test`, password }, false);
    assert.equal(second.status, 200);
    const isolated = await second.json();
    secondUserId = isolated.user.id;
    assert.deepEqual(isolated.progress.completedTasks, []);
    assert.equal(await prisma.taskProgress.count({ where: { userId } }), worlds.flatMap(world => world.tasks).length);
    assert.equal(await prisma.achievementShare.count({ where: { userId } }), worlds.length);
    console.log('PASS: cadastro, duplicidade, login, senha inválida, cookie, logout, persistência, isolamento, permissões, perfil, respostas e todas as conquistas.');
  } finally {
    try {
      if (userId) await prisma.user.delete({ where: { id: userId } });
      if (secondUserId) await prisma.user.delete({ where: { id: secondUserId } });
    } finally {
      await prisma.$disconnect();
      server.kill();
    }
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
