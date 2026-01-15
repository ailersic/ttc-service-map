import { env } from 'node:process';
import { PrismaClient } from '@prisma/client';
import { parse } from 'csv-parse';
import { Writable } from 'stream';
import { pipeline } from 'stream/promises';
import unzipper from 'unzipper';
import geometry from '../build/utils/geometry.js';
import { writeFileSync } from 'node:fs';

const ACCOUNT_ID = "364551d890021662422bef42d8059833";
const DATABASE_ID = "44f8e533-ac92-4a09-9cee-8fa3c68b8de3";
const D1_API_KEY = env.CLOUDFLARE_API_TOKEN;
const D1_URL = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DATABASE_ID}/import`;
const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${D1_API_KEY}`,
};

const queries = [];

/** @typedef {'string' | 'int' | 'bigint' | 'float' | 'decimal' | 'boolean' | 'enum' | 'uuid' | 'json' | 'datetime' | 'bytes' | 'unknown'} ArgScalarType */

/**
 * @param {string} sql
 * @param {unkown[]} args
 * @param {{ scalarType: ArgScalarType, arity: 'scalar' | 'list' }[]} argTypes
 */
function fillQueryArgs(sql, args, argTypes) {
    args.forEach((arg, i) => {
        let argStr = '';
        const type = argTypes[i].scalarType;
        switch (type) {
            case 'bigint':
            case 'boolean':
            case 'decimal':
            case 'float':
            case 'int':
                argStr = '' + arg;
                break;
            case 'bytes':
            case 'json':
            case 'unknown':
                console.warn('bad arg type:', type);
                return;
            case 'datetime':
            case 'enum':
            case 'string':
            case 'uuid':
                argStr = `'${('' + arg).replaceAll('\'', '\'\'')}'`;
                break;
        }
        sql = sql.replace('?', argStr);
    });
    const matchReturning = sql.match(/(.*) RETURNING.*/);
    return matchReturning ? matchReturning[1] : sql;
}

function makeMockQuery(dummy) {
    return async ({ sql, args, argTypes }) => {
        if (sql !== 'COMMIT') {
            queries.push(fillQueryArgs(sql, args, argTypes));
        }
        return dummy;
    };
}

const mockTransaction = {
    provider: 'sqlite',
    adapterName: '@prisma/adapter-d1',
    queryRaw: makeMockQuery({ columnTypes: [], columnNames: [], rows: [] }),
    executeRaw: makeMockQuery(0),
    options: { usePhantomQuery: false },
    commit: async () => { },
    rollback: async () => { },
};

const mockAdapter = {
    provider: 'sqlite',
    adapterName: '@prisma/adapter-d1',
    executeScript: (script) => {
        console.warn('adapter.executeScript:', script);
    },
    startTransaction: async () => mockTransaction,
    dispose: async () => { },
    queryRaw: async ({ sql, args, argTypes }) => {
        queries.push(fillQueryArgs(sql, args, argTypes));
        const returns = sql.match(/RETURNING (.*)/);
        const names = returns
            ? returns[1].split(',').map(item => {
                const as = item.match(/AS `([^`]*)`/);
                return as ? as[1] : item;
            })
            : [];
        return {
            columnTypes: new Array(names.length).fill(7),
            columnNames: names,
            rows: [names.map(name => {
                switch (name) {
                    case 'type': return 'Bus';
                    case 'sort_order': return 0;
                    default: return 'dummy';
                }
            })],
        };
    },
    executeRaw: makeMockQuery(0),
};

const mockAdapterFactory = {
    provider: 'sqlite',
    adapterName: '@prisma/adapter-d1',
    connect: async () => mockAdapter,
};

const prisma = new PrismaClient({
    // log: ['query'],
    adapter: mockAdapterFactory,
});

async function loadGtfs() {
    const start = Date.now();
    const gtfsPackageUrl = 'https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/package_show?id=';
    const gtfsPackageId = 'merged-gtfs-ttc-routes-and-schedules';
    const res = await fetch(gtfsPackageUrl + gtfsPackageId);
    const data = await res.json();
    const lastRefreshed = new Date(data.result.last_refreshed);
    console.log('last refreshed:', lastRefreshed.toLocaleDateString());
    const zipUrl = data.result.resources[0].url;
    const zipRes = await fetch(zipUrl);
    const buffer = await zipRes.arrayBuffer();
    const dir = await unzipper.Open.buffer(Buffer.from(buffer));
    console.log(dir.files.map(file => file.path));
    // It's faster to just wipe the db and recreate everything
    const tables = [
        'service',
        'routeStop',
        'route',
        'stationAnchor',
        'shapePoint',
        'shape',
        'platform',
        'station',
    ];
    for (let k of tables) {
        console.log('delete', k);
        const delegate = prisma[k];
        await delegate.deleteMany();
    }
    const tripStopCountLookup = {};
    const routeAndDirectionByTripId = {};
    const tripShapeLookup = {};
    const stationPlatforms = [];
    const pointsByShape = {};
    const loadOrder = [
        'agency.txt',
        'calendar.txt',
        'calendar_dates.txt',
        'shapes.txt',
        'routes.txt',
        'stops.txt',
        'trips.txt',
        'stop_times.txt',
    ];
    for (let file of dir.files.sort((a, b) => loadOrder.indexOf(a.path) - loadOrder.indexOf(b.path))) {
        switch (file.path) {
            case 'agency.txt':
                await consumeAgency(file);
                break;
            case 'calendar.txt':
                await consumeCalendar(file);
                break;
            case 'calendar_dates.txt':
                break;
            case 'routes.txt':
                await consumeRoutes(file);
                break;
            case 'shapes.txt':
                await consumeShapes(file, pointsByShape);
                break;
            case 'stops.txt':
                await consumeStops(file, stationPlatforms);
                break;
            case 'trips.txt':
                await consumeTrips(file, tripStopCountLookup, routeAndDirectionByTripId, tripShapeLookup);
                break;
            case 'stop_times.txt':
                await consumeStopTimes(file, tripStopCountLookup, routeAndDirectionByTripId, tripShapeLookup, stationPlatforms, pointsByShape);
                break;
        }
    }

    await generateStations(stationPlatforms);

    console.log('generated SQL in', Math.round((Date.now() - start) / 100) / 10, 'seconds');
}

async function consumeAgency(file) {
    await consumeCsv(file, async ([{
        agency_id: id,
        agency_name: name,
        agency_url: url
    }]) => {
        await prisma.agency.upsert({
            create: { id, name, url },
            update: { name, url, last_updated: new Date() },
            where: { id },
        })
    });
}

async function consumeCalendar(file) {
    await consumeCsv(file, async (calendarServices) => {
        await prisma.service.createMany({
            data: calendarServices.map(({ service_id }) => ({
                id: service_id,
            })),
        });
    });
}

async function consumeRoutes(file) {
    await consumeCsv(file, async (routes) => {
        await prisma.route.createMany({
            data: routes.map(({
                route_id,
                route_long_name,
                route_short_name,
                route_type,
                route_color,
                route_text_color,
                route_sort_order,
            }) => ({
                id: route_id,
                long_name: route_long_name,
                short_name: route_short_name,
                type: mapGtfsRouteTypeToApi(route_type),
                color: `#${route_color}` || getDefaultRouteColor(route_id),
                text_color: `#${route_text_color}` || '#ffffff',
                sort_order: ((n) => isNaN(n) ? undefined : n)(Number(route_sort_order)),
            })),
        });
    });
}

// SLOW
async function consumeShapes(file, pointsByShape) {
    await consumeCsv(file, async (shapePoints) => {
        shapePoints.forEach(({ shape_id, shape_pt_lat, shape_pt_lon, shape_pt_sequence, shape_dist_traveled }) => {
            (pointsByShape[shape_id] || (pointsByShape[shape_id] = [])).push({
                latitude: Number(shape_pt_lat),
                longitude: Number(shape_pt_lon),
                sequence: Number(shape_pt_sequence),
                dist_traveled: shape_dist_traveled && Number(shape_dist_traveled),
                shape_id,
            });
        });
    });
    await prisma.shape.createMany({ data: Object.keys(pointsByShape).map(id => ({ id })) });
    await prisma.shapePoint.createMany({
        data: Object.entries(pointsByShape)
            .map(([shape_id, points]) => geometry.reducePolyLine({
                points: points.sort(({ sequence: a }, { sequence: b }) => a - b),
                x: 'longitude', y: 'latitude',
                iterations: 10,
                tolerance: 1.4e-4, // ~16.7m N/S, ~12.2m E/W, see: https://www.omnicalculator.com/other/latitude-longitude-distance
            }).map(({ longitude, latitude, sequence, dist_traveled }) => ({
                latitude,
                longitude,
                sequence,
                dist_traveled,
                shape_id,
            }))).flat(),
    });
}

// SLOW
async function consumeStops(file, stationPlatforms) {
    await consumeCsv(file, async (stops) => {
        const data = stops.map(({ stop_id, stop_lat, stop_lon, stop_name, stop_code }) => ({
            id: stop_id,
            latitude: Number(stop_lat),
            longitude: Number(stop_lon),
            name: toTitleCase(stop_name),
            code: stop_code || null,
        }));
        stationPlatforms.push(...data.filter(({ name }) =>
            (name.includes('Station') || name.startsWith('York University')) && name.includes('Platform'),
        ));
        await prisma.platform.createMany({ data });
    });
}

// SlOW
async function consumeTrips(
    file,
    tripStopCountLookup,
    routeAndDirectionByTripId,
    tripShapeLookup,
) {
    await consumeCsv(file, async (trips) => {
        trips.forEach(({ route_id, trip_id, direction_id, shape_id }) => {
            if (tripStopCountLookup[route_id] === undefined) {
                tripStopCountLookup[route_id] = {
                    '0': {},
                    '1': {},
                };
            }
            tripStopCountLookup[route_id][direction_id || '0'][trip_id] = 0;
            routeAndDirectionByTripId[trip_id] = [route_id, direction_id || '0'];
            tripShapeLookup[trip_id] = shape_id;
        });
    });
}

// SlOW
async function consumeStopTimes(
    file,
    tripStopCountLookup,
    routeAndDirectionByTripId,
    tripShapeLookup,
    stationPlatforms,
    pointsByShape,
) {
    console.log('counting stops by trip...');
    await consumeCsv(file, stopTimes => {
        stopTimes.forEach(row => {
            const trip_id = row.trip_id;
            const [route_id, direction] = routeAndDirectionByTripId[trip_id];
            tripStopCountLookup[route_id][direction][trip_id]++;
        });
    });
    console.log('done');

    console.log('selecting maximal trips...');
    const trip_ids_to_keep = [];
    Object.entries(tripStopCountLookup).forEach(([route_id, lookupByDirection]) => {
        Object.entries(lookupByDirection).forEach(([direction, counts]) => {
            const [trip_id] = Object.entries(counts).reduce(
                ([max_trip_id, max_count], [trip_id, count]) => {
                    if (count > max_count) {
                        return [trip_id, count];
                    } else {
                        return [max_trip_id, max_count];
                    }
                }, ['', 0]);
            trip_ids_to_keep.push(trip_id);
        });
    });
    console.log('done');

    console.log('linking Route to Shape...');
    const updateArgs = trip_ids_to_keep
        .filter(trip_id => routeAndDirectionByTripId[trip_id][1] === '0')
        .map(trip_id => ({
            data: { shape_id: tripShapeLookup[trip_id] },
            where: { id: routeAndDirectionByTripId[trip_id][0] },
        }));
    console.log('updating', updateArgs.length, 'routes');
    for (const args of updateArgs) {
        await prisma.route.update(args);
    }
    console.log('done');

    console.log('creating RouteStop...');
    const keepIdLookup = {};
    trip_ids_to_keep.forEach(trip_id => keepIdLookup[trip_id] = true);
    let data = [];
    await consumeCsv(file, async (stopTimes) => {
        data = data.concat(stopTimes
            .filter(row => keepIdLookup[row.trip_id])
            .map(row => {
                const [route_id, direction] = routeAndDirectionByTripId[row.trip_id];
                return {
                    route_id,
                    direction: Number(direction),
                    platform_id: row.stop_id,
                    sequence: Number(row.stop_sequence),
                    distance_along_shape: Number(row.shape_dist_traveled),
                    trip_id: row.trip_id,
                };
            }));
    });
    data.forEach(({ direction, platform_id, trip_id }) => {
        // console.log('hello', direction, platform_id, trip_id);
        if (direction === 0) {
            const shape_id = tripShapeLookup[trip_id];
            const points = pointsByShape[shape_id];
            const platform = stationPlatforms.find(({ id }) => id === platform_id);
            if (platform) {
                platform.shape = { id: shape_id, points };
                console.log('goodbye', shape_id, points.length, platform);
            }
        }
    });
    data.forEach(rs => delete rs.trip_id); // don't insert trip_id into db
    console.log(data.length, 'route stops');
    await prisma.routeStop.createMany({ data });
    console.log('done');
}

async function consumeCsv(file, store) {
    const kB = file.uncompressedSize / 1024;
    const MB = kB / 1024;
    console.log(`${file.path} (${(MB < 1 ? `${kB.toFixed(1)} kB` : `${MB.toFixed(1)} MB`)})`);
    const start = Date.now();
    const parser = parse();
    let keys;
    let rows = [];
    const batchSize = 100000;
    const consumer = new Writable({
        async write(rec, _, cb) {
            if (keys === undefined) {
                keys = rec;
            } else {
                const row = {};
                keys.forEach((k, i) => row[k] = rec[i]);
                rows.push(row);
                if (rows.length >= batchSize) {
                    await store(rows);
                    rows = [];
                }
            }
            cb();
        },
        objectMode: true,
        async final(cb) {
            await store(rows);
            cb();
        }
    });
    await pipeline(file.stream(), parser, consumer);
    console.log(`${file.path} read in ${((Date.now() - start) / 1000).toFixed(1)} seconds`);
}

function mapGtfsRouteTypeToApi(routeType) {
    switch (routeType) {
        case '0':
            return 'TramStreetcarLightRail';
        case '1':
            return 'SubwayMetro';
        case '2':
            return 'Rail';
        case '3':
            return 'Bus';
    }
}

function toTitleCase(name) {
    const noCap = ['a', 'an', 'and', 'at', 'in', 'of', 'on', 'the', 'to'];
    const allCap = ['TMU'];
    return name.replace(/\s+/g, ' ').replace(
        /[A-Z']+/ig,
        match => {
            if (noCap.includes(match.toLocaleLowerCase())) {
                return match.toLocaleLowerCase();
            } else if (allCap.includes(match.toLocaleUpperCase())) {
                return match.toLocaleUpperCase();
            } else {
                return match.charAt(0).toLocaleUpperCase() + match.substring(1).toLocaleLowerCase();
            }
        }
    );
}

async function generateStations(stationPlatforms) {
    const stationMap = {};
    stationPlatforms.forEach(p => {
        // Special handling for York University Station (see above)
        let stationName = (p.name.match(/(.*Station)/i) || p.name.match(/(York University)/))[1];
        let stationId = stationName.toLowerCase().trim().replace(/[\s-]+/g, '-');
        // Special handling for Bloor-Yonge Station
        if (stationName === 'Bloor Station' || stationName === 'Yonge Station') {
            stationName = 'Bloor-Yonge Station';
            stationId = stationName.toLowerCase().trim().replace(/[\s-]+/g, '-');
        }
        // Special handling for Bloor-Yonge Station
        if (stationName === 'Spadina Station') {
            if (p.name.includes('Northbound') || p.name.includes('Southbound')) {
                stationId = `${stationId}-1`;
            } else {
                stationId = `${stationId}-2`;
            }
        }
        if (stationId in stationMap) {
            stationMap[stationId].children.push(p);
        } else {
            stationMap[stationId] = {
                name: stationName,
                children: [p],
            };
        }
    });
    const anchors = [];
    const stations = Object.entries(stationMap).map(([station_id, { name, children }]) => {
        const average = { latitude: 0, longitude: 0 };
        children.forEach(p => {
            average.latitude += p.latitude / children.length;
            average.longitude += p.longitude / children.length;
        });
        const shapes = {};
        children.forEach(({ shape }) => {
            shape && (shapes[shape.id] = shape);
        });
        console.log('found', Object.keys(shapes).length, 'shapes for', station_id);
        const interpolationFactorsPerShape = {};
        const current = { ...average };
        const delta = { latitude: Infinity, longitude: Infinity };
        // Converge onto nearest intersection of shapes
        let it = 0;
        for (; it < 100 && (delta.latitude > 1e-8 || delta.longitude > 1e-8); it++) {
            const avgOnShapes = Object.values(shapes)
                .reduce((avg, shape) => {
                    const {
                        point: [closestLongitude, closestLatitude],
                        t: interpolationFactor,
                    } = geometry.snapToPolyLine(
                        [current.longitude, current.latitude],
                        shape.points.map(({ latitude, longitude }) => [longitude, latitude]),
                    );
                    interpolationFactorsPerShape[shape.id] = interpolationFactor;
                    avg.latitude += closestLatitude / Object.keys(shapes).length;
                    avg.longitude += closestLongitude / Object.keys(shapes).length;
                    return avg;
                }, { latitude: 0, longitude: 0 });
            delta.latitude = Math.abs(avgOnShapes.latitude - current.latitude);
            delta.longitude = Math.abs(avgOnShapes.longitude - current.longitude);
            current.latitude = avgOnShapes.latitude;
            current.longitude = avgOnShapes.longitude;
        }
        anchors.push(...Object.entries(interpolationFactorsPerShape).map(([shape_id, interpolation_factor]) => ({
            interpolation_factor,
            shape_id,
            station_id,
        })));
        const { latitude, longitude } = current;
        return { id: station_id, name, latitude, longitude };
    });
    stations.forEach(s => {
        const { latitude, longitude } = s;
        s.latitude = Math.round(latitude * 1e6) / 1e6;
        s.longitude = Math.round(longitude * 1e6) / 1e6;
    });
    await prisma.station.createMany({ data: stations });
    await prisma.stationAnchor.createMany({ data: anchors });
    await Promise.all(stations.map(({ id: station_id }) => prisma.platform.updateMany({
        where: { id: { in: stationMap[station_id].children.map(({ id }) => id) } },
        data: { parent_station_id: { set: station_id } },
    })));
}


await loadGtfs();

console.log(queries.length, 'queries');
writeFileSync('./scripts/seed.sql', queries.join(';\n\n'));
