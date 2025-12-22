import { parse } from 'csv-parse';
import unzipper from 'unzipper';
import Gtfs from './Gtfs.ts';
import prisma from '../prisma/prisma.js';
import {
    PlatformCreateManyInput,
    RouteCreateManyInput,
    ServiceCreateManyInput,
    ShapePointCreateManyInput,
    StationCreateManyInput,
    TripCreateManyInput,
    TripStopCreateManyInput,
} from '../prisma/generated/models.ts';
import { Platform, RouteType } from '../prisma/generated/client.ts';
import { pipeline } from 'stream/promises';
import { Writable } from 'stream';
import protobufjs from 'protobufjs';

export type Direction = 0 | 1;

export type SubwayPlatformCollection = Awaited<ReturnType<TtcApi['getSubwayPlatforms']>>;
export type SubwayStationCollection = Awaited<ReturnType<TtcApi['getSubwayStations']>>;
export type SubwayRouteCollection = Awaited<ReturnType<TtcApi['getSubwayRoutes']>>;

export interface AlertCollection {
    timestamp: number;
    alerts: Alert[];
};

export namespace Alert {

    // export enum Cause {
    //     Unknown = 'Unknown',
    //     Other = 'Other',
    //     Technical = 'Technical',
    //     Strike = 'Strike',
    //     Demonstration = 'Demonstration',
    //     Accident = 'Accident',
    //     Holiday = 'Holiday',
    //     Weather = 'Weather',
    //     Maintenance = 'Maintenance',
    //     Construction = 'Construction',
    //     Police = 'Police',
    //     Medical = 'Medical',
    // };

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
                type: RouteType.SubwayMetro,
            },
            select: {
                id: true,
                short_name: true,
                long_name: true,
                color: true,
                route_stops: {
                    select: {
                        direction: true,
                        sequence: true,
                        platform_id: true,
                    },
                },
                shape: {
                    select: {
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
                stops: route_stops
                    .sort((a, b) => a.sequence - b.sequence)
                    .reduce((stops, { direction, platform_id }) => {
                        stops[direction].push(platform_id);
                        return stops;
                    }, [[], []] as string[][]),
                shape: shape && shape.shape_points,
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
        await prisma.station.deleteMany();
        await this._generateStations();
    }

    async regenerateRouteStops() {
        await prisma.routeStop.deleteMany();
        await this._generateRouteStops();
    }

    async regenerateRouteShapes() {
        await this._generateRouteShapes();
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
            timestamp: Number(feedMessage.header.timestamp),
            alerts: (await Promise.all(
                feedMessage.entity
                    .map(async ({ id, alert }) => {

                        // discard feed entities without an alert
                        if (alert === undefined) return null;

                        const {
                            active_period,
                            cause_detail,
                            effect_detail,
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
                            // cause: this._mapGtfsCauseToApi(cause),
                            // cause_description: this._toEnglish(cause_detail),
                            effect: this._mapGtfsEffectToApi(effect),
                            // effect_description: this._toEnglish(effect_detail),
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
        console.log('records:', dir.numberOfRecords);
        console.log(dir.files.map(file => file.path));
        // It's faster to just wipe the db and recreate everything
        const tables: (keyof typeof prisma)[] = ['tripStop', 'trip', 'service', 'routeStop', 'route', 'shapePoint', 'shape', 'platform', 'station'];
        for (let k of tables) {
            console.log('delete', k);
            // @ts-expect-error -- signatures of deleteMany on each table don't match, but they all have no-arg signatures
            await prisma[k].deleteMany();
        }
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
                        console.log('GTFS calendar services:', calendarServices.length);
                        await prisma.service.createMany({
                            data: calendarServices.map(({ service_id }): ServiceCreateManyInput => ({
                                id: service_id,
                            })),
                        });
                    });
                    break;
                case 'calendar_dates.txt':
                    await this._consumeCsv(file, async (calendarServiceExceptions: Gtfs.Schedule.CalendarServiceException[]) => {
                        console.log('GTFS calendar service exceptions:', calendarServiceExceptions.length);
                        // await prisma.service.updateMany({
                        //     data: calendarServiceExceptions.map(({ service_id }): ServiceUpdateManyMutationInput => ({
                        //         id: service_id,
                        //     })),
                        // });
                    });
                    break;
                case 'routes.txt':
                    await this._consumeCsv(file, async (routes: Gtfs.Schedule.Route[]) => {
                        console.log('GTFS routes:', routes.length);
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
                    await this._consumeCsv(file, async (shapePoints: Gtfs.Schedule.ShapePoint[]) => {
                        console.log('GTFS shape points:', shapePoints.length);
                        const shapeIds = shapePoints
                            .map(({ shape_id }) => shape_id)
                            .sort()
                            .filter((id, i, a) => id !== a[i - 1]);
                        const existing = await prisma.shape.findMany({
                            select: { id: true },
                            where: { id: { in: shapeIds } },
                            orderBy: { id: 'asc' },
                        }).then(result => result.map(({ id }) => id));
                        await prisma.shape.createMany({
                            data: shapeIds.filter(id => !existing.includes(id)).map(id => ({ id })),
                        });
                        await prisma.shapePoint.createMany({
                            data: shapePoints.map(({ shape_id, shape_pt_lat, shape_pt_lon, shape_pt_sequence, shape_dist_traveled }): ShapePointCreateManyInput => ({
                                latitude: Number(shape_pt_lat),
                                longitude: Number(shape_pt_lon),
                                sequence: Number(shape_pt_sequence),
                                dist_traveled: shape_dist_traveled && Number(shape_dist_traveled),
                                shape_id,
                            })),
                        });
                    });
                    break;
                case 'stops.txt':
                    await this._consumeCsv(file, async (stops: Gtfs.Schedule.Stop[]) => {
                        console.log('GTFS stops:', stops.length);
                        ['', ...Object.values(Gtfs.Schedule.LocationType).filter(lt => !isNaN(Number(lt)))]
                            .forEach(
                                lt => console.log(`  Type ${lt || 'unspecified'}:`, stops.filter(
                                    ({ location_type }) => location_type === lt
                                ).length),
                            );
                        console.log('  Children', stops.filter(({ parent_station }) => parent_station).length);
                        await prisma.station.createMany({
                            data: stops
                                .filter(({ location_type }) => (location_type || Gtfs.Schedule.LocationType.Platform) === Gtfs.Schedule.LocationType.Station)
                                .map(({ stop_id, stop_lat, stop_lon, stop_name }): StationCreateManyInput => ({
                                    id: stop_id,
                                    latitude: Number(stop_lat),
                                    longitude: Number(stop_lon),
                                    name: stop_name!,
                                })),
                        });
                        await prisma.platform.createMany({
                            data: stops
                                .filter(({ location_type }) => (location_type || Gtfs.Schedule.LocationType.Platform) === Gtfs.Schedule.LocationType.Platform)
                                .map(({ stop_id, stop_lat, stop_lon, parent_station, stop_name, stop_code }): PlatformCreateManyInput => ({
                                    id: stop_id,
                                    latitude: Number(stop_lat),
                                    longitude: Number(stop_lon),
                                    name: this._toTitleCase(stop_name!),
                                    code: stop_code || null,
                                    parent_station_id: parent_station || null,
                                })),
                        });
                    });
                    break;
                case 'stop_times.txt':
                    await this._consumeCsv(file, async (stopTimes: Gtfs.Schedule.StopTime[]) => {
                        console.log('GTFS stop times:', stopTimes.length);
                        await prisma.tripStop.createMany({
                            data: stopTimes.map(({ stop_id, stop_sequence, trip_id, shape_dist_traveled }): TripStopCreateManyInput => ({
                                trip_id,
                                platform_id: stop_id,
                                sequence: Number(stop_sequence),
                                distance_along_shape: Number(shape_dist_traveled),
                            })),
                        });
                    });
                    break;
                case 'trips.txt':
                    await this._consumeCsv(file, async (trips: Gtfs.Schedule.Trip[]) => {
                        console.log('GTFS trips:', trips.length);
                        await prisma.trip.createMany({
                            data: trips.map(({ route_id, service_id, trip_id, direction_id, shape_id, trip_headsign, trip_short_name }): TripCreateManyInput => ({
                                id: trip_id,
                                route_id,
                                service_id,
                                direction: Number(direction_id),
                                headsign: trip_headsign,
                                shape_id: shape_id || null,
                                short_name: trip_short_name,
                            })),
                        });
                    });
                    break;
            }
        }
        console.log('generating route stops...');
        await this._generateRouteStops();
        console.log('generating route shapes...');
        await this._generateRouteShapes();
        console.log('generating stations...');
        await this._generateStations();
        console.log('done loading GTFS');
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
                                                dist_traveled: true,
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
                            type: { in: [RouteType.SubwayMetro, RouteType.TramStreetcarLightRail] },
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
        console.log('platforms:', stationPlatforms.map(({ name }) => name));
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
        const stations = Object.entries(stationMap).map(([id, { name, children }]) => {
            const pointsPerShape: {
                [k in string]: {
                    latitude: number;
                    longitude: number;
                    dist_traveled: number | null;
                }[];
            } = {};
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
            console.log('found', Object.keys(shapes).length, 'shapes for', name, '-', Object.keys(shapes));
            const far = {
                latitude: Infinity,
                longitude: Infinity,
                sqrDist: Infinity,
            };
            const current = { ...average };
            const delta = { latitude: Infinity, longitude: Infinity };
            // Converge onto nearest intersection of shapes
            // console.log(0, current);
            for (
                let it = 0;
                it < 100 && (delta.latitude > 1e-7 || delta.longitude > 1e-7);
                it++
            ) {
                const avgOnShapes = Object.values(shapes)
                    .reduce((avg, shape) => {
                        // TODO: try lerp between closest and second closest
                        const closestOnShape = shape.shape_points
                            .reduce((closest, { latitude, longitude }) => {
                                const sqrDist = Math.pow(latitude - current.latitude, 2) + Math.pow(longitude - current.longitude, 2);
                                if (sqrDist < closest.sqrDist) {
                                    closest.sqrDist = sqrDist;
                                    closest.latitude = latitude;
                                    closest.longitude = longitude;
                                }
                                return closest;
                            }, { ...far });
                        // console.log(Math.sqrt(closestOnShape.sqrDist));
                        avg.latitude += closestOnShape.latitude / Object.keys(shapes).length;
                        avg.longitude += closestOnShape.longitude / Object.keys(shapes).length;
                        return avg;
                    }, { latitude: 0, longitude: 0 });
                delta.latitude = Math.abs(avgOnShapes.latitude - current.latitude);
                delta.longitude = Math.abs(avgOnShapes.longitude - current.longitude);
                // console.log('delta:', delta);
                current.latitude = avgOnShapes.latitude;
                current.longitude = avgOnShapes.longitude;
                // console.log(it + 1, current);
            }
            const { latitude, longitude } = current;
            return { id, name, latitude, longitude };
        });
        stations.forEach(s => {
            const { latitude, longitude } = s;
            s.latitude = Math.round(latitude * 1e6) / 1e6;
            s.longitude = Math.round(longitude * 1e6) / 1e6;
        });
        await prisma.station.createMany({ data: stations });
        await Promise.all(stations.map(({ id: station_id }) => prisma.platform.updateMany({
            where: { id: { in: stationMap[station_id].children.map(({ id }) => id) } },
            data: { parent_station_id: { set: station_id } },
        })));
    }

    private async _generateRouteStops() {
        await prisma.routeStop.createMany({
            data: await prisma.trip.findMany({
                select: {
                    direction: true,
                    route_id: true,
                    trip_stops: {
                        select: {
                            platform_id: true,
                            sequence: true,
                        },
                        orderBy: {
                            sequence: 'asc',
                        },
                    },
                },
                distinct: ['direction', 'route_id'],
                orderBy: {
                    trip_stops: {
                        _count: 'desc',
                    },
                }
            }).then(result => result.map(({ direction, route_id, trip_stops }) =>
                trip_stops.map(({ platform_id, sequence }) => ({ direction: direction || 0, sequence, route_id, platform_id })),
            ).flat()),
        });
    }

    private async _generateRouteShapes() {
        await prisma.route.updateMany({ data: { shape_id: null } });
        await prisma.route.findMany({
            select: {
                id: true,
                trips: {
                    take: 1,
                    select: { shape_id: true },
                    where: {
                        AND: [
                            { shape_id: { not: null } },
                            { OR: [{ direction: 0 }, { direction: null }] },
                        ],
                    },
                    orderBy: { trip_stops: { _count: 'desc' } },
                },
            },
        }).then(result => Promise.all(
            result.map(({ id, trips: [trip] }) => prisma.route.update({
                where: { id },
                data: { shape_id: trip?.shape_id },
            })),
        ));
    }

    private async _consumeCsv<T extends { [k in keyof T]: string }>(file: unzipper.File, store: (rows: T[]) => Promise<void>) {
        console.log(`${file.path} (${(file.uncompressedSize / 1024 / 1024).toFixed(1)} MB)`);
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
                        console.log(count);
                        // console.log('store:', rows.length);
                        await store(rows);
                        rows = [];
                    }
                }
                cb();
            },
            objectMode: true,
            async final(cb) {
                count += rows.length;
                console.log(count);
                // console.log('store:', rows.length);
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

    // private _mapGtfsCauseToApi(cause: undefined): undefined;
    // private _mapGtfsCauseToApi(cause: Gtfs.Realtime.Cause): Alert.Cause;
    // private _mapGtfsCauseToApi(cause: Gtfs.Realtime.Cause | undefined): Alert.Cause | undefined;
    // private _mapGtfsCauseToApi(cause: Gtfs.Realtime.Cause | undefined): Alert.Cause | undefined {
    //     if (cause) {
    //         return Alert.Cause[Object.keys(Gtfs.Realtime.Cause)
    //             .find(k => Gtfs.Realtime.Cause[k as keyof typeof Gtfs.Realtime.Cause] === cause) as keyof typeof Alert.Cause];
    //     } else {
    //         return undefined;
    //     }
    // }

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
