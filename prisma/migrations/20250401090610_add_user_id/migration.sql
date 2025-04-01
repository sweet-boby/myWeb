/*
  Warnings:

  - A unique constraint covering the columns `[chatId]` on the table `ChatWithAI` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `chatId` to the `ChatWithAI` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ChatWithAIMessage" DROP CONSTRAINT "ChatWithAIMessage_chatId_fkey";

-- AlterTable
ALTER TABLE "ChatWithAI" ADD COLUMN     "chatId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ChatWithAIMessage" ALTER COLUMN "chatId" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "ChatWithAI_chatId_key" ON "ChatWithAI"("chatId");

-- AddForeignKey
ALTER TABLE "ChatWithAIMessage" ADD CONSTRAINT "ChatWithAIMessage_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "ChatWithAI"("chatId") ON DELETE RESTRICT ON UPDATE CASCADE;
