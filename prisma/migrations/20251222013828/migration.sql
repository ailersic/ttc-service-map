/*
  Warnings:

  - Added the required column `distance_along_shape` to the `TripStop` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TripStop" ADD COLUMN     "distance_along_shape" DOUBLE PRECISION NOT NULL;
