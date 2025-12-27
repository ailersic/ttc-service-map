-- AlterTable
ALTER TABLE "ShapePoint" ADD CONSTRAINT "ShapePoint_pkey" PRIMARY KEY ("shape_id", "sequence");

-- DropIndex
DROP INDEX "ShapePoint_shape_id_sequence_key";

-- CreateTable
CREATE TABLE "RouteStop" (
    "direction" INTEGER NOT NULL,
    "sequence" INTEGER NOT NULL,
    "route_id" TEXT NOT NULL,
    "platform_id" TEXT NOT NULL,

    CONSTRAINT "RouteStop_pkey" PRIMARY KEY ("route_id","direction","sequence")
);

-- CreateIndex
CREATE INDEX "RouteStop_route_id_idx" ON "RouteStop"("route_id");

-- AddForeignKey
ALTER TABLE "RouteStop" ADD CONSTRAINT "RouteStop_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "Route"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RouteStop" ADD CONSTRAINT "RouteStop_platform_id_fkey" FOREIGN KEY ("platform_id") REFERENCES "Platform"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
