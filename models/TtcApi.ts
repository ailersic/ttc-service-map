import { parse } from 'csv-parse';
import unzipper from 'unzipper';
import Gtfs from './Gtfs.ts';
import prisma from '../prisma/prisma.js';
import { PlatformCreateManyInput, RouteCreateManyInput, ServiceCreateManyInput, ServiceUpdateManyMutationInput, StationCreateManyInput, TripCreateManyInput, TripStopCreateManyInput } from '../prisma/generated/models.ts';
import { RouteType } from '../prisma/generated/client.ts';
import { pipeline } from 'stream/promises';
import { Writable } from 'stream';

export type SubwayPlatformCollection = Awaited<ReturnType<TtcApi['getSubwayPlatforms']>>;
export type SubwayRouteCollection = Awaited<ReturnType<TtcApi['getSubwayRoutes']>>;

export default class TtcApi {
    private readonly baseUrl = 'https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action';

    private loadGtfsStaticPromise: Promise<void> | null = null;

    constructor() { }

    async getSubwayPlatforms() {
        return prisma.platform.findMany({
            where: {
                trip_stops: {
                    some: {
                        trip: {
                            route: {
                                type: RouteType.SubwayMetro,
                            },
                        },
                    },
                },
            },
            orderBy: {
                id: 'asc',
            },
            omit: {
                parent_station_id: true,
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
                short_name: true,
                long_name: true,
                color: true,
                trips: {
                    select: {
                        headsign: true,
                        direction: true,
                        trip_stops: {
                            select: {
                                platform_id: true,
                            },
                            orderBy: {
                                sequence: 'asc',
                            },
                        },
                    },
                    distinct: 'direction',
                    orderBy: {
                        trip_stops: {
                            _count: 'desc',
                        },
                    },
                },
            },
        }).then(result => {
            return result.map(r => ({
                ...r,
                trips: r.trips.map(t => ({
                    ...t,
                    trip_stops: t.trip_stops.map(({ platform_id }) => platform_id),
                })),
            }));
        });
    }

    loadGtfsStatic() {
        return this.loadGtfsStaticPromise = this._loadGtfsStatic().then(() => { this.loadGtfsStaticPromise = null });
    }

    getGtfsStaticPromise() {
        return this.loadGtfsStaticPromise;
    }

    private async _loadGtfsStatic() {
        const res = await fetch(`${this.baseUrl}/package_show?id=ttc-routes-and-schedules`);
        const data = await res.json();
        const lastRefreshed = new Date(data.result.last_refreshed as string);
        console.log('last refreshed:', lastRefreshed);
        const agency = await prisma.agency.findFirst();
        if (agency && agency.lastUpdatedAt > lastRefreshed) {
            console.log(agency.name, 'already up to date');
            return;
        }
        const zipUrl = data.result.resources[0].url as string;
        const zipRes = await fetch(zipUrl);
        const buffer = await zipRes.arrayBuffer();
        const dir = await unzipper.Open.buffer(Buffer.from(buffer));
        console.log('records:', dir.numberOfRecords);
        console.log(dir.files.map(file => file.path));
        // It's faster to just wipe the db and recreate everything
        const tables = ['tripStop', 'trip', 'shape', 'service', 'route', 'platform', 'station'] as const;
        for (let k of tables) {
            console.log('delete', k);
            // @ts-expect-error -- signatures of deleteMany on each table don't match, but they all have no-arg signatures
            await prisma[k].deleteMany();
        }
        const loadOrder = [
            'agency.txt',
            'calendar.txt',
            'calendar_dates.txt',
            'routes.txt',
            'shapes.txt',
            'stops.txt',
            'trips.txt',
            'stop_times.txt'
        ];
        for (let file of dir.files.sort((a, b) => loadOrder.indexOf(a.path) - loadOrder.indexOf(b.path))) {
            switch (file.path) {
                case 'agency.txt':
                    await this._consumeCsv(file, async ([{
                        agency_id: id,
                        agency_name: name,
                        agency_url: url
                    }]: Gtfs.Agency[]) => {
                        await prisma.agency.upsert({
                            create: { id, name, url },
                            update: { name, url, lastUpdatedAt: new Date() },
                            where: { id },
                        })
                    });
                    break;
                case 'calendar.txt':
                    await this._consumeCsv(file, async (calendarServices: Gtfs.CalendarService[]) => {
                        console.log('GTFS calendar services:', calendarServices.length);
                        await prisma.service.createMany({
                            data: calendarServices.map(({ service_id }): ServiceCreateManyInput => ({
                                id: service_id,
                            })),
                        });
                    });
                    break;
                case 'calendar_dates.txt':
                    await this._consumeCsv(file, async (calendarServiceExceptions: Gtfs.CalendarServiceException[]) => {
                        console.log('GTFS calendar service exceptions:', calendarServiceExceptions.length);
                        // await prisma.service.updateMany({
                        //     data: calendarServiceExceptions.map(({ service_id }): ServiceUpdateManyMutationInput => ({
                        //         id: service_id,
                        //     })),
                        // });
                    });
                    break;
                case 'routes.txt':
                    await this._consumeCsv(file, async (routes: Gtfs.Route[]) => {
                        console.log('GTFS routes:', routes.length);
                        await prisma.route.createMany({
                            data: routes.map(({ route_id, route_long_name, route_short_name, route_type, route_color }): RouteCreateManyInput => ({
                                id: route_id,
                                long_name: route_long_name,
                                short_name: route_short_name,
                                type: this._mapGtfsRouteTypeToApi(route_type),
                                color: route_color || this._getDefaultRouteColor(route_id),
                            })),
                        });
                    });
                    break;
                case 'shapes.txt':
                    // TODO
                    break;
                case 'stops.txt':
                    // TODO: infer stations from platform names
                    await this._consumeCsv(file, async (stops: Gtfs.Stop[]) => {
                        console.log('GTFS stops:', stops.length);
                        ['', ...Object.values(Gtfs.LocationType).filter(lt => !isNaN(Number(lt)))]
                            .forEach(
                                lt => console.log(`  Type ${lt || 'unspecified'}:`, stops.filter(
                                    ({ location_type }) => location_type === lt
                                ).length),
                            );
                        console.log('\tChildren', stops.filter(({ parent_station }) => parent_station).length);
                        await prisma.station.createMany({
                            data: stops
                                .filter(({ location_type }) => (location_type || Gtfs.LocationType.Platform) === Gtfs.LocationType.Station)
                                .map(({ stop_id, stop_lat, stop_lon, stop_name, stop_code }): StationCreateManyInput => ({
                                    id: stop_id,
                                    latitude: Number(stop_lat),
                                    longitude: Number(stop_lon),
                                    name: stop_name,
                                    code: stop_code || null,
                                })),
                        });
                        await prisma.platform.createMany({
                            data: stops
                                .filter(({ location_type }) => (location_type || Gtfs.LocationType.Platform) === Gtfs.LocationType.Platform)
                                .map(({ stop_id, stop_lat, stop_lon, parent_station, stop_name, stop_code }): PlatformCreateManyInput => ({
                                    id: stop_id,
                                    latitude: Number(stop_lat),
                                    longitude: Number(stop_lon),
                                    name: stop_name,
                                    code: stop_code || null,
                                    parent_station_id: parent_station || null,
                                })),
                        });
                    });
                    break;
                case 'stop_times.txt':
                    await this._consumeCsv(file, async (stopTimes: Gtfs.StopTime[]) => {
                        console.log('GTFS stop times:', stopTimes.length);
                        await prisma.tripStop.createMany({
                            data: stopTimes.map(({ stop_id, stop_sequence, trip_id }): TripStopCreateManyInput => ({
                                trip_id,
                                platform_id: stop_id,
                                sequence: Number(stop_sequence),
                            })),
                        });
                    });
                    break;
                case 'trips.txt':
                    await this._consumeCsv(file, async (trips: Gtfs.Trip[]) => {
                        console.log('GTFS trips:', trips.length);
                        await prisma.trip.createMany({
                            data: trips.map(({ route_id, service_id, trip_id, direction_id, shape_id, trip_headsign, trip_short_name }): TripCreateManyInput => ({
                                id: trip_id,
                                route_id,
                                service_id,
                                direction: Number(direction_id),
                                headsign: trip_headsign,
                                // shape_id: shape_id || null, TODO
                                shape_id: null,
                                short_name: trip_short_name,
                            })),
                        });
                    });
                    break;
            }
        }
        console.log('done');
    }
    
    private async _consumeCsv(file: unzipper.File, store: (rows: {}[]) => Promise<void>) {
        console.log(`${file.path} (${(file.uncompressedSize / 1024 / 1024).toFixed(1)} MB)`);
        const parser = parse();
        let keys: string[] | undefined;
        let rows: {}[] = [];
        const batchSize = 100000;
        let count = 0;
        const consumer = new Writable({
            async write(rec: string[], _, cb) {
                if (keys === undefined) {
                    keys = rec;
                } else {
                    const row = {};
                    keys.forEach((k, i) => row[k] = rec[i]);
                    rows.push(row);
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

    private _mapGtfsRouteTypeToApi(routeType: Gtfs.RouteType): RouteType {
        switch (routeType) {
            case Gtfs.RouteType.TramStreetcarLightRail:
                return RouteType.TramStreetcarLightRail;
            case Gtfs.RouteType.SubwayMetro:
                return RouteType.SubwayMetro;
            case Gtfs.RouteType.Rail:
                return RouteType.Rail;
            case Gtfs.RouteType.Bus:
                return RouteType.Bus;
            default:
                throw new Error(`Route Type not supported: ${Gtfs.RouteType[routeType]}`);
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
};
