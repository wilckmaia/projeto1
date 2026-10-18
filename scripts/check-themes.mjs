import { assertTestDatabase } from './test-safety.mjs';
import { createHash } from 'node:crypto';
assertTestDatabase();
// Real Chromium checks, isolated browser profile and temporary account.
// Run through npm run test:integration -- --browser only.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { randomUUID } from 'node:crypto';
import { PrismaClient } from '@prisma/client';
import { load } from './education-test-harness.mjs';
import { PDFDocument } from 'pdf-lib';
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
  const worlds = load('src/lib/catalog.ts').worlds;
  for (const dark of [false, true]) {
    await navigate('/'); await waitFor("!!document.querySelector('.world-grid')"); await theme(dark);
    assert.equal(await evaluate("document.querySelectorAll('.education-world').length"),7);
    await contrast(['.world-card strong', '.world-card small', '.world-card-copy > span', '.theme-toggle', '.nav-link', '.metric-card small']);
    await screenshot('dashboard-' + (dark ? 'dark' : 'light'));
    await navigate('/perfil'); await contrast(['.achievement-requirement', '.theme-toggle']);
    for (const world of worlds) {
      await navigate('/' + world.id);
      await contrast(['h1', '.subtitle', '.secondary-button', '.theme-toggle']);
      assert.ok(await evaluate('document.body.innerText.includes(' + JSON.stringify(world.id === 'mundo-1' ? 'Fundamentos' : 'Mundo bloqueado') + ')'));
      await screenshot(world.id + '-' + (dark ? 'dark' : 'light'));
      await call('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
      assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth'), 'No mobile overflow');
      await screenshot(world.id + '-mobile-' + (dark ? 'dark' : 'light'));
      await call('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
    }
    await navigate('/biblioteca/m1-t1');
    assert.equal(await evaluate("document.querySelector('details').open"),false,'optional questions start closed');
    await contrast(['.lesson-reading p', '.lesson-reading .eyebrow', '.optional-reference summary']);
    await screenshot('library-' + (dark ? 'dark' : 'light'));
    await call('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
    await navigate('/'); await waitFor("!!document.querySelector('.world-grid')");
    assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth'),'dashboard mobile overflow');
    await screenshot('dashboard-mobile-' + (dark ? 'dark' : 'light'));
    await call('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
  }
  // Unlock Economy using only this isolated browser-test account.
  const originalTasks = worlds.filter(world => world.original).flatMap(world => world.tasks.map(task => ({ worldId: world.id, taskId: task.id })));
  for (const task of originalTasks) await prisma.taskProgress.create({ data: { id: randomUUID(), userId, ...task, completed: true, completedAt: new Date() } });
  const economy = load('src/lib/education.ts').educationWorlds.find(world => world.id === 'economia');
  await navigate('/economia');
  assert.equal(await evaluate("document.querySelectorAll('a[href^=\"/economia/trilhas/\"]').length"), 7);
  await screenshot('economy-micromundos');
  for (const track of economy.tracks) {
    await navigate('/economia/trilhas/' + track.id);
    const titles = await evaluate("[...document.querySelectorAll('.task-list .task-item strong')].map(el=>el.textContent)");
    assert.deepEqual(titles, track.lessons.map(lesson => lesson.title));
    const intro = await evaluate("document.querySelector('.track-introduction').textContent");
    for (const text of [track.overview, track.description, track.internalTopics].filter(Boolean)) assert.ok(intro.includes(text));
    if (track.reference) assert.equal(await evaluate("document.querySelector('.track-reference').getAttribute('href')"), track.reference.url);
  }
  await navigate('/economia/' + economy.tracks[0].lessons[0].id);
  assert.equal(await evaluate("document.querySelector('.task-body > h1').textContent"), 'Tópico 1 — Produto Interno Bruto (PIB)');
  const documents = load('src/lib/economy-study-documents.ts').studyDocuments;
  const parseDocument = load('src/lib/study-document.ts').parseStudyDocument;
  for (const lesson of economy.tracks.flatMap(track => track.lessons).filter(lesson => lesson.documentId)) {
    const source = documents[lesson.documentId];
    const parsed = parseDocument(source);
    await navigate('/economia/' + lesson.id);
    assert.equal(await evaluate("document.querySelector('.task-body > h1').textContent"), parsed.title);
    assert.deepEqual(await evaluate("[...document.querySelectorAll('.study-activity > h2')].map(el=>el.textContent)"), parsed.activities.map(activity => activity.title));
    assert.equal(await evaluate("document.querySelectorAll('.study-answer:not([open])').length"), 10);
    assert.equal(await evaluate("document.querySelectorAll('.katex-error').length"), 0);
    const formulas = [...source.matchAll(/\\\[\n([\s\S]*?)\n\\\]/g)].map(match => match[1]);
    assert.deepEqual(await evaluate("[...document.querySelectorAll('annotation[encoding=\"application/x-tex\"]')].map(el=>el.textContent)"), formulas);
    assert.equal(await evaluate("document.querySelectorAll('.study-table table').length"), ({pib:4,inflacao:2,desemprego:3,crescimento:2,ciclos:1,demanda:0,consumo:2})[lesson.documentId]);
    await screenshot('study-' + lesson.documentId);
    for (const [index, expected] of (lesson.documentId === 'pib' ? [['1.100,00', '900,00'], ['1.440,00', '1.200,00', '44,00', '20,00']] : lesson.documentId === 'inflacao' ? [['1.338,23', '747,26'], ['160,00', '220,00', '37,50']] : lesson.documentId === 'crescimento' ? [['1,49','2,65'],['100,00','200,00']] : lesson.documentId === 'ciclos' ? [['-5,00'],['900,00','990,00','11,11']] : lesson.documentId === 'demanda' ? [['133,33','1.133,33'],['155,56','1.222,22']] : lesson.documentId === 'consumo' ? [['3.500,00','500,00','87,50'],['109.090,91','9.090,91']] : [['9,72','72,00','15,58','77,00'],['100,00','50,00']]).entries()) {
      await evaluate("document.querySelector('[data-activity=\"" + (index + 1) + "\"] .economy-simulator button').click()");
      await waitFor("!!document.querySelector('[data-activity=\"" + (index + 1) + "\"] .economy-simulator dl')");
      const results = await evaluate("document.querySelector('[data-activity=\"" + (index + 1) + "\"] .economy-simulator dl').textContent");
      for (const value of expected) assert.ok(results.includes(value));
    }
    const challengeActivity = lesson.documentId === 'inflacao' ? 1 : 2;
    const changes = lesson.documentId === 'pib' ? [[0, '100'], [1, '20']] : lesson.documentId === 'inflacao' ? [[1, '10'], [2, '2']] : lesson.documentId === 'crescimento' ? [[2,'2']] : lesson.documentId === 'ciclos' ? [[1,'20'],[2,'20']] : lesson.documentId === 'demanda' ? [[0,'90']] : lesson.documentId === 'consumo' ? [[2,'20']] : [[0,'20000']];
    await evaluate(`(()=>{const inputs=document.querySelectorAll('[data-activity="${challengeActivity}"] .economy-simulator input');for(const [index,value] of ${JSON.stringify(changes)}){Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(inputs[index],value);inputs[index].dispatchEvent(new Event('input',{bubbles:true}));}})()`);
    await waitFor("!document.querySelector('[data-activity=\"" + challengeActivity + "\"] .economy-simulator dl')");
    await evaluate("document.querySelector('[data-activity=\"" + challengeActivity + "\"] .economy-simulator button').click()");
    await waitFor("!!document.querySelector('[data-activity=\"" + challengeActivity + "\"] .economy-simulator dl')");
    assert.deepEqual(await evaluate("[...document.querySelectorAll('[data-activity=\"" + challengeActivity + "\"] .economy-simulator dd')].map(el=>el.textContent)"), lesson.documentId === 'pib' ? ['2.000,00', '1.000,00', '100,00', '0,00'] : lesson.documentId === 'inflacao' ? ['1.210,00', '826,45'] : lesson.documentId === 'crescimento' ? ['200,00','400,00'] : lesson.documentId === 'ciclos' ? ['800,00','960,00','25,00'] : lesson.documentId === 'demanda' ? ['165,56','1.172,22'] : lesson.documentId === 'consumo' ? ['100.000,00','0,00'] : ['200,00','100,00']);
    const correctLetter = parsed.activities[0].answer.match(/Alternativa correta: ([A-D])\)/)[1];
    await evaluate("document.querySelector('[data-activity=\"1\"] input[type=radio][value=" + correctLetter + "]').click()");
    await waitFor("document.querySelector('[data-activity=\"1\"] .study-choices button').disabled === false");
    await evaluate("document.querySelector('[data-activity=\"1\"] .study-choices button').click()");
    await waitFor("document.querySelector('[data-activity=\"1\"] .study-choices [role=status]')?.textContent === 'Alternativa correta.'");
    await evaluate("document.querySelector('[data-activity=\"1\"] details').open = true");
    await call('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
    assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth'), 'study document mobile overflow');
    await screenshot('study-' + lesson.documentId + '-mobile');
    await call('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
  }
  for(const removed of ['economia-macro-topico-2','economia-micro-topico-2','economia-politica-topico-10']) {
    const response=await fetch(base+'/economia/'+removed,{headers:{Cookie:cookie}});
    assert.equal(response.status,404,'removed empty topic is inaccessible');
  }
  console.log('PASS: seven study documents, all 70 activities, exact LaTeX, tables, closed answer panels, correct alternatives, fourteen interactive simulators and mobile layout.');
  await call('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await navigate('/economia/trilhas/' + economy.tracks[0].id);
  assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth'));
  await screenshot('economy-micromundo-mobile');
  await call('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
  console.log('PASS: seven Economy micromundos, only topics with activities, both descriptions, internal topics, original links and mobile topic navigation.');
  // A test-only issued snapshot verifies view/download independently of future content.
  const certificate = await prisma.certificate.create({ data: { userId, worldId: 'render-fixture', userName: 'Teste Árvore 日本', worldName: 'Executivo', title: 'Certificado do Poder Executivo', color: '#967000', completedAt: new Date() } });
  await navigate('/certificados/' + certificate.id);
  await screenshot('certificate');
  await evaluate("(()=>{const original=URL.createObjectURL;URL.createObjectURL=blob=>{blob.arrayBuffer().then(buffer=>{let s='';for(const b of new Uint8Array(buffer))s+=String.fromCharCode(b);window.testPDF=btoa(s);});return original(blob);};const originalImage=HTMLCanvasElement.prototype.toDataURL;HTMLCanvasElement.prototype.toDataURL=function(...args){const data=originalImage.apply(this,args);window.testCertificatePNG=data;return data;};[...document.querySelectorAll('button')].find(b=>b.textContent==='Baixar PDF').click();})()");
  await waitFor('!!window.testPDF');
  const bytes = Buffer.from(await evaluate('window.testPDF'),'base64');
  await writeFile(resolve(output,'certificate.pdf'),bytes);
  await writeFile(resolve(output,'certificate-pdf-image.png'),Buffer.from((await evaluate('window.testCertificatePNG')).split(',')[1],'base64'));
  const pdf = await PDFDocument.load(bytes);
  assert.equal(pdf.getPageCount(),1); assert.equal(pdf.getTitle(),'Certificado do Poder Executivo');
  console.log('PASS: desktop/mobile worlds, locks, theme persistence, optional reference content and Unicode PDF download.');
  assert.deepEqual(errors, [], 'No browser errors or hydration warnings');
  console.log('PASS: all visual theme checks. Screenshots in .data/theme-check');
} finally {
  if (socket?.readyState === WebSocket.OPEN) { try { await call('Browser.close'); } catch {} socket.close(); }
  chrome?.kill(); server.kill();
  await new Promise(resolve => mailServer.close(resolve));
  if (userId) await prisma.user.delete({ where: { id: userId } });
  await prisma.$disconnect();
}
