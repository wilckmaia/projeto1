// Run after npm run build. Uses only public pages; never queries a database.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { readFileSync } from 'node:fs';

const socket = createServer();
await new Promise(resolve => socket.listen(0, '127.0.0.1', resolve));
const port = socket.address().port;
await new Promise(resolve => socket.close(resolve));
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', String(port)], {
  windowsHide: true, stdio: 'ignore',
});
const base = `http://127.0.0.1:${port}`;
const origin = 'https://projeto1-beta-beryl.vercel.app';
try {
  let ready = false;
  for (let attempt = 0; attempt < 200; attempt++) {
    try { if ((await fetch(`${base}/robots.txt`)).ok) { ready = true; break; } } catch { /* Starting. */ }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  assert.ok(ready, 'local production server started');
  const robots = await fetch(`${base}/robots.txt`);
  assert.equal(robots.status, 200);
  const rules = await robots.text();
  assert.match(rules, /User-Agent: \*/i);
  assert.match(rules, /^Allow: \/$/m);
  assert.doesNotMatch(rules, /^Disallow: \/$/m);
  assert.ok(rules.includes(`Sitemap: ${origin}/sitemap.xml`));
  const sitemap = await fetch(`${base}/sitemap.xml`);
  assert.equal(sitemap.status, 200);
  assert.match(sitemap.headers.get('content-type'), /xml/);
  const xml = await sitemap.text();
  assert.deepEqual([...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]), [`${origin}/sobre`]);
  const page = await fetch(`${base}/sobre`);
  assert.equal(page.status, 200);
  assert.doesNotMatch(page.headers.get('x-robots-tag') ?? '', /noindex/i);
  const html = await page.text();
  assert.match(html, /name="robots" content="index, follow"/);
  assert.doesNotMatch(html, /name="robots" content="[^"]*noindex/);
  assert.ok(html.includes(`rel="canonical" href="${origin}/sobre"`));
  assert.ok(html.includes('Aprenda política por camadas'), 'public content is server rendered');
  for (const path of ['/', '/confirmar', '/verificar-email', '/recuperar-senha', '/redefinir-senha']) {
    const response = await fetch(base + path);
    assert.equal(response.status, 200);
    assert.match(response.headers.get('x-robots-tag'), /noindex/);
  }
  const filename = 'google1e5978080cba4aa8 (2).html';
  const verification = await fetch(`${base}/${encodeURIComponent(filename)}`);
  assert.equal(verification.status, 200);
  assert.equal(await verification.text(), readFileSync(`public/${filename}`, 'utf8'));
  console.log('PASS: sitemap allowlist, crawler access, public canonical/indexing, authentication noindex and Google verification file.');
} finally {
  server.kill();
}
