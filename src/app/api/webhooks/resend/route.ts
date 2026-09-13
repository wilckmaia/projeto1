import { Webhook } from 'svix';
import { prisma } from '@/lib/prisma';
import { errorResponse, HttpError, json } from '@/lib/errors';
import { readBody } from '@/lib/request-security';
export async function POST(request: Request) {
  try {
    const secret = process.env.RESEND_WEBHOOK_SECRET;
    if (!secret) throw new HttpError(503, 'Serviço temporariamente indisponível.');
    const raw = await readBody(request, 65536);
    let payload: unknown;
    try {
      // Svix validates the original bytes, HMAC and timestamp tolerance.
      new Webhook(secret).verify(raw, {
        'svix-id': request.headers.get('svix-id') ?? '',
        'svix-timestamp': request.headers.get('svix-timestamp') ?? '',
        'svix-signature': request.headers.get('svix-signature') ?? '',
      });
      // Current Svix verifies only; parse JSON strictly after signature validation.
      payload = JSON.parse(raw);
    } catch { throw new HttpError(400, 'Webhook inválido.'); }
    if (!payload || typeof payload !== 'object' || !('type' in payload) || !('data' in payload)) throw new HttpError(400, 'Evento inválido.');
    const states: Record<string, string> = {
      'email.sent': 'accepted', 'email.delivered': 'delivered', 'email.delivery_delayed': 'delayed',
      'email.failed': 'failed', 'email.bounced': 'bounced', 'email.complained': 'complained', 'email.suppressed': 'failed',
    };
    const state = typeof payload.type === 'string' ? states[payload.type] : undefined;
    if (!state) return json({ ok: true });
    const data = payload.data;
    if (!data || typeof data !== 'object' || !('email_id' in data) || typeof data.email_id !== 'string' || data.email_id.length > 128) throw new HttpError(400, 'Evento inválido.');
    const tags = 'tags' in data ? data.tags : null;
    const deliveryId = tags && typeof tags === 'object' && 'auth_delivery_id' in tags && typeof tags.auth_delivery_id === 'string' ? tags.auth_delivery_id : undefined;
    // Tags correlate callbacks even when they arrive before the send response.
    // Terminal failure/complaint states never regress on replay/out-of-order events.
    const allowed = state === 'accepted' ? ['pending'] : state === 'delayed' ? ['pending', 'accepted'] :
      state === 'delivered' ? ['pending', 'accepted', 'delayed'] : ['pending', 'accepted', 'delayed', 'delivered'];
    const updated = await prisma.authChallenge.updateMany({
      where: {
        ...(deliveryId ? { deliveryId, OR: [{ providerId: null }, { providerId: data.email_id }] } : { providerId: data.email_id }),
        deliveryStatus: { in: allowed },
      },
      data: { providerId: data.email_id, deliveryStatus: state },
    });
    if (updated.count && ['failed', 'bounced', 'complained', 'delayed'].includes(state)) {
      console.error(JSON.stringify({ event: 'auth_email_' + state, providerId: data.email_id }));
    }
    // Never mark an account verified from sent/delivered/opened webhooks.
    return json({ ok: true });
  } catch (error) { return errorResponse(error); }
}
