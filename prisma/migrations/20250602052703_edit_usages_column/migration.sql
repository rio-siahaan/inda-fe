/*
  Warnings:

  - You are about to drop the column `conversationId` on the `Usages` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Usages` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Usages" DROP CONSTRAINT "Usages_userId_fkey";

-- AlterTable
ALTER TABLE "Usages" DROP COLUMN "conversationId",
DROP COLUMN "userId";
