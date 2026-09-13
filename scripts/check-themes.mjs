import { assertTestDatabase } from './test-safety.mjs';
import { createHash } from 'node:crypto';
assertTestDatabase();
// Real Chromium checks, isolated browser profile and temporary account.
// Run through npm run test:integration -- --browser only.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { randomUUID } from 'node:crypto';
import { PrismaClient } from '@prisma/client';
import ts from 'typescript';
import { createServer } from 'node:http';
import { testAuthBrowser } from './test-auth-browser.mjs';

const base = 'http://localhost:3198';
const output = resolve('.data/theme-check');
const profile = resolve(tmpdir(), `politika-theme-browser-${randomUUID()}`);
await mkdir(output, { recursive: true });
const prisma = new PrismaClient();
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-H', '127.0.0.1', '-p', '3198'], { windowsHide: true, stdio: 'ignore', env: { ...process.env, APP_ORIGIN: base } });
const mail = [];
const mailServer = createServer(async (request, response) => {
  let body = ''; for await (const chunk of request) body += chunk;
  mail.push(JSON.parse(body));
  response.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({ id: randomUUID() }));
});
await new Promise(resolve => mailServer.listen(Number(new URL(process.env.EMAIL_TEST_ENDPOINT).port), '127.0.0.1', resolve));
let chrome, socket, userId;
let sequence = 0;
const pending = new Map();
const errors = [];
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
async function ready(url) {
  for (let i = 0; i < 100; i++) {
    try { const r = await fetch(url); if (r.ok) return r; } catch {}
    await pause(300);
  }
  throw Error(`Service unavailable: ${url}`);
}
function call(method, params = {}) {
  const id = ++sequence;
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => { pending.delete(id); reject(Error(`Timeout: ${method}`)); }, 30000);
    pending.set(id, { resolve: result => { clearTimeout(timeout); resolve(result); }, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
}
async function evaluate(expression) {
  const result = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  assert.ok(!result.exceptionDetails, JSON.stringify(result.exceptionDetails));
  return result.result.value;
}
async function waitFor(expression) {
  for (let i = 0; i < 100; i++) { if (await evaluate(expression)) return; await pause(150); }
  throw Error(`Page condition not met: ${expression}`);
}
async function navigate(path) {
  await call('Page.navigate', { url: base + path });
  await waitFor(`location.pathname === ${JSON.stringify(new URL(base + path).pathname)} && document.readyState === 'complete' && !!document.querySelector('.theme-toggle')`);
  await pause(400);
}
async function launch() {
  chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=9333', `--user-data-dir=${profile}`, 'about:blank'], { windowsHide: true, stdio: 'ignore' });
  const targets = await (await ready('http://localhost:9333/json/list')).json();
  socket = new WebSocket(targets.find(target => target.type === 'page').webSocketDebuggerUrl);
  await new Promise(resolve => socket.addEventListener('open', resolve, { once: true }));
  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text);
    if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') errors.push(message.params.args.map(arg => arg.value ?? arg.description).join(' '));
    const handler = pending.get(message.id);
    if (handler) { pending.delete(message.id); if (message.error) handler.reject(Error(JSON.stringify(message.error))); else handler.resolve(message.result); }
  });
  await call('Page.enable'); await call('Runtime.enable'); await call('Network.enable');
  await call('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
}
async function theme(dark) {
  if (await evaluate("document.documentElement.dataset.theme === 'dark'") !== dark) {
    await evaluate("document.querySelector('.theme-toggle').click()");
  }
  await waitFor(`document.documentElement.dataset.theme === '${dark ? 'dark' : 'light'}' && document.querySelector('.theme-toggle').getAttribute('aria-pressed') === '${dark}'`);
  await pause(250);
}
async function screenshot(name) {
  const shot = await call('Page.captureScreenshot', { format: 'png' });
  await writeFile(resolve(output, `${name}.png`), Buffer.from(shot.data, 'base64'));
}
async function contrast(selectors) {
  // Sample settled styles after the existing 200ms state/color transitions.
  await pause(250);
  const values = await evaluate(`(${function(selectors) {
    return selectors.flatMap(selector => [...document.querySelectorAll(selector)].filter(el => el.getClientRects().length).map(el => {
      const style = getComputedStyle(el);
      let ancestor = el;
      let background = style.backgroundColor;
      while (background === 'rgba(0, 0, 0, 0)' && ancestor.parentElement) {
        ancestor = ancestor.parentElement; background = getComputedStyle(ancestor).backgroundColor;
      }
      return { selector, foreground: style.color, background };
    }));
  }.toString()})(${JSON.stringify(selectors)})`);
  const luminance = color => {
    const rgb = color.match(/[\d.]+/g).slice(0, 3).map(Number).map(value => { value /= 255; return value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4; });
    return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
  };
  for (const item of values) {
    const a = luminance(item.foreground), b = luminance(item.background);
    const ratio = (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
    assert.ok(ratio >= 4.5, `${item.selector} contrast ${ratio.toFixed(2)}: ${item.foreground} / ${item.background}`);
  }
}
async function post(path, body, cookie) {
  return fetch(base + path, { method: 'POST', headers: { Origin: base, 'Content-Type': 'application/json', ...(cookie ? { Cookie: cookie } : {}) }, body: JSON.stringify(body) });
}
try {
  await ready(base); await launch();
  await navigate('/');
  await waitFor("!!document.querySelector('.auth-form')");
  for (const dark of [false, true]) {
    await theme(dark); await contrast(['.auth-card h1', '.auth-card > p', '.auth-form button', '.theme-toggle']);
    await screenshot(`auth-${dark ? 'dark' : 'light'}`);
  }
  await call('Page.reload');
  await waitFor("document.readyState === 'complete' && document.documentElement.dataset.theme === 'dark' && !!document.querySelector('.auth-form')");
  assert.equal(await evaluate("localStorage.getItem('politika-theme')"), 'dark');
  // Close the entire browser, then reopen the same isolated profile.
  await call('Browser.close'); await pause(1500); await launch(); await navigate('/');
  assert.equal(await evaluate('document.documentElement.dataset.theme'), 'dark');
  console.log('PASS: theme toggle, reload and browser reopening');
  await testAuthBrowser({ evaluate, waitFor, navigate, prisma, mail, screenshot });

  const user = await prisma.user.create({ data: { id: 'visual-' + randomUUID(), name: 'Teste visual', email: randomUUID() + '@example.test', passwordHash: 'unused', emailVerifiedAt: new Date() } });
  userId = user.id;
  const token = Buffer.from(randomUUID()+randomUUID()).toString('base64url').slice(0,43);
  await prisma.session.create({ data: { tokenHash: createHash('sha256').update(token).digest('hex'), userId, expiresAt: new Date(Date.now()+3600000) } });
  const cookie = 'politika_user=' + token;
  await prisma.rateLimit.deleteMany();
  await call('Network.setCookie', { name: cookie.split('=')[0], value: cookie.slice(cookie.indexOf('=') + 1), url: base, httpOnly: true, secure: true });
  const source = ts.transpileModule(await readFile('src/lib/data.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const data = { exports: {} }; new Function('exports', 'module', 'require', source)(data.exports, data, name => { assert.equal(name, 'server-only'); return {}; });
  for (const world of data.exports.worlds.slice(0, 3)) for (const task of world.tasks) {
    assert.equal((await post('/api/progress', { worldId: world.id, taskId: task.id, answers: task.questions.map((q, i) => ({ questionId: `${task.id}-${i}`, selectedIndex: q.correctIndex })) }, cookie)).status, 200);
  }
  for (const dark of [false, true]) {
    await navigate('/'); await waitFor("!!document.querySelector('.world-grid')"); await theme(dark);
    await contrast(['.world-card strong', '.world-card small', '.pill', '.theme-toggle', '.nav-link', '.metric-card small']);
    await screenshot(`dashboard-${dark ? 'dark' : 'light'}`);
    await navigate('/perfil'); await contrast(['.achievement-state', '.achievement-phrase', '.achievement-requirement']);
    for (const world of data.exports.worlds.slice(3)) {
      await navigate(`/${world.id}`); await contrast(['h1', '.subtitle', '.task-item small', '.kpis span', '.secondary-button', '.theme-toggle']);
      await screenshot(`${world.id}-${dark ? 'dark' : 'light'}`);
      await navigate(`/${world.id}/${world.tasks[0].id}`);
      await contrast(['h1', '.subtitle', '.question-card h3', '.option-button', '.primary-button', '.theme-toggle']);
      await screenshot(`${world.id}-lesson-${dark ? 'dark' : 'light'}`);
      await evaluate("document.querySelector('.question-card').scrollIntoView({block:'center'})");
      const point = await evaluate("(()=>{const r=document.querySelector('.option-button').getBoundingClientRect();return {x:r.x+10,y:r.y+10}})()");
      await call('Input.dispatchMouseEvent', { type: 'mouseMoved', ...point });
      await pause(250); await contrast(['.option-button']);
      await evaluate("document.querySelector('.option-button').click()");
      await contrast(['.option-button.selected']);
      await evaluate("document.querySelector('.action-row button').click()");
      await waitFor("!!document.querySelector('.feedback-box')");
      await contrast(['.option-button', '.feedback-box', '.primary-button']);
      await screenshot(`${world.id}-feedback-${dark ? 'dark' : 'light'}`);
      await evaluate("document.querySelector('.action-row button').click()");
      await waitFor("!document.querySelector('.feedback-box')");
      await call('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
      assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth'), 'No horizontal overflow');
      await screenshot(`${world.id}-mobile-${dark ? 'dark' : 'light'}`);
      await call('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
      console.log(`PASS: ${world.id} ${dark ? 'dark' : 'light'}, world + lesson + mobile contrast/layout`);
    }
  }
  assert.deepEqual(errors, [], 'No browser errors or hydration warnings');
  console.log('PASS: all visual theme checks. Screenshots in .data/theme-check');
} finally {
  if (socket?.readyState === WebSocket.OPEN) { try { await call('Browser.close'); } catch {} socket.close(); }
  chrome?.kill(); server.kill();
  await new Promise(resolve => mailServer.close(resolve));
  if (userId) await prisma.user.delete({ where: { id: userId } });
  await prisma.$disconnect();
}
