/**
 * a Stop can be a station or a platform, linked by parent_station_id
 * a Trip joins M:1 (Route, Direction, Shape)
 * a StopTime joins (Trip, Stop)
 */

import { env } from 'node:process';
import { Prisma, PrismaClient, RouteType } from '../generated/prisma/client.ts';
import { parse } from 'csv-parse';
import { Writable } from 'stream';
import { pipeline } from 'stream/promises';
import unzipper from 'unzipper';
import geometry from '../utils/geometry.ts';
import { writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { config } from 'dotenv';
import { SqlDriverAdapterFactory } from '@prisma/client/runtime/client';
import Gtfs from '../models/Gtfs.ts';

config();

const SQL_SCRIPT_FILE = 'generated/seed.sql';

const queries: string[] = [];

function fillQueryArgs(sql: SqlQuery['sql'], args: SqlQuery['args'], argTypes: SqlQuery['argTypes']): string {
    const chunks = sql.split('?');
    sql = '';
    args.forEach((arg, i) => {
        let argStr = '';
        const type = argTypes[i].scalarType;
        if (arg === null || arg === undefined) {
            sql += chunks[i] + 'null';
            return
        }
        switch (type) {
            case 'bigint':
            case 'boolean':
            case 'int':
                argStr = '' + arg;
                break;
            case 'decimal':
            case 'float':
                try {
                    argStr = Number(arg).toFixed(6);
                } catch {
                    console.log('number arg failed for', type, typeof arg, arg);
                }
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
                argStr = `'${('' + arg).replace('\'', '\'\'')}'`;
                break;
        }
        sql += chunks[i] + argStr;
    });
    sql += chunks[chunks.length - 1];
    const withoutReturning = sql.split(' RETURNING')[0];
    return withoutReturning;
}

type SqlQuery = Parameters<Transaction['queryRaw']>[0];

function makeMockQuery<T>(dummy: T) {
    return async ({ sql, args, argTypes }: SqlQuery) => {
        if (sql !== 'COMMIT') {
            // console.log('SQL!');
            queries.push(fillQueryArgs(sql, args, argTypes));
        }
        return dummy;
    };
}

type Transaction = Awaited<ReturnType<SqlDriverAdapter['startTransaction']>>;

const mockTransaction: Transaction = {
    provider: 'sqlite',
    adapterName: '@prisma/adapter-d1',
    queryRaw: makeMockQuery({ columnTypes: [], columnNames: [], rows: [] }),
    executeRaw: makeMockQuery(0),
    options: { usePhantomQuery: false },
    commit: async () => { },
    rollback: async () => { },
};

type SqlDriverAdapter = Awaited<ReturnType<SqlDriverAdapterFactory['connect']>>;

const mockAdapter: SqlDriverAdapter = {
    provider: 'sqlite',
    adapterName: '@prisma/adapter-d1',
    executeScript: async (script) => {
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

const mockAdapterFactory: SqlDriverAdapterFactory = {
    provider: 'sqlite',
    adapterName: '@prisma/adapter-d1',
    connect: async () => mockAdapter,
};

const prisma = new PrismaClient({
    // log: ['query'],
    adapter: mockAdapterFactory,
});

const lineIds = ['1', '2', '3', '4', '5', '6'];

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
    // const tableNames = (Object.keys(prisma) as (keyof typeof prisma)[]).filter(......);
    const tableNames = [
        'service',
        'routeStop',
        'route',
        'stationAnchor',
        'platformAnchor',
        'point',
        'polyLine',
        'platform',
        'station',
    ] as const;
    for (let k of tableNames) {
        console.log('delete', k);
        const table = prisma[k];
        // @ts-expect-error -- ts(2349) error states signatures of deleteMany are incompatible
        // between each delegate, but all have a no-arg variant as we are using here.
        await table.deleteMany();
    }
    const tripStopCountLookup: {
        [k in string]: {
            [k in Gtfs.Schedule.Direction]: {
                [k in string]: number;
            };
        };
    } = {};
    const routeAndDirectionByTripId: {
        [k in string]: [string, Gtfs.Schedule.Direction];
    } = {};
    const tripShapeLookup: {
        [k in string]: string;
    } = {};
    const stopLatLng: {
        [k in string]: {
            latitude: number;
            longitude: number;
        };
    } = {};
    const stationLookup: {
        [k in string]: {
            children: string[];
        };
    } = {};
    // const stationPlatforms: {
    //     id: string;
    //     latitude: number;
    //     longitude: number;
    //     name: string;
    //     code: string | null;
    //     shape?: {
    //         id: string,
    //         points: {
    //             polyline_id: string;
    //             sequence: number;
    //             latitude: number;
    //             longitude: number;
    //         }[];
    //     };
    // }[] = [];
    const pointsByShape: {
        [k in string]: {
            polyline_id: string;
            sequence: number;
            latitude: number;
            longitude: number;
        }[];
    } = {};
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
                await consumeStops(file, stopLatLng, stationLookup);
                break;
            case 'trips.txt':
                await consumeTrips(file, tripStopCountLookup, routeAndDirectionByTripId, tripShapeLookup, pointsByShape);
                break;
            case 'stop_times.txt':
                await consumeStopTimes(file, tripStopCountLookup, routeAndDirectionByTripId, tripShapeLookup, pointsByShape, stopLatLng, stationLookup);
                break;
        }
    }

    await alignStations();

    console.log('generated SQL in', Math.round((Date.now() - start) / 100) / 10, 'seconds');
}

async function consumeAgency(file: unzipper.File) {
    await consumeCsv<Gtfs.Schedule.Agency>(file, async ([{
        agency_id: id,
        agency_name: name,
        agency_url: url
    }]) => {
        await prisma.agency.upsert({
            create: { id, name, url },
            update: { name, url, last_updated: new Date() },
            where: { id },
        });
    });
}

async function consumeCalendar(file: unzipper.File) {
    await consumeCsv<Gtfs.Schedule.CalendarService>(file, async (calendarServices) => {
        await prisma.service.createMany({
            data: calendarServices.map(({ service_id }) => ({
                id: service_id,
            })),
        });
    });
}

async function consumeRoutes(file: unzipper.File) {
    await consumeCsv<Gtfs.Schedule.Route>(file, async (routes) => {
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
                long_name: toTitleCase(route_long_name),
                short_name: toTitleCase(route_short_name),
                type: mapGtfsRouteTypeToApi(route_type, route_id),
                color: (route_id === '1' ? '#f8c300' : `#${route_color || '000000'}`),
                text_color: `#${route_text_color || 'ffffff'}`,
                sort_order: ((n) => isNaN(n) ? undefined : n)(Number(route_sort_order)),
            })),
        });
    });
}

async function consumeShapes(
    file: unzipper.File,
    pointsByShape: {
        [k in string]: {
            polyline_id: string;
            sequence: number;
            latitude: number;
            longitude: number;
        }[];
    },
) {
    await consumeCsv<Gtfs.Schedule.ShapePoint>(file, async (shapePoints) => {
        shapePoints.forEach(({ shape_id, shape_pt_lat, shape_pt_lon, shape_pt_sequence }) => {
            // console.log('push', shape_id, `#${shape_pt_sequence}`);
            (pointsByShape[shape_id] || (pointsByShape[shape_id] = [])).push({
                latitude: Number(shape_pt_lat),
                longitude: Number(shape_pt_lon),
                sequence: Number(shape_pt_sequence),
                polyline_id: shape_id,
            });
        });
    });
    console.log('Read', Object.values(pointsByShape).map(points => points.length).reduce((s, c) => s + c, 0), 'points');
    Object.entries(pointsByShape).forEach(([id, points]) => {
        pointsByShape[id] = geometry.reducePolyLine({
            points,
            x: 'longitude', y: 'latitude',
            iterations: 10,
            tolerance: 2e-6,
        });
    });
    console.log('Reduced to', Object.values(pointsByShape).map(points => points.length).reduce((s, c) => s + c, 0), 'points');
    Object.values(pointsByShape).forEach(points => points.sort((a, b) => a.sequence - b.sequence));
    console.log('Creating shapes');
    await prisma.polyLine.createMany({ data: Object.keys(pointsByShape).map(id => ({ id })) });
    console.log('Creating shape points');
    for (let data of Object.values(pointsByShape)) {
        await prisma.point.createMany({ data });
    }
    console.log('Done');
}

async function consumeStops(
    file: unzipper.File,
    stopLatLng: {
        [k in string]: {
            latitude: number;
            longitude: number;
        };
    },
    stationLookup: {
        [k in string]: {
            children: string[];
        };
    },
) {
    await consumeCsv<Gtfs.Schedule.Stop>(file, async (stops) => {

        // pull explicit station data
        const stationData: Prisma.StationCreateManyInput[] = stops
            .filter(({ location_type }) => location_type === Gtfs.Schedule.LocationType.Station)
            .map(({ stop_id, stop_lat, stop_lon, stop_name }) => ({
                id: stop_id,
                latitude: Number(stop_lat),
                longitude: Number(stop_lon),
                name: stop_name!,
                formerly: lookupFormerly(stop_name!),
            }));

        // add Spadina North-South as separate station
        const spadinaPlatformNb = stops.find(({ stop_id }) => stop_id === '13853')!;
        const spadinaPlatformSb = stops.find(({ stop_id }) => stop_id === '13854')!;
        const spadinaStn = stops.find(({ stop_id }) => stop_id === '99976')!;
        const spadina2: typeof stationData[0] = {
            id: spadinaStn.stop_id + '-ns',
            name: spadinaStn.stop_name!,
            latitude: NaN,
            longitude: NaN,
        };
        spadinaPlatformNb.parent_station = spadina2.id;
        spadinaPlatformSb.parent_station = spadina2.id;
        stationData.push(spadina2);

        // pull explicit platform data
        const platformData: Prisma.PlatformCreateManyInput[] = stops
            .filter(({ location_type }) => location_type === Gtfs.Schedule.LocationType.Platform || location_type === '' || location_type === undefined)
            .map(({ stop_id, stop_lat, stop_lon, stop_name, stop_code, parent_station }) => ({
                id: stop_id,
                latitude: Number(stop_lat),
                longitude: Number(stop_lon),
                parent_station_id: parent_station || null,
                name: stop_name!,
                code: stop_code || undefined,
            }));

        // infer missing stations
        const inferredStations: {
            [k in string]: typeof stationData[0];
        } = {};
        platformData
            .forEach(platform => {
                if (platform.parent_station_id) {
                    // parent already defined
                    return;
                }
                const match = platform.name.match(/^(\w.*\w) station - \w+ platform/i);
                if (!match) {
                    // this platform doesn't have a station
                    return;
                }
                const [, stationName] = match;
                const station = stationData.find(({ name, id }) => name === stationName);
                if (station) {
                    // the station already exists
                    platform.parent_station_id = station.id;
                    console.warn('found station:', station.name);
                    return;
                }
                const stationId = 'inf-' + stationName.toLowerCase().replace(' ', '-');
                console.warn('inferring station:', stationName, 'from platform:', platform.name);
                if (stationId in inferredStations) {
                    console.warn('already inferred');
                } else {
                    inferredStations[stationId] = {
                        id: stationId,
                        name: stationName,
                        latitude: NaN,
                        longitude: NaN,
                    };
                }
            });
        stationData.push(...Object.values(inferredStations));

        // add platforms as children to parent stations
        platformData
            .filter(({ parent_station_id }) => parent_station_id)
            .forEach(({ id, parent_station_id }) => {
                if (parent_station_id === spadinaStn.stop_id || parent_station_id == spadina2.id) {
                    console.log(parent_station_id, 'push', id);
                }
                parent_station_id = parent_station_id!;
                (stationLookup[parent_station_id] || (stationLookup[parent_station_id] = { children: [] })).children.push(id);
            });

        // record platform lat-long's
        platformData.forEach(({ id, latitude, longitude }) => stopLatLng[id] = { latitude, longitude });
        
        // average out station lat-long's and record
        stationData.forEach(station => {
            if (!(station.id in stationLookup)) {
                console.warn('station', station.id, station.name, 'has no children?');
                return;
            }
            const { children } = stationLookup[station.id];
            if (station.name === 'Spadina') {
                console.log(station.id, 'has', children.length, 'children');
            }
            station.latitude = children.reduce((s, pid) => s + stopLatLng[pid].latitude / children.length, 0);
            station.longitude = children.reduce((s, pid) => s + stopLatLng[pid].longitude / children.length, 0);
            stopLatLng[station.id] = {
                latitude: station.latitude,
                longitude: station.longitude,
            };
        })

        // check for absent parents
        platformData.forEach(({ parent_station_id }) => {
            if (parent_station_id && stopLatLng[parent_station_id] === undefined) {
                console.warn('station id', parent_station_id, 'not listed');
            }
        });

        // push platform and station data
        await prisma.station.createMany({ data: stationData });
        await prisma.platform.createMany({ data: platformData });
    });
}

async function consumeTrips(
    file: unzipper.File,
    tripStopCountLookup: {
        [k in string]: {
            [k in Gtfs.Schedule.Direction]: {
                [k in string]: number;
            };
        };
    },
    routeAndDirectionByTripId: {
        [k in string]: [string, Gtfs.Schedule.Direction];
    },
    tripShapeLookup: {
        [k in string]?: string;
    },
    pointsByShape: {
        [k in string]: {
            polyline_id: string;
            sequence: number;
            latitude: number;
            longitude: number;
        }[];
    },
) {
    await consumeCsv<Gtfs.Schedule.Trip>(file, async (trips) => {
        trips.forEach(({ route_id, trip_id, direction_id, shape_id }) => {
            if (tripStopCountLookup[route_id] === undefined) {
                tripStopCountLookup[route_id] = {
                    '0': {},
                    '1': {},
                };
            }
            tripStopCountLookup[route_id][direction_id || '0'][trip_id] = 0;
            routeAndDirectionByTripId[trip_id] = [route_id, direction_id || '0'];
            if (!(shape_id === undefined || shape_id === '' || shape_id in pointsByShape)) {
                console.warn('shape', shape_id, `(for trip ${trip_id}) does not exist`);
            }
            tripShapeLookup[trip_id] = (shape_id && (shape_id in pointsByShape)) ? shape_id : undefined;
        });
    });
}

// TODO: this can probably be optimized
async function consumeStopTimes(
    file: unzipper.File,
    tripStopCountLookup: {
        [k in string]: {
            [k in Gtfs.Schedule.Direction]: {
                [k in string]: number;
            };
        };
    },
    routeAndDirectionByTripId: {
        [k in string]: [string, Gtfs.Schedule.Direction];
    },
    tripShapeLookup: {
        [k in string]?: string;
    },
    // stationPlatforms: {
    //     id: string;
    //     latitude: number;
    //     longitude: number;
    //     name: string;
    //     code: string | null;
    //     shape?: {
    //         id: string,
    //         points: {
    //             polyline_id: string;
    //             sequence: number;
    //             latitude: number;
    //             longitude: number;
    //         }[];
    //     };
    // }[],
    pointsByShape: {
        [k in string]: {
            polyline_id: string;
            sequence: number;
            latitude: number;
            longitude: number;
        }[];
    },
    stopLatLng: {
        [k in string]: {
            latitude: number;
            longitude: number;
        };
    },
    stationLookup: {
        [k in string]: {
            children: string[];
        };
    },
) {
    console.log('counting stops by trip...');
    await consumeCsv<Gtfs.Schedule.StopTime>(file, (stopTimes) => {
        stopTimes.forEach(row => {
            const trip_id = row.trip_id;
            if (trip_id === '') {
                console.warn('missing trip on stopTime!');
            }
            if (routeAndDirectionByTripId[trip_id] === undefined) {
                console.warn('trip', trip_id, 'not in routeAndDirection map');
                return;
            }
            const [route_id, direction] = routeAndDirectionByTripId[trip_id];
            tripStopCountLookup[route_id][direction][trip_id]++;
        });
    });
    console.log('done');

    console.log('selecting maximal trips...');
    const trip_ids_to_keep: string[] = [];
    Object.entries(tripStopCountLookup).forEach(([route_id, lookupByDirection]) => {
        Object.entries(lookupByDirection).forEach(([direction, counts]) => {
            const [trip_id] = Object.entries(counts).reduce(
                ([max_trip_id, max_count], [trip_id, count]) => {
                    if (count > max_count) {
                        return [trip_id, count];
                    } else {
                        return [max_trip_id, max_count];
                    }
                }, [null as string | null, 0]);
            if (trip_id === null) {
                console.warn('no trips for route', route_id, '-', direction);
            } else {
                trip_ids_to_keep.push(trip_id);
            }
        });
    });
    console.log('done');

    console.log('inferring shapes for shapeless trips...');
    const tripsWithInferredShapes: string[] = [];
    trip_ids_to_keep.forEach(trip_id => {
        if (tripShapeLookup[trip_id] === undefined) {
            let shape_id = `inf-${trip_id}`;
            tripShapeLookup[trip_id] = shape_id;
            tripsWithInferredShapes.push(trip_id);
        }
    });
    console.log(tripsWithInferredShapes.length, 'trips have no shape');
    if (tripsWithInferredShapes.length === 0) {
        console.log('skipping shape inferrence');
    } else {
        await prisma.polyLine.createMany({
            data: tripsWithInferredShapes.map(trip_id => ({
                id: tripShapeLookup[trip_id]!,
            })),
        });
        console.log('done');

        console.log('inferring shape points...')
        const newPoints: {
            polyline_id: string;
            sequence: number;
            latitude: number;
            longitude: number;
        }[] = [];
        await consumeCsv<Gtfs.Schedule.StopTime>(file, (stopTimes) => {
            stopTimes.forEach(({ trip_id, stop_id, stop_sequence }) => {
                if (tripsWithInferredShapes.includes(trip_id)) {
                    const polyline_id = tripShapeLookup[trip_id]!;
                    const sequence = Number(stop_sequence);
                    if (stopLatLng[stop_id] === undefined) {
                        console.warn('stop', stop_id, 'has no latLng');
                        return
                    }
                    const { latitude, longitude } = stopLatLng[stop_id];
                    const point = {
                        polyline_id,
                        sequence,
                        latitude,
                        longitude,
                    };
                    newPoints.push(point);
                    console.info('push point to polyline', polyline_id);
                    (pointsByShape[polyline_id] || (pointsByShape[polyline_id] = [])).push(point);
                }
            });
        });
        console.log('inferred', newPoints.length, 'points');
        await prisma.point.createMany({ data: newPoints });
        tripsWithInferredShapes.forEach(trip_id => {
            const polyline_id = tripShapeLookup[trip_id]!;
            if (!(polyline_id in pointsByShape)) {
                console.warn('polyline', polyline_id, 'has no points!');
                return;
            }
            pointsByShape[polyline_id].sort(({ sequence: a }, { sequence: b }) => a - b);
            console.log('shape', polyline_id, 'has', pointsByShape[polyline_id].length, 'points');
        });
        console.log('done');
    }

    console.log('linking Route to Shape...');
    const updateArgs: Prisma.RouteUpdateArgs[] = trip_ids_to_keep
        .map(trip_id => ({
            data: routeAndDirectionByTripId[trip_id][1] === '0'
                ? { forward_id: tripShapeLookup[trip_id]! }
                : { backward_id: tripShapeLookup[trip_id]! },
            where: { id: routeAndDirectionByTripId[trip_id][0] },
        } as Prisma.RouteUpdateArgs));
    console.log('updating', updateArgs.length, 'routes');
    for (const args of updateArgs) {
        await prisma.route.update(args);
    }
    console.log('done');

    console.log('creating route stops...');
    const keepIdLookup: { [k in string]?: true } = {};
    trip_ids_to_keep.forEach(trip_id => keepIdLookup[trip_id] = true);
    let routeStops: (Prisma.RouteStopCreateManyInput & { trip_id?: string })[] = [];
    await consumeCsv<Gtfs.Schedule.StopTime>(file, (stopTimes) => {
        routeStops = routeStops.concat(stopTimes
            .filter(row => keepIdLookup[row.trip_id])
            .map(row => {
                const [route_id, direction] = routeAndDirectionByTripId[row.trip_id];
                return {
                    route_id,
                    direction: Number(direction),
                    platform_id: row.stop_id,
                    sequence: Number(row.stop_sequence),
                    trip_id: row.trip_id,
                } as typeof routeStops[0];
            }));
    });
    // routeStops.forEach(({ direction, platform_id, trip_id, route_id }) => {
    //     if (lineIds.includes(route_id) && direction === 0) {
    //         const shape_id = tripShapeLookup[trip_id!]!;
    //         const points = pointsByShape[shape_id];
    //         const platform = stationPlatforms.find(({ id }) => id === platform_id);
    //         if (platform && shape_id) {
    //             if (platform.shape) {
    //                 console.error('platform', platform.id, 'already has shape', platform.shape.id, 'but trying to put shape', shape_id);
    //             }
    //             platform.shape = { id: shape_id, points };
    //         }
    //     }
    // });
    console.log(routeStops.length, 'route stops');
    await prisma.routeStop.createMany({ data: routeStops.map(rs => ({ ...rs, trip_id: undefined })) });
    console.log('done');

    console.log('creating platform anchors...');
    const platformPolylineLookup: { [k in string]: string[] } = {};
    const anchorsSeen: { [k in string]: number } = {};
    const platformAnchorData = routeStops.map(({ platform_id, trip_id }) => {
        const polyline_id = tripShapeLookup[trip_id!]!;
        if (polyline_id === undefined) {
            console.warn('platform', platform_id, 'on trip', trip_id, 'has no polyline_id');
            return { platform_id, polyline_id: null, interpolation_factor: NaN };
        }
        (platformPolylineLookup[platform_id] || (platformPolylineLookup[platform_id] = [])).push(polyline_id);
        const points = pointsByShape[polyline_id];
        if (points === undefined) {
            console.warn('polyline', polyline_id, 'has no points');
            return { platform_id, polyline_id, interpolation_factor: NaN };
        }
        const interpolation_factor = geometry.snapToPolyLine(
            geometry.latLngToPoint(stopLatLng[platform_id]),
            points.map(geometry.latLngToPoint),
        )!.t;
        const t = anchorsSeen[platform_id + ',' + polyline_id];
        if (t !== undefined) {
            console.info('skipping duplicate anchor for platform', platform_id, 'shape', polyline_id);
            if (t !== interpolation_factor) {
                console.warn('t mismatch:', t, '!=', interpolation_factor);
            }
            return null;
        }
        anchorsSeen[platform_id + ',' + polyline_id] = interpolation_factor;
        return {
            platform_id,
            polyline_id,
            interpolation_factor,
        } as Prisma.PlatformAnchorCreateManyInput;
    }).filter(x => x) as Prisma.PlatformAnchorCreateManyInput[];
    console.log(platformAnchorData.length, 'platform anchors');
    await prisma.platformAnchor.createMany({ data: platformAnchorData });
    console.log('done');

    console.log('creating station anchors...');
    const stationAnchorData = Object.entries(stationLookup).reduce((data, [station_id, { children }]) => {
        const polylineIds = children
            .reduce((all, platform_id) => {
                const platformPolylines = platformPolylineLookup[platform_id];
                if (platformPolylines === undefined || platformPolylines.length === 0) {
                    console.warn('platform', platform_id, 'has no polylines');
                    return all;
                }
                return all.concat(platformPolylines);
            }, [] as string[])
            .sort()
            .reduce((unique, id) => unique.find(_id => _id === id) ? unique : unique.concat(id), [] as string[]);
        if (polylineIds.length === 0) {
            console.warn('station', station_id, 'has no polylines');
            return data;
        }
        polylineIds.forEach(id => {
            if (polylineIds.filter(id_ => id_ === id).length > 1) {
                console.warn('station', station_id, 'has duplicate polyline', id);
            }
        });
        return data.concat(polylineIds.map((polyline_id): Prisma.StationAnchorCreateManyInput => ({
            interpolation_factor: geometry.snapToPolyLine(
                geometry.latLngToPoint(stopLatLng[station_id]),
                pointsByShape[polyline_id].map(geometry.latLngToPoint),
            )!.t,
            polyline_id,
            station_id,
        })));
    }, [] as Prisma.StationAnchorCreateManyInput[]);
    console.log(stationAnchorData.length, 'station anchors');
    await prisma.stationAnchor.createMany({ data: stationAnchorData });
    console.log('done');
}

async function alignStations() {
    // TODO
}

async function consumeCsv<T extends { [k in keyof T]?: string }>(
    file: unzipper.File,
    store: (rows: T[]) => void | Promise<void>) {
    const kB = file.uncompressedSize / 1024;
    const MB = kB / 1024;
    console.log(`${file.path} (${(MB < 1 ? `${kB.toFixed(1)} kB` : `${MB.toFixed(1)} MB`)})`);
    const start = Date.now();
    const parser = parse({
        skipRecordsWithError: true,
        onSkip(err, raw) { console.log(`Skipping record: '${raw}' - `, err?.code, err?.name) },
    });
    let keys: (keyof T)[] | undefined;
    let rows: T[] = [];
    const batchSize = 100000;
    const consumer = new Writable({
        async write(rec: string[], _, cb) {
            if (keys === undefined) {
                keys = rec as (keyof T)[];
            } else {
                const row: Partial<T> = {};
                keys.forEach((k, i) => row[k] = rec[i] as T[typeof k]);
                rows.push(row as T);
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
    await pipeline(file.stream(), parser, consumer).catch(reason => {
        console.log('failed to parse', file.path, 'reason:', reason);
        process.exit(1);
    });
    console.log(`${file.path} read in ${((Date.now() - start) / 1000).toFixed(1)} seconds`);
}

function mapGtfsRouteTypeToApi(routeType: Gtfs.Schedule.RouteType, routeId?: string): RouteType {
    switch (routeType) {
        case Gtfs.Schedule.RouteType.TramStreetcarLightRail:
            return (routeId && lineIds.includes(routeId)) ? RouteType.SubwayLRT : RouteType.Streetcar;
        case Gtfs.Schedule.RouteType.SubwayMetro:
            return RouteType.SubwayLRT;
        case Gtfs.Schedule.RouteType.Bus:
            return RouteType.Bus;
        default:
            throw new Error(`Route Type not supported: ${routeType}`);
    }
}

function lookupFormerly(name: string): string | undefined {
    switch (name) {
        case 'Cedarvale': return 'Eglinton West';
        case 'TMU': return 'Dundas';
        case 'Don Valley': return 'Science Centre (RIP)';
        default: return undefined;
    }
}

function toTitleCase(name: string) {
    const noCap = ['a', 'an', 'and', 'at', 'in', 'of', 'on', 'the', 'to'];
    const allCap = ['TMU', 'TTC'];
    const prefix = ['Mc', 'O\''];
    return name.replace(/\s+/g, ' ').replace(
        /[A-Z']+/ig,
        (match: string, offset: number) => {
            if (offset > 0 && noCap.includes(match.toLocaleLowerCase())) {
                return match.toLocaleLowerCase();
            } else if (allCap.includes(match.toLocaleUpperCase())) {
                return match.toLocaleUpperCase();
            } else {
                const pre = prefix.find(pre => match.toLocaleLowerCase().startsWith(pre.toLocaleLowerCase()));
                if (pre) {
                    return pre + toTitleCase(match.slice(pre.length));
                }
                return match.charAt(0).toLocaleUpperCase() + match.substring(1).toLocaleLowerCase();
            }
        }
    );
}

async function run() {
    await loadGtfs();
    console.log('generated', queries.length, 'queries');
    if (queries.length === 0) {
        return;
    }
    const combinedSql = queries.join(';\n');
    writeFileSync(SQL_SCRIPT_FILE, combinedSql);
}

run();
