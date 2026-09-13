import 'server-only';
import { createHmac } from 'node:crypto';
import { isIP } from 'node:net';
import { prisma } from './prisma';
import { HttpError } from './errors';
export function clientKey(request: Request) {
  // Only Vercel's overwritten header is trusted. Direct hosting shares a bucket.
  if (process.env.VERCEL === '1') {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim();
    if (!ip || !isIP(ip)) throw new HttpError(503, 'Serviço temporariamente indisponível.');
    return ip;
  }
  return 'direct';
}
export async function limit(scope: string, identity: string, maximum: number, seconds: number) {
  const result = await countAttempt(scope, identity, maximum, seconds);
  if (result.count > maximum) throw new HttpError(429, 'Muitas tentativas. Aguarde e tente novamente.', result.retry);
}
async function countAttempt(scope: string, identity: string, maximum: number, seconds: number) {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) throw new HttpError(503, 'Serviço temporariamente indisponível.');
  const key = createHmac('sha256', secret).update(scope + ':' + identity).digest('hex');
  const rows = await prisma.$queryRaw<{ count: number; retry: number }[]>`
    INSERT INTO "RateLimit" ("key", "count", "expiresAt")
    VALUES (${key}, 1, CURRENT_TIMESTAMP + ${seconds} * INTERVAL '1 second')
    ON CONFLICT ("key") DO UPDATE SET
      "count" = CASE WHEN "RateLimit"."expiresAt" <= CURRENT_TIMESTAMP THEN 1 ELSE LEAST("RateLimit"."count" + 1, ${maximum + 1}) END,
      "expiresAt" = CASE WHEN "RateLimit"."expiresAt" <= CURRENT_TIMESTAMP THEN CURRENT_TIMESTAMP + ${seconds} * INTERVAL '1 second' ELSE "RateLimit"."expiresAt" END
    RETURNING "count", GREATEST(1, CEIL(EXTRACT(EPOCH FROM ("expiresAt" - CURRENT_TIMESTAMP))))::int AS retry
  `;
  await prisma.$executeRaw`DELETE FROM "RateLimit" WHERE "key" IN (SELECT "key" FROM "RateLimit" WHERE "expiresAt" < CURRENT_TIMESTAMP LIMIT 20)`;
  return rows[0];
}
export async function delayFailedLogin(ip: string) {
  // IP-only penalty for incorrect credentials; no account lock or email counter.
  const { count } = await countAttempt('login-failures', ip, 8, 300);
  const milliseconds = Math.min(2000, 125 * 2 ** (count - 1));
  await new Promise(resolve => setTimeout(resolve, milliseconds));
}
