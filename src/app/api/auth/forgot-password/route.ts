import { after } from 'next/server';
import { emailConfiguration } from '@/lib/email';
import { errorResponse, json } from '@/lib/errors';
import { requestPasswordReset, recoveryMessage } from '@/lib/password-reset';
import { clientKey, limit } from '@/lib/rate-limit';
import { emailField, fields, readJson, validateMutation } from '@/lib/request-security';
export const runtime = 'nodejs';
export const maxDuration = 60;
export async function POST(request: Request) {
  try {
    validateMutation(request);
    await limit('reset-request-ip', clientKey(request), 5, 3600);
    const body = await readJson(request, 4096);
    fields(body, ['email']);
    const email = emailField(body.email);
    await limit('reset-email-cooldown', email, 1, 60);
    await limit('reset-email-hour', email, 5, 3600);
    emailConfiguration();
    // Vercel keeps after() work alive. Lookup/send latency cannot enumerate accounts.
    after(async () => {
      try { await requestPasswordReset(email); }
      catch { console.error(JSON.stringify({ event: 'password_reset_request_failed' })); }
    });
    return json({ ok: true, message: recoveryMessage }, 202);
  } catch (error) { return errorResponse(error); }
}
