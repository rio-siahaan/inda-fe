/*
  Warnings:

  - You are about to drop the `Files` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Files";

-- CreateTable
CREATE TABLE "Usages" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "selectedModel" TEXT NOT NULL,
    "responseTime" INTEGER NOT NULL,
    "inputToken" INTEGER NOT NULL,
    "outputToken" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Usages" ADD CONSTRAINT "Usages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
