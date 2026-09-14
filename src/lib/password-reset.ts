import 'server-only';
import { prisma } from './prisma';
import { newToken, tokenHash, validToken } from './session';
import { hashPassword, validatePassword } from './password';
import { HttpError } from './errors';
import { emailConfiguration, sendPasswordReset, logPasswordResetDeliveryFailure } from './email';
import { appOrigin } from './request-security';

export const recoveryMessage = 'Se existir uma conta associada a este e-mail, enviaremos um link de recuperação. Confira também o spam. Se não chegar, tente novamente em alguns minutos.';
export const invalidResetMessage = 'Este link é inválido ou expirou. Solicite uma nova recuperação de senha.';
export async function requestPasswordReset(email: string) {
  emailConfiguration(); appOrigin();
  const issued = await prisma.$transaction(async tx => {
    const users = await tx.$queryRaw<{ id: string; email: string }[]>`SELECT "id", "email" FROM "User" WHERE "email" = ${email} FOR UPDATE`;
    const user = users[0];
    if (!user) return null;
    const token = newToken();
    await tx.passwordResetToken.deleteMany({ where: { userId: user.id } });
    const record = await tx.passwordResetToken.create({ data: {
      userId: user.id, tokenHash: tokenHash(token), expiresAt: new Date(Date.now() + 30 * 60 * 1000),
    } });
    return { token, record, email: user.email };
  });
  if (!issued) return;
  try {
    await sendPasswordReset(issued.email, issued.token, issued.record.id);
  } catch (error) {
    // Same public response even on provider failure; never reveal account existence.
    logPasswordResetDeliveryFailure(error, Boolean(issued.email));
    await prisma.passwordResetToken.deleteMany({ where: { id: issued.record.id } });
  }
}
export async function resetPassword(token: string, password: string, confirmPassword: string) {
  if (!validToken(token)) throw new HttpError(400, invalidResetMessage);
  validatePassword(password);
  if (password !== confirmPassword) throw new HttpError(400, 'As senhas devem ser iguais.');
  const hash = tokenHash(token);
  const candidate = await prisma.passwordResetToken.findUnique({ where: { tokenHash: hash } });
  if (!candidate || candidate.usedAt || candidate.expiresAt <= new Date()) throw new HttpError(400, invalidResetMessage);
  const passwordHash = await hashPassword(password);
  await prisma.$transaction(async tx => {
    // Same user lock as session issuance and reset requests. Recheck after locking.
    await tx.$queryRaw`SELECT "id" FROM "User" WHERE "id" = ${candidate.userId} FOR UPDATE`;
    const consumed = await tx.passwordResetToken.updateMany({
      where: { tokenHash: hash, usedAt: null, expiresAt: { gt: new Date() } }, data: { usedAt: new Date() },
    });
    if (consumed.count !== 1) throw new HttpError(400, invalidResetMessage);
    await tx.user.update({ where: { id: candidate.userId }, data: { passwordHash } });
    await tx.passwordResetToken.deleteMany({ where: { userId: candidate.userId, tokenHash: { not: hash } } });
    await tx.session.deleteMany({ where: { userId: candidate.userId } });
  });
}
