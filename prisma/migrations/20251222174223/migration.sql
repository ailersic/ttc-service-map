-- CreateTable
CREATE TABLE "StationAnchor" (
    "interpolationFactor" DOUBLE PRECISION NOT NULL,
    "station_id" TEXT NOT NULL,
    "shape_id" TEXT NOT NULL,

    CONSTRAINT "StationAnchor_pkey" PRIMARY KEY ("station_id","shape_id")
);

-- CreateIndex
CREATE INDEX "StationAnchor_station_id_idx" ON "StationAnchor"("station_id");

-- CreateIndex
CREATE INDEX "StationAnchor_shape_id_idx" ON "StationAnchor"("shape_id");

-- AddForeignKey
ALTER TABLE "StationAnchor" ADD CONSTRAINT "StationAnchor_station_id_fkey" FOREIGN KEY ("station_id") REFERENCES "Station"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StationAnchor" ADD CONSTRAINT "StationAnchor_shape_id_fkey" FOREIGN KEY ("shape_id") REFERENCES "Shape"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
