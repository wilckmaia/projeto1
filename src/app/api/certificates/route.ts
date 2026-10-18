import { getCurrentUser } from '@/lib/storage';
import { issueCertificate } from '@/lib/certificates';
import { HttpError, errorResponse, json } from '@/lib/errors';
import { validateMutation, readJson, fields, textField } from '@/lib/request-security';
import { limit, clientKey } from '@/lib/rate-limit';
export async function POST(request: Request) {
  try {
    validateMutation(request);
    await limit('certificate-ip', clientKey(request), 30, 60);
    const user = await getCurrentUser();
    if (!user) throw new HttpError(401, 'Entre na sua conta.');
    await limit('certificate-user', user.id, 10, 60);
    const body = await readJson(request, 2048);
    fields(body, ['worldId']);
    const certificate = await issueCertificate(user.id, textField(body.worldId, 64));
    return json({ path: '/certificados/' + certificate.id });
  } catch (error) { return errorResponse(error); }
}
