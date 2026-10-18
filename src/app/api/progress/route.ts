import { getCurrentUser, completeLesson, saveAnswers } from '@/lib/storage';
import { getWorldById } from '@/lib/data';
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
    const taskId = textField(body.taskId, 64), worldId = textField(body.worldId, 64);
    const original = getWorldById(worldId)?.original;
    fields(body, original ? ['taskId', 'worldId', 'answers'] : ['taskId', 'worldId', 'completed']);
    if (original ? !Array.isArray(body.answers) : body.completed !== true) throw new HttpError(400, 'Confirme a conclusão da atividade.');
    const progress = original ? await saveAnswers(user.id, taskId, worldId, body.answers as unknown[]) : await completeLesson(user.id, taskId, worldId);
    return json({ ok: true, progress, message: 'Progresso salvo com sucesso.' });
  } catch (error) { return errorResponse(error); }
}
