namespace Gtfs {
    
    /** @see https://gtfs.org/documentation/schedule/reference */
    export namespace Schedule {

        export interface Agency {
            agency_id: string;
            agency_name: string;
            agency_url: string;
            // omitted agency_timezone, agency_lang, agency_phone, agency_fare_url, agency_email, cemv_support
        };

        export interface CalendarService {
            service_id: string;
            monday: '0' | '1';
            tuesday: '0' | '1';
            wednesday: '0' | '1';
            thursday: '0' | '1';
            friday: '0' | '1';
            saturday: '0' | '1';
            sunday: '0' | '1';
            start_date: string;
            end_date: string;
        };

        export interface CalendarServiceException {
            service_id: string;
            date: string;
            exception_type: CalendarServiceExceptionType;
        };

        export enum CalendarServiceExceptionType {
            ServiceAdded = '1',
            ServiceRemoved = '2',
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

        export interface ShapePoint {
            shape_id: string;
            shape_pt_lat: `${number}`;
            shape_pt_lon: `${number}`;
            shape_pt_sequence: `${number}`;
            shape_dist_traveled?: `${number}`;
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

        export enum LocationType {
            Platform = "0",
            Station = "1",
            EntranceOrExit = "2",
            GenericNode = "3",
            BoardingArea = "4",
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
            shape_dist_traveled?: `${number}`;
            // omitted timepoint, pickup_booking_rule_id, drop_off_booking_rule_id
        };

        export interface Trip {
            route_id: string;
            service_id: string;
            trip_id: string;
            trip_headsign?: string | '';
            trip_short_name?: string | '';
            direction_id?: Direction | '';
            // omitted block_id
            shape_id?: string | '';
            // omitted wheelchair_accessible, bikes_allowed, cars_allowed
        };

        export type Direction = '0' | '1';
    };

    /** @see https://gtfs.org/documentation/realtime/reference */
    export namespace Realtime {

        export interface FeedMessage {
            header: FeedHeader;
            entity: FeedEntity[];
        };

        export interface FeedHeader {
            gtfs_realtime_version: string;
            // omitted incrementality
            timestamp: `${number}`;
            // omitted feed_version
        };

        export interface FeedEntity {
            id: string;
            // omitted is_deleted
            trip_update?: TripUpdate;
            // omitted vehicle
            alert?: Alert;
            // omitted shape, stop, trip_modifications
        };

        export interface TripUpdate {
            trip: TripDescriptor;
            // omitted vehicle, stop_time_update, timestamp, delay, trip_properties
        };

        export type TripDescriptor = TripDescriptorWithTripId | TripDescriptorWithoutTripId;

        export interface TripDescriptorCommon {
            schedule_relationship?: ScheduleRelationship;
            modified_trip?: ModifiedTripSelector;
        };

        export enum ScheduleRelationship {
            Scheduled = 'SCHEDULED',
            /** @deprecated */
            Added = 'ADDED',
            Unscheduled = 'UNSCHEDULED',
            Canceled = 'CANCELED',
            /** @experimental */
            Replacement = 'REPLACEMENT',
            Duplicated = 'DUPLICATED',
            /** @experimental */
            New = 'NEW',
            /** @experimental */
            Deleted = 'DELETED',
        };

        export interface ModifiedTripSelector {
            modifications_id: string;
            affected_trip_id: string;
            start_time?: string;
            start_date?: string;
        };

        export interface TripDescriptorWithTripId extends TripDescriptorCommon {
            trip_id: string;
            route_id?: string;
            direction_id?: Schedule.Direction;
            start_time?: string;
            start_date?: string;
        };

        export interface TripDescriptorWithoutTripId extends TripDescriptorCommon {
            trip_id?: undefined;
            route_id: string;
            direction_id: Schedule.Direction;
            start_time: string;
            start_date: string;
        };

        export interface Alert {
            active_period?: TimeRange[];
            informed_entity: EntitySelector[];
            cause?: Cause;
            cause_detail?: TranslatedString;
            effect?: Effect;
            effect_detail?: TranslatedString;
            // omitted url
            header_text: TranslatedString;
            description_text: TranslatedString;
            // omitted tts_header_text, tts_description_text, severity_level, image, image_alternative_text
        };

        export interface TimeRange {
            start?: `${number}`;
            end?: `${number}`;
        };

        export interface EntitySelector {
            agency_id?: string;
            route_id?: string;
            route_type?: Schedule.RouteType;
            direction_id?: Schedule.Direction;
            trip?: TripDescriptor;
            stop_id?: string;
        };

        export enum Cause {
            Unknown = 'UNKNOWN_CAUSE',
            Other = 'OTHER_CAUSE',
            Technical = 'TECHNICAL_PROBLEM',
            Strike = 'STRIKE',
            Demonstration = 'DEMONSTRATION',
            Accident = 'ACCIDENT',
            Holiday = 'HOLIDAY',
            Weather = 'WEATHER',
            Maintenance = 'MAINTENANCE',
            Construction = 'CONSTRUCTION',
            Police = 'POLICE_ACTIVITY',
            Medical = 'MEDICAL_EMERGENCY',
        };

        export enum Effect {
            NoService = 'NO_SERVICE',
            ReducedService = 'REDUCED_SERVICE',
            SignificantDelay = 'SIGNIFICANT_DELAYS',
            Detour = 'DETOUR',
            AdditionalService = 'ADDITIONAL_SERVICE',
            ModifiedService = 'MODIFIED_SERVICE',
            Other = 'OTHER_EFFECT',
            Unknown = 'UNKNOWN_EFFECT',
            StopMoved = 'STOP_MOVED',
            None = 'NO_EFFECT',
            AccessibilityIssue = 'ACCESSIBILITY_ISSUE',
        };

        export interface TranslatedString {
            translation: Translation[];
        };

        export interface Translation {
            text: string;
            language?: string;
        };
    };
};

export default Gtfs;