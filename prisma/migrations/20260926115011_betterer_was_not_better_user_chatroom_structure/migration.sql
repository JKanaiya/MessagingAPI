/*
  Warnings:

  - Added the required column `userId` to the `Chatroom` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chatroom" ADD COLUMN     "userId" INTEGER NOT NULL;
