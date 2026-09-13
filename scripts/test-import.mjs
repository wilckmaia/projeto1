import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import { PrismaClient } from '@prisma/client';
import { assertTestDatabase } from './test-safety.mjs';
assertTestDatabase();
const file=resolve(process.env.IMPORT_FIXTURE_PATH);
const db=new DatabaseSync(file);
db.exec(`
CREATE TABLE User (id TEXT PRIMARY KEY,name TEXT,email TEXT,passwordHash TEXT,createdAt INTEGER);
CREATE TABLE TaskProgress(id TEXT PRIMARY KEY,userId TEXT,taskId TEXT,worldId TEXT,completed INTEGER,completedAt INTEGER,acertos INTEGER,erros INTEGER);
CREATE TABLE AnswerAttempt(id TEXT PRIMARY KEY,userId TEXT,taskProgressId TEXT,taskId TEXT,questionId TEXT,selectedIndex INTEGER,correctIndex INTEGER,isCorrect INTEGER,answeredAt INTEGER);
CREATE TABLE AchievementShare(token TEXT PRIMARY KEY,userId TEXT,worldId TEXT,createdAt INTEGER);
INSERT INTO User VALUES ('import-user','Fixture','import@example.test','unused',1700000000000);
INSERT INTO TaskProgress VALUES ('import-progress','import-user','m1-t1','mundo-1',0,NULL,1,0);
INSERT INTO AnswerAttempt VALUES ('import-old','import-user','import-progress','m1-t1','m1-t1-0',0,1,0,1700000000000);
INSERT INTO AnswerAttempt VALUES ('import-new','import-user','import-progress','m1-t1','m1-t1-0',1,1,1,1700000001000);
`);
db.close();
async function run(){
  const child=spawn(process.execPath,['scripts/import-sqlite.mjs',file],{windowsHide:true,env:process.env,stdio:'pipe'});
  child.stdout.resume();child.stderr.resume();
  await new Promise((res,rej)=>{child.on('error',rej);child.on('exit',code=>code===0?res():rej(new Error('SQLite import fixture failed')));});
}
const prisma=new PrismaClient();
try{
  await run();await run();
  assert.equal(await prisma.user.count(),1);
  assert.equal(await prisma.answerAttempt.count(),1);
  assert.equal(await prisma.answerArchive.count(),2);
  assert.equal((await prisma.answerAttempt.findFirst()).selectedIndex,1);
  console.log('PASS: SQLite import, preserved historical answers, latest answer and idempotent re-import.');
}finally{await prisma.$disconnect();}
