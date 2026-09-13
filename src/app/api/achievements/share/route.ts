import { achievements } from '@/lib/achievements';
import { getCurrentUser, worldCompleted } from '@/lib/storage';
import { prisma } from '@/lib/prisma';
import { HttpError, errorResponse, json } from '@/lib/errors';
import { validateMutation, readJson, fields, textField } from '@/lib/request-security';
import { limit, clientKey } from '@/lib/rate-limit';
async function mutate(request: Request, revoke: boolean) {
  try {
    validateMutation(request);
    await limit('share-ip', clientKey(request), 60, 60);
    const user = await getCurrentUser();
    if (!user) throw new HttpError(401, 'Entre na sua conta para compartilhar.');
    await limit('share-user', user.id, 10, 60);
    const body = await readJson(request, 2048);
    fields(body, ['worldId']);
    const worldId = textField(body.worldId, 64);
    if (!achievements.some(item => item.worldId === worldId)) throw new HttpError(404, 'Conquista não encontrada.');
    if (revoke) {
      await prisma.achievementShare.deleteMany({ where: { userId: user.id, worldId } });
      return json({ ok: true });
    }
    if (!await worldCompleted(user.id, worldId)) throw new HttpError(403, 'Conclua este mundo para compartilhar a conquista.');
    const share = await prisma.achievementShare.upsert({
      where: { userId_worldId: { userId: user.id, worldId } },
      create: { userId: user.id, worldId }, update: {},
    });
    return json({ path: '/conquistas/' + share.token });
  } catch (error) { return errorResponse(error); }
}
export const POST = (request: Request) => mutate(request, false);
export const DELETE = (request: Request) => mutate(request, true);
