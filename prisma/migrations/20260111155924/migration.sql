/*
  Warnings:

  - You are about to drop the column `interpolationFactor` on the `StationAnchor` table. All the data in the column will be lost.
  - Added the required column `interpolation_factor` to the `StationAnchor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StationAnchor" DROP COLUMN "interpolationFactor",
ADD COLUMN     "interpolation_factor" DOUBLE PRECISION NOT NULL;
