/*
  Warnings:

  - You are about to drop the column `dateTime` on the `events` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `participants` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `createdAt` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "events" DROP COLUMN "dateTime",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "participants_userId_key" ON "participants"("userId");
