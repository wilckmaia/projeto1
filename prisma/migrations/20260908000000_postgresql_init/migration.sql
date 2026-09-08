-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AchievementShare" (
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "worldId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AchievementShare_pkey" PRIMARY KEY ("token")
);

-- CreateTable
CREATE TABLE "public"."TaskProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "worldId" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "acertos" INTEGER NOT NULL DEFAULT 0,
    "erros" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "TaskProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AnswerAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "taskProgressId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "selectedIndex" INTEGER NOT NULL,
    "correctIndex" INTEGER NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "answeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnswerAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AchievementShare_userId_worldId_key" ON "public"."AchievementShare"("userId", "worldId");

-- CreateIndex
CREATE INDEX "TaskProgress_userId_idx" ON "public"."TaskProgress"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TaskProgress_userId_taskId_key" ON "public"."TaskProgress"("userId", "taskId");

-- CreateIndex
CREATE INDEX "AnswerAttempt_userId_taskId_idx" ON "public"."AnswerAttempt"("userId", "taskId");

-- CreateIndex
CREATE INDEX "AnswerAttempt_taskProgressId_idx" ON "public"."AnswerAttempt"("taskProgressId");

-- AddForeignKey
ALTER TABLE "public"."AchievementShare" ADD CONSTRAINT "AchievementShare_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TaskProgress" ADD CONSTRAINT "TaskProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnswerAttempt" ADD CONSTRAINT "AnswerAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnswerAttempt" ADD CONSTRAINT "AnswerAttempt_taskProgressId_fkey" FOREIGN KEY ("taskProgressId") REFERENCES "public"."TaskProgress"("id") ON DELETE CASCADE ON UPDATE CASCADE;
