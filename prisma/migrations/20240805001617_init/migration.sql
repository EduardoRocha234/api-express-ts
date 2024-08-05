/*
  Warnings:

  - Added the required column `adminId` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxOfParticipantsWaitingList` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "events" ADD COLUMN     "adminId" TEXT NOT NULL,
ADD COLUMN     "maxOfParticipantsWaitingList" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
