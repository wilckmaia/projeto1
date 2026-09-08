import { createHmac, timingSafeEqual } from 'node:crypto';

export const SESSION_MAX_AGE = 60 * 60 * 24 * 30;

function sign(payload: string) {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error('Configure SESSION_SECRET com pelo menos 32 caracteres aleatórios.');
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

export function createSessionToken(userId: string) {
  const payload = Buffer.from(JSON.stringify({ userId, expiresAt: Date.now() + SESSION_MAX_AGE * 1000 })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export function readSessionToken(token: string): string | null {
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payload, signature] = parts;
  const expected = Buffer.from(sign(payload));
  const received = Buffer.from(signature);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null;
  try {
    const value = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return typeof value.userId === 'string' && Number.isSafeInteger(value.expiresAt) && value.expiresAt > Date.now() ? value.userId : null;
  } catch {
    return null;
  }
}
