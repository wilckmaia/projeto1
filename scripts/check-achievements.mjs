import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { randomUUID, createHash } from 'node:crypto';
import { once } from 'node:events';
import { createRequire } from 'node:module';
import ts from 'typescript';
import { testAuthFlows } from './test-auth-flows.mjs';
import { PrismaClient } from '@prisma/client';
import { assertTestDatabase } from './test-safety.mjs';
assertTestDatabase();
// Ensure a test-only invocation also has the current migrations.
const migration = spawn(process.execPath, ['node_modules/prisma/build/index.js', 'migrate', 'deploy'], { windowsHide: true, env: process.env, stdio: 'ignore' });
const [migrationCode] = await once(migration, 'exit');
assert.equal(migrationCode, 0, 'test migrations applied');
const require = createRequire(import.meta.url);
const prisma = new PrismaClient();
const base = process.env.APP_ORIGIN;
assert.equal(new URL(base).hostname, '127.0.0.1');
const exports = {};
new Function('exports', 'require', ts.transpileModule(readFileSync('src/lib/data.ts','utf8'), {compilerOptions:{target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.CommonJS}}).outputText)(exports, name => { assert.equal(name,'server-only'); return {}; });
const { worlds } = exports;
const mail = [];
const delivery = { mode: 'ok' };
const providerIds = new Map();
const mailServer = createServer(async (request, response) => {
  if (request.method !== 'POST') { response.writeHead(405).end(); return; }
  let body = ''; for await (const chunk of request) body += chunk;
  const key = request.headers['idempotency-key'];
  if (!providerIds.has(key)) providerIds.set(key, randomUUID());
  const providerId = providerIds.get(key);
  mail.push({ ...JSON.parse(body), providerId, idempotencyKey: key });
  if (delivery.mode === 'timeout') { request.on('close', () => response.destroy()); return; }
  if (delivery.mode === 'fail' || delivery.mode === 'once') {
    if (delivery.mode === 'once') delivery.mode = 'ok';
    response.writeHead(503).end('{}'); return;
  }
  response.writeHead(200, {'Content-Type':'application/json'}).end(delivery.mode === 'malformed' ? '{}' : JSON.stringify({ id: providerId }));
});
mailServer.listen(Number(new URL(process.env.EMAIL_TEST_ENDPOINT).port), '127.0.0.1'); await once(mailServer, 'listening');
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next','start','-H','127.0.0.1','-p',new URL(base).port], {windowsHide:true,env:process.env,stdio:'pipe'});
server.stdout.resume(); server.stderr.resume();
const accounts = [];
const hashToken = value => createHash('sha256').update(value).digest('hex');
const clearLimits = () => prisma.rateLimit.deleteMany();
async function post(path, body, cookie, extra = {}) {
  return fetch(base + path, { method:'POST', headers:{'Content-Type':'application/json',Origin:base,...(cookie?{Cookie:cookie}:{}),...extra},body:JSON.stringify(body) });
}
const current = async cookie => (await fetch(base+'/api/session',{headers:cookie?{Cookie:cookie}:{}})).json();
const getToken = email => {
  const message = mail.filter(item => item.to.includes(email)).at(-1);
  assert.ok(message, 'email delivered only to local capture');
  return new URLSearchParams(new URL(message.text.split('\n\n').at(-1)).hash.slice(1)).get('token');
};
async function account() {
  await clearLimits();
  const email = randomUUID()+'@example.test', password = 'Secure test phrase '+randomUUID();
  const response = await post('/api/session',{action:'register',name:'Teste de conquistas',email,password});
  assert.equal(response.status,202);
  assert.equal((await prisma.user.findUniqueOrThrow({where:{email}})).emailVerifiedAt,null,'signup does not claim ownership');
  assert.equal(mail.filter(item => item.to.includes(email)).length,0,'signup sends no email');
  const login = await post('/api/session',{action:'login',email,password});
  assert.equal(login.status,200);
  const data = await login.json(); accounts.push(data.user.id);
  return {email,password,id:data.user.id,cookie:login.headers.get('set-cookie').split(';')[0],headers:login.headers};
}
try {
  let ready = false;
  for (let i=0;i<120;i++) {
    if (server.exitCode !== null) throw new Error('Test server exited');
    try { if ((await fetch(base)).ok) { ready=true;break; } } catch {}
    await new Promise(resolve=>setTimeout(resolve,250));
  }
  assert.ok(ready,'server starts');
  assert.equal(await prisma.answerArchive.count(),2,'migration preserved original answer rows');
  assert.equal(await prisma.answerAttempt.count({where:{taskProgressId:'migration-progress'}}),1,'migration deduplicated current answers');
  assert.equal((await prisma.taskProgress.findUnique({where:{id:'migration-progress'}})).acertos,1,'migration reconciles current counters');
  await prisma.user.delete({where:{id:'migration-fixture'}});
  const html = await fetch(base);
  assert.match(html.headers.get('content-security-policy'),/nonce-/);
  assert.equal(html.headers.get('x-frame-options'),'DENY');
  assert.equal(html.headers.get('x-powered-by'),null);
  const markup = await html.text();
  assert.match(markup,/<script[^>]+nonce=/);
  assert.ok(!markup.includes(worlds[0].tasks[0].questions[0].explanation),'no answer keys in anonymous page');
  assert.equal((await post('/api/session',{action:'login'},undefined,{Origin:'https://evil.example'})).status,403);
  assert.equal((await post('/api/session',{action:'login'},undefined,{'Content-Type':'text/plain'})).status,415);
  assert.equal((await post('/api/session',{action:'unknown'})).status,400);
  assert.equal((await post('/api/session',{padding:'x'.repeat(17000)})).status,413);
  assert.equal((await post('/api/session',{action:'register',email:'a@example.test',name:'A',password:'123456'})).status,400);
  assert.equal((await post('/api/progress',{answers:[]})).status,401);
  const a = await account(), b = await account();
  assert.match(a.headers.get('set-cookie'),/HttpOnly/i); assert.match(a.headers.get('set-cookie'),/Secure/i); assert.match(a.headers.get('set-cookie'),/SameSite=Lax/i);
  assert.equal((await current(a.cookie+'tampered')).user,null);
  assert.equal((await current('politika_user='+a.id)).user,null,'old unsigned cookies rejected');
  assert.equal((await current(b.cookie)).progress.completedTasks.length,0);
  await clearLimits();
  const duplicate = await post('/api/session',{action:'register',name:'Not the owner',email:a.email,password:'A different long secret 12345'});
  assert.equal(duplicate.status,202);
  assert.equal((await prisma.user.findUnique({where:{id:a.id}})).name,'Teste de conquistas','registration cannot overwrite existing account');
  const privatePage = await fetch(base+'/mundo-1/m1-t1',{headers:{Cookie:a.cookie}});
  assert.equal(privatePage.status,200);
  assert.ok(!(await privatePage.text()).includes(worlds[0].tasks[0].questions[0].explanation),'unsubmitted explanations stay server-side');
  for (const world of worlds) {
    await clearLimits();
    assert.equal((await post('/api/achievements/share',{worldId:world.id},a.cookie)).status,403);
    for (const task of world.tasks) {
      await clearLimits();
      const answers = task.questions.map((q,i)=>({questionId:task.id+'-'+i,selectedIndex:0}));
      if (task.sequential) {
        const partial = await post('/api/progress',{worldId:world.id,taskId:task.id,answers:answers.slice(0,1)},a.cookie);
        assert.equal(partial.status,200);
        assert.equal((await partial.json()).progress.taskProgress[task.id].completed,false);
        // Full and shorter request overlap: final state must never regress.
        const concurrent = await Promise.all([post('/api/progress',{worldId:world.id,taskId:task.id,answers},a.cookie),post('/api/progress',{worldId:world.id,taskId:task.id,answers:answers.slice(0,1)},a.cookie)]);
        assert.equal(concurrent[0].status,200);
        assert.ok([200,409].includes(concurrent[1].status));
      } else {
        assert.equal((await post('/api/progress',{worldId:world.id,taskId:task.id,answers},a.cookie)).status,200);
      }
      const duplicate = await post('/api/progress',{worldId:world.id,taskId:task.id,answers},a.cookie);
      assert.equal(duplicate.status,200);
      const result = await duplicate.json();
      assert.equal(result.progress.taskProgress[task.id].completed,true);
      assert.equal(result.progress.taskProgress[task.id].answers[0].correctIndex,task.questions[0].correctIndex);
      assert.equal(await prisma.answerAttempt.count({where:{userId:a.id,taskId:task.id}}),answers.length,'bounded answer storage');
    }
    await clearLimits();
    const shared = await post('/api/achievements/share',{worldId:world.id},a.cookie);
    assert.equal(shared.status,200);
    const {path} = await shared.json();
    const page = await fetch(base+path);
    assert.equal(page.status,200);
    const text = await page.text(); assert.ok(text.includes('Teste de conquistas')); assert.ok(!text.includes(a.email)); assert.ok(!text.includes(a.id));
    const wrongOwner = await fetch(base+'/api/achievements/share',{method:'DELETE',headers:{Origin:base,'Content-Type':'application/json',Cookie:b.cookie},body:JSON.stringify({worldId:world.id})});
    assert.equal(wrongOwner.status,200);
    assert.equal((await fetch(base+path)).status,200,'other user cannot revoke share');
    await fetch(base+'/api/achievements/share',{method:'DELETE',headers:{Origin:base,'Content-Type':'application/json',Cookie:a.cookie},body:JSON.stringify({worldId:world.id})});
    assert.equal((await fetch(base+path)).status,404,'revoked link inaccessible');
    console.log('PASS: progression, persistence, concurrency and sharing '+world.id);
  }
  await clearLimits();
  assert.equal((await current(b.cookie)).progress.completedTasks.length,0,'other account unchanged');
  const first = worlds[0].tasks[0];
  assert.equal((await post('/api/progress',{worldId:worlds[0].id,taskId:first.id,userId:a.id,answers:[]},b.cookie)).status,400);
  assert.equal((await post('/api/progress',{worldId:'mundo-2',taskId:worlds[1].tasks[0].id,answers:worlds[1].tasks[0].questions.map((q,i)=>({questionId:worlds[1].tasks[0].id+'-'+i,selectedIndex:0}))},b.cookie)).status,403);
  const logout = await fetch(base+'/api/session',{method:'DELETE',headers:{Origin:base,'Content-Type':'application/json',Cookie:a.cookie}});
  assert.equal(logout.status,200);
  assert.equal((await current(a.cookie)).user,null,'replay after logout rejected');
  const login = await post('/api/session',{action:'login',email:a.email,password:a.password});
  a.cookie = login.headers.get('set-cookie').split(';')[0];
  await prisma.session.update({where:{tokenHash:hashToken(a.cookie.split('=')[1])},data:{expiresAt:new Date(0)}});
  assert.equal((await current(a.cookie)).user,null,'expired session rejected');
  await clearLimits();
  assert.equal((await current(b.cookie)).user.id,b.id,'other sessions remain valid');
  await clearLimits();
  // Concurrent clients using the real distributed limiter cannot over-admit.
  function load(file,deps){const exp={};new Function('exports','require',ts.transpileModule(readFileSync(file,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.CommonJS}}).outputText)(exp,n=>n==='server-only'?{}:deps[n]??require(n));return exp;}
  const errors=load('src/lib/errors.ts',{});
  const limiter=load('src/lib/rate-limit.ts',{'./prisma':{prisma},'./errors':errors});
  const attempts=await Promise.allSettled(Array.from({length:20},()=>limiter.limit('concurrent-test','test',5,60)));
  assert.equal(attempts.filter(x=>x.status==='fulfilled').length,5,'atomic quota');
  await testAuthFlows({ prisma, base, post, current, getToken, mail, delivery, clearLimits, accounts });
  console.log('PASS: auth, optional email verification, CSRF, IDOR, replay/expiry, body validation, rate limits, legacy login and migration retention.');
} finally {
  server.kill(); await new Promise(resolve=>server.exitCode!==null?resolve():server.once('exit',resolve));
  await new Promise(resolve=>mailServer.close(resolve));
  try { await prisma.user.deleteMany({where:{id:{in:accounts}}}); } finally {await prisma.$disconnect();}
}
