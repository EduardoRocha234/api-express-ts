/*
  Warnings:

  - Added the required column `participantName` to the `participants` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "participants" ADD COLUMN     "participantName" TEXT NOT NULL;
