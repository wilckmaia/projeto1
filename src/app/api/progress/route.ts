import { getCurrentUser, saveAnswers } from '@/lib/storage';
import { HttpError, errorResponse, json } from '@/lib/errors';
import { validateMutation, readJson, fields, textField } from '@/lib/request-security';
import { limit, clientKey } from '@/lib/rate-limit';
export async function POST(request: Request) {
  try {
    validateMutation(request);
    await limit('progress-ip', clientKey(request), 180, 60);
    const user = await getCurrentUser();
    if (!user) throw new HttpError(401, 'Faça login antes de salvar progresso.');
    await limit('progress-user', user.id, 60, 60);
    const body = await readJson(request, 65536);
    fields(body, ['taskId', 'worldId', 'answers']);
    const taskId = textField(body.taskId, 64), worldId = textField(body.worldId, 64);
    if (!Array.isArray(body.answers)) throw new HttpError(400, 'Respostas inválidas.');
    const progress = await saveAnswers(user.id, taskId, worldId, body.answers);
    return json({ ok: true, progress, message: 'Progresso salvo com sucesso.' });
  } catch (error) { return errorResponse(error); }
}
