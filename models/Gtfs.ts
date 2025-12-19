/** @see: https://gtfs.org/documentation/schedule/reference */
namespace Gtfs {
    export interface Agency {
        agency_id: string;
        agency_name: string;
        agency_url: string;
        // omitted agency_timezone, agency_lang, agency_phone, agency_fare_url, agency_email, cemv_support
    };

    export interface CalendarService {
        service_id: string;
        monday: 0 | 1;
        tuesday: 0 | 1;
        wednesday: 0 | 1;
        thursday: 0 | 1;
        friday: 0 | 1;
        saturday: 0 | 1;
        sunday: 0 | 1;
        start_date: string;
        end_date: string;
    };

    export enum CalendarServiceExceptionType {
        ServiceAdded = 1,
        ServiceRemoved = 2,
    };

    export interface CalendarServiceException {
        service_id: string;
        date: string;
        exception_type: CalendarServiceExceptionType;
    };

    export enum RouteType {
        TramStreetcarLightRail = "0",
        SubwayMetro = "1",
        Rail = "2",
        Bus = "3",
        Ferry = "4",
        CableTram = "5",
        Aerial = "6",
        Funicular = "7",
        Trolleybus = "11",
        Monorail = "12",
    };

    export interface Route {
        route_id: string;
        agency_id: string;
        route_short_name: string;
        route_long_name: string;
        route_desc?: string | '';
        route_type: RouteType;
        // omitted route_url
        route_color?: string | '';
        route_text_color?: string | '';
        route_sort_order?: `${number}` | '';
        // omitted continuous_pickup, continuous_drop_off
        network_id?: string | '';
        // omitted cemv_support
    };

    export enum LocationType {
        Platform = "0",
        Station = "1",
        EntranceOrExit = "2",
        GenericNode = "3",
        BoardingArea = "4",
    };

    export interface Stop {
        stop_id: string;
        stop_code?: string | '';
        stop_name?: string | '';
        // omitted tts_stop_name
        stop_desc?: string | '';
        stop_lat: `${number}`;
        stop_lon: `${number}`;
        // omitted zone_id, stop_url
        location_type?: LocationType | '';
        parent_station?: string | '';
        // omitted stop_timezone, wheelchair_boarding, level_id,
        platform_code?: string | '';
        // omitted stop_access
    };

    export interface StopTime {
        trip_id: string;
        // omitted arrival_time, departure_time
        stop_id: string;
        // omitted location_group_id, location_id
        stop_sequence: `${number}`;
        stop_headsign?: string | '';
        // omitted start_pickup_drop_off_window, end_pickup_drop_off_window,
        //         pickup_type, drop_off_type, continuous_pickup, continuous_drop_off,
        //         shape_dist_traveled, timepoint, pickup_booking_rule_id,
        //         drop_off_booking_rule_id
    };

    export interface Trip {
        route_id: string;
        service_id: string;
        trip_id: string;
        trip_headsign?: string | '';
        trip_short_name?: string | '';
        direction_id?: '0' | '1' | '';
        // omitted block_id
        shape_id?: string | '';
        // omitted wheelchair_accessible, bikes_allowed, cars_allowed
    };
};

export default Gtfs;