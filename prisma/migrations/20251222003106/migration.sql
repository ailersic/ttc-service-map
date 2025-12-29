-- AlterTable
ALTER TABLE "Route" ADD COLUMN     "shape_id" TEXT;

-- CreateIndex
CREATE INDEX "RouteStop_platform_id_idx" ON "RouteStop"("platform_id");

-- AddForeignKey
ALTER TABLE "Route" ADD CONSTRAINT "Route_shape_id_fkey" FOREIGN KEY ("shape_id") REFERENCES "Shape"("id") ON DELETE SET NULL ON UPDATE CASCADE;
