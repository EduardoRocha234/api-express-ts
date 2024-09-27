/*
  Warnings:

  - Added the required column `displayIcon` to the `sports` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sports" ADD COLUMN     "displayIcon" TEXT NOT NULL;
