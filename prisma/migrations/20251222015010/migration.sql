/*
  Warnings:

  - You are about to drop the column `lastUpdatedAt` on the `Agency` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Agency" DROP COLUMN "lastUpdatedAt",
ADD COLUMN     "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
