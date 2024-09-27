/*
  Warnings:

  - Added the required column `displayColor` to the `sports` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sports" ADD COLUMN     "displayColor" TEXT NOT NULL;
