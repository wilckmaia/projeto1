import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';
import { assertTestDatabase } from './test-safety.mjs';
const require = createRequire(import.meta.url);
function load(file, dependencies = {}) {
  const exports = {};
  const source = ts.transpileModule(readFileSync(file, 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS, esModuleInterop: true } }).outputText;
  new Function('exports', 'require', source)(exports, name => name === 'server-only' ? {} : name in dependencies ? dependencies[name] : require(name));
  return exports;
}
const errors = load('src/lib/errors.ts');
const security = load('src/lib/request-security.ts', { './errors': errors });
const password = load('src/lib/password.ts', { './errors': errors });
const data = load('src/lib/data.ts');
const catalog = load('src/lib/catalog.ts');
assert.deepEqual(catalog.worlds, data.worlds.map(({tasks,...world}) => ({...world,tasks:tasks.map(({id,title,questions})=>({id,title,questionCount:questions.length}))})), 'public catalog matches lesson metadata');
const progress = load('src/lib/progress.ts', { '@/lib/catalog': catalog });
for (const world of data.worlds) {
  assert.equal(progress.isWorldUnlocked(world.id, progress.defaultProgress), world.id === 'mundo-1');
}
assert.throws(() => assertTestDatabase({}), /blocked/);
assert.throws(() => assertTestDatabase({SECURITY_TEST_MODE:'1',DATABASE_URL:'postgresql://x@remote/prod',DIRECT_URL:'postgresql://x@remote/prod'}), /loopback/);
const previous = process.env.APP_ORIGIN;
process.env.APP_ORIGIN = 'https://politika.example';
try {
  assert.throws(() => security.validateMutation(new Request('https://politika.example/api/session',{method:'POST',headers:{origin:'https://evil.example','content-type':'application/json'}})), e => e.status === 403);
  assert.throws(() => security.validateMutation(new Request('https://politika.example/api/session',{method:'POST',headers:{origin:'https://politika.example','content-type':'text/plain'}})), e => e.status === 415);
  const request = body => new Request('https://politika.example/',{method:'POST',body});
  await assert.rejects(security.readJson(request('x'.repeat(100)), 20), e => e.status === 413);
  await assert.rejects(security.readJson(request('[]'), 20), e => e.status === 400);
  assert.equal(security.emailField(' USER@example.test '), 'user@example.test');
  assert.throws(() => security.emailField('invalid@'), e => e.status === 400);
  assert.throws(() => password.validatePassword('123456'), e => e.status === 400);
  assert.throws(() => password.validatePassword('😀'.repeat(19)), e => e.status === 400);
  password.validatePassword('A long and unusual test phrase 42!');
  const hash = await password.hashPassword('A long and unusual test phrase 42!');
  assert.equal(await password.checkPassword('A long and unusual test phrase 42!', hash), true);
  assert.equal(await password.checkPassword('incorrect'), false);
} finally { if (previous === undefined) delete process.env.APP_ORIGIN; else process.env.APP_ORIGIN = previous; }
console.log('PASS: public DTO/catalog, input bounds, origins, passwords and test-environment guard.');
