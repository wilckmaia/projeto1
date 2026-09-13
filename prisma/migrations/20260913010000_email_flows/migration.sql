BEGIN;
DROP INDEX "AuthChallenge_email_kind_key";
ALTER TABLE "AuthChallenge"
  ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "subjectUserId" TEXT,
  ADD COLUMN "deliveryId" TEXT,
  ADD COLUMN "providerId" TEXT,
  ADD COLUMN "deliveryStatus" TEXT NOT NULL DEFAULT 'accepted';
UPDATE "AuthChallenge" SET "deliveryId" = gen_random_uuid()::text;
ALTER TABLE "AuthChallenge" ALTER COLUMN "deliveryId" SET NOT NULL;
UPDATE "AuthChallenge" AS c SET "subjectUserId" = u."id"
  FROM "User" AS u WHERE c."email" = u."email";
UPDATE "AuthChallenge" AS c SET "passwordHash" = u."passwordHash"
  FROM "User" AS u WHERE c."kind" = 'reset' AND c."subjectUserId" = u."id";
CREATE INDEX "AuthChallenge_email_kind_idx" ON "AuthChallenge"("email", "kind");
CREATE UNIQUE INDEX "AuthChallenge_deliveryId_key" ON "AuthChallenge"("deliveryId");
CREATE UNIQUE INDEX "AuthChallenge_providerId_key" ON "AuthChallenge"("providerId");
DELETE FROM "Session" USING "User" WHERE "Session"."userId" = "User"."id" AND "User"."emailVerifiedAt" IS NULL;
COMMIT;
