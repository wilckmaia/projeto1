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
const password = load('src/lib/password.ts', { './errors': errors, './password-policy': load('src/lib/password-policy.ts') });
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
const diagnostics = load('src/lib/email-diagnostics.ts');
const originalEnv = { ...process.env };
const originalError = console.error;
const logs = [];
try {
  process.env.RESEND_API_KEY = 're_fake_sensitive_key';
  process.env.EMAIL_FROM = 'Politika <sender@example.test>';
  delete process.env.EMAIL_TEST_ENDPOINT;
  const responses = [];
  let calls = 0;
  const email = load('src/lib/email.ts', {
    './errors': errors, './email-diagnostics': diagnostics,
    './request-security': { appOrigin: () => 'https://example.test', emailField: security.emailField },
    resend: { Resend: class {
      constructor(key, options) {
        assert.equal(key, process.env.RESEND_API_KEY);
        assert.equal(options.baseUrl, 'https://api.resend.com');
      }
      emails = { send: async (content, options) => {
        calls++;
        assert.equal(content.from, process.env.EMAIL_FROM);
        assert.deepEqual(content.to, ['recipient@example.test']);
        assert.equal(options.idempotencyKey, 'reset/test-delivery');
        const result = responses.shift();
        if (result instanceof Error) throw result;
        return result;
      } };
    } },
  });
  console.error = line => logs.push(JSON.parse(line));
  const send = () => email.sendPasswordReset('recipient@example.test', 'sensitive-token', 'test-delivery');
  responses.push({ data: { id: 'accepted' }, error: null });
  await send();
  assert.equal(logs.length, 0);
  const failure = async () => {
    await assert.rejects(send(), error => {
      email.logPasswordResetDeliveryFailure(error, true);
      return error.status === 503;
    });
  };
  calls = 0;
  responses.push({ data: { id: 'must-not-count' }, error: { name: 'validation_error', statusCode: 403, message: 'You can only send testing emails to recipient@example.test sensitive-token re_fake_sensitive_key' } });
  await failure();
  assert.equal(calls, 1);
  assert.equal(logs.at(-1).statusCode, 403);
  assert.match(logs.at(-1).errorMessage, /test sender restriction/);
  responses.push({ data: {}, error: null }, { data: null, error: null });
  await failure();
  assert.equal(logs.at(-1).errorName, 'invalid_response');
  responses.push(new TypeError('sensitive-token'), new TypeError('re_fake_sensitive_key'));
  await failure();
  assert.equal(logs.at(-1).errorName, 'TypeError');
  assert.equal(logs.at(-1).recipientPresent, true);
  assert.equal(logs.at(-1).senderFormatValid, true);
  assert.equal(logs.at(-1).testSender, false);
  assert.doesNotMatch(JSON.stringify(logs), /recipient@example|sensitive-token|re_fake_sensitive_key/);
  assert.equal(diagnostics.emailDiagnostic({name:'sensitive-token', message:'https://host/#token=sensitive-token'}).errorName, 'unknown_error');
  assert.match(diagnostics.emailDiagnostic({message:'The domain is not verified'}).errorMessage, /not verified/);
  assert.match(diagnostics.emailDiagnostic({name:'invalid_api_key'}).errorMessage, /authentication/);
  assert.match(diagnostics.emailDiagnostic({message:'Unable to fetch data.'}).errorMessage, /Transport/);
} finally {
  console.error = originalError;
  for (const key of Object.keys(process.env)) if (!(key in originalEnv)) delete process.env[key];
  Object.assign(process.env, originalEnv);
}
console.log('PASS: Resend credentials/from/recipient wiring, returned errors, missing ID, exceptions and safe diagnostics.');
