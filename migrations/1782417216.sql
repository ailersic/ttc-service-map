-- DropIndex
DROP INDEX "ShapePoint_shape_id_idx";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Shape";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ShapePoint";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "PlatformAnchor" (
    "interpolation_factor" REAL NOT NULL,
    "platform_id" TEXT NOT NULL,
    "polyline_id" TEXT NOT NULL,

    PRIMARY KEY ("platform_id", "polyline_id"),
    CONSTRAINT "PlatformAnchor_platform_id_fkey" FOREIGN KEY ("platform_id") REFERENCES "Platform" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PlatformAnchor_polyline_id_fkey" FOREIGN KEY ("polyline_id") REFERENCES "PolyLine" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PolyLine" (
    "id" TEXT NOT NULL PRIMARY KEY
);

-- CreateTable
CREATE TABLE "Point" (
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "sequence" INTEGER NOT NULL,
    "polyline_id" TEXT NOT NULL,

    PRIMARY KEY ("polyline_id", "sequence"),
    CONSTRAINT "Point_polyline_id_fkey" FOREIGN KEY ("polyline_id") REFERENCES "PolyLine" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Route" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "short_name" TEXT NOT NULL,
    "long_name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "color" TEXT,
    "text_color" TEXT,
    "sort_order" INTEGER,
    "forward_id" TEXT,
    "backward_id" TEXT,
    CONSTRAINT "Route_forward_id_fkey" FOREIGN KEY ("forward_id") REFERENCES "PolyLine" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Route_backward_id_fkey" FOREIGN KEY ("backward_id") REFERENCES "PolyLine" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Route" ("color", "id", "long_name", "short_name", "sort_order", "text_color", "type") SELECT "color", "id", "long_name", "short_name", "sort_order", "text_color", "type" FROM "Route";
DROP TABLE "Route";
ALTER TABLE "new_Route" RENAME TO "Route";
CREATE TABLE "new_RouteStop" (
    "direction" INTEGER NOT NULL,
    "sequence" INTEGER NOT NULL,
    "route_id" TEXT NOT NULL,
    "platform_id" TEXT NOT NULL,

    PRIMARY KEY ("route_id", "direction", "sequence"),
    CONSTRAINT "RouteStop_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "Route" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "RouteStop_platform_id_fkey" FOREIGN KEY ("platform_id") REFERENCES "Platform" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_RouteStop" ("direction", "platform_id", "route_id", "sequence") SELECT "direction", "platform_id", "route_id", "sequence" FROM "RouteStop";
DROP TABLE "RouteStop";
ALTER TABLE "new_RouteStop" RENAME TO "RouteStop";
CREATE INDEX "RouteStop_route_id_idx" ON "RouteStop"("route_id");
CREATE INDEX "RouteStop_platform_id_idx" ON "RouteStop"("platform_id");
CREATE TABLE "new_StationAnchor" (
    "interpolation_factor" REAL NOT NULL,
    "station_id" TEXT NOT NULL,
    "polyline_id" TEXT NOT NULL,

    PRIMARY KEY ("station_id", "polyline_id"),
    CONSTRAINT "StationAnchor_station_id_fkey" FOREIGN KEY ("station_id") REFERENCES "Station" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "StationAnchor_polyline_id_fkey" FOREIGN KEY ("polyline_id") REFERENCES "PolyLine" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_StationAnchor" ("interpolation_factor", "station_id") SELECT "interpolation_factor", "station_id" FROM "StationAnchor";
DROP TABLE "StationAnchor";
ALTER TABLE "new_StationAnchor" RENAME TO "StationAnchor";
CREATE INDEX "StationAnchor_station_id_idx" ON "StationAnchor"("station_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "PlatformAnchor_platform_id_idx" ON "PlatformAnchor"("platform_id");

-- CreateIndex
CREATE INDEX "Point_polyline_id_idx" ON "Point"("polyline_id");

