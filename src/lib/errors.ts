import 'server-only';
import { randomUUID } from 'node:crypto';
export class HttpError extends Error {
  constructor(public status: number, message: string, public retryAfter?: number) { super(message); }
}
export function json(data: unknown, status = 200) {
  return Response.json(data, { status, headers: { 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff' } });
}
export function errorResponse(error: unknown) {
  if (error instanceof HttpError) {
    const response = json({ error: error.message }, error.status);
    if (error.retryAfter) response.headers.set('Retry-After', String(error.retryAfter));
    return response;
  }
  const incidentId = randomUUID();
  console.error(JSON.stringify({ event: 'request_failed', incidentId }));
  return json({ error: 'Não foi possível concluir a operação. Tente novamente.', incidentId }, 500);
}
