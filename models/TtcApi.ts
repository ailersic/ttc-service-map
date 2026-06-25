import geometry from '../utils/geometry.ts';
import Gtfs from './Gtfs.ts';
import { RouteType, PrismaClient } from '../generated/prisma/client.ts';
import { transit_realtime } from '../generated/gtfs-realtime.js';
import Logger from '../utils/Logger.ts';
import Stopwatch from '../utils/Stopwatch.ts';

export enum Direction {
    Forward = 0,
    Backward = 1,
};

export type PlatformCollection = Awaited<ReturnType<TtcApi['getPlatforms']>>;
export type StationCollection = Awaited<ReturnType<TtcApi['getStations']>>;
export type RouteCollection = Awaited<ReturnType<TtcApi['getRoutes']>>;

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
    periods: { start: number, end: number }[];
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
    private readonly gtfsAlertUrls = {
        all: 'https://gtfsrt.ttc.ca/alerts/all?format=binary',
        subway: 'https://gtfsrt.ttc.ca/alerts/subway?format=binary',
        streetcar: 'https://gtfsrt.ttc.ca/alerts/streetcar?format=binary',
        bus: 'https://gtfsrt.ttc.ca/alerts/bus?format=binary',
        accessibility: 'https://gtfsrt.ttc.ca/alerts/accessibility?format=binary',
        stops: 'https://gtfsrt.ttc.ca/alerts/stops?format=binary',
    };

    private readonly lineIds = ['1', '2', '3', '4', '5', '6'];

    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async getPlatforms() {
        const sw = new Stopwatch();
        Logger.info('TtcApi.getPlatforms()');
        const result = await this.prisma.platform.findMany({
            where: { route_stops: { some: {} } },
            select: {
                id: true,
                name: true,
                latitude: true,
                longitude: true,
                parent_station_id: true,
            },
            orderBy: { id: 'asc' },
        });
        Logger.info('Loaded from DB in', sw.lap(), 'ms');
        const dict: {
            [k in string]: Omit<typeof result[0], 'id'>;
        } = {};
        result.forEach(({ id, ...rest }) => {
            dict[id] = rest;
        });
        Logger.info('Mapped to client format in', sw.lap(), 'ms');
        Logger.info('TtcApi.getPlatforms() completed in', sw.totalElapsed(), 'ms');
        return dict;
    }

    async getStations() {
        const sw = new Stopwatch();
        Logger.info('TtcApi.getStations()');
        const result = await this.prisma.station.findMany({
            include: {
                platforms: {
                    select: {
                        id: true,
                    },
                },
            },
            orderBy: { id: 'asc' },
        });
        Logger.info('Loaded from DB in', sw.lap(), 'ms');
        const dict: {
            [k in string]: Omit<typeof result[0], 'id' | 'platforms'> & { platform_ids: string[] };
        } = {};
        result.forEach(({ id, platforms, ...rest }) => {
            dict[id] = {
                platform_ids: platforms.map(({ id }) => id),
                ...rest,
            };
        });
        Logger.info('Mapped to client format in', sw.lap(), 'ms');
        Logger.info('TtcApi.getStations() completed in', sw.totalElapsed(), 'ms');
        return dict;
    }

    async getRoutes() {
        const sw = new Stopwatch();
        Logger.info('TtcApi.getRoutes()');
        const routes = await this.prisma.route.findMany({
            select: {
                id: true,
                short_name: true,
                long_name: true,
                color: true,
                text_color: true,
                type: true,
                forward_id: true,
                backward_id: true,
            },
            where: {
                stops: { some: {} },
            },
        });
        Logger.info('routes:', sw.lap(), 'ms');
        const stops = await this.prisma.routeStop.findMany({
            select: {
                direction: true,
                sequence: true,
                route_id: true,
                platform: {
                    select: {
                        id: true,
                        latitude: true,
                        longitude: true,
                        anchors: {
                            select: {
                                interpolation_factor: true,
                                polyline_id: true,
                            },
                        },
                    },
                },
            },
            orderBy: { sequence: 'asc' },
        });
        Logger.info('stops:', sw.lap(), 'ms');
        const stopLookup: { [k in string]: typeof stops } = {};
        stops.forEach(stop => (stopLookup[stop.route_id] = stopLookup[stop.route_id] || []).push(stop));
        Logger.info('post-proc stops:', sw.lap(), 'ms');
        const stopsWithStations = await this.prisma.routeStop.findMany({
            select: {
                route_id: true,
                platform: {
                    select: {
                        parent_station: {
                            select: {
                                anchors: {
                                    select: {
                                        interpolation_factor: true,
                                        polyline_id: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
            where: { AND: [{ direction: 0 }, { platform: { parent_station_id: { not: null } } }] },
            orderBy: { sequence: 'asc' },
        });
        Logger.info('stopsWithStations:', sw.lap(), 'ms');
        const stationLookup: { [k in string]?: NonNullable<(typeof stopsWithStations)[0]['platform']['parent_station']>[] } = {};
        stopsWithStations.forEach(stop => (stationLookup[stop.route_id] = stationLookup[stop.route_id] || []).push(stop.platform.parent_station!));
        Logger.info('post-proc stations:', sw.lap(), 'ms');
        const polyLines = await this.prisma.polyLine.findMany({
            where: {
                OR: [{
                    route_forward: { some: {} },
                }, {
                    route_backward: { some: {} },
                }],
            },
            select: {
                id: true,
                points: true,
            },
        });
        Logger.info('polylines:', sw.lap(), 'ms');
        const polyLineLookup: { [k in string]: geometry.LatLng[] } = {}
        polyLines.forEach(pl => polyLineLookup[pl.id] = pl.points.sort((a, b) => a.sequence - b.sequence));
        Logger.info('post-proc polylines:', sw.lap(), 'ms');
        const combined = routes.map(route => ({
            ...route,
            stops: stopLookup[route.id],
            stations: stationLookup[route.id],
            forward: (typeof route.forward_id === 'string' ? polyLineLookup[route.forward_id] : null),
            backward: (typeof route.backward_id === 'string' ? polyLineLookup[route.backward_id] : null),
        }));
        Logger.info('combine:', sw.lap(), 'ms');
        Logger.info('Loaded from DB in', sw.totalElapsed(), 'ms');
        const mapped = combined.map(({
            id, type, short_name, long_name, color, text_color,
            forward_id, backward_id, forward, backward, stops, stations,
        }) => {
            const forwardStops = stops.filter(({ direction }) => direction === Direction.Forward);
            const forwardInterpFactors = forwardStops.map(({ platform }) =>
                platform.anchors.find(({ polyline_id }) => forward_id === polyline_id)!.interpolation_factor);
            const forwardPoints = forward!.map(geometry.latLngToPoint);

            const backwardStops = stops.filter(({ direction }) => direction === Direction.Backward);
            const backwardInterpFactors = backwardStops.map(({ platform }) =>
                platform.anchors.find(({ polyline_id }) => backward_id === polyline_id)!.interpolation_factor);
            const backwardPoints = backward!.map(geometry.latLngToPoint);

            const stationInterpFactors = stations && stations.map(({ anchors }) =>
                anchors.find(({ polyline_id }) => polyline_id === forward_id)?.interpolation_factor)
                .filter(factor => typeof factor === 'number');

            return {
                id, type, short_name, long_name, color, text_color,
                stops: {
                    forward: forwardStops.map(({ platform }) => platform.id),
                    backward: backwardStops.map(({ platform }) => platform.id),
                },
                segments: {
                    forward: geometry.polyLineToSegments(forwardPoints, forwardInterpFactors, false)
                        .map(seg => seg.map(geometry.pointToLatLng)),
                    backward: geometry.polyLineToSegments(backwardPoints, backwardInterpFactors, false)
                        .map(seg => seg.map(geometry.pointToLatLng)),
                },
                station_segments: stationInterpFactors && geometry.polyLineToSegments(forwardPoints, stationInterpFactors, false)
                    .map(seg => seg.map(geometry.pointToLatLng)),
            };
        }).sort((a, b) => Number(a.id) - Number(b.id));
        Logger.info('Mapped to client format in', sw.lap(), 'ms');
        Logger.info('TtcApi.getRoutes() completed in', sw.totalElapsed(), 'ms');
        return mapped;
    }

    async getSubwayAlerts(): Promise<AlertCollection> {
        Logger.info('getSubwayAlerts()');
        return this._getAlerts(this.gtfsAlertUrls.subway);
    }

    async getStreetcarAlerts(): Promise<AlertCollection> {
        Logger.info('getSubwayAlerts()');
        return this._getAlerts(this.gtfsAlertUrls.streetcar);
    }

    async getBusAlerts(): Promise<AlertCollection> {
        Logger.info('getSubwayAlerts()');
        return this._getAlerts(this.gtfsAlertUrls.bus);
    }

    async getAccessibilityAlerts(): Promise<AlertCollection> {
        Logger.info('getSubwayAlerts()');
        return this._getAlerts(this.gtfsAlertUrls.accessibility);
    }

    async getStopAlerts(): Promise<AlertCollection> {
        Logger.info('getSubwayAlerts()');
        return this._getAlerts(this.gtfsAlertUrls.stops);
    }

    async getAllAlerts(): Promise<AlertCollection> {
        Logger.info('getSubwayAlerts()');
        return this._getAlerts(this.gtfsAlertUrls.all);
    }

    private async _getAlerts(url: string): Promise<AlertCollection> {
        const sw = new Stopwatch;
        Logger.info('TtcApi._getAlerts()');
        // This fetch is pretty slow, >2 seconds, and no clear way to speed it up.
        // Client should not wait for this before rendering.
        const feedRes = await fetch(url);
        Logger.info('Got alerts from TTC in', sw.lap(), 'ms');
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
        Logger.info('Parsed alerts in', sw.lap(), 'ms');
        const result = {
            timestamp: Number(feedMessage.header!.timestamp) * 1000, // seconds to ms
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

                        // // discard alerts that are not active
                        // if (active_period && !active_period.some(({ start, end }) => (
                        //     (!start || Number(start) * 1000 < Date.now()) &&
                        //     (!end || Number(end) * 1000 > Date.now())
                        // ))) return null;

                        return {
                            id: id!,
                            periods: active_period && active_period.map(({ start, end }) => ({
                                start: Number(start),
                                end: Number(end),
                            })) || [{ start: 0, end: Infinity }],
                            header: this._toEnglish(header_text!),
                            description: this._toEnglish(description_text!),
                            effect: this._mapGtfsEffectToApi(effect),
                            criteria: informed_entity!
                                .filter(({ trip }) => !trip)
                                .map(({ direction_id, route_id, route_type, stop_id }) => ({
                                    direction: direction_id ? this._mapGtfsDirectionToApi(direction_id.toString() as Gtfs.Schedule.Direction) : undefined,
                                    route_id: route_id || undefined,
                                    route_type: route_type ? this._mapGtfsRouteTypeToApi(route_type.toString() as Gtfs.Schedule.RouteType, route_id || undefined) : undefined,
                                    platform_id: stop_id || undefined,
                                })),
                        };
                    }))
            ).filter((alert): alert is NonNullable<typeof alert> => !!alert),
        };
        Logger.info('Mapped alerts in', sw.lap(), 'ms');
        Logger.info('TtcApi._getAlerts() completed in', sw.totalElapsed(), 'ms');
        return result;
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

    private _mapGtfsRouteTypeToApi(routeType: Gtfs.Schedule.RouteType, routeId?: string): RouteType {
        switch (routeType) {
            case Gtfs.Schedule.RouteType.TramStreetcarLightRail:
                return (routeId && this.lineIds.includes(routeId)) ? RouteType.SubwayLRT : RouteType.Streetcar;
            case Gtfs.Schedule.RouteType.SubwayMetro:
                return RouteType.SubwayLRT;
            case Gtfs.Schedule.RouteType.Bus:
                return RouteType.Bus;
            default:
                throw new Error(`Route Type not supported: ${routeType}`);
        }
    }

    private _toEnglish(ts: undefined): undefined;
    private _toEnglish(ts: transit_realtime.ITranslatedString): string;
    private _toEnglish(ts: transit_realtime.ITranslatedString | undefined): string | undefined;
    private _toEnglish(ts: transit_realtime.ITranslatedString | undefined): string | undefined {
        return ts && ts.translation
            ? ts.translation.find(({ language }) => !language || language === 'en')!.text!
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
