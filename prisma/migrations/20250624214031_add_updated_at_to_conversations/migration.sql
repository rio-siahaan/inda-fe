/*
  Warnings:

  - You are about to drop the column `created_at` on the `Conversations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Conversations" DROP COLUMN "created_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3);
