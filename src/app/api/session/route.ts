import { getSessionPayload } from '@/lib/storage';
import { loginUser, requestConfirmation, confirm, confirmationMessage, registerUser, registrationMessage } from '@/lib/auth';
import { logoutUser } from '@/lib/session';
import { errorResponse, HttpError, json } from '@/lib/errors';
import { validateMutation, readJson, fields, textField, emailField } from '@/lib/request-security';
import { clientKey, limit, delayFailedLogin } from '@/lib/rate-limit';
export async function GET(request: Request) {
  try { await limit('session-read', clientKey(request), 120, 60); return json(await getSessionPayload()); }
  catch (error) { return errorResponse(error); }
}
export async function POST(request: Request) {
  try {
    validateMutation(request);
    const ip = clientKey(request);
    await limit('auth-ip-minute', ip, 30, 60);
    const body = await readJson(request, 16384);
    const action = body.action;
    if (action === 'confirm') {
      fields(body, ['action', 'token']);
      await confirm(textField(body.token, 43, 43));
      return json({ ok: true, message: 'Solicitação confirmada. Entre com seu e-mail e senha.' });
    }
    if (action !== 'login' && action !== 'register' && action !== 'verify-resend') throw new HttpError(400, 'Ação inválida.');
    fields(body, action === 'register' ? ['action', 'name', 'email', 'password'] : action === 'login' ? ['action', 'name', 'email', 'password'] : ['action', 'email']);
    const email = emailField(body.email);
    if (action === 'login') {
      try { await loginUser(email, textField(body.password, 256)); }
      catch (error) {
        if (error instanceof HttpError && error.status === 401) await delayFailedLogin(ip);
        throw error;
      }
      return json(await getSessionPayload());
    }
    if (action === 'register') {
      await limit('register-ip', ip, 5, 3600);
      await limit('register-address', email, 5, 3600);
      const name = textField(body.name, 40).trim();
      if (!name) throw new HttpError(400, 'Informe seu nome.');
      await registerUser(email, name, textField(body.password, 256));
      return json({ ok: true, message: registrationMessage }, 202);
    }
    await limit('email-cooldown', email, 1, 60);
    await limit('email-address-hour', email, 5, 3600);
    await limit('email-ip', ip, 5, 3600);
    await requestConfirmation(email);
    return json({ ok: true, message: confirmationMessage }, 202);
  } catch (error) { return errorResponse(error); }
}
export async function DELETE(request: Request) {
  try { validateMutation(request); await logoutUser(); return json({ ok: true }); }
  catch (error) { return errorResponse(error); }
}
