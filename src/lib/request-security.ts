import 'server-only';
import { HttpError } from './errors';
export function appOrigin() {
  const configured = process.env.APP_ORIGIN;
  if (!configured) throw new HttpError(503, 'Serviço temporariamente indisponível.');
  const url = new URL(configured);
  if (url.username || url.password || url.pathname !== '/' || url.search || url.hash ||
    (url.protocol !== 'https:' && !(url.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)))) {
    throw new HttpError(503, 'Serviço temporariamente indisponível.');
  }
  return url.origin;
}
export function validateMutation(request: Request) {
  if (request.headers.get('origin') !== appOrigin() || request.headers.get('sec-fetch-site') === 'cross-site') throw new HttpError(403, 'Origem não permitida.');
  if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') throw new HttpError(415, 'Envie os dados como application/json.');
}
export async function readBody(request: Request, maxBytes: number): Promise<string> {
  const declared = request.headers.get('content-length');
  if (declared && (!/^\d+$/.test(declared) || Number(declared) > maxBytes)) throw new HttpError(413, 'Requisição muito grande.');
  if (request.headers.get('content-encoding') && request.headers.get('content-encoding') !== 'identity') throw new HttpError(415, 'Codificação não permitida.');
  if (!request.body) throw new HttpError(400, 'Dados inválidos.');
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) { await reader.cancel(); throw new HttpError(413, 'Requisição muito grande.'); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  return Buffer.concat(chunks).toString('utf8');
}
export async function readJson(request: Request, maxBytes: number): Promise<Record<string, unknown>> {
  const raw = await readBody(request, maxBytes);
  try {
    const body: unknown = JSON.parse(raw);
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error();
    return body as Record<string, unknown>;
  } catch { throw new HttpError(400, 'JSON inválido.'); }
}
export function fields(body: Record<string, unknown>, allowed: string[]) {
  if (Object.keys(body).some(key => !allowed.includes(key))) throw new HttpError(400, 'Dados inválidos.');
}
export function textField(value: unknown, max: number, min = 1): string {
  if (typeof value !== 'string' || value.length < min || value.length > max) throw new HttpError(400, 'Dados inválidos.');
  return value;
}
export function emailField(value: unknown) {
  const email = textField(value, 254).trim().toLowerCase();
  if (!/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/i.test(email) || email.split('@')[0].length > 64 || email.startsWith('.') || email.includes('..')) throw new HttpError(400, 'Informe um e-mail válido.');
  return email;
}
