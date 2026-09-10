-- DropForeignKey
ALTER TABLE "Chatroom" DROP CONSTRAINT "Chatroom_id_fkey";

-- AddForeignKey
ALTER TABLE "Chatroom" ADD CONSTRAINT "Chatroom_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
