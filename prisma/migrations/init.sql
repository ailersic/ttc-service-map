-- CreateTable
CREATE TABLE "Agency" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "last_updated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Station" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "StationAnchor" (
    "interpolation_factor" REAL NOT NULL,
    "station_id" TEXT NOT NULL,
    "shape_id" TEXT NOT NULL,

    PRIMARY KEY ("station_id", "shape_id"),
    CONSTRAINT "StationAnchor_station_id_fkey" FOREIGN KEY ("station_id") REFERENCES "Station" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "StationAnchor_shape_id_fkey" FOREIGN KEY ("shape_id") REFERENCES "Shape" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Platform" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "parent_station_id" TEXT,
    CONSTRAINT "Platform_parent_station_id_fkey" FOREIGN KEY ("parent_station_id") REFERENCES "Station" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Route" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "short_name" TEXT NOT NULL,
    "long_name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "color" TEXT,
    "text_color" TEXT,
    "sort_order" INTEGER,
    "shape_id" TEXT,
    CONSTRAINT "Route_shape_id_fkey" FOREIGN KEY ("shape_id") REFERENCES "Shape" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RouteStop" (
    "direction" INTEGER NOT NULL,
    "sequence" INTEGER NOT NULL,
    "distance_along_shape" REAL NOT NULL,
    "route_id" TEXT NOT NULL,
    "platform_id" TEXT NOT NULL,

    PRIMARY KEY ("route_id", "direction", "sequence"),
    CONSTRAINT "RouteStop_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "Route" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RouteStop_platform_id_fkey" FOREIGN KEY ("platform_id") REFERENCES "Platform" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "Shape" (
    "id" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "ShapePoint" (
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "sequence" INTEGER NOT NULL,
    "dist_traveled" REAL,
    "shape_id" TEXT NOT NULL,

    PRIMARY KEY ("shape_id", "sequence"),
    CONSTRAINT "ShapePoint_shape_id_fkey" FOREIGN KEY ("shape_id") REFERENCES "Shape" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "StationAnchor_station_id_idx" ON "StationAnchor"("station_id");

-- CreateIndex
CREATE INDEX "StationAnchor_shape_id_idx" ON "StationAnchor"("shape_id");

-- CreateIndex
CREATE INDEX "Platform_parent_station_id_idx" ON "Platform"("parent_station_id");

-- CreateIndex
CREATE INDEX "Route_shape_id_idx" ON "Route"("shape_id");

-- CreateIndex
CREATE INDEX "RouteStop_route_id_idx" ON "RouteStop"("route_id");

-- CreateIndex
CREATE INDEX "RouteStop_platform_id_idx" ON "RouteStop"("platform_id");

-- CreateIndex
CREATE INDEX "ShapePoint_shape_id_idx" ON "ShapePoint"("shape_id");

