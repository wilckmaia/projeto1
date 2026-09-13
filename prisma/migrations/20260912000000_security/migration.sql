BEGIN;
ALTER TABLE "User" ADD COLUMN "emailVerifiedAt" TIMESTAMP(3);
CREATE TABLE "Session" (
  "tokenHash" TEXT PRIMARY KEY, "userId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "expiresAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "Session_userId_idx" ON "Session"("userId");
CREATE INDEX "Session_expiresAt_idx" ON "Session"("expiresAt");
CREATE TABLE "RateLimit" ("key" TEXT PRIMARY KEY, "count" INTEGER NOT NULL, "expiresAt" TIMESTAMP(3) NOT NULL);
CREATE INDEX "RateLimit_expiresAt_idx" ON "RateLimit"("expiresAt");
CREATE TABLE "AuthChallenge" (
  "tokenHash" TEXT PRIMARY KEY, "email" TEXT NOT NULL, "kind" TEXT NOT NULL,
  "name" TEXT, "passwordHash" TEXT, "expiresAt" TIMESTAMP(3) NOT NULL
);
CREATE UNIQUE INDEX "AuthChallenge_email_kind_key" ON "AuthChallenge"("email", "kind");
CREATE INDEX "AuthChallenge_expiresAt_idx" ON "AuthChallenge"("expiresAt");
CREATE TABLE "AnswerArchive" ("id" TEXT PRIMARY KEY, "record" JSONB NOT NULL, "archivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP);
-- Preserve every old row before removing duplicate current answers. Deterministic
-- tie breaker for identical timestamps; no original history is destroyed.
LOCK TABLE "AnswerAttempt" IN ACCESS EXCLUSIVE MODE;
INSERT INTO "AnswerArchive" ("id", "record")
SELECT a."id", to_jsonb(a) FROM "AnswerAttempt" a;
WITH ranked AS (
  SELECT "id", row_number() OVER (PARTITION BY "taskProgressId", "questionId" ORDER BY "answeredAt" DESC, "id" DESC) AS n FROM "AnswerAttempt"
)
DELETE FROM "AnswerAttempt" WHERE "id" IN (SELECT "id" FROM ranked WHERE n > 1);
CREATE UNIQUE INDEX "AnswerAttempt_taskProgressId_questionId_key" ON "AnswerAttempt"("taskProgressId", "questionId");
COMMIT;
