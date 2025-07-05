/*
  Warnings:

  - You are about to drop the column `conversation_id` on the `Messages` table. All the data in the column will be lost.
  - Added the required column `conversationId` to the `Messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `responseTime` to the `Messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `selectedModel` to the `Messages` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_conversation_id_fkey";

-- AlterTable
ALTER TABLE "Messages" DROP COLUMN "conversation_id",
ADD COLUMN     "conversationId" TEXT NOT NULL,
ADD COLUMN     "responseTime" TEXT NOT NULL,
ADD COLUMN     "selectedModel" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
