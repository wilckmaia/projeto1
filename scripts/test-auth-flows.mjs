import assert from 'node:assert/strict';
import { randomUUID, createHash } from 'node:crypto';
import { Webhook } from 'svix';
import bcrypt from 'bcryptjs';
import { assertTestDatabase } from './test-safety.mjs';
export async function testAuthFlows({ prisma, base, post, current, getToken, mail, delivery, clearLimits, accounts }) {
  assertTestDatabase();
  const hash = value => createHash('sha256').update(value).digest('hex');
  const email = () => randomUUID() + '@example.test';
  const password = 'A secure test passphrase ' + randomUUID();
  const register = async address => {
    await clearLimits();
    const response = await post('/api/session', { action: 'register', name: 'Email owner', email: address, password });
    assert.equal(response.status, 202);
    // Exercise old optional links separately: registration itself sends no mail.
    const result = await post('/api/session', { action: 'verify-resend', email: address });
    assert.equal(result.status, 202);
    return result.json();
  };
  const confirm = token => post('/api/session', { action: 'confirm', token });
  const request = async (address, action = 'verify-resend') => {
    await clearLimits();
    return post('/api/session', { action, email: address });
  };
  const login = (address, secret = password) => post('/api/session', { action: 'login', email: address, password: secret });
  const remember = async address => { const user = await prisma.user.findUniqueOrThrow({ where: { email: address } }); accounts.push(user.id); return user; };
  const webhook = async (message, type, options = {}) => {
    const id = 'msg_' + randomUUID(), timestamp = new Date(Date.now() - (options.old ? 600000 : 0));
    const payload = JSON.stringify({ type, created_at: new Date().toISOString(), data: {
      email_id: message.providerId, tags: { auth_delivery_id: message.tags[0].value },
    } });
    const signature = new Webhook(process.env.RESEND_WEBHOOK_SECRET).sign(id, timestamp, payload);
    return fetch(base + '/api/webhooks/resend', { method: 'POST', headers: {
      'Content-Type': 'application/json', 'svix-id': id, 'svix-timestamp': String(Math.floor(timestamp.getTime() / 1000)),
      'svix-signature': options.invalid ? signature + 'invalid' : signature,
    }, body: payload });
  };
  const offline = email();
  await clearLimits();
  delivery.mode = 'fail';
  const mailCount = mail.length;
  assert.equal((await post('/api/session', { action: 'register', name: 'Offline mail', email: offline, password })).status, 202, 'signup independent of email delivery');
  assert.equal(mail.length, mailCount, 'signup does not contact provider');
  assert.equal((await login(offline)).status, 200);
  await remember(offline);
  delivery.mode = 'ok';
  const pending = email();
  const generic = await register(pending);
  const original = getToken(pending);
  assert.equal((await prisma.user.findUniqueOrThrow({ where: { email: pending } })).emailVerifiedAt, null);
  assert.equal((await login(pending)).status, 200, 'signup can log in without verification');
  const stored = await prisma.authChallenge.findUniqueOrThrow({ where: { tokenHash: hash(original) } });
  assert.notEqual(stored.passwordHash, password);
  assert.ok(stored.expiresAt > new Date() && stored.expiresAt <= new Date(Date.now() + 1800000));
  assert.ok(!JSON.stringify(stored).includes(original), 'raw token is never persisted');
  assert.equal((await webhook(mail.at(-1), 'email.delivered')).status, 200);
  assert.equal((await prisma.user.findUniqueOrThrow({ where: { email: pending } })).emailVerifiedAt, null, 'delivery is not ownership verification');
  const cooldown = await post('/api/session', { action: 'verify-resend', email: pending });
  assert.equal(cooldown.status, 202, 'resend has no cooldown');
  assert.equal((await request(pending)).status, 202);
  const second = getToken(pending);
  assert.notEqual(second, original);
  const race = await Promise.all([confirm(original), confirm(second)]);
  assert.deepEqual(race.map(r => r.status).sort(), [200, 400], 'sibling verification links consumed atomically');
  const owner = await remember(pending);
  assert.ok(owner.emailVerifiedAt);
  assert.equal(await prisma.authChallenge.count({ where: { email: pending } }), 0);
  assert.equal((await login(pending)).status, 200);
  assert.deepEqual(await register(pending), generic, 'duplicate signup response is identical');
  const duplicateToken = getToken(pending);
  await confirm(duplicateToken);
  assert.equal((await login(pending)).status, 200, 'duplicate registration cannot change password');

  const expired = email();
  await register(expired);
  const old = getToken(expired);
  await prisma.authChallenge.update({ where: { tokenHash: hash(old) }, data: { expiresAt: new Date(0) } });
  assert.equal((await confirm(old)).status, 400);
  assert.equal((await request(expired)).status, 202, 'resend retains signup details after token expiry');
  assert.equal((await confirm(getToken(expired))).status, 200);
  await remember(expired);

  const failure = email();
  await register(failure);
  const working = getToken(failure);
  delivery.mode = 'fail';
  const before = mail.length;
  assert.equal((await request(failure)).status, 503, 'provider failure is not reported as success');
  assert.equal(mail.length, before + 2, 'bounded retry');
  assert.equal(mail.at(-1).idempotencyKey, mail.at(-2).idempotencyKey, 'retry uses same key');
  const rejected = getToken(failure);
  assert.equal((await confirm(rejected)).status, 400, 'failed-send token is unusable');
  delivery.mode = 'ok';
  assert.equal((await confirm(working)).status, 200, 'failed resend preserves previous link');
  await remember(failure);
  delivery.mode = 'once';
  assert.equal((await request(failure)).status, 202, 'transient provider error recovered');
  delivery.mode = 'malformed';
  assert.equal((await request(email())).status, 503, 'invalid provider response fails closed');
  delivery.mode = 'timeout';
  assert.equal((await request(email())).status, 503, 'network timeout has recoverable error');
  delivery.mode = 'ok';

  const bounced = email();
  await register(bounced);
  const message = mail.at(-1), bouncedToken = getToken(bounced);
  assert.equal((await webhook(message, 'email.bounced', { invalid: true })).status, 400);
  assert.equal((await webhook(message, 'email.bounced', { old: true })).status, 400);
  assert.equal((await webhook(message, 'email.bounced')).status, 200);
  assert.equal((await webhook(message, 'email.bounced')).status, 200, 'webhook replay is idempotent');
  assert.equal((await webhook(message, 'email.delivered')).status, 200);
  assert.equal((await confirm(bouncedToken)).status, 400, 'late delivered event cannot resurrect bounced token');
  assert.equal((await request(bounced)).status, 202);
  assert.equal((await confirm(getToken(bounced))).status, 200);
  await remember(bounced);

  await clearLimits();
  const signedIn = await login(pending);
  const cookie = signedIn.headers.get('set-cookie').split(';')[0];
  const oldHash = (await prisma.user.findUniqueOrThrow({ where: { email: pending } })).passwordHash;
  const oldToken = Buffer.from(randomUUID() + randomUUID()).toString('base64url').slice(0, 43);
  await prisma.authChallenge.create({ data: { email: pending, kind: 'reset', tokenHash: hash(oldToken), subjectUserId: owner.id, passwordHash: oldHash, expiresAt: new Date(Date.now() + 1800000) } });
  const beforeMail = mail.length;
  const beforeTokens = await prisma.authChallenge.count();
  for (const action of ['reset-request', 'reset-confirm']) {
    assert.equal((await post('/api/session', { action, email: pending, token: oldToken, password: 'Different strong phrase 12345' }, cookie)).status, 400, 'removed action is rejected');
  }
  assert.equal((await confirm(oldToken)).status, 400, 'verification cannot consume old recovery token');
  assert.equal(mail.length, beforeMail);
  assert.equal(await prisma.authChallenge.count(), beforeTokens);
  assert.equal((await prisma.user.findUniqueOrThrow({ where: { email: pending } })).passwordHash, oldHash);
  assert.equal((await current(cookie)).user.id, owner.id, 'removed flow cannot revoke sessions');
  assert.equal((await login(pending)).status, 200, 'password remains unchanged');
  assert.equal((await fetch(base + '/recuperar-senha')).status, 200);
  await prisma.authChallenge.deleteMany({ where: { tokenHash: hash(oldToken) } });
  const noSignup = email();
  assert.deepEqual(await (await request(noSignup)).json(), generic);
  assert.equal((await confirm(getToken(noSignup))).status, 200);
  assert.equal(await prisma.user.findUnique({ where: { email: noSignup } }), null, 'resend alone cannot create account');

  const legacy = await prisma.user.create({ data: { id: randomUUID(), name: 'Legacy', email: email(), passwordHash: await bcrypt.hash('old123', 12) } });
  accounts.push(legacy.id);
  const legacyToken = Buffer.from(randomUUID() + randomUUID()).toString('base64url').slice(0, 43);
  await prisma.session.create({ data: { tokenHash: hash(legacyToken), userId: legacy.id, expiresAt: new Date(Date.now() + 3600000) } });
  const legacyCookie = 'politika_user=' + legacyToken;
  await clearLimits();
  assert.equal((await current(legacyCookie)).user.id, legacy.id);
  assert.equal((await post('/api/progress', { answers: [] }, legacyCookie)).status, 400);
  assert.equal((await post('/api/achievements/share', { worldId: 'mundo-1' }, legacyCookie)).status, 403);
  assert.equal(new URL((await fetch(base + '/perfil', { headers: { Cookie: legacyCookie } })).url).pathname, '/perfil');
  assert.equal((await login(legacy.email, 'wrong')).status, 401);
  assert.equal((await login(legacy.email, 'old123')).status, 200);
  await request(legacy.email);
  assert.equal((await confirm(getToken(legacy.email))).status, 200);
  assert.equal((await current(legacyCookie)).user.id, legacy.id, 'optional verification does not revoke valid sessions');
  assert.equal((await login(legacy.email, 'old123')).status, 200, 'verified legacy password still works');

  await clearLimits();
  const times = [];
  for (let i = 0; i < 8; i++) {
    const start = Date.now();
    assert.equal((await post('/api/session', { action: 'login', email: legacy.email, password: 'wrong' }, undefined, { 'X-Forwarded-For': '1.2.3.' + i })).status, 401);
    times.push(Date.now() - start);
  }
  assert.ok(times.at(-1) > times[0] + 900, 'progressive delay uses shared IP bucket');
  assert.equal((await login(legacy.email, 'old123')).status, 200, 'correct login after eight failures: no account lock');
  await clearLimits();
  for (let i = 0; i < 30; i++) assert.equal((await post('/api/session', { action: 'unknown' }, undefined, { 'X-Forwarded-For': '1.2.3.' + i })).status, 400);
  const limited = await login(legacy.email, 'old123');
  assert.equal(limited.status, 200, 'valid login is not blocked by request count');
  await clearLimits();
  console.log('PASS: complete verification, resend/expiry, hashed single-use tokens, delivery errors/webhooks, removed recovery rejection, unverified account access and login after eight failures.');
}
