import 'server-only';
import { Resend } from 'resend';
import { HttpError } from './errors';
import { appOrigin, emailField } from './request-security';
import { emailDiagnostic } from './email-diagnostics';

class PasswordResetDeliveryError extends HttpError {
  constructor(readonly diagnostic: ReturnType<typeof emailDiagnostic>) {
    super(503, 'Não foi possível enviar o e-mail agora.');
  }
}

export function logPasswordResetDeliveryFailure(error: unknown, recipientPresent: boolean) {
  const from = process.env.EMAIL_FROM ?? '';
  const address = from.match(/^[^<>\r\n]+<([^<>]+)>$/)?.[1] ?? from;
  let senderFormatValid = false;
  try { emailField(address); senderFormatValid = !/[\r\n]/.test(from); } catch { /* Boolean only. */ }
  console.error(JSON.stringify({ event: 'password_reset_delivery_failed', provider: 'resend',
    ...(error instanceof PasswordResetDeliveryError ? error.diagnostic : emailDiagnostic(error)), recipientPresent,
    senderFormatValid, testSender: /@resend\.dev$/i.test(address.trim()) }));
}
export function emailConfiguration() {
  const test = process.env.EMAIL_TEST_ENDPOINT;
  if (test) {
    const url = new URL(test);
    const db = new URL(process.env.DATABASE_URL ?? '');
    if (process.env.SECURITY_TEST_MODE !== '1' || process.env.VERCEL || !['127.0.0.1', 'localhost'].includes(url.hostname) ||
      !['127.0.0.1', 'localhost'].includes(db.hostname) || !db.pathname.endsWith('_security_test')) throw new HttpError(503, 'Serviço temporariamente indisponível.');
    return { endpoint: test, key: 'local-test', from: 'test@example.test' };
  }
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM || /[\r\n]/.test(process.env.EMAIL_FROM) || !process.env.EMAIL_FROM.includes('@')) throw new HttpError(503, 'Serviço de e-mail temporariamente indisponível.');
  return { endpoint: 'https://api.resend.com/emails', key: process.env.RESEND_API_KEY, from: process.env.EMAIL_FROM };
}

export async function sendPasswordReset(email: string, token: string, deliveryId: string) {
  const config = emailConfiguration();
  // Keep the bearer credential out of server access logs, referrers and RSC payloads.
  const link = appOrigin() + '/redefinir-senha#' + new URLSearchParams({ token });
  const safeLink = link.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
  const content = {
    from: config.from, to: [email], subject: 'Redefinição de senha - Politika',
    text: 'Olá,\n\nRecebemos uma solicitação para redefinir a senha da sua conta no Politika.\nClique no link abaixo para criar uma nova senha. Este link expira em 30 minutos.\nSe você não solicitou essa alteração, ignore este e-mail. Sua senha atual continuará funcionando.\nPor segurança, nunca compartilhe este link.\n\nEquipe Politika\n\n' + link,
    html: `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;padding:24px 12px;background:#f3f5f9;font-family:Arial,sans-serif;color:#17233a"><table role="presentation" style="width:100%;max-width:560px;margin:auto;background:#fff;border-radius:16px"><tr><td style="padding:32px"><p style="font-size:14px;font-weight:bold;letter-spacing:2px;color:#3452a0">POLITIKA</p><h1 style="font-size:26px">Redefina sua senha</h1><p>Olá,</p><p style="line-height:1.6">Recebemos uma solicitação para redefinir a senha da sua conta no Politika.</p><p>Clique no botão abaixo para criar uma nova senha:</p><p style="margin:32px 0"><a href="${safeLink}" style="display:inline-block;background:#3452a0;color:#fff;padding:16px 24px;border-radius:8px;text-decoration:none;font-weight:bold">Redefinir minha senha</a></p><p><strong>Este link expira em 30 minutos.</strong></p><p style="line-height:1.6">Se você não solicitou essa alteração, ignore este e-mail. Sua senha atual continuará funcionando.</p><p>Por segurança, nunca compartilhe este link.</p><p>Equipe Politika</p><hr style="border:0;border-top:1px solid #e5e7eb"><p style="font-size:12px;line-height:1.6">Se o botão não funcionar, copie e cole este endereço no navegador:<br><a href="${safeLink}" style="word-break:break-all;color:#3452a0">${safeLink}</a></p></td></tr></table></body></html>`,
  };
  // Pin production API: SDK otherwise accepts an implicit RESEND_BASE_URL override.
  const resend = new Resend(config.key, { baseUrl: process.env.EMAIL_TEST_ENDPOINT ? config.endpoint : 'https://api.resend.com' });
  let diagnostic = emailDiagnostic(null);
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const options = { idempotencyKey: 'reset/' + deliveryId, signal: AbortSignal.timeout(10000) };
      const { data, error } = await resend.emails.send(content, options);
      if (!error && typeof data?.id === 'string' && data.id.length > 0) return;
      diagnostic = error ? emailDiagnostic(error) : { errorName: 'invalid_response', errorMessage: 'Provider response has no email ID.', statusCode: null };
      if (diagnostic.statusCode && diagnostic.statusCode < 500 && ![429, 409].includes(diagnostic.statusCode)) break;
    } catch (error) { diagnostic = emailDiagnostic(error); }
    if (attempt === 0) await new Promise(resolve => setTimeout(resolve, 500));
  }
  throw new PasswordResetDeliveryError(diagnostic);
}
export async function sendConfirmation(email: string, token: string, deliveryId: string) {
  const config = emailConfiguration();
  // Fragment avoids tokens in access logs/referrers. GET never consumes the link.
  const link = appOrigin() + '/confirmar#' + new URLSearchParams({ token, kind: 'register' });
  const body = JSON.stringify({
    from: config.from, to: [email],
    subject: 'Verifique seu e-mail na Politika',
    text: 'Para verificar seu e-mail, abra o link abaixo. Se não iniciou um cadastro, volte ao site e crie sua conta.' +
      ' O link expira em 30 minutos e só pode ser usado uma vez. Se você não fez esta solicitação, ignore esta mensagem.\n\n' + link,
    tags: [{ name: 'auth_delivery_id', value: deliveryId }],
  });
  // One bounded retry with the same idempotency key/payload, including timeouts.
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await fetch(config.endpoint, {
        method: 'POST', headers: { Authorization: 'Bearer ' + config.key, 'Content-Type': 'application/json', 'Idempotency-Key': 'auth/' + deliveryId },
        body, signal: AbortSignal.timeout(10000),
      });
      if (response.ok) {
        const data: unknown = await response.json();
        if (data && typeof data === 'object' && 'id' in data && typeof data.id === 'string' && data.id.length > 0 && data.id.length <= 128) return data.id;
        break;
      }
      if (response.status !== 429 && response.status < 500) break;
    } catch { /* Do not log recipients, tokens, credentials or provider bodies. */ }
    if (attempt === 0) await new Promise(resolve => setTimeout(resolve, 500));
  }
  console.error(JSON.stringify({ event: 'auth_email_send_failed', deliveryId }));
  throw new HttpError(503, 'Não foi possível enviar o e-mail agora. Tente novamente em instantes.', 60);
}
