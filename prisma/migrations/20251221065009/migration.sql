-- CreateIndex
CREATE INDEX "Platform_parent_station_id_idx" ON "Platform"("parent_station_id");

-- CreateIndex
CREATE INDEX "ShapePoint_shape_id_idx" ON "ShapePoint"("shape_id");

-- CreateIndex
CREATE INDEX "Trip_route_id_idx" ON "Trip"("route_id");

-- CreateIndex
CREATE INDEX "Trip_service_id_idx" ON "Trip"("service_id");

-- CreateIndex
CREATE INDEX "Trip_shape_id_idx" ON "Trip"("shape_id");

-- CreateIndex
CREATE INDEX "TripStop_trip_id_idx" ON "TripStop"("trip_id");
