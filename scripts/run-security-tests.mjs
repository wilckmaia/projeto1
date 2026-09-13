// Never loads .env. Creates its own SCRAM-protected loopback cluster and database.
import { spawn, spawnSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { mkdirSync, writeFileSync, readFileSync, copyFileSync, unlinkSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { createServer } from 'node:net';
import { assertTestDatabase } from './test-safety.mjs';
const runId = randomBytes(6).toString('hex');
const root = resolve('.security-test', runId);
mkdirSync(root, { recursive: true });
const pgBin = process.env.PG_BIN ?? (process.platform === 'win32' ? 'C:/Program Files/PostgreSQL/18/bin' : '/usr/lib/postgresql/18/bin');
const pg = name => join(pgBin, name + (process.platform === 'win32' ? '.exe' : ''));
async function freePort() {
  const s = createServer(); await new Promise(r => s.listen(0, '127.0.0.1', r));
  const port = s.address().port; await new Promise(r => s.close(r)); return port;
}
const port = await freePort();
const appPort = await freePort(), emailPort = await freePort();
const password = randomBytes(32).toString('hex');
const database = 'politika_' + runId + '_security_test';
const url = 'postgresql://security_test:' + password + '@127.0.0.1:' + port + '/' + database;
const env = { ...process.env, DATABASE_URL: url, DIRECT_URL: url, SESSION_SECRET: randomBytes(32).toString('hex'),
  APP_ORIGIN: 'http://127.0.0.1:' + appPort, SECURITY_TEST_MODE: '1', EMAIL_TEST_ENDPOINT: 'http://127.0.0.1:' + emailPort,
  PGPASSWORD: password, PGHOST: '127.0.0.1', PGPORT: String(port), PGUSER: 'security_test', PGDATABASE: database,
  RESEND_WEBHOOK_SECRET: 'whsec_' + randomBytes(32).toString('base64'), NEXT_TELEMETRY_DISABLED: '1' };
delete env.VERCEL; delete env.RESEND_API_KEY; delete env.EMAIL_FROM;
assertTestDatabase(env);
function sync(command, args, extra = {}) {
  const result = spawnSync(command, args, { env, windowsHide: true, encoding: 'utf8', ...(command === pg('pg_ctl') ? { stdio: 'ignore' } : {}), ...extra });
  if (result.status !== 0) { console.error((result.stderr ?? result.error?.code ?? '').split(password).join('[redacted]')); throw new Error('Local setup failed: ' + command.split(/[\\/]/).at(-1)); }
}
async function node(args) {
  const child = spawn(process.execPath, args, { env, windowsHide: true, stdio: 'pipe' });
  const redact = chunk => process.stdout.write(chunk.toString().split(password).join('[redacted]'));
  child.stdout.on('data', redact); child.stderr.on('data', redact);
  await new Promise((res, rej) => { child.on('error', rej); child.on('exit', code => code === 0 ? res() : rej(new Error('Verification command failed: ' + args[0]))); });
}
let started = false;
try {
  const passwordFile = join(root, 'init-password');
  writeFileSync(passwordFile, password, { mode: 0o600 });
  try { sync(pg('initdb'), ['-D', join(root, 'postgres'), '-U', 'security_test', '--auth=scram-sha-256', '--pwfile=' + passwordFile, '--encoding=UTF8', '--locale=C']); }
  finally { unlinkSync(passwordFile); }
  sync(pg('pg_ctl'), ['-D', join(root, 'postgres'), '-l', join(root, 'postgres.log'), '-o', '-h 127.0.0.1 -p ' + port, '-w', 'start']); started = true;
  sync(pg('createdb'), [database]);
  // Apply the original migration, add legacy duplicates, then exercise the upgrade.
  const original = join(root, 'prisma');
  mkdirSync(join(original, 'migrations', '20260908000000_postgresql_init'), { recursive: true });
  copyFileSync('prisma/schema.prisma', join(original, 'schema.prisma'));
  copyFileSync('prisma/migrations/migration_lock.toml', join(original, 'migrations', 'migration_lock.toml'));
  copyFileSync('prisma/migrations/20260908000000_postgresql_init/migration.sql', join(original, 'migrations', '20260908000000_postgresql_init', 'migration.sql'));
  await node(['node_modules/prisma/build/index.js', 'migrate', 'deploy', '--schema', join(original, 'schema.prisma')]);
  const fixture = 'INSERT INTO "User" ("id","name","email","passwordHash") VALUES (\'migration-fixture\',\'Fixture\',\'fixture@example.test\',\'unused\');' +
    'INSERT INTO "TaskProgress" ("id","userId","taskId","worldId") VALUES (\'migration-progress\',\'migration-fixture\',\'m1-t1\',\'mundo-1\');' +
    'INSERT INTO "AnswerAttempt" ("id","userId","taskProgressId","taskId","questionId","selectedIndex","correctIndex","isCorrect") VALUES (\'old-1\',\'migration-fixture\',\'migration-progress\',\'m1-t1\',\'m1-t1-0\',0,1,false),(\'old-2\',\'migration-fixture\',\'migration-progress\',\'m1-t1\',\'m1-t1-0\',1,1,true);';
  sync(pg('psql'), ['-v', 'ON_ERROR_STOP=1', '-c', fixture]);
  await node(['node_modules/prisma/build/index.js', 'migrate', 'deploy']);
  await node(['node_modules/prisma/build/index.js', 'migrate', 'deploy']);
  await node(['node_modules/prisma/build/index.js', 'migrate', 'diff', '--from-schema-datasource', 'prisma/schema.prisma', '--to-schema-datamodel', 'prisma/schema.prisma', '--exit-code']);
  await node(['node_modules/prisma/build/index.js', 'generate']);
  await node(['node_modules/next/dist/bin/next', 'typegen']);
  await node(['node_modules/typescript/bin/tsc', '--noEmit', '--incremental', 'false']);
  await node(['scripts/security-unit.mjs']);
  await node(['node_modules/next/dist/bin/next', 'build']);
  await node(['scripts/check-achievements.mjs']);
  if (process.argv.includes('--browser')) await node(['scripts/check-themes.mjs']);
  const importDatabase = 'politika_' + randomBytes(6).toString('hex') + '_security_test';
  sync(pg('createdb'), [importDatabase]);
  const importURL = new URL(env.DATABASE_URL); importURL.pathname = '/' + importDatabase;
  env.DATABASE_URL = importURL.href; env.DIRECT_URL = importURL.href; env.PGDATABASE = importDatabase;
  env.IMPORT_FIXTURE_PATH = join(root, 'import-fixture.db');
  await node(['node_modules/prisma/build/index.js', 'migrate', 'deploy']);
  await node(['scripts/test-import.mjs']);
  console.log('PASS: isolated migration upgrade, build and security integration.');
} finally {
  if (started) sync(pg('pg_ctl'), ['-D', join(root, 'postgres'), '-m', 'fast', '-w', 'stop']);
  // Keep only ignored, stopped test data for diagnosis. No remote database touched.
  const config = readFileSync('prisma/schema.prisma', 'utf8');
  if (!config.includes('model Session')) process.exitCode = 1;
}
