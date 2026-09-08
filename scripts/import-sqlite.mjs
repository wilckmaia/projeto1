// One-time offline transfer. SQLite is never used by the application.
import assert from 'node:assert/strict';
import { DatabaseSync, backup } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { PrismaClient } from '@prisma/client';

const sourcePath = resolve(process.argv[2] || 'prisma/dev.db');
const target = process.env.DIRECT_URL;
if (!target || !/^postgres(ql)?:\/\//.test(target)) throw new Error('Configure DIRECT_URL com a conexão PostgreSQL direta.');
const prisma = new PrismaClient({ datasourceUrl: target });
const tables = [
  ['User', 'user', 'id', ['createdAt'], []],
  ['TaskProgress', 'taskProgress', 'id', ['completedAt'], ['completed']],
  ['AnswerAttempt', 'answerAttempt', 'id', ['answeredAt'], ['isCorrect']],
  ['AchievementShare', 'achievementShare', 'token', ['createdAt'], []],
];
let source;
let snapshot;
try {
  source = new DatabaseSync(sourcePath, { readOnly: true });
  mkdirSync('.migration-backups', { recursive: true });
  const snapshotPath = resolve('.migration-backups', `sqlite-${Date.now()}.db`);
  await backup(source, snapshotPath);
  source.close();
  source = undefined;
  snapshot = new DatabaseSync(snapshotPath, { readOnly: true });
  assert.equal(snapshot.prepare('PRAGMA integrity_check').get().integrity_check, 'ok');
  assert.equal(snapshot.prepare('PRAGMA foreign_key_check').all().length, 0);
  const batches = tables.map(([table, model, key, dates, booleans]) => ({
    table, model, key,
    rows: snapshot.prepare(`SELECT * FROM "${table}" ORDER BY "${key}"`).all().map(row => {
      const data = { ...row };
      for (const field of dates) {
        if (data[field] !== null) {
          const value = data[field];
          data[field] = new Date(typeof value === 'string' && /^\d+$/.test(value) ? Number(value) : typeof value === 'string' && !/(Z|[+-]\d\d:\d\d)$/.test(value) ? value.replace(' ', 'T') + 'Z' : value);
          assert.ok(Number.isFinite(data[field].getTime()), `Data inválida: ${table}.${field}`);
        }
      }
      for (const field of booleans) {
        assert.ok(data[field] === 0 || data[field] === 1, `Booleano inválido: ${table}.${field}`);
        data[field] = Boolean(data[field]);
      }
      return data;
    }),
  }));
  await prisma.$transaction(async tx => {
    // Require an empty target; an exact re-run is allowed without writing anything.
    await tx.$executeRawUnsafe('LOCK TABLE "User", "TaskProgress", "AnswerAttempt", "AchievementShare" IN ACCESS EXCLUSIVE MODE');
    const counts = await Promise.all(batches.map(batch => tx[batch.model].count()));
    const empty = counts.every(count => count === 0);
    if (empty) {
      for (const batch of batches) {
        for (let offset = 0; offset < batch.rows.length; offset += 500) {
          await tx[batch.model].createMany({ data: batch.rows.slice(offset, offset + 500) });
        }
      }
    }
    for (const batch of batches) {
      const actual = await tx[batch.model].findMany({ orderBy: { [batch.key]: 'asc' } });
      // Avoid printing records, hashes or personal information on failure.
      const canonical = rows => JSON.stringify([...rows].sort((a, b) => a[batch.key] < b[batch.key] ? -1 : a[batch.key] > b[batch.key] ? 1 : 0).map(row => Object.fromEntries(Object.keys(row).sort().map(key => [key, row[key]]))));
      if (canonical(actual) !== canonical(batch.rows)) throw new Error(`Verificação divergente em ${batch.table}. Destino deve estar vazio ou idêntico à origem; nenhuma alteração foi confirmada.`);
    }
    console.log(empty ? 'Importação e comparação integral concluídas.' : 'Destino já idêntico; nenhuma escrita necessária.');
  }, { timeout: 120000, maxWait: 20000 });
  console.log(Object.fromEntries(batches.map(batch => [batch.table, batch.rows.length])));
  console.log('Backup SQLite preservado em .migration-backups (contém dados privados).');
} finally {
  source?.close();
  snapshot?.close();
  await prisma.$disconnect();
}
