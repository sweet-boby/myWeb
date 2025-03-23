/*
  Warnings:

  - You are about to drop the column `recevier` on the `Massage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Massage" DROP COLUMN "recevier",
ADD COLUMN     "receiver" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT;
