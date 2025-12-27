/*
  Warnings:

  - You are about to drop the `Trip` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TripStop` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `distance_along_shape` to the `RouteStop` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Trip" DROP CONSTRAINT "Trip_route_id_fkey";

-- DropForeignKey
ALTER TABLE "Trip" DROP CONSTRAINT "Trip_service_id_fkey";

-- DropForeignKey
ALTER TABLE "Trip" DROP CONSTRAINT "Trip_shape_id_fkey";

-- DropForeignKey
ALTER TABLE "TripStop" DROP CONSTRAINT "TripStop_platform_id_fkey";

-- DropForeignKey
ALTER TABLE "TripStop" DROP CONSTRAINT "TripStop_trip_id_fkey";

-- AlterTable
ALTER TABLE "RouteStop" ADD COLUMN     "distance_along_shape" DOUBLE PRECISION NOT NULL;

-- DropTable
DROP TABLE "Trip";

-- DropTable
DROP TABLE "TripStop";
