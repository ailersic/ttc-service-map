import { parse } from 'csv-parse';
import protobufjs from 'protobufjs';
import { Writable } from 'stream';
import { pipeline } from 'stream/promises';
import unzipper from 'unzipper';
import { RouteType } from '../prisma/generated/client.ts';
import {
    PlatformCreateManyInput,
    RouteCreateManyInput,
    RouteStopCreateManyInput,
    ServiceCreateManyInput,
    StationAnchorCreateManyInput
} from '../prisma/generated/models.ts';
import prisma from '../prisma/prisma.js';
import geometry from '../utils/geometry.ts';
import Gtfs from './Gtfs.ts';

export type Direction = 0 | 1;

export type SubwayPlatformCollection = Awaited<ReturnType<TtcApi['getSubwayPlatforms']>>;
export type SubwayStationCollection = Awaited<ReturnType<TtcApi['getSubwayStations']>>;
export type SubwayRouteCollection = Awaited<ReturnType<TtcApi['getSubwayRoutes']>>;

export interface AlertCollection {
    timestamp: number;
    alerts: Alert[];
};

export namespace Alert {

    export enum Effect {
        NoService = 'NoService',
        ReducedService = 'ReducedService',
        SignificantDelay = 'SignificantDelay',
        Detour = 'Detour',
        AdditionalService = 'AdditionalService',
        ModifiedService = 'ModifiedService',
        Other = 'Other',
        Unknown = 'Unknown',
        StopMoved = 'StopMoved',
        None = 'None',
        AccessibilityIssue = 'AccessibilityIssue',
    };

    /** To be interpreted as AND. */
    export type Criteria = {
        direction?: Direction;
        route_id?: string;
        route_type?: RouteType;
        platform_id?: string;
    };
};

export interface Alert {
    id: string;
    effect: Alert.Effect;
    header: string;
    description: string;
    /** To be interpreted as OR. */
    criteria: Alert.Criteria[];
};

/**
 * @see https://open.toronto.ca/dataset/merged-gtfs-ttc-routes-and-schedules/
 * @see https://open.toronto.ca/dataset/ttc-routes-and-schedules/
 * @see https://gtfsrt.ttc.ca/
 */
export default class TtcApi {
    private readonly gtfsPackageUrl = 'https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/package_show?id=';
    // Unclear which dataset should be preferred, but the "merged" dataset is bigger
    // private readonly gtfsPackageId = 'ttc-routes-and-schedules';
    private readonly gtfsPackageId = 'merged-gtfs-ttc-routes-and-schedules';
    private readonly gtfsProtoFileUrl = 'https://raw.githubusercontent.com/google/transit/e62ea02efd8987cd6a5eaf8438de7feef9303857/gtfs-realtime/proto/gtfs-realtime.proto';
    private readonly gtfsAlertUrl = 'https://gtfsrt.ttc.ca/alerts/all?format=binary';

    private readonly lineIds = ['1', '2', '3', '4', '5', '6'];

    private loadGtfsSchedulePromise: Promise<void> | null = null;
    private gtfsRealtime: protobufjs.Type | null = null;

    constructor() { }

    async getSubwayPlatforms() {
        return prisma.platform.findMany({
            where: {
                parent_station_id: { not: null },
            },
            orderBy: {
                id: 'asc',
            },
        }).then(result => {
            const dict: {
                [k in string]: Omit<typeof result[0], 'id'>;
            } = {};
            result.forEach(({ id, ...rest }) => {
                dict[id] = rest;
            });
            return dict;
        });
    }

    async getSubwayStations() {
        return prisma.station.findMany({
            orderBy: {
                id: 'asc',
            },
        }).then(result => {
            const dict: {
                [k in string]: Omit<typeof result[0], 'id'>;
            } = {};
            result.forEach(({ id, ...rest }) => {
                dict[id] = rest;
            });
            return dict;
        });
    }

    async getSubwayRoutes() {
        return prisma.route.findMany({
            where: {
                id: { in: this.lineIds },
            },
            select: {
                id: true,
                short_name: true,
                long_name: true,
                color: true,
                route_stops: {
                    select: {
                        platform: {
                            select: {
                                id: true,
                                parent_station: {
                                    select: {
                                        anchors: {
                                            select: {
                                                interpolationFactor: true,
                                                shape_id: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    where: { direction: 0 },
                    orderBy: { sequence: 'asc' },
                },
                shape: {
                    select: {
                        id: true,
                        shape_points: {
                            select: {
                                latitude: true,
                                longitude: true,
                            },
                            orderBy: { sequence: 'asc' },
                        },
                    },
                },
            },
        }).then(result => {
            return result.map(({ id, short_name, long_name, color, route_stops, shape }) => ({
                id, short_name, long_name, color,
                stops: route_stops.map(({ platform }) => platform.id),
                segments: route_stops.reduce((segments, { platform }, i, a) => {
                    const thisAnchor = platform.parent_station?.anchors
                        .find(({ shape_id }) => shape_id === shape?.id)?.interpolationFactor!;
                    if (i > 0) {
                        const prevAnchor = a[i - 1].platform.parent_station?.anchors
                            .find(({ shape_id }) => shape_id === shape?.id)?.interpolationFactor!;
                        segments.push(
                            geometry.slicePolyLine(
                                shape!.shape_points.map(({ latitude, longitude }) => [longitude, latitude]),
                                prevAnchor,
                                thisAnchor,
                            ).map(([longitude, latitude]) => ({ latitude, longitude }))
                        );
                    }
                    return segments;
                }, [] as { latitude: number, longitude: number }[][]),
                shape: shape?.shape_points,
            }));
        });
    }

    loadGtfs(forceReload: boolean = false) {
        return this.loadGtfsSchedulePromise = this._loadGtfs(forceReload).then(() => { this.loadGtfsSchedulePromise = null });
    }

    getGtfsStaticPromise() {
        return this.loadGtfsSchedulePromise;
    }

    async regenerateStations() {
        await prisma.platform.updateMany({ data: { parent_station_id: { set: null } } });
        await prisma.stationAnchor.deleteMany();
        await prisma.station.deleteMany();
        await this._generateStations();
    }

    async getAlerts(): Promise<AlertCollection> {
        if (this.gtfsRealtime === null) {
            await this._loadGtfsRtProtoDefs();
        }
        // This fetch is pretty slow, >2 seconds, and no clear way to speed it up.
        // Client should not wait for this before rendering.
        const feedRes = await fetch(this.gtfsAlertUrl);
        const feed = await feedRes.body!.getReader().read().then(result => Buffer.from(result.value!));
        const feedMessage = this.gtfsRealtime!.decode(feed).toJSON() as Gtfs.Realtime.FeedMessage;
        const result = {
            timestamp: Number(feedMessage.header.timestamp) * 1000, // seconds to ms
            alerts: (await Promise.all(
                feedMessage.entity
                    .map(async ({ id, alert }) => {

                        // discard feed entities without an alert
                        if (alert === undefined) return null;

                        const {
                            active_period,
                            header_text,
                            description_text,
                            informed_entity,
                        } = alert;

                        const cause = alert.cause || Gtfs.Realtime.Cause.Unknown;
                        const effect = alert.effect || Gtfs.Realtime.Effect.Unknown;

                        // discard alerts that are not active
                        if (active_period && !active_period.some(({ start, end }) => (
                            (!start || Number(start) < Date.now()) &&
                            (!end || Number(end) > Date.now())
                        ))) return null;

                        return {
                            id,
                            header: this._toEnglish(header_text),
                            description: this._toEnglish(description_text),
                            effect: this._mapGtfsEffectToApi(effect),
                            criteria: informed_entity
                                .filter(({ trip }) => !trip)
                                .map(({ direction_id, route_id, route_type, stop_id }) => ({
                                    direction: this._mapGtfsDirectionToApi(direction_id),
                                    route_id,
                                    route_type: route_type ? this._mapGtfsRouteTypeToApi(route_type) : undefined,
                                    platform_id: stop_id,
                                })),
                        };
                    }))
            ).filter((alert): alert is NonNullable<typeof alert> => !!alert),
        };
        return result;
    }

    private async _loadGtfs(forceReload: boolean) {
        const start = Date.now();
        if (this.gtfsRealtime === null) {
            await this._loadGtfsRtProtoDefs();
        }
        const res = await fetch(this.gtfsPackageUrl + this.gtfsPackageId);
        const data = await res.json();
        const lastRefreshed = new Date(data.result.last_refreshed as string);
        console.log('last refreshed:', lastRefreshed.toLocaleDateString());
        if (!forceReload) {
            const agency = await prisma.agency.findFirst();
            if (agency && agency.last_updated > lastRefreshed) {
                console.log(agency.name, 'already up to date');
                return;
            }
        }
        const zipUrl = data.result.resources[0].url as string;
        const zipRes = await fetch(zipUrl);
        const buffer = await zipRes.arrayBuffer();
        const dir = await unzipper.Open.buffer(Buffer.from(buffer));
        console.log(dir.files.map(file => file.path));
        // It's faster to just wipe the db and recreate everything
        const tables: (keyof typeof prisma)[] = [
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
            // @ts-expect-error -- signatures of deleteMany on each table don't match, but they all have no-arg signatures
            await prisma[k].deleteMany();
        }
        const tripStopCountLookup: {
            // route_id
            [k in string]: {
                [k in Gtfs.Schedule.Direction]: {
                    // trip_id
                    [k in string]: number;
                };
            };
        } = {};
        const routeAndDirectionByTripId: {
            [k in string]: [string, Gtfs.Schedule.Direction];
        } = {};
        const tripShapeLookup: {
            // trip_id : shape_id
            [k in string]: string;
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
                    await this._consumeCsv(file, async ([{
                        agency_id: id,
                        agency_name: name,
                        agency_url: url
                    }]: Gtfs.Schedule.Agency[]) => {
                        await prisma.agency.upsert({
                            create: { id, name, url },
                            update: { name, url, last_updated: new Date() },
                            where: { id },
                        })
                    });
                    break;
                case 'calendar.txt':
                    await this._consumeCsv(file, async (calendarServices: Gtfs.Schedule.CalendarService[]) => {
                        await prisma.service.createMany({
                            data: calendarServices.map(({ service_id }): ServiceCreateManyInput => ({
                                id: service_id,
                            })),
                        });
                    });
                    break;
                case 'calendar_dates.txt':
                    break;
                case 'routes.txt':
                    await this._consumeCsv(file, async (routes: Gtfs.Schedule.Route[]) => {
                        await prisma.route.createMany({
                            data: routes.map(({ route_id, route_long_name, route_short_name, route_type, route_color, route_text_color, route_sort_order }): RouteCreateManyInput => ({
                                id: route_id,
                                long_name: route_long_name,
                                short_name: route_short_name,
                                type: this._mapGtfsRouteTypeToApi(route_type),
                                color: `#${route_color}` || this._getDefaultRouteColor(route_id),
                                text_color: `#${route_text_color}` || '#ffffff',
                                sort_order: ((n) => isNaN(n) ? undefined : n)(Number(route_sort_order)),
                            })),
                        });
                    });
                    break;
                case 'shapes.txt':
                    const pointsByShape: {
                        [k in string]: {
                            latitude: number;
                            longitude: number;
                            sequence: number;
                            dist_traveled?: number;
                            shape_id: string;
                        }[];
                    } = {};
                    await this._consumeCsv(file, async (shapePoints: Gtfs.Schedule.ShapePoint[]) => {
                        shapePoints.forEach(({ shape_id, shape_pt_lat, shape_pt_lon, shape_pt_sequence, shape_dist_traveled }) => {
                            pointsByShape[shape_id] = pointsByShape[shape_id] || [];
                            pointsByShape[shape_id].push({
                                latitude: Number(shape_pt_lat),
                                longitude: Number(shape_pt_lon),
                                sequence: Number(shape_pt_sequence),
                                dist_traveled: shape_dist_traveled && Number(shape_dist_traveled),
                                shape_id,
                            });
                        });
                    });
                    const { count: shapeCount } = await prisma.shape.createMany({ data: Object.keys(pointsByShape).map(id => ({ id })) });
                    console.log(shapeCount, 'shapes');
                    const { count: shapePointCount } = await prisma.shapePoint.createMany({
                        data: Object.entries(pointsByShape)
                            .map(([shape_id, points]) => geometry.reducePolyLine({
                                points: points.sort(({ sequence: a }, { sequence: b }) => a - b),
                                x: 'longitude', y: 'latitude',
                                iterations: 10,
                                tolerance: 6e-5, // ~6.7m N/S, ~4.9m E/W, see: https://www.omnicalculator.com/other/latitude-longitude-distance
                            }).map(({ longitude, latitude, sequence, dist_traveled }) => ({
                                latitude,
                                longitude,
                                sequence,
                                dist_traveled,
                                shape_id,
                            }))
                            ).flat(),
                    });
                    console.log(shapePointCount, 'shape points');
                    break;
                case 'stops.txt':
                    await this._consumeCsv(file, async (stops: Gtfs.Schedule.Stop[]) => {
                        await prisma.platform.createMany({
                            data: stops
                                .map(({ stop_id, stop_lat, stop_lon, stop_name, stop_code }): PlatformCreateManyInput => ({
                                    id: stop_id,
                                    latitude: Number(stop_lat),
                                    longitude: Number(stop_lon),
                                    name: this._toTitleCase(stop_name!),
                                    code: stop_code || null,
                                })),
                        });
                    });
                    break;
                case 'trips.txt':
                    await this._consumeCsv(file, async (trips: Gtfs.Schedule.Trip[]) => {
                        trips.forEach(trip => {
                            if (tripStopCountLookup[trip.route_id] === undefined) {
                                tripStopCountLookup[trip.route_id] = {
                                    '0': {},
                                    '1': {},
                                };
                            }
                            tripStopCountLookup[trip.route_id][trip.direction_id || '0'][trip.trip_id] = 0;
                            routeAndDirectionByTripId[trip.trip_id] = [trip.route_id, trip.direction_id || '0'];
                            tripShapeLookup[trip.trip_id] = trip.shape_id!;
                        });
                    });
                    break;
                case 'stop_times.txt':

                    console.log('counting stops by trip...');
                    await this._consumeCsv(file, async (stopTimes: Gtfs.Schedule.StopTime[]) => {
                        stopTimes.forEach(({ trip_id }) => {
                            const [route_id, direction] = routeAndDirectionByTripId[trip_id];
                            tripStopCountLookup[route_id][direction][trip_id]++;
                        });
                    });
                    console.log('done');

                    console.log('selecting maximal trips...');
                    const trip_ids_to_keep: string[] = [];
                    Object.entries(tripStopCountLookup).forEach(([route_id, lookupByDirection]) => {
                        Object.entries(lookupByDirection).forEach(([direction, counts]) => {
                            console.log(route_id, direction);
                            const [trip_id] = Object.entries(counts).reduce(
                                ([max_trip_id, max_count], [trip_id, count]) => {
                                    if (count > max_count) {
                                        console.log('new max:', count);
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
                    await this._consumeCsv(file, async (stopTimes: Gtfs.Schedule.StopTime[]) => {
                        const { count } = await prisma.routeStop.createMany({
                            data: stopTimes.filter(({ trip_id }) => trip_ids_to_keep.includes(trip_id))
                                .map(({ stop_id, stop_sequence, trip_id, shape_dist_traveled }): RouteStopCreateManyInput => {
                                    const [route_id, direction] = routeAndDirectionByTripId[trip_id];
                                    return {
                                        route_id,
                                        direction: Number(direction),
                                        platform_id: stop_id,
                                        sequence: Number(stop_sequence),
                                        distance_along_shape: Number(shape_dist_traveled),
                                    };
                                }),
                        });
                        console.log(count, 'route stops');
                    });
                    console.log('done');

                    break;
            }
        }
        console.log('generating stations...');
        await this._generateStations();
        console.log('done')
        console.log('loaded GTFS in', Math.round((Date.now() - start) / 100) / 10, 'seconds');
        let totalRows = 0;
        for (let k of tables) {
            // @ts-expect-error -- signatures of count on each table don't match, but they all have no-arg signatures
            const count = await prisma[k].count();
            totalRows += count;
            console.log(`${String(k)}:`, count, 'rows');
        }
        console.log('total:', totalRows, 'rows');
    }

    private async _loadGtfsRtProtoDefs() {
        const protoRes = await fetch(this.gtfsProtoFileUrl);
        let protoFile = "";
        await protoRes.body!.pipeTo(new WritableStream({
            write(chunk) {
                protoFile += Buffer.from(chunk).toString('utf8');
            },
        }));
        this.gtfsRealtime = protobufjs.parse(protoFile, { keepCase: true }).root.lookupType('FeedMessage');
    }

    private async _generateStations() {
        const stationPlatforms = await prisma.platform.findMany({
            select: {
                id: true,
                name: true,
                latitude: true,
                longitude: true,
                route_stops: {
                    select: {
                        route: {
                            select: {
                                shape: {
                                    select: {
                                        id: true,
                                        shape_points: {
                                            select: {
                                                latitude: true,
                                                longitude: true,
                                            },
                                            orderBy: { sequence: 'asc' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    where: {
                        route: {
                            shape_id: { not: null },
                            // type: { in: [RouteType.SubwayMetro, RouteType.TramStreetcarLightRail] },
                            id: { in: this.lineIds },
                        },
                    },
                },
            },
            where: {
                OR: [{
                    AND: [{
                        name: { contains: 'Station' },
                    }, {
                        name: { contains: 'Platform' },
                    }],
                }, {
                    // Special handling for York University Station (names do not include "Station")
                    AND: [{
                        name: { startsWith: 'York University' }
                    }, {
                        name: { contains: 'Platform' },
                    }],
                }],
            },
            orderBy: {
                name: 'asc',
            },
        });
        const stationMap: {
            [k in string]: {
                name: string;
                children: (typeof stationPlatforms[0])[];
            };
        } = {};
        stationPlatforms.forEach(p => {
            // Special handling for York University Station (see above)
            let stationName = (p.name.match(/(.*Station)/i) || p.name.match(/(York University)/))![1];
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
        const anchors: StationAnchorCreateManyInput[] = [];
        const stations = Object.entries(stationMap).map(([station_id, { name, children }]) => {
            const average = { latitude: 0, longitude: 0 };
            children.forEach(p => {
                average.latitude += p.latitude / children.length;
                average.longitude += p.longitude / children.length;
            });
            const shapes: {
                [k in string]: NonNullable<typeof stationPlatforms[0]['route_stops'][0]['route']['shape']>;
            } = {};
            children.forEach(({ route_stops }) =>
                route_stops.forEach(({ route: { shape } }) => {
                    if (shape && !(shape.id in shapes)) {
                        shapes[shape.id] = shape;
                    }
                }),
            );
            const interpolationFactorsPerShape: {
                [k in string]: number;
            } = {};
            console.log('found', Object.keys(shapes).length, 'shapes for', name, '-', Object.keys(shapes));
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
                            shape.shape_points.map(({ latitude, longitude }) => [longitude, latitude]),
                        )!;
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
            anchors.push(...Object.entries(interpolationFactorsPerShape).map(([shape_id, interpolationFactor]) => ({
                interpolationFactor,
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

    private async _consumeCsv<T extends { [k in keyof T]: string }>(file: unzipper.File, store: (rows: T[]) => Promise<void>) {
        const kB = file.uncompressedSize / 1024;
        const MB = kB / 1024;
        console.log(`${file.path} (${(MB < 1 ? `${kB.toFixed(1)} kB` : `${MB.toFixed(1)} MB`)})`);
        const parser = parse();
        let keys: (keyof T)[] | undefined;
        let rows: T[] = [];
        const batchSize = 100000;
        let count = 0;
        const consumer = new Writable({
            async write(rec: string[], _, cb) {
                if (keys === undefined) {
                    keys = rec as (keyof T)[];
                } else {
                    const row = {} as Record<keyof T, string>;
                    keys.forEach((k, i) => row[k] = rec[i]);
                    rows.push(row as T);
                    if (rows.length >= batchSize) {
                        count += rows.length;
                        await store(rows);
                        rows = [];
                    }
                }
                cb();
            },
            objectMode: true,
            async final(cb) {
                count += rows.length;
                await store(rows);
                cb();
            }
        });
        await pipeline(file.stream(), parser, consumer);
    }

    private _toTitleCase(name: string): string {
        const noCap = ['a', 'an', 'and', 'at', 'of', 'the', 'to'];
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

    private _mapGtfsDirectionToApi(direction: undefined): undefined;
    private _mapGtfsDirectionToApi(direction: Gtfs.Schedule.Direction): Direction;
    private _mapGtfsDirectionToApi(direction: Gtfs.Schedule.Direction | undefined): Direction | undefined;
    private _mapGtfsDirectionToApi(direction: Gtfs.Schedule.Direction | undefined): Direction | undefined {
        switch (direction) {
            case '0': return 0;
            case '1': return 1;
            default: return undefined;
        }
    }

    private _mapGtfsRouteTypeToApi(routeType: Gtfs.Schedule.RouteType): RouteType {
        switch (routeType) {
            case Gtfs.Schedule.RouteType.TramStreetcarLightRail:
                return RouteType.TramStreetcarLightRail;
            case Gtfs.Schedule.RouteType.SubwayMetro:
                return RouteType.SubwayMetro;
            case Gtfs.Schedule.RouteType.Rail:
                return RouteType.Rail;
            case Gtfs.Schedule.RouteType.Bus:
                return RouteType.Bus;
            default:
                throw new Error(`Route Type not supported: ${routeType}`);
        }
    }

    private _getDefaultRouteColor(id: string): string {
        switch (id) {
            case '1': return '#f8c300';
            case '2': return '#00923f';
            case '4': return '#a21a68';
            case '6': return '#969594';
            default: return '#da251d';
        }
    }

    private _toEnglish(ts: undefined): undefined;
    private _toEnglish(ts: Gtfs.Realtime.TranslatedString): string;
    private _toEnglish(ts: Gtfs.Realtime.TranslatedString | undefined): string | undefined;
    private _toEnglish(ts: Gtfs.Realtime.TranslatedString | undefined): string | undefined {
        return ts
            ? ts.translation.find(({ language }) => !language || language === 'en')!.text
            : undefined;
    }

    private _mapGtfsEffectToApi(effect: undefined): undefined;
    private _mapGtfsEffectToApi(effect: Gtfs.Realtime.Effect): Alert.Effect;
    private _mapGtfsEffectToApi(effect: Gtfs.Realtime.Effect | undefined): Alert.Effect | undefined;
    private _mapGtfsEffectToApi(effect: Gtfs.Realtime.Effect | undefined): Alert.Effect | undefined {
        if (effect) {
            return Alert.Effect[Object.keys(Gtfs.Realtime.Effect)
                .find(k => Gtfs.Realtime.Effect[k as keyof typeof Gtfs.Realtime.Effect] === effect) as keyof typeof Alert.Effect];
        } else {
            return undefined;
        }
    }
};
