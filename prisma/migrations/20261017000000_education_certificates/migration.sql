CREATE TABLE "Certificate" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "worldId" TEXT NOT NULL,
  "userName" TEXT NOT NULL,
  "worldName" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "color" TEXT NOT NULL,
  "platform" TEXT NOT NULL DEFAULT 'Politika',
  "completedAt" TIMESTAMP(3) NOT NULL,
  "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Certificate_userId_worldId_key" ON "Certificate"("userId", "worldId");
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
