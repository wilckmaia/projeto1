import { errorResponse, json } from '@/lib/errors';
import { resetPassword } from '@/lib/password-reset';
import { fields, readJson, textField, validateMutation } from '@/lib/request-security';
export const runtime = 'nodejs';
export async function POST(request: Request) {
  try {
    validateMutation(request);
    const body = await readJson(request, 4096);
    fields(body, ['token', 'password', 'confirmPassword']);
    await resetPassword(textField(body.token, 256), textField(body.password, 256), textField(body.confirmPassword, 256));
    return json({ ok: true, message: 'Senha alterada com sucesso.' });
  } catch (error) { return errorResponse(error); }
}
