import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { PrismaClient } from '@prisma/client';
import { assertTestDatabase } from './test-safety.mjs';
import { load, fixtures } from './education-test-harness.mjs';
assertTestDatabase();
const prisma = new PrismaClient();
const { worlds, data, progress } = fixtures();
const errors = load('src/lib/errors.ts');
const storage = load('src/lib/storage.ts', { '@/lib/data': data, '@/lib/legacy-data': load('src/lib/legacy-data.ts'), '@/lib/progress': progress, '@/lib/prisma': { prisma }, './session': {}, './errors': errors });
const certificates = load('src/lib/certificates.ts', { './prisma': { prisma }, './data': data, './storage': storage, './progress': progress, './errors': errors });
const ids = [randomUUID(), randomUUID()];
try {
  for (const id of ids) await prisma.user.create({ data: { id, name: 'Fixture Árvore 日本', email: id + '@example.test', passwordHash: 'unused' } });
  await prisma.taskProgress.create({ data: { id: randomUUID(), userId: ids[0], worldId: 'mundo-1', taskId: 'm1-t1', completed: true, completedAt: new Date() } });
  assert.equal((await storage.getProgressByUserId(ids[0])).completedTasks.length, 0);
  await assert.rejects(storage.completeLesson(ids[0], 'fixture-legislativo', 'legislativo'), error => error.status === 403);
  await assert.rejects(certificates.issueCertificate(ids[0], 'executivo'), error => error.status === 403);
  await assert.rejects(storage.completeLesson(ids[0], 'fixture-executivo', 'economia'), error => error.status === 404);
  for (const world of worlds) {
    const taskId = world.tasks[0].id;
    const finish = () => world.original ? storage.saveAnswers(ids[0], taskId, world.id, [{questionId:taskId+'-0',selectedIndex:0}]) : storage.completeLesson(ids[0], taskId, world.id);
    await Promise.all([finish(),finish()]);
    const saved = await storage.getProgressByUserId(ids[0]);
    assert.equal(progress.getWorldCompletion(world.id, saved).percent, 100);
    assert.equal((await storage.getProgressByUserId(ids[1])).completedTasks.length, 0);
    const [a, b] = await Promise.all([certificates.issueCertificate(ids[0], world.id), certificates.issueCertificate(ids[0], world.id)]);
    assert.equal(a.id, b.id); assert.equal(a.userName, 'Fixture Árvore 日本');
    assert.equal(a.worldName, world.name); assert.ok(a.completedAt);
    assert.equal(await prisma.certificate.count({ where: { userId: ids[0], worldId: world.id } }), 1);
  }
  assert.equal(await prisma.taskProgress.count({ where: { userId: ids[0], taskId: 'm1-t1' } }), 1, 'legacy progress retained');
  // Issued certificates remain stable even when the learner name changes later.
  await prisma.user.update({ where: { id: ids[0] }, data: { name: 'Changed' } });
  assert.equal((await certificates.issueCertificate(ids[0], 'executivo')).userName, 'Fixture Árvore 日本');
  console.log('PASS: real database persistence, concurrency, ownership, world locks, idempotent certificate issuance, snapshots and legacy retention.');
} finally {
  await prisma.user.deleteMany({ where: { id: { in: ids } } });
  await prisma.$disconnect();
}
