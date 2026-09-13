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
      if (table === "User") data.emailVerifiedAt = null;
      return data;
    }),
  }));
  const answers = batches.find(batch => batch.model === 'answerAttempt');
  const originalAnswers = answers.rows.map(row => ({ id: row.id, record: JSON.parse(JSON.stringify(row)) }));
  const ordered = [...answers.rows].sort((a,b) => a.answeredAt - b.answeredAt || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  answers.rows = [...new Map(ordered.map(row => [JSON.stringify([row.taskProgressId,row.questionId]), row])).values()];
  for (const progress of batches.find(batch => batch.model === 'taskProgress').rows) {
    const current = answers.rows.filter(answer => answer.taskProgressId === progress.id);
    progress.acertos = current.filter(answer => answer.isCorrect).length;
    progress.erros = current.filter(answer => !answer.isCorrect).length;
  }
  batches.push({ table: 'AnswerArchive', model: 'answerArchive', key: 'id', rows: originalAnswers });
  await prisma.$transaction(async tx => {
    // Require an empty target; an exact re-run is allowed without writing anything.
    await tx.$executeRawUnsafe('LOCK TABLE "User", "TaskProgress", "AnswerAttempt", "AchievementShare", "AnswerArchive" IN ACCESS EXCLUSIVE MODE');
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
      const records = await tx[batch.model].findMany({ orderBy: { [batch.key]: 'asc' } });
      const columns = Object.keys(batch.rows[0] ?? {});
      const actual = records.map(record => Object.fromEntries(columns.map(key => [key, record[key]])));
      // Avoid printing records, hashes or personal information on failure.
      const normalize = value => value instanceof Date ? value.toISOString() : Array.isArray(value) ? value.map(normalize) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map(key => [key, normalize(value[key])])) : value;
      const canonical = rows => JSON.stringify(normalize([...rows].sort((a,b) => a[batch.key] < b[batch.key] ? -1 : a[batch.key] > b[batch.key] ? 1 : 0)));
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
