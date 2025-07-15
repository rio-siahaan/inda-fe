/*
  Warnings:

  - You are about to drop the column `provideraccountid` on the `account` table. All the data in the column will be lost.
  - You are about to drop the column `sessiontoken` on the `session` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[provider,providerAccountId]` on the table `account` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sessionToken]` on the table `session` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `providerAccountId` to the `account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sessionToken` to the `session` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "account_provider_provideraccountid_key";

-- DropIndex
DROP INDEX "session_sessiontoken_key";

-- AlterTable
ALTER TABLE "account" DROP COLUMN "provideraccountid",
ADD COLUMN     "providerAccountId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "session" DROP COLUMN "sessiontoken",
ADD COLUMN     "sessionToken" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "emailVerified" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "account_provider_providerAccountId_key" ON "account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "session_sessionToken_key" ON "session"("sessionToken");
