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
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', '3197'], { windowsHide: true, stdio: 'pipe' });
const base = 'http://localhost:3197';
let userId;
let cookie;
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
    const registration = await post('/api/session', { action: 'register', name: 'Teste de conquistas', email: `achievement-${randomUUID()}@example.test`, password: randomUUID() });
    assert.equal(registration.status, 200);
    const account = await registration.json();
    userId = account.user.id;
    cookie = registration.headers.get('set-cookie').split(';')[0];
    const profile = await (await fetch(base + '/perfil', { headers: { Cookie: cookie } })).text();
    assert.equal((profile.match(/class="achievement-card is-locked"/g) || []).length, 3);
    for (const world of worlds) {
      assert.equal((await post('/api/achievements/share', { worldId: world.id })).status, 403);
      assert.equal((await post('/api/progress', { worldId: world.id, taskId: world.tasks[0].id, answers: [] })).status, 400);
      for (const task of world.tasks) {
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
    assert.equal((completedProfile.match(/class="achievement-card unlocked"/g) || []).length, 3);
    assert.equal((await fetch(base + '/conquistas/invalid-token')).status, 404);
    console.log('PASS: favicon, initial locks, authentication, answer validation, all 3 unlocks, persistent public links, anonymous access and private data exclusion.');
  } finally {
    if (userId) await prisma.user.delete({ where: { id: userId } });
    await prisma.$disconnect();
    server.kill();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
