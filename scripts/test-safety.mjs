export function assertTestDatabase(env = process.env) {
  if (env.SECURITY_TEST_MODE !== '1' || env.VERCEL) throw new Error('Use npm run test:integration; direct test execution is blocked.');
  const urls = ['DATABASE_URL', 'DIRECT_URL'].map(key => new URL(env[key] ?? ''));
  if (urls.some(url => !['postgresql:', 'postgres:'].includes(url.protocol) || !['127.0.0.1', 'localhost'].includes(url.hostname) || !/^\/politika_[a-f0-9]+_security_test$/.test(url.pathname))) throw new Error('Only isolated loopback security-test databases are allowed.');
  if (urls[0].host !== urls[1].host || urls[0].pathname !== urls[1].pathname || urls[0].username !== urls[1].username) throw new Error('Test database connections must agree.');
}
