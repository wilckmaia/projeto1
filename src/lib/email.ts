import 'server-only';
import { HttpError } from './errors';
import { appOrigin } from './request-security';
export function emailConfiguration() {
  const test = process.env.EMAIL_TEST_ENDPOINT;
  if (test) {
    const url = new URL(test);
    const db = new URL(process.env.DATABASE_URL ?? '');
    if (process.env.SECURITY_TEST_MODE !== '1' || process.env.VERCEL || !['127.0.0.1', 'localhost'].includes(url.hostname) ||
      !['127.0.0.1', 'localhost'].includes(db.hostname) || !db.pathname.endsWith('_security_test')) throw new HttpError(503, 'Serviço temporariamente indisponível.');
    return { endpoint: test, key: 'local-test', from: 'test@example.test' };
  }
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) throw new HttpError(503, 'Confirmação por e-mail temporariamente indisponível.');
  return { endpoint: 'https://api.resend.com/emails', key: process.env.RESEND_API_KEY, from: process.env.EMAIL_FROM };
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
