import 'server-only';
import { createHash, randomBytes } from 'node:crypto';
import { cookies } from 'next/headers';
import { prisma } from './prisma';
import { HttpError } from './errors';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30;
export const SESSION_COOKIE = 'politika_user';
export const tokenHash = (token: string) => createHash('sha256').update(token).digest('hex');
export const newToken = () => randomBytes(32).toString('base64url');
export const validToken = (token: string) => /^[A-Za-z0-9_-]{43}$/.test(token);
const cookieOptions = { httpOnly: true, sameSite: 'lax' as const, secure: process.env.NODE_ENV === 'production', path: '/', priority: 'high' as const };
export async function setSession(userId: string, expectedPasswordHash: string) {
  const store = await cookies();
  const previous = store.get(SESSION_COOKIE)?.value;
  const token = newToken();
  await prisma.$transaction(async tx => {
    // Serialize session issuance per user to enforce the active-session bound.
    const locked = await tx.$queryRaw<{ passwordHash: string }[]>`SELECT "passwordHash" FROM "User" WHERE "id" = ${userId} FOR UPDATE`;
    if (locked[0]?.passwordHash !== expectedPasswordHash) throw new HttpError(401, "Entre novamente na sua conta.");
    if (previous && validToken(previous)) await tx.session.deleteMany({ where: { tokenHash: tokenHash(previous) } });
    await tx.session.deleteMany({ where: { userId, expiresAt: { lte: new Date() } } });
    const old = await tx.session.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, skip: 9, select: { tokenHash: true } });
    if (old.length) await tx.session.deleteMany({ where: { tokenHash: { in: old.map(item => item.tokenHash) } } });
    await tx.session.create({ data: { tokenHash: tokenHash(token), userId, expiresAt: new Date(Date.now() + SESSION_MAX_AGE * 1000) } });
  });
  store.set(SESSION_COOKIE, token, { ...cookieOptions, maxAge: SESSION_MAX_AGE });
}
export async function logoutUser() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token && validToken(token)) await prisma.session.deleteMany({ where: { tokenHash: tokenHash(token) } });
  store.set(SESSION_COOKIE, '', { ...cookieOptions, maxAge: 0, expires: new Date(0) });
}
export async function sessionUser() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token || !validToken(token)) return null;
  const session = await prisma.session.findUnique({ where: { tokenHash: tokenHash(token) }, select: { expiresAt: true, user: { select: { id: true, name: true, email: true, createdAt: true } } } });
  if (!session || session.expiresAt <= new Date()) return null;
  const { id, name, email, createdAt } = session.user;
  return { id, name, email, createdAt };
}
