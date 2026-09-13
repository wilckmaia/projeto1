import 'server-only';
import { randomUUID } from 'node:crypto';
import { prisma } from './prisma';
import { HttpError } from './errors';
import { checkPassword, hashPassword, validatePassword } from './password';
import { newToken, tokenHash, validToken, setSession } from './session';
import { emailConfiguration, sendConfirmation } from './email';
export const confirmationMessage = 'Se a solicitação puder ser concluída, você receberá instruções por e-mail. Confira também o spam. Se não chegar, tente reenviar.';
const usableDelivery = ['accepted', 'delivered', 'delayed'];
export const registrationMessage = 'Solicitação de cadastro concluída. Entre com seu e-mail e senha. Se já possui conta, use sua senha atual.';
export async function registerUser(email: string, name: string, password: string) {
  validatePassword(password);
  const passwordHash = await hashPassword(password);
  await prisma.$transaction(async tx => {
    await tx.$queryRaw`SELECT 1 FROM pg_advisory_xact_lock(hashtextextended(${email}, 0))`;
    await tx.user.createMany({ data: [{ id: 'user-' + randomUUID(), email, name, passwordHash }], skipDuplicates: true });
    // An older pending signup cannot replace the new account's credentials.
    await tx.authChallenge.deleteMany({ where: { email, kind: 'register' } });
  });
}
export async function requestConfirmation(email: string) {
  emailConfiguration();
  const token = newToken();
  // Each send has its own token. A failed resend never replaces a working link.
  const challenge = await prisma.$transaction(async tx => {
    await tx.$queryRaw`SELECT 1 FROM pg_advisory_xact_lock(hashtextextended(${email}, 0))`;
    const user = await tx.user.findUnique({ where: { email }, select: { id: true } });
    const pending = !user ? await tx.authChallenge.findFirst({
      where: { email, kind: 'register', passwordHash: { not: null }, createdAt: { gt: new Date(Date.now() - 86400000) } },
      orderBy: { createdAt: 'desc' },
    }) : null;
    return tx.authChallenge.create({ data: {
      email, kind: 'register', tokenHash: tokenHash(token), deliveryStatus: 'pending',
      subjectUserId: user?.id, name: pending?.name,
      passwordHash: pending?.passwordHash,
      expiresAt: new Date(Date.now() + 1800000),
    } });
  });
  try {
    const providerId = await sendConfirmation(email, token, challenge.deliveryId);
    const activated = await prisma.authChallenge.updateMany({
      where: { tokenHash: challenge.tokenHash, deliveryStatus: { in: ['pending', ...usableDelivery] } },
      data: { providerId },
    });
    await prisma.authChallenge.updateMany({
      where: { tokenHash: challenge.tokenHash, deliveryStatus: 'pending' }, data: { deliveryStatus: 'accepted' },
    });
    if (activated.count !== 1) throw new HttpError(503, 'Não foi possível concluir o envio. Tente novamente.');
  } catch (error) {
    await prisma.authChallenge.updateMany({ where: { tokenHash: challenge.tokenHash }, data: { deliveryStatus: 'failed' } });
    throw error;
  }
  // Retain pending signup details for resending for 24h; tokens still expire in 30m.
  await prisma.$executeRaw`DELETE FROM "AuthChallenge" WHERE "tokenHash" IN (SELECT "tokenHash" FROM "AuthChallenge" WHERE "expiresAt" < CURRENT_TIMESTAMP - INTERVAL '24 hours' LIMIT 20)`;
}
export async function confirm(token: string) {
  const invalid = () => new HttpError(400, 'Link inválido, expirado ou já utilizado. Solicite um novo link.');
  if (!validToken(token)) throw invalid();
  await prisma.$transaction(async tx => {
    const hash = tokenHash(token);
    const candidate = await tx.authChallenge.findUnique({ where: { tokenHash: hash }, select: { email: true } });
    if (!candidate) throw invalid();
    // Serialize confirmation/resend per email, including two different valid tokens.
    await tx.$queryRaw`SELECT 1 FROM pg_advisory_xact_lock(hashtextextended(${candidate.email}, 0))`;
    const challenge = await tx.authChallenge.findUnique({ where: { tokenHash: hash } });
    if (!challenge || challenge.kind !== 'register' || challenge.expiresAt <= new Date() || !usableDelivery.includes(challenge.deliveryStatus)) throw invalid();
    const removed = await tx.authChallenge.deleteMany({ where: {
      tokenHash: hash, expiresAt: { gt: new Date() }, deliveryStatus: { in: usableDelivery },
    } });
    if (removed.count !== 1) throw invalid();
    if (!challenge.subjectUserId && challenge.name && challenge.passwordHash) {
      await tx.user.createMany({ data: [{ id: 'user-' + randomUUID(), email: challenge.email,
        name: challenge.name, passwordHash: challenge.passwordHash, emailVerifiedAt: new Date() }], skipDuplicates: true });
    }
    if (challenge.subjectUserId) {
      await tx.user.updateMany({ where: { id: challenge.subjectUserId, email: challenge.email, emailVerifiedAt: null }, data: { emailVerifiedAt: new Date() } });
    }
    // Consume sibling verification links only.
    await tx.authChallenge.deleteMany({ where: { email: challenge.email, kind: 'register' } });
  });
}
export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  const matches = await checkPassword(password, user?.passwordHash);
  if (!user || !matches || Buffer.byteLength(password, 'utf8') > 72) throw new HttpError(401, 'E-mail ou senha inválidos.');
  await setSession(user.id, user.passwordHash);
}
