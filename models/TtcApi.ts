import { parse } from 'csv-parse';
import { Writable } from 'stream';
import { pipeline } from 'stream/promises';
import unzipper from 'unzipper';
import geometry from '../utils/geometry.ts';
import Gtfs from './Gtfs.ts';
import { RouteType, Prisma, PrismaClient } from '@prisma/client';
import { transit_realtime } from '../generated/gtfs-realtime.js';

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
    private readonly gtfsAlertUrl = 'https://gtfsrt.ttc.ca/alerts/all?format=binary';

    private readonly lineIds = ['1', '2', '3', '4', '5', '6'];

    private loadGtfsPromise: Promise<void> | null = null;
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async getSubwayPlatforms() {
        return this.prisma.platform.findMany({
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
        return this.prisma.station.findMany({
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
        return this.prisma.route.findMany({
            where: { id: { in: this.lineIds } },
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
                                                interpolation_factor: true,
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
                        station_anchors: {
                            select: {
                                interpolation_factor: true,
                                station: {
                                    select: {
                                        latitude: true,
                                        longitude: true,
                                    },
                                },
                            },
                            orderBy: { interpolation_factor: 'desc' },
                        },
                    },
                },
            },
        }).then(result => {
            return result.map(({ id, short_name, long_name, color, route_stops, shape }) => {
                const points = [...shape!.shape_points];
                // Insert stations as points so the shape doesn't drift away
                shape!.station_anchors.forEach(({ interpolation_factor, station: { latitude, longitude } }) => {
                    if (interpolation_factor % 1 !== 0) {
                        points.splice(Math.ceil(interpolation_factor), 0, { latitude, longitude });
                    }
                });
                return {
                    id, short_name, long_name, color,
                    stops: route_stops.map(({ platform }) => platform.id),
                    segments: route_stops.reduce((segments, { platform }, i, a) => {
                        const thisAnchor = platform.parent_station?.anchors
                            .find(({ shape_id }) => shape_id === shape?.id)?.interpolation_factor!;
                        if (i > 0) {
                            const prevAnchor = a[i - 1].platform.parent_station?.anchors
                                .find(({ shape_id }) => shape_id === shape?.id)?.interpolation_factor!;
                            segments.push(
                                geometry.reducePolyLine({
                                    points: geometry.smoothenPolyLine(
                                        geometry.slicePolyLine(
                                            shape!.shape_points.map(({ latitude, longitude }) => [longitude, latitude]),
                                            prevAnchor,
                                            thisAnchor,
                                        ),
                                        1e-4,
                                    ),
                                    tolerance: 1e-6,
                                }).map(([longitude, latitude]) => ({ latitude, longitude })),
                            );
                        }
                        return segments;
                    }, [] as { latitude: number, longitude: number }[][]),
                    shape: geometry.reducePolyLine({
                        points: geometry.smoothenPolyLine(
                            points.map(({ latitude, longitude }) => [longitude, latitude]),
                            1e-4,
                        ),
                        tolerance: 1e-6,
                    }).map(([longitude, latitude]) => ({ latitude, longitude })),
                };
            });
        });
    }

    // TODO: Since this can take a few minutes, we should consider responding with 503
    //       and a Retry-After of 5 minutes if reloading GTFS schedule data is needed.
    //       The client could handle this pretty easily.
    // see: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/503
    safeLoadGtfs(forceReload: boolean = false) {
        return this.loadGtfsPromise || (
            this.loadGtfsPromise = this._loadGtfs(forceReload)
                .then(() => { this.loadGtfsPromise = null })
        );
    }

    getGtfsStaticPromise() {
        return this.loadGtfsPromise;
    }

    async regenerateStations() {
        await this.prisma.platform.updateMany({ data: { parent_station_id: { set: null } } });
        await this.prisma.stationAnchor.deleteMany();
        await this.prisma.station.deleteMany();
        await this._generateStations();
    }

    async getAlerts(): Promise<AlertCollection> {
        // This fetch is pretty slow, >2 seconds, and no clear way to speed it up.
        // Client should not wait for this before rendering.
        const feedRes = await fetch(this.gtfsAlertUrl);
        const feedReader = feedRes.body!.getReader();
        const chunks = [];
        while (true) {
            const { value, done } = await feedReader.read();
            if (done) {
                break;
            }
            chunks.push(value);
        }
        const feed = new Uint8Array(chunks.reduce((total, { byteLength }) => total + byteLength, 0));
        let offset = 0;
        chunks.forEach(c => {
            feed.set(c, offset);
            offset += c.byteLength;
        });
        const feedMessage = transit_realtime.FeedMessage.decode(feed);
        const result = {
            timestamp: Number(feedMessage.header.timestamp) * 1000, // seconds to ms
            alerts: (await Promise.all(
                feedMessage.entity
                    .map(async ({ id, alert }) => {

                        // discard feed entities without an alert
                        if (!alert) return null;

                        const {
                            active_period,
                            header_text,
                            description_text,
                            informed_entity,
                        } = alert;

                        // const cause = alert.cause || transit_realtime.Alert.Cause.UNKNOWN_CAUSE;
                        const effect = alert.effect || transit_realtime.Alert.Effect.UNKNOWN_EFFECT;

                        // discard alerts that are not active
                        if (active_period && !active_period.some(({ start, end }) => (
                            (!start || Number(start) < Date.now()) &&
                            (!end || Number(end) > Date.now())
                        ))) return null;

                        return {
                            id,
                            header: this._toEnglish(header_text!),
                            description: this._toEnglish(description_text!),
                            effect: this._mapGtfsEffectToApi(effect),
                            criteria: informed_entity!
                                .filter(({ trip }) => !trip)
                                .map(({ direction_id, route_id, route_type, stop_id }) => ({
                                    direction: direction_id ? this._mapGtfsDirectionToApi(direction_id.toString() as Gtfs.Schedule.Direction) : undefined,
                                    route_id: route_id || undefined,
                                    route_type: route_type ? this._mapGtfsRouteTypeToApi(route_type.toString() as Gtfs.Schedule.RouteType) : undefined,
                                    platform_id: stop_id || undefined,
                                })),
                        };
                    }))
            ).filter((alert): alert is NonNullable<typeof alert> => !!alert),
        };
        return result;
    }

    private async _loadGtfs(forceReload: boolean) {
        const start = Date.now();
        const res = await fetch(this.gtfsPackageUrl + this.gtfsPackageId);
        const data = await res.json();
        const lastRefreshed = new Date(data.result.last_refreshed as string);
        console.log('last refreshed:', lastRefreshed.toLocaleDateString());
        if (!forceReload) {
            const agency = await this.prisma.agency.findFirst();
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
        const tables: (Exclude<keyof typeof this.prisma, `\$${string}` | symbol>)[] = [
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
            const delegate = this.prisma[k];
            await (delegate.deleteMany as () => Prisma.PrismaPromise<Prisma.BatchPayload>)();
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
                    await this._consumeAgency(file);
                    break;
                case 'calendar.txt':
                    await this._consumeCalendar(file);
                    break;
                case 'calendar_dates.txt':
                    break;
                case 'routes.txt':
                    await this._consumeRoutes(file);
                    break;
                case 'shapes.txt':
                    await this._consumeShapes(file);
                    break;
                case 'stops.txt':
                    await this._consumeStops(file);
                    break;
                case 'trips.txt':
                    await this._consumeTrips(file, tripStopCountLookup, routeAndDirectionByTripId, tripShapeLookup);
                    break;
                case 'stop_times.txt':
                    await this._consumeStopTimes(file, tripStopCountLookup, routeAndDirectionByTripId, tripShapeLookup);
                    break;
            }
        }

        console.log('generating stations...');
        await this._generateStations();
        console.log('done')

        console.log('loaded GTFS in', Math.round((Date.now() - start) / 100) / 10, 'seconds');
    }

    private async _consumeAgency(file: unzipper.File) {
        await this._consumeCsv(file, async ([{
            agency_id: id,
            agency_name: name,
            agency_url: url
        }]: Gtfs.Schedule.Agency[]) => {
            await this.prisma.agency.upsert({
                create: { id, name, url },
                update: { name, url, last_updated: new Date() },
                where: { id },
            })
        });
    }

    private async _consumeCalendar(file: unzipper.File) {
        await this._consumeCsv(file, async (calendarServices: Gtfs.Schedule.CalendarService[]) => {
            await this.prisma.service.createMany({
                data: calendarServices.map(({ service_id }): Prisma.ServiceCreateManyInput => ({
                    id: service_id,
                })),
            });
        });
    }

    private async _consumeRoutes(file: unzipper.File) {
        await this._consumeCsv(file, async (routes: Gtfs.Schedule.Route[]) => {
            await this.prisma.route.createMany({
                data: routes.map(({ route_id, route_long_name, route_short_name, route_type, route_color, route_text_color, route_sort_order }): Prisma.RouteCreateManyInput => ({
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
    }

    // SLOW
    private async _consumeShapes(file: unzipper.File) {
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
                (pointsByShape[shape_id] || (pointsByShape[shape_id] = [])).push({
                    latitude: Number(shape_pt_lat),
                    longitude: Number(shape_pt_lon),
                    sequence: Number(shape_pt_sequence),
                    dist_traveled: shape_dist_traveled && Number(shape_dist_traveled),
                    shape_id,
                });
            });
        });
        const { count: shapeCount } = await this.prisma.shape.createMany({ data: Object.keys(pointsByShape).map(id => ({ id })) });
        console.log(shapeCount, 'shapes');
        const { count: shapePointCount } = await this.prisma.shapePoint.createMany({
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
        console.log(shapePointCount, 'shape points');
    }

    // SLOW
    private async _consumeStops(file: unzipper.File) {
        await this._consumeCsv(file, async (stops: Gtfs.Schedule.Stop[]) => {
            await this.prisma.platform.createMany({
                data: stops
                    .map(({ stop_id, stop_lat, stop_lon, stop_name, stop_code }): Prisma.PlatformCreateManyInput => ({
                        id: stop_id,
                        latitude: Number(stop_lat),
                        longitude: Number(stop_lon),
                        name: this._toTitleCase(stop_name!),
                        code: stop_code || null,
                    })),
            });
        });
    }

    // SlOW
    private async _consumeTrips(
        file: unzipper.File,
        tripStopCountLookup: {
            // route_id
            [k in string]: {
                [k in Gtfs.Schedule.Direction]: {
                    // trip_id
                    [k in string]: number;
                };
            };
        },
        routeAndDirectionByTripId: {
            [k in string]: [string, Gtfs.Schedule.Direction];
        },
        tripShapeLookup: {
            // trip_id : shape_id
            [k in string]: string;
        },
    ) {
        await this._consumeCsv<Gtfs.Schedule.Trip>(file, async (trips) => {
            trips.forEach(({ route_id, trip_id, direction_id, shape_id }) => {
                if (tripStopCountLookup[route_id] === undefined) {
                    tripStopCountLookup[route_id] = {
                        '0': {},
                        '1': {},
                    };
                }
                tripStopCountLookup[route_id][direction_id || '0'][trip_id] = 0;
                routeAndDirectionByTripId[trip_id] = [route_id, direction_id || '0'];
                tripShapeLookup[trip_id] = shape_id!;
            });
        });
    }

    // SlOW
    private async _consumeStopTimes(
        file: unzipper.File,
        tripStopCountLookup: {
            // route_id
            [k in string]: {
                [k in Gtfs.Schedule.Direction]: {
                    // trip_id
                    [k in string]: number;
                };
            };
        },
        routeAndDirectionByTripId: {
            [k in string]: [string, Gtfs.Schedule.Direction];
        },
        tripShapeLookup: {
            // trip_id : shape_id
            [k in string]: string;
        },
    ) {
        console.log('counting stops by trip...');
        await this._consumeCsv<Gtfs.Schedule.StopTime>(file, stopTimes => {
            stopTimes.forEach(row => {
                const trip_id = row.trip_id;
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
            await this.prisma.route.update(args);
        }
        console.log('done');

        console.log('creating RouteStop...');
        const keepIdLookup: { [k in string]?: boolean } = {};
        trip_ids_to_keep.forEach(trip_id => keepIdLookup[trip_id] = true);
        let data: Prisma.RouteStopCreateManyInput[] = [];
        await this._consumeCsv<Gtfs.Schedule.StopTime>(file, async (stopTimes) => {
            data = data.concat(stopTimes
                .filter(row => keepIdLookup[row.trip_id])
                .map(row => {
                    const [route_id, direction] = routeAndDirectionByTripId[row.trip_id];
                    return {
                        route_id,
                        direction: Number(direction),
                        platform_id: row.stop_id,
                        sequence: Number(row.stop_sequence),
                        distance_along_shape: Number(row.shape_dist_traveled!),
                    };
                }));
        });
        console.log(data.length, 'route stops');
        await this.prisma.routeStop.createMany({ data });
        console.log('done');
    }

    private async _generateStations() {
        const stationPlatforms = await this.prisma.platform.findMany({
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
        const anchors: Prisma.StationAnchorCreateManyInput[] = [];
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
            // console.log('found', Object.keys(shapes).length, 'shapes for', name, '-', Object.keys(shapes));
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
        await this.prisma.station.createMany({ data: stations });
        await this.prisma.stationAnchor.createMany({ data: anchors });
        await Promise.all(stations.map(({ id: station_id }) => this.prisma.platform.updateMany({
            where: { id: { in: stationMap[station_id].children.map(({ id }) => id) } },
            data: { parent_station_id: { set: station_id } },
        })));
    }

    private async _consumeCsv<T extends { [k in keyof T]?: string }>(
        file: unzipper.File,
        store: (rows: T[]) => void | Promise<void>,
    ) {
        const kB = file.uncompressedSize / 1024;
        const MB = kB / 1024;
        console.log(`${file.path} (${(MB < 1 ? `${kB.toFixed(1)} kB` : `${MB.toFixed(1)} MB`)})`);
        const start = Date.now();
        const parser = parse();
        let keys: (keyof T)[] | undefined;
        let rows: T[] = [];
        const batchSize = 100000;
        const consumer = new Writable({
            async write(rec: string[], _, cb) {
                if (keys === undefined) {
                    keys = rec as (keyof T)[];
                } else {
                    const row = {} as Record<keyof T, string>;
                    keys.forEach((k, i) => row[k] = rec[i]);
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
        await pipeline(file.stream(), parser, consumer);
        console.log(`${file.path} read in ${((Date.now() - start) / 1000).toFixed(1)} seconds`);
    }

    private _toTitleCase(name: string): string {
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
    private _toEnglish(ts: transit_realtime.ITranslatedString): string;
    private _toEnglish(ts: transit_realtime.ITranslatedString | undefined): string | undefined;
    private _toEnglish(ts: transit_realtime.ITranslatedString | undefined): string | undefined {
        return ts && ts.translation
            ? ts.translation.find(({ language }) => !language || language === 'en')!.text
            : undefined;
    }

    private _mapGtfsEffectToApi(effect: undefined): undefined;
    private _mapGtfsEffectToApi(effect: transit_realtime.Alert.Effect): Alert.Effect;
    private _mapGtfsEffectToApi(effect: transit_realtime.Alert.Effect | undefined): Alert.Effect | undefined;
    private _mapGtfsEffectToApi(effect: transit_realtime.Alert.Effect | undefined): Alert.Effect | undefined {
        switch (effect) {
            case transit_realtime.Alert.Effect.NO_SERVICE:
                return Alert.Effect.NoService;
            case transit_realtime.Alert.Effect.REDUCED_SERVICE:
                return Alert.Effect.ReducedService;
            case transit_realtime.Alert.Effect.SIGNIFICANT_DELAYS:
                return Alert.Effect.SignificantDelay;
            case transit_realtime.Alert.Effect.DETOUR:
                return Alert.Effect.Detour;
            case transit_realtime.Alert.Effect.ADDITIONAL_SERVICE:
                return Alert.Effect.AdditionalService;
            case transit_realtime.Alert.Effect.MODIFIED_SERVICE:
                return Alert.Effect.ModifiedService;
            case transit_realtime.Alert.Effect.OTHER_EFFECT:
                return Alert.Effect.Other;
            case transit_realtime.Alert.Effect.UNKNOWN_EFFECT:
                return Alert.Effect.Unknown;
            case transit_realtime.Alert.Effect.STOP_MOVED:
                return Alert.Effect.StopMoved;
            case transit_realtime.Alert.Effect.NO_EFFECT:
                return Alert.Effect.None;
            case transit_realtime.Alert.Effect.ACCESSIBILITY_ISSUE:
                return Alert.Effect.AccessibilityIssue;
            default:
                return undefined;
        }
    }
};
