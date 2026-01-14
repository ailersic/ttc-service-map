/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const transit_realtime = $root.transit_realtime = (() => {

    /**
     * Namespace transit_realtime.
     * @exports transit_realtime
     * @namespace
     */
    const transit_realtime = {};

    transit_realtime.FeedMessage = (function() {

        /**
         * Properties of a FeedMessage.
         * @memberof transit_realtime
         * @interface IFeedMessage
         * @property {transit_realtime.IFeedHeader} header FeedMessage header
         * @property {Array.<transit_realtime.IFeedEntity>|null} [entity] FeedMessage entity
         */

        /**
         * Constructs a new FeedMessage.
         * @memberof transit_realtime
         * @classdesc Represents a FeedMessage.
         * @implements IFeedMessage
         * @constructor
         * @param {transit_realtime.IFeedMessage=} [properties] Properties to set
         */
        function FeedMessage(properties) {
            this.entity = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * FeedMessage header.
         * @member {transit_realtime.IFeedHeader} header
         * @memberof transit_realtime.FeedMessage
         * @instance
         */
        FeedMessage.prototype.header = null;

        /**
         * FeedMessage entity.
         * @member {Array.<transit_realtime.IFeedEntity>} entity
         * @memberof transit_realtime.FeedMessage
         * @instance
         */
        FeedMessage.prototype.entity = $util.emptyArray;

        /**
         * Creates a new FeedMessage instance using the specified properties.
         * @function create
         * @memberof transit_realtime.FeedMessage
         * @static
         * @param {transit_realtime.IFeedMessage=} [properties] Properties to set
         * @returns {transit_realtime.FeedMessage} FeedMessage instance
         */
        FeedMessage.create = function create(properties) {
            return new FeedMessage(properties);
        };

        /**
         * Encodes the specified FeedMessage message. Does not implicitly {@link transit_realtime.FeedMessage.verify|verify} messages.
         * @function encode
         * @memberof transit_realtime.FeedMessage
         * @static
         * @param {transit_realtime.IFeedMessage} message FeedMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FeedMessage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            $root.transit_realtime.FeedHeader.encode(message.header, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.entity != null && message.entity.length)
                for (let i = 0; i < message.entity.length; ++i)
                    $root.transit_realtime.FeedEntity.encode(message.entity[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified FeedMessage message, length delimited. Does not implicitly {@link transit_realtime.FeedMessage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof transit_realtime.FeedMessage
         * @static
         * @param {transit_realtime.IFeedMessage} message FeedMessage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FeedMessage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a FeedMessage message from the specified reader or buffer.
         * @function decode
         * @memberof transit_realtime.FeedMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {transit_realtime.FeedMessage} FeedMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FeedMessage.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.transit_realtime.FeedMessage();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.header = $root.transit_realtime.FeedHeader.decode(reader, reader.uint32());
                        break;
                    }
                case 2: {
                        if (!(message.entity && message.entity.length))
                            message.entity = [];
                        message.entity.push($root.transit_realtime.FeedEntity.decode(reader, reader.uint32()));
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("header"))
                throw $util.ProtocolError("missing required 'header'", { instance: message });
            return message;
        };

        /**
         * Decodes a FeedMessage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof transit_realtime.FeedMessage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {transit_realtime.FeedMessage} FeedMessage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FeedMessage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a FeedMessage message.
         * @function verify
         * @memberof transit_realtime.FeedMessage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        FeedMessage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            {
                let error = $root.transit_realtime.FeedHeader.verify(message.header);
                if (error)
                    return "header." + error;
            }
            if (message.entity != null && message.hasOwnProperty("entity")) {
                if (!Array.isArray(message.entity))
                    return "entity: array expected";
                for (let i = 0; i < message.entity.length; ++i) {
                    let error = $root.transit_realtime.FeedEntity.verify(message.entity[i]);
                    if (error)
                        return "entity." + error;
                }
            }
            return null;
        };

        /**
         * Creates a FeedMessage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof transit_realtime.FeedMessage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {transit_realtime.FeedMessage} FeedMessage
         */
        FeedMessage.fromObject = function fromObject(object) {
            if (object instanceof $root.transit_realtime.FeedMessage)
                return object;
            let message = new $root.transit_realtime.FeedMessage();
            if (object.header != null) {
                if (typeof object.header !== "object")
                    throw TypeError(".transit_realtime.FeedMessage.header: object expected");
                message.header = $root.transit_realtime.FeedHeader.fromObject(object.header);
            }
            if (object.entity) {
                if (!Array.isArray(object.entity))
                    throw TypeError(".transit_realtime.FeedMessage.entity: array expected");
                message.entity = [];
                for (let i = 0; i < object.entity.length; ++i) {
                    if (typeof object.entity[i] !== "object")
                        throw TypeError(".transit_realtime.FeedMessage.entity: object expected");
                    message.entity[i] = $root.transit_realtime.FeedEntity.fromObject(object.entity[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a FeedMessage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof transit_realtime.FeedMessage
         * @static
         * @param {transit_realtime.FeedMessage} message FeedMessage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        FeedMessage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults)
                object.entity = [];
            if (options.defaults)
                object.header = null;
            if (message.header != null && message.hasOwnProperty("header"))
                object.header = $root.transit_realtime.FeedHeader.toObject(message.header, options);
            if (message.entity && message.entity.length) {
                object.entity = [];
                for (let j = 0; j < message.entity.length; ++j)
                    object.entity[j] = $root.transit_realtime.FeedEntity.toObject(message.entity[j], options);
            }
            return object;
        };

        /**
         * Converts this FeedMessage to JSON.
         * @function toJSON
         * @memberof transit_realtime.FeedMessage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        FeedMessage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for FeedMessage
         * @function getTypeUrl
         * @memberof transit_realtime.FeedMessage
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        FeedMessage.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/transit_realtime.FeedMessage";
        };

        return FeedMessage;
    })();

    transit_realtime.FeedHeader = (function() {

        /**
         * Properties of a FeedHeader.
         * @memberof transit_realtime
         * @interface IFeedHeader
         * @property {string} gtfs_realtime_version FeedHeader gtfs_realtime_version
         * @property {transit_realtime.FeedHeader.Incrementality|null} [incrementality] FeedHeader incrementality
         * @property {number|Long|null} [timestamp] FeedHeader timestamp
         * @property {string|null} [feed_version] FeedHeader feed_version
         */

        /**
         * Constructs a new FeedHeader.
         * @memberof transit_realtime
         * @classdesc Represents a FeedHeader.
         * @implements IFeedHeader
         * @constructor
         * @param {transit_realtime.IFeedHeader=} [properties] Properties to set
         */
        function FeedHeader(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * FeedHeader gtfs_realtime_version.
         * @member {string} gtfs_realtime_version
         * @memberof transit_realtime.FeedHeader
         * @instance
         */
        FeedHeader.prototype.gtfs_realtime_version = "";

        /**
         * FeedHeader incrementality.
         * @member {transit_realtime.FeedHeader.Incrementality} incrementality
         * @memberof transit_realtime.FeedHeader
         * @instance
         */
        FeedHeader.prototype.incrementality = 0;

        /**
         * FeedHeader timestamp.
         * @member {number|Long} timestamp
         * @memberof transit_realtime.FeedHeader
         * @instance
         */
        FeedHeader.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * FeedHeader feed_version.
         * @member {string} feed_version
         * @memberof transit_realtime.FeedHeader
         * @instance
         */
        FeedHeader.prototype.feed_version = "";

        /**
         * Creates a new FeedHeader instance using the specified properties.
         * @function create
         * @memberof transit_realtime.FeedHeader
         * @static
         * @param {transit_realtime.IFeedHeader=} [properties] Properties to set
         * @returns {transit_realtime.FeedHeader} FeedHeader instance
         */
        FeedHeader.create = function create(properties) {
            return new FeedHeader(properties);
        };

        /**
         * Encodes the specified FeedHeader message. Does not implicitly {@link transit_realtime.FeedHeader.verify|verify} messages.
         * @function encode
         * @memberof transit_realtime.FeedHeader
         * @static
         * @param {transit_realtime.IFeedHeader} message FeedHeader message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FeedHeader.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.gtfs_realtime_version);
            if (message.incrementality != null && Object.hasOwnProperty.call(message, "incrementality"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.incrementality);
            if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.timestamp);
            if (message.feed_version != null && Object.hasOwnProperty.call(message, "feed_version"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.feed_version);
            return writer;
        };

        /**
         * Encodes the specified FeedHeader message, length delimited. Does not implicitly {@link transit_realtime.FeedHeader.verify|verify} messages.
         * @function encodeDelimited
         * @memberof transit_realtime.FeedHeader
         * @static
         * @param {transit_realtime.IFeedHeader} message FeedHeader message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FeedHeader.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a FeedHeader message from the specified reader or buffer.
         * @function decode
         * @memberof transit_realtime.FeedHeader
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {transit_realtime.FeedHeader} FeedHeader
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FeedHeader.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.transit_realtime.FeedHeader();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.gtfs_realtime_version = reader.string();
                        break;
                    }
                case 2: {
                        message.incrementality = reader.int32();
                        break;
                    }
                case 3: {
                        message.timestamp = reader.uint64();
                        break;
                    }
                case 4: {
                        message.feed_version = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("gtfs_realtime_version"))
                throw $util.ProtocolError("missing required 'gtfs_realtime_version'", { instance: message });
            return message;
        };

        /**
         * Decodes a FeedHeader message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof transit_realtime.FeedHeader
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {transit_realtime.FeedHeader} FeedHeader
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FeedHeader.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a FeedHeader message.
         * @function verify
         * @memberof transit_realtime.FeedHeader
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        FeedHeader.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isString(message.gtfs_realtime_version))
                return "gtfs_realtime_version: string expected";
            if (message.incrementality != null && message.hasOwnProperty("incrementality"))
                switch (message.incrementality) {
                default:
                    return "incrementality: enum value expected";
                case 0:
                case 1:
                    break;
                }
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                    return "timestamp: integer|Long expected";
            if (message.feed_version != null && message.hasOwnProperty("feed_version"))
                if (!$util.isString(message.feed_version))
                    return "feed_version: string expected";
            return null;
        };

        /**
         * Creates a FeedHeader message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof transit_realtime.FeedHeader
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {transit_realtime.FeedHeader} FeedHeader
         */
        FeedHeader.fromObject = function fromObject(object) {
            if (object instanceof $root.transit_realtime.FeedHeader)
                return object;
            let message = new $root.transit_realtime.FeedHeader();
            if (object.gtfs_realtime_version != null)
                message.gtfs_realtime_version = String(object.gtfs_realtime_version);
            switch (object.incrementality) {
            default:
                if (typeof object.incrementality === "number") {
                    message.incrementality = object.incrementality;
                    break;
                }
                break;
            case "FULL_DATASET":
            case 0:
                message.incrementality = 0;
                break;
            case "DIFFERENTIAL":
            case 1:
                message.incrementality = 1;
                break;
            }
            if (object.timestamp != null)
                if ($util.Long)
                    (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = true;
                else if (typeof object.timestamp === "string")
                    message.timestamp = parseInt(object.timestamp, 10);
                else if (typeof object.timestamp === "number")
                    message.timestamp = object.timestamp;
                else if (typeof object.timestamp === "object")
                    message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber(true);
            if (object.feed_version != null)
                message.feed_version = String(object.feed_version);
            return message;
        };

        /**
         * Creates a plain object from a FeedHeader message. Also converts values to other types if specified.
         * @function toObject
         * @memberof transit_realtime.FeedHeader
         * @static
         * @param {transit_realtime.FeedHeader} message FeedHeader
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        FeedHeader.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.gtfs_realtime_version = "";
                object.incrementality = options.enums === String ? "FULL_DATASET" : 0;
                if ($util.Long) {
                    let long = new $util.Long(0, 0, true);
                    object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestamp = options.longs === String ? "0" : 0;
                object.feed_version = "";
            }
            if (message.gtfs_realtime_version != null && message.hasOwnProperty("gtfs_realtime_version"))
                object.gtfs_realtime_version = message.gtfs_realtime_version;
            if (message.incrementality != null && message.hasOwnProperty("incrementality"))
                object.incrementality = options.enums === String ? $root.transit_realtime.FeedHeader.Incrementality[message.incrementality] === undefined ? message.incrementality : $root.transit_realtime.FeedHeader.Incrementality[message.incrementality] : message.incrementality;
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (typeof message.timestamp === "number")
                    object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                else
                    object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber(true) : message.timestamp;
            if (message.feed_version != null && message.hasOwnProperty("feed_version"))
                object.feed_version = message.feed_version;
            return object;
        };

        /**
         * Converts this FeedHeader to JSON.
         * @function toJSON
         * @memberof transit_realtime.FeedHeader
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        FeedHeader.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for FeedHeader
         * @function getTypeUrl
         * @memberof transit_realtime.FeedHeader
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        FeedHeader.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/transit_realtime.FeedHeader";
        };

        /**
         * Incrementality enum.
         * @name transit_realtime.FeedHeader.Incrementality
         * @enum {number}
         * @property {number} FULL_DATASET=0 FULL_DATASET value
         * @property {number} DIFFERENTIAL=1 DIFFERENTIAL value
         */
        FeedHeader.Incrementality = (function() {
            const valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "FULL_DATASET"] = 0;
            values[valuesById[1] = "DIFFERENTIAL"] = 1;
            return values;
        })();

        return FeedHeader;
    })();

    transit_realtime.FeedEntity = (function() {

        /**
         * Properties of a FeedEntity.
         * @memberof transit_realtime
         * @interface IFeedEntity
         * @property {string} id FeedEntity id
         * @property {boolean|null} [is_deleted] FeedEntity is_deleted
         * @property {transit_realtime.ITripUpdate|null} [trip_update] FeedEntity trip_update
         * @property {transit_realtime.IVehiclePosition|null} [vehicle] FeedEntity vehicle
         * @property {transit_realtime.IAlert|null} [alert] FeedEntity alert
         * @property {transit_realtime.IShape|null} [shape] FeedEntity shape
         * @property {transit_realtime.IStop|null} [stop] FeedEntity stop
         * @property {transit_realtime.ITripModifications|null} [trip_modifications] FeedEntity trip_modifications
         */

        /**
         * Constructs a new FeedEntity.
         * @memberof transit_realtime
         * @classdesc Represents a FeedEntity.
         * @implements IFeedEntity
         * @constructor
         * @param {transit_realtime.IFeedEntity=} [properties] Properties to set
         */
        function FeedEntity(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * FeedEntity id.
         * @member {string} id
         * @memberof transit_realtime.FeedEntity
         * @instance
         */
        FeedEntity.prototype.id = "";

        /**
         * FeedEntity is_deleted.
         * @member {boolean} is_deleted
         * @memberof transit_realtime.FeedEntity
         * @instance
         */
        FeedEntity.prototype.is_deleted = false;

        /**
         * FeedEntity trip_update.
         * @member {transit_realtime.ITripUpdate|null|undefined} trip_update
         * @memberof transit_realtime.FeedEntity
         * @instance
         */
        FeedEntity.prototype.trip_update = null;

        /**
         * FeedEntity vehicle.
         * @member {transit_realtime.IVehiclePosition|null|undefined} vehicle
         * @memberof transit_realtime.FeedEntity
         * @instance
         */
        FeedEntity.prototype.vehicle = null;

        /**
         * FeedEntity alert.
         * @member {transit_realtime.IAlert|null|undefined} alert
         * @memberof transit_realtime.FeedEntity
         * @instance
         */
        FeedEntity.prototype.alert = null;

        /**
         * FeedEntity shape.
         * @member {transit_realtime.IShape|null|undefined} shape
         * @memberof transit_realtime.FeedEntity
         * @instance
         */
        FeedEntity.prototype.shape = null;

        /**
         * FeedEntity stop.
         * @member {transit_realtime.IStop|null|undefined} stop
         * @memberof transit_realtime.FeedEntity
         * @instance
         */
        FeedEntity.prototype.stop = null;

        /**
         * FeedEntity trip_modifications.
         * @member {transit_realtime.ITripModifications|null|undefined} trip_modifications
         * @memberof transit_realtime.FeedEntity
         * @instance
         */
        FeedEntity.prototype.trip_modifications = null;

        /**
         * Creates a new FeedEntity instance using the specified properties.
         * @function create
         * @memberof transit_realtime.FeedEntity
         * @static
         * @param {transit_realtime.IFeedEntity=} [properties] Properties to set
         * @returns {transit_realtime.FeedEntity} FeedEntity instance
         */
        FeedEntity.create = function create(properties) {
            return new FeedEntity(properties);
        };

        /**
         * Encodes the specified FeedEntity message. Does not implicitly {@link transit_realtime.FeedEntity.verify|verify} messages.
         * @function encode
         * @memberof transit_realtime.FeedEntity
         * @static
         * @param {transit_realtime.IFeedEntity} message FeedEntity message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FeedEntity.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
            if (message.is_deleted != null && Object.hasOwnProperty.call(message, "is_deleted"))
                writer.uint32(/* id 2, wireType 0 =*/16).bool(message.is_deleted);
            if (message.trip_update != null && Object.hasOwnProperty.call(message, "trip_update"))
                $root.transit_realtime.TripUpdate.encode(message.trip_update, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.vehicle != null && Object.hasOwnProperty.call(message, "vehicle"))
                $root.transit_realtime.VehiclePosition.encode(message.vehicle, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.alert != null && Object.hasOwnProperty.call(message, "alert"))
                $root.transit_realtime.Alert.encode(message.alert, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            if (message.shape != null && Object.hasOwnProperty.call(message, "shape"))
                $root.transit_realtime.Shape.encode(message.shape, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            if (message.stop != null && Object.hasOwnProperty.call(message, "stop"))
                $root.transit_realtime.Stop.encode(message.stop, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
            if (message.trip_modifications != null && Object.hasOwnProperty.call(message, "trip_modifications"))
                $root.transit_realtime.TripModifications.encode(message.trip_modifications, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified FeedEntity message, length delimited. Does not implicitly {@link transit_realtime.FeedEntity.verify|verify} messages.
         * @function encodeDelimited
         * @memberof transit_realtime.FeedEntity
         * @static
         * @param {transit_realtime.IFeedEntity} message FeedEntity message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FeedEntity.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a FeedEntity message from the specified reader or buffer.
         * @function decode
         * @memberof transit_realtime.FeedEntity
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {transit_realtime.FeedEntity} FeedEntity
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FeedEntity.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.transit_realtime.FeedEntity();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.id = reader.string();
                        break;
                    }
                case 2: {
                        message.is_deleted = reader.bool();
                        break;
                    }
                case 3: {
                        message.trip_update = $root.transit_realtime.TripUpdate.decode(reader, reader.uint32());
                        break;
                    }
                case 4: {
                        message.vehicle = $root.transit_realtime.VehiclePosition.decode(reader, reader.uint32());
                        break;
                    }
                case 5: {
                        message.alert = $root.transit_realtime.Alert.decode(reader, reader.uint32());
                        break;
                    }
                case 6: {
                        message.shape = $root.transit_realtime.Shape.decode(reader, reader.uint32());
                        break;
                    }
                case 7: {
                        message.stop = $root.transit_realtime.Stop.decode(reader, reader.uint32());
                        break;
                    }
                case 8: {
                        message.trip_modifications = $root.transit_realtime.TripModifications.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("id"))
                throw $util.ProtocolError("missing required 'id'", { instance: message });
            return message;
        };

        /**
         * Decodes a FeedEntity message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof transit_realtime.FeedEntity
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {transit_realtime.FeedEntity} FeedEntity
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FeedEntity.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a FeedEntity message.
         * @function verify
         * @memberof transit_realtime.FeedEntity
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        FeedEntity.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isString(message.id))
                return "id: string expected";
            if (message.is_deleted != null && message.hasOwnProperty("is_deleted"))
                if (typeof message.is_deleted !== "boolean")
                    return "is_deleted: boolean expected";
            if (message.trip_update != null && message.hasOwnProperty("trip_update")) {
                let error = $root.transit_realtime.TripUpdate.verify(message.trip_update);
                if (error)
                    return "trip_update." + error;
            }
            if (message.vehicle != null && message.hasOwnProperty("vehicle")) {
                let error = $root.transit_realtime.VehiclePosition.verify(message.vehicle);
                if (error)
                    return "vehicle." + error;
            }
            if (message.alert != null && message.hasOwnProperty("alert")) {
                let error = $root.transit_realtime.Alert.verify(message.alert);
                if (error)
                    return "alert." + error;
            }
            if (message.shape != null && message.hasOwnProperty("shape")) {
                let error = $root.transit_realtime.Shape.verify(message.shape);
                if (error)
                    return "shape." + error;
            }
            if (message.stop != null && message.hasOwnProperty("stop")) {
                let error = $root.transit_realtime.Stop.verify(message.stop);
                if (error)
                    return "stop." + error;
            }
            if (message.trip_modifications != null && message.hasOwnProperty("trip_modifications")) {
                let error = $root.transit_realtime.TripModifications.verify(message.trip_modifications);
                if (error)
                    return "trip_modifications." + error;
            }
            return null;
        };

        /**
         * Creates a FeedEntity message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof transit_realtime.FeedEntity
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {transit_realtime.FeedEntity} FeedEntity
         */
        FeedEntity.fromObject = function fromObject(object) {
            if (object instanceof $root.transit_realtime.FeedEntity)
                return object;
            let message = new $root.transit_realtime.FeedEntity();
            if (object.id != null)
                message.id = String(object.id);
            if (object.is_deleted != null)
                message.is_deleted = Boolean(object.is_deleted);
            if (object.trip_update != null) {
                if (typeof object.trip_update !== "object")
                    throw TypeError(".transit_realtime.FeedEntity.trip_update: object expected");
                message.trip_update = $root.transit_realtime.TripUpdate.fromObject(object.trip_update);
            }
            if (object.vehicle != null) {
                if (typeof object.vehicle !== "object")
                    throw TypeError(".transit_realtime.FeedEntity.vehicle: object expected");
                message.vehicle = $root.transit_realtime.VehiclePosition.fromObject(object.vehicle);
            }
            if (object.alert != null) {
                if (typeof object.alert !== "object")
                    throw TypeError(".transit_realtime.FeedEntity.alert: object expected");
                message.alert = $root.transit_realtime.Alert.fromObject(object.alert);
            }
            if (object.shape != null) {
                if (typeof object.shape !== "object")
                    throw TypeError(".transit_realtime.FeedEntity.shape: object expected");
                message.shape = $root.transit_realtime.Shape.fromObject(object.shape);
            }
            if (object.stop != null) {
                if (typeof object.stop !== "object")
                    throw TypeError(".transit_realtime.FeedEntity.stop: object expected");
                message.stop = $root.transit_realtime.Stop.fromObject(object.stop);
            }
            if (object.trip_modifications != null) {
                if (typeof object.trip_modifications !== "object")
                    throw TypeError(".transit_realtime.FeedEntity.trip_modifications: object expected");
                message.trip_modifications = $root.transit_realtime.TripModifications.fromObject(object.trip_modifications);
            }
            return message;
        };

        /**
         * Creates a plain object from a FeedEntity message. Also converts values to other types if specified.
         * @function toObject
         * @memberof transit_realtime.FeedEntity
         * @static
         * @param {transit_realtime.FeedEntity} message FeedEntity
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        FeedEntity.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.id = "";
                object.is_deleted = false;
                object.trip_update = null;
                object.vehicle = null;
                object.alert = null;
                object.shape = null;
                object.stop = null;
                object.trip_modifications = null;
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.is_deleted != null && message.hasOwnProperty("is_deleted"))
                object.is_deleted = message.is_deleted;
            if (message.trip_update != null && message.hasOwnProperty("trip_update"))
                object.trip_update = $root.transit_realtime.TripUpdate.toObject(message.trip_update, options);
            if (message.vehicle != null && message.hasOwnProperty("vehicle"))
                object.vehicle = $root.transit_realtime.VehiclePosition.toObject(message.vehicle, options);
            if (message.alert != null && message.hasOwnProperty("alert"))
                object.alert = $root.transit_realtime.Alert.toObject(message.alert, options);
            if (message.shape != null && message.hasOwnProperty("shape"))
                object.shape = $root.transit_realtime.Shape.toObject(message.shape, options);
            if (message.stop != null && message.hasOwnProperty("stop"))
                object.stop = $root.transit_realtime.Stop.toObject(message.stop, options);
            if (message.trip_modifications != null && message.hasOwnProperty("trip_modifications"))
                object.trip_modifications = $root.transit_realtime.TripModifications.toObject(message.trip_modifications, options);
            return object;
        };

        /**
         * Converts this FeedEntity to JSON.
         * @function toJSON
         * @memberof transit_realtime.FeedEntity
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        FeedEntity.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for FeedEntity
         * @function getTypeUrl
         * @memberof transit_realtime.FeedEntity
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        FeedEntity.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/transit_realtime.FeedEntity";
        };

        return FeedEntity;
    })();

    transit_realtime.TripUpdate = (function() {

        /**
         * Properties of a TripUpdate.
         * @memberof transit_realtime
         * @interface ITripUpdate
         * @property {transit_realtime.ITripDescriptor} trip TripUpdate trip
         * @property {transit_realtime.IVehicleDescriptor|null} [vehicle] TripUpdate vehicle
         * @property {Array.<transit_realtime.TripUpdate.IStopTimeUpdate>|null} [stop_time_update] TripUpdate stop_time_update
         * @property {number|Long|null} [timestamp] TripUpdate timestamp
         * @property {number|null} [delay] TripUpdate delay
         * @property {transit_realtime.TripUpdate.ITripProperties|null} [trip_properties] TripUpdate trip_properties
         */

        /**
         * Constructs a new TripUpdate.
         * @memberof transit_realtime
         * @classdesc Represents a TripUpdate.
         * @implements ITripUpdate
         * @constructor
         * @param {transit_realtime.ITripUpdate=} [properties] Properties to set
         */
        function TripUpdate(properties) {
            this.stop_time_update = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * TripUpdate trip.
         * @member {transit_realtime.ITripDescriptor} trip
         * @memberof transit_realtime.TripUpdate
         * @instance
         */
        TripUpdate.prototype.trip = null;

        /**
         * TripUpdate vehicle.
         * @member {transit_realtime.IVehicleDescriptor|null|undefined} vehicle
         * @memberof transit_realtime.TripUpdate
         * @instance
         */
        TripUpdate.prototype.vehicle = null;

        /**
         * TripUpdate stop_time_update.
         * @member {Array.<transit_realtime.TripUpdate.IStopTimeUpdate>} stop_time_update
         * @memberof transit_realtime.TripUpdate
         * @instance
         */
        TripUpdate.prototype.stop_time_update = $util.emptyArray;

        /**
         * TripUpdate timestamp.
         * @member {number|Long} timestamp
         * @memberof transit_realtime.TripUpdate
         * @instance
         */
        TripUpdate.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * TripUpdate delay.
         * @member {number} delay
         * @memberof transit_realtime.TripUpdate
         * @instance
         */
        TripUpdate.prototype.delay = 0;

        /**
         * TripUpdate trip_properties.
         * @member {transit_realtime.TripUpdate.ITripProperties|null|undefined} trip_properties
         * @memberof transit_realtime.TripUpdate
         * @instance
         */
        TripUpdate.prototype.trip_properties = null;

        /**
         * Creates a new TripUpdate instance using the specified properties.
         * @function create
         * @memberof transit_realtime.TripUpdate
         * @static
         * @param {transit_realtime.ITripUpdate=} [properties] Properties to set
         * @returns {transit_realtime.TripUpdate} TripUpdate instance
         */
        TripUpdate.create = function create(properties) {
            return new TripUpdate(properties);
        };

        /**
         * Encodes the specified TripUpdate message. Does not implicitly {@link transit_realtime.TripUpdate.verify|verify} messages.
         * @function encode
         * @memberof transit_realtime.TripUpdate
         * @static
         * @param {transit_realtime.ITripUpdate} message TripUpdate message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TripUpdate.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            $root.transit_realtime.TripDescriptor.encode(message.trip, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.stop_time_update != null && message.stop_time_update.length)
                for (let i = 0; i < message.stop_time_update.length; ++i)
                    $root.transit_realtime.TripUpdate.StopTimeUpdate.encode(message.stop_time_update[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.vehicle != null && Object.hasOwnProperty.call(message, "vehicle"))
                $root.transit_realtime.VehicleDescriptor.encode(message.vehicle, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                writer.uint32(/* id 4, wireType 0 =*/32).uint64(message.timestamp);
            if (message.delay != null && Object.hasOwnProperty.call(message, "delay"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.delay);
            if (message.trip_properties != null && Object.hasOwnProperty.call(message, "trip_properties"))
                $root.transit_realtime.TripUpdate.TripProperties.encode(message.trip_properties, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified TripUpdate message, length delimited. Does not implicitly {@link transit_realtime.TripUpdate.verify|verify} messages.
         * @function encodeDelimited
         * @memberof transit_realtime.TripUpdate
         * @static
         * @param {transit_realtime.ITripUpdate} message TripUpdate message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TripUpdate.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a TripUpdate message from the specified reader or buffer.
         * @function decode
         * @memberof transit_realtime.TripUpdate
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {transit_realtime.TripUpdate} TripUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TripUpdate.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.transit_realtime.TripUpdate();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.trip = $root.transit_realtime.TripDescriptor.decode(reader, reader.uint32());
                        break;
                    }
                case 3: {
                        message.vehicle = $root.transit_realtime.VehicleDescriptor.decode(reader, reader.uint32());
                        break;
                    }
                case 2: {
                        if (!(message.stop_time_update && message.stop_time_update.length))
                            message.stop_time_update = [];
                        message.stop_time_update.push($root.transit_realtime.TripUpdate.StopTimeUpdate.decode(reader, reader.uint32()));
                        break;
                    }
                case 4: {
                        message.timestamp = reader.uint64();
                        break;
                    }
                case 5: {
                        message.delay = reader.int32();
                        break;
                    }
                case 6: {
                        message.trip_properties = $root.transit_realtime.TripUpdate.TripProperties.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("trip"))
                throw $util.ProtocolError("missing required 'trip'", { instance: message });
            return message;
        };

        /**
         * Decodes a TripUpdate message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof transit_realtime.TripUpdate
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {transit_realtime.TripUpdate} TripUpdate
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TripUpdate.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a TripUpdate message.
         * @function verify
         * @memberof transit_realtime.TripUpdate
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        TripUpdate.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            {
                let error = $root.transit_realtime.TripDescriptor.verify(message.trip);
                if (error)
                    return "trip." + error;
            }
            if (message.vehicle != null && message.hasOwnProperty("vehicle")) {
                let error = $root.transit_realtime.VehicleDescriptor.verify(message.vehicle);
                if (error)
                    return "vehicle." + error;
            }
            if (message.stop_time_update != null && message.hasOwnProperty("stop_time_update")) {
                if (!Array.isArray(message.stop_time_update))
                    return "stop_time_update: array expected";
                for (let i = 0; i < message.stop_time_update.length; ++i) {
                    let error = $root.transit_realtime.TripUpdate.StopTimeUpdate.verify(message.stop_time_update[i]);
                    if (error)
                        return "stop_time_update." + error;
                }
            }
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                    return "timestamp: integer|Long expected";
            if (message.delay != null && message.hasOwnProperty("delay"))
                if (!$util.isInteger(message.delay))
                    return "delay: integer expected";
            if (message.trip_properties != null && message.hasOwnProperty("trip_properties")) {
                let error = $root.transit_realtime.TripUpdate.TripProperties.verify(message.trip_properties);
                if (error)
                    return "trip_properties." + error;
            }
            return null;
        };

        /**
         * Creates a TripUpdate message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof transit_realtime.TripUpdate
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {transit_realtime.TripUpdate} TripUpdate
         */
        TripUpdate.fromObject = function fromObject(object) {
            if (object instanceof $root.transit_realtime.TripUpdate)
                return object;
            let message = new $root.transit_realtime.TripUpdate();
            if (object.trip != null) {
                if (typeof object.trip !== "object")
                    throw TypeError(".transit_realtime.TripUpdate.trip: object expected");
                message.trip = $root.transit_realtime.TripDescriptor.fromObject(object.trip);
            }
            if (object.vehicle != null) {
                if (typeof object.vehicle !== "object")
                    throw TypeError(".transit_realtime.TripUpdate.vehicle: object expected");
                message.vehicle = $root.transit_realtime.VehicleDescriptor.fromObject(object.vehicle);
            }
            if (object.stop_time_update) {
                if (!Array.isArray(object.stop_time_update))
                    throw TypeError(".transit_realtime.TripUpdate.stop_time_update: array expected");
                message.stop_time_update = [];
                for (let i = 0; i < object.stop_time_update.length; ++i) {
                    if (typeof object.stop_time_update[i] !== "object")
                        throw TypeError(".transit_realtime.TripUpdate.stop_time_update: object expected");
                    message.stop_time_update[i] = $root.transit_realtime.TripUpdate.StopTimeUpdate.fromObject(object.stop_time_update[i]);
                }
            }
            if (object.timestamp != null)
                if ($util.Long)
                    (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = true;
                else if (typeof object.timestamp === "string")
                    message.timestamp = parseInt(object.timestamp, 10);
                else if (typeof object.timestamp === "number")
                    message.timestamp = object.timestamp;
                else if (typeof object.timestamp === "object")
                    message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber(true);
            if (object.delay != null)
                message.delay = object.delay | 0;
            if (object.trip_properties != null) {
                if (typeof object.trip_properties !== "object")
                    throw TypeError(".transit_realtime.TripUpdate.trip_properties: object expected");
                message.trip_properties = $root.transit_realtime.TripUpdate.TripProperties.fromObject(object.trip_properties);
            }
            return message;
        };

        /**
         * Creates a plain object from a TripUpdate message. Also converts values to other types if specified.
         * @function toObject
         * @memberof transit_realtime.TripUpdate
         * @static
         * @param {transit_realtime.TripUpdate} message TripUpdate
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        TripUpdate.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults)
                object.stop_time_update = [];
            if (options.defaults) {
                object.trip = null;
                object.vehicle = null;
                if ($util.Long) {
                    let long = new $util.Long(0, 0, true);
                    object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestamp = options.longs === String ? "0" : 0;
                object.delay = 0;
                object.trip_properties = null;
            }
            if (message.trip != null && message.hasOwnProperty("trip"))
                object.trip = $root.transit_realtime.TripDescriptor.toObject(message.trip, options);
            if (message.stop_time_update && message.stop_time_update.length) {
                object.stop_time_update = [];
                for (let j = 0; j < message.stop_time_update.length; ++j)
                    object.stop_time_update[j] = $root.transit_realtime.TripUpdate.StopTimeUpdate.toObject(message.stop_time_update[j], options);
            }
            if (message.vehicle != null && message.hasOwnProperty("vehicle"))
                object.vehicle = $root.transit_realtime.VehicleDescriptor.toObject(message.vehicle, options);
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (typeof message.timestamp === "number")
                    object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                else
                    object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber(true) : message.timestamp;
            if (message.delay != null && message.hasOwnProperty("delay"))
                object.delay = message.delay;
            if (message.trip_properties != null && message.hasOwnProperty("trip_properties"))
                object.trip_properties = $root.transit_realtime.TripUpdate.TripProperties.toObject(message.trip_properties, options);
            return object;
        };

        /**
         * Converts this TripUpdate to JSON.
         * @function toJSON
         * @memberof transit_realtime.TripUpdate
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        TripUpdate.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for TripUpdate
         * @function getTypeUrl
         * @memberof transit_realtime.TripUpdate
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        TripUpdate.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/transit_realtime.TripUpdate";
        };

        TripUpdate.StopTimeEvent = (function() {

            /**
             * Properties of a StopTimeEvent.
             * @memberof transit_realtime.TripUpdate
             * @interface IStopTimeEvent
             * @property {number|null} [delay] StopTimeEvent delay
             * @property {number|Long|null} [time] StopTimeEvent time
             * @property {number|null} [uncertainty] StopTimeEvent uncertainty
             * @property {number|Long|null} [scheduled_time] StopTimeEvent scheduled_time
             */

            /**
             * Constructs a new StopTimeEvent.
             * @memberof transit_realtime.TripUpdate
             * @classdesc Represents a StopTimeEvent.
             * @implements IStopTimeEvent
             * @constructor
             * @param {transit_realtime.TripUpdate.IStopTimeEvent=} [properties] Properties to set
             */
            function StopTimeEvent(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * StopTimeEvent delay.
             * @member {number} delay
             * @memberof transit_realtime.TripUpdate.StopTimeEvent
             * @instance
             */
            StopTimeEvent.prototype.delay = 0;

            /**
             * StopTimeEvent time.
             * @member {number|Long} time
             * @memberof transit_realtime.TripUpdate.StopTimeEvent
             * @instance
             */
            StopTimeEvent.prototype.time = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

            /**
             * StopTimeEvent uncertainty.
             * @member {number} uncertainty
             * @memberof transit_realtime.TripUpdate.StopTimeEvent
             * @instance
             */
            StopTimeEvent.prototype.uncertainty = 0;

            /**
             * StopTimeEvent scheduled_time.
             * @member {number|Long} scheduled_time
             * @memberof transit_realtime.TripUpdate.StopTimeEvent
             * @instance
             */
            StopTimeEvent.prototype.scheduled_time = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

            /**
             * Creates a new StopTimeEvent instance using the specified properties.
             * @function create
             * @memberof transit_realtime.TripUpdate.StopTimeEvent
             * @static
             * @param {transit_realtime.TripUpdate.IStopTimeEvent=} [properties] Properties to set
             * @returns {transit_realtime.TripUpdate.StopTimeEvent} StopTimeEvent instance
             */
            StopTimeEvent.create = function create(properties) {
                return new StopTimeEvent(properties);
            };

            /**
             * Encodes the specified StopTimeEvent message. Does not implicitly {@link transit_realtime.TripUpdate.StopTimeEvent.verify|verify} messages.
             * @function encode
             * @memberof transit_realtime.TripUpdate.StopTimeEvent
             * @static
             * @param {transit_realtime.TripUpdate.IStopTimeEvent} message StopTimeEvent message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            StopTimeEvent.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.delay != null && Object.hasOwnProperty.call(message, "delay"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.delay);
                if (message.time != null && Object.hasOwnProperty.call(message, "time"))
                    writer.uint32(/* id 2, wireType 0 =*/16).int64(message.time);
                if (message.uncertainty != null && Object.hasOwnProperty.call(message, "uncertainty"))
                    writer.uint32(/* id 3, wireType 0 =*/24).int32(message.uncertainty);
                if (message.scheduled_time != null && Object.hasOwnProperty.call(message, "scheduled_time"))
                    writer.uint32(/* id 4, wireType 0 =*/32).int64(message.scheduled_time);
                return writer;
            };

            /**
             * Encodes the specified StopTimeEvent message, length delimited. Does not implicitly {@link transit_realtime.TripUpdate.StopTimeEvent.verify|verify} messages.
             * @function encodeDelimited
             * @memberof transit_realtime.TripUpdate.StopTimeEvent
             * @static
             * @param {transit_realtime.TripUpdate.IStopTimeEvent} message StopTimeEvent message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            StopTimeEvent.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a StopTimeEvent message from the specified reader or buffer.
             * @function decode
             * @memberof transit_realtime.TripUpdate.StopTimeEvent
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {transit_realtime.TripUpdate.StopTimeEvent} StopTimeEvent
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            StopTimeEvent.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.transit_realtime.TripUpdate.StopTimeEvent();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.delay = reader.int32();
                            break;
                        }
                    case 2: {
                            message.time = reader.int64();
                            break;
                        }
                    case 3: {
                            message.uncertainty = reader.int32();
                            break;
                        }
                    case 4: {
                            message.scheduled_time = reader.int64();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a StopTimeEvent message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof transit_realtime.TripUpdate.StopTimeEvent
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {transit_realtime.TripUpdate.StopTimeEvent} StopTimeEvent
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            StopTimeEvent.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a StopTimeEvent message.
             * @function verify
             * @memberof transit_realtime.TripUpdate.StopTimeEvent
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            StopTimeEvent.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.delay != null && message.hasOwnProperty("delay"))
                    if (!$util.isInteger(message.delay))
                        return "delay: integer expected";
                if (message.time != null && message.hasOwnProperty("time"))
                    if (!$util.isInteger(message.time) && !(message.time && $util.isInteger(message.time.low) && $util.isInteger(message.time.high)))
                        return "time: integer|Long expected";
                if (message.uncertainty != null && message.hasOwnProperty("uncertainty"))
                    if (!$util.isInteger(message.uncertainty))
                        return "uncertainty: integer expected";
                if (message.scheduled_time != null && message.hasOwnProperty("scheduled_time"))
                    if (!$util.isInteger(message.scheduled_time) && !(message.scheduled_time && $util.isInteger(message.scheduled_time.low) && $util.isInteger(message.scheduled_time.high)))
                        return "scheduled_time: integer|Long expected";
                return null;
            };

            /**
             * Creates a StopTimeEvent message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof transit_realtime.TripUpdate.StopTimeEvent
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {transit_realtime.TripUpdate.StopTimeEvent} StopTimeEvent
             */
            StopTimeEvent.fromObject = function fromObject(object) {
                if (object instanceof $root.transit_realtime.TripUpdate.StopTimeEvent)
                    return object;
                let message = new $root.transit_realtime.TripUpdate.StopTimeEvent();
                if (object.delay != null)
                    message.delay = object.delay | 0;
                if (object.time != null)
                    if ($util.Long)
                        (message.time = $util.Long.fromValue(object.time)).unsigned = false;
                    else if (typeof object.time === "string")
                        message.time = parseInt(object.time, 10);
                    else if (typeof object.time === "number")
                        message.time = object.time;
                    else if (typeof object.time === "object")
                        message.time = new $util.LongBits(object.time.low >>> 0, object.time.high >>> 0).toNumber();
                if (object.uncertainty != null)
                    message.uncertainty = object.uncertainty | 0;
                if (object.scheduled_time != null)
                    if ($util.Long)
                        (message.scheduled_time = $util.Long.fromValue(object.scheduled_time)).unsigned = false;
                    else if (typeof object.scheduled_time === "string")
                        message.scheduled_time = parseInt(object.scheduled_time, 10);
                    else if (typeof object.scheduled_time === "number")
                        message.scheduled_time = object.scheduled_time;
                    else if (typeof object.scheduled_time === "object")
                        message.scheduled_time = new $util.LongBits(object.scheduled_time.low >>> 0, object.scheduled_time.high >>> 0).toNumber();
                return message;
            };

            /**
             * Creates a plain object from a StopTimeEvent message. Also converts values to other types if specified.
             * @function toObject
             * @memberof transit_realtime.TripUpdate.StopTimeEvent
             * @static
             * @param {transit_realtime.TripUpdate.StopTimeEvent} message StopTimeEvent
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            StopTimeEvent.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.delay = 0;
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, false);
                        object.time = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.time = options.longs === String ? "0" : 0;
                    object.uncertainty = 0;
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, false);
                        object.scheduled_time = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.scheduled_time = options.longs === String ? "0" : 0;
                }
                if (message.delay != null && message.hasOwnProperty("delay"))
                    object.delay = message.delay;
                if (message.time != null && message.hasOwnProperty("time"))
                    if (typeof message.time === "number")
                        object.time = options.longs === String ? String(message.time) : message.time;
                    else
                        object.time = options.longs === String ? $util.Long.prototype.toString.call(message.time) : options.longs === Number ? new $util.LongBits(message.time.low >>> 0, message.time.high >>> 0).toNumber() : message.time;
                if (message.uncertainty != null && message.hasOwnProperty("uncertainty"))
                    object.uncertainty = message.uncertainty;
                if (message.scheduled_time != null && message.hasOwnProperty("scheduled_time"))
                    if (typeof message.scheduled_time === "number")
                        object.scheduled_time = options.longs === String ? String(message.scheduled_time) : message.scheduled_time;
                    else
                        object.scheduled_time = options.longs === String ? $util.Long.prototype.toString.call(message.scheduled_time) : options.longs === Number ? new $util.LongBits(message.scheduled_time.low >>> 0, message.scheduled_time.high >>> 0).toNumber() : message.scheduled_time;
                return object;
            };

            /**
             * Converts this StopTimeEvent to JSON.
             * @function toJSON
             * @memberof transit_realtime.TripUpdate.StopTimeEvent
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            StopTimeEvent.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for StopTimeEvent
             * @function getTypeUrl
             * @memberof transit_realtime.TripUpdate.StopTimeEvent
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            StopTimeEvent.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/transit_realtime.TripUpdate.StopTimeEvent";
            };

            return StopTimeEvent;
        })();

        TripUpdate.StopTimeUpdate = (function() {

            /**
             * Properties of a StopTimeUpdate.
             * @memberof transit_realtime.TripUpdate
             * @interface IStopTimeUpdate
             * @property {number|null} [stop_sequence] StopTimeUpdate stop_sequence
             * @property {string|null} [stop_id] StopTimeUpdate stop_id
             * @property {transit_realtime.TripUpdate.IStopTimeEvent|null} [arrival] StopTimeUpdate arrival
             * @property {transit_realtime.TripUpdate.IStopTimeEvent|null} [departure] StopTimeUpdate departure
             * @property {transit_realtime.VehiclePosition.OccupancyStatus|null} [departure_occupancy_status] StopTimeUpdate departure_occupancy_status
             * @property {transit_realtime.TripUpdate.StopTimeUpdate.ScheduleRelationship|null} [schedule_relationship] StopTimeUpdate schedule_relationship
             * @property {transit_realtime.TripUpdate.StopTimeUpdate.IStopTimeProperties|null} [stop_time_properties] StopTimeUpdate stop_time_properties
             */

            /**
             * Constructs a new StopTimeUpdate.
             * @memberof transit_realtime.TripUpdate
             * @classdesc Represents a StopTimeUpdate.
             * @implements IStopTimeUpdate
             * @constructor
             * @param {transit_realtime.TripUpdate.IStopTimeUpdate=} [properties] Properties to set
             */
            function StopTimeUpdate(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * StopTimeUpdate stop_sequence.
             * @member {number} stop_sequence
             * @memberof transit_realtime.TripUpdate.StopTimeUpdate
             * @instance
             */
            StopTimeUpdate.prototype.stop_sequence = 0;

            /**
             * StopTimeUpdate stop_id.
             * @member {string} stop_id
             * @memberof transit_realtime.TripUpdate.StopTimeUpdate
             * @instance
             */
            StopTimeUpdate.prototype.stop_id = "";

            /**
             * StopTimeUpdate arrival.
             * @member {transit_realtime.TripUpdate.IStopTimeEvent|null|undefined} arrival
             * @memberof transit_realtime.TripUpdate.StopTimeUpdate
             * @instance
             */
            StopTimeUpdate.prototype.arrival = null;

            /**
             * StopTimeUpdate departure.
             * @member {transit_realtime.TripUpdate.IStopTimeEvent|null|undefined} departure
             * @memberof transit_realtime.TripUpdate.StopTimeUpdate
             * @instance
             */
            StopTimeUpdate.prototype.departure = null;

            /**
             * StopTimeUpdate departure_occupancy_status.
             * @member {transit_realtime.VehiclePosition.OccupancyStatus} departure_occupancy_status
             * @memberof transit_realtime.TripUpdate.StopTimeUpdate
             * @instance
             */
            StopTimeUpdate.prototype.departure_occupancy_status = 0;

            /**
             * StopTimeUpdate schedule_relationship.
             * @member {transit_realtime.TripUpdate.StopTimeUpdate.ScheduleRelationship} schedule_relationship
             * @memberof transit_realtime.TripUpdate.StopTimeUpdate
             * @instance
             */
            StopTimeUpdate.prototype.schedule_relationship = 0;

            /**
             * StopTimeUpdate stop_time_properties.
             * @member {transit_realtime.TripUpdate.StopTimeUpdate.IStopTimeProperties|null|undefined} stop_time_properties
             * @memberof transit_realtime.TripUpdate.StopTimeUpdate
             * @instance
             */
            StopTimeUpdate.prototype.stop_time_properties = null;

            /**
             * Creates a new StopTimeUpdate instance using the specified properties.
             * @function create
             * @memberof transit_realtime.TripUpdate.StopTimeUpdate
             * @static
             * @param {transit_realtime.TripUpdate.IStopTimeUpdate=} [properties] Properties to set
             * @returns {transit_realtime.TripUpdate.StopTimeUpdate} StopTimeUpdate instance
             */
            StopTimeUpdate.create = function create(properties) {
                return new StopTimeUpdate(properties);
            };

            /**
             * Encodes the specified StopTimeUpdate message. Does not implicitly {@link transit_realtime.TripUpdate.StopTimeUpdate.verify|verify} messages.
             * @function encode
             * @memberof transit_realtime.TripUpdate.StopTimeUpdate
             * @static
             * @param {transit_realtime.TripUpdate.IStopTimeUpdate} message StopTimeUpdate message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            StopTimeUpdate.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.stop_sequence != null && Object.hasOwnProperty.call(message, "stop_sequence"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.stop_sequence);
                if (message.arrival != null && Object.hasOwnProperty.call(message, "arrival"))
                    $root.transit_realtime.TripUpdate.StopTimeEvent.encode(message.arrival, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.departure != null && Object.hasOwnProperty.call(message, "departure"))
                    $root.transit_realtime.TripUpdate.StopTimeEvent.encode(message.departure, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
                if (message.stop_id != null && Object.hasOwnProperty.call(message, "stop_id"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.stop_id);
                if (message.schedule_relationship != null && Object.hasOwnProperty.call(message, "schedule_relationship"))
                    writer.uint32(/* id 5, wireType 0 =*/40).int32(message.schedule_relationship);
                if (message.stop_time_properties != null && Object.hasOwnProperty.call(message, "stop_time_properties"))
                    $root.transit_realtime.TripUpdate.StopTimeUpdate.StopTimeProperties.encode(message.stop_time_properties, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                if (message.departure_occupancy_status != null && Object.hasOwnProperty.call(message, "departure_occupancy_status"))
                    writer.uint32(/* id 7, wireType 0 =*/56).int32(message.departure_occupancy_status);
                return writer;
            };

            /**
             * Encodes the specified StopTimeUpdate message, length delimited. Does not implicitly {@link transit_realtime.TripUpdate.StopTimeUpdate.verify|verify} messages.
             * @function encodeDelimited
             * @memberof transit_realtime.TripUpdate.StopTimeUpdate
             * @static
             * @param {transit_realtime.TripUpdate.IStopTimeUpdate} message StopTimeUpdate message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            StopTimeUpdate.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a StopTimeUpdate message from the specified reader or buffer.
             * @function decode
             * @memberof transit_realtime.TripUpdate.StopTimeUpdate
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {transit_realtime.TripUpdate.StopTimeUpdate} StopTimeUpdate
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            StopTimeUpdate.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.transit_realtime.TripUpdate.StopTimeUpdate();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.stop_sequence = reader.uint32();
                            break;
                        }
                    case 4: {
                            message.stop_id = reader.string();
                            break;
                        }
                    case 2: {
                            message.arrival = $root.transit_realtime.TripUpdate.StopTimeEvent.decode(reader, reader.uint32());
                            break;
                        }
                    case 3: {
                            message.departure = $root.transit_realtime.TripUpdate.StopTimeEvent.decode(reader, reader.uint32());
                            break;
                        }
                    case 7: {
                            message.departure_occupancy_status = reader.int32();
                            break;
                        }
                    case 5: {
                            message.schedule_relationship = reader.int32();
                            break;
                        }
                    case 6: {
                            message.stop_time_properties = $root.transit_realtime.TripUpdate.StopTimeUpdate.StopTimeProperties.decode(reader, reader.uint32());
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a StopTimeUpdate message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof transit_realtime.TripUpdate.StopTimeUpdate
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {transit_realtime.TripUpdate.StopTimeUpdate} StopTimeUpdate
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            StopTimeUpdate.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a StopTimeUpdate message.
             * @function verify
             * @memberof transit_realtime.TripUpdate.StopTimeUpdate
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            StopTimeUpdate.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.stop_sequence != null && message.hasOwnProperty("stop_sequence"))
                    if (!$util.isInteger(message.stop_sequence))
                        return "stop_sequence: integer expected";
                if (message.stop_id != null && message.hasOwnProperty("stop_id"))
                    if (!$util.isString(message.stop_id))
                        return "stop_id: string expected";
                if (message.arrival != null && message.hasOwnProperty("arrival")) {
                    let error = $root.transit_realtime.TripUpdate.StopTimeEvent.verify(message.arrival);
                    if (error)
                        return "arrival." + error;
                }
                if (message.departure != null && message.hasOwnProperty("departure")) {
                    let error = $root.transit_realtime.TripUpdate.StopTimeEvent.verify(message.departure);
                    if (error)
                        return "departure." + error;
                }
                if (message.departure_occupancy_status != null && message.hasOwnProperty("departure_occupancy_status"))
                    switch (message.departure_occupancy_status) {
                    default:
                        return "departure_occupancy_status: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                    case 8:
                        break;
                    }
                if (message.schedule_relationship != null && message.hasOwnProperty("schedule_relationship"))
                    switch (message.schedule_relationship) {
                    default:
                        return "schedule_relationship: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                        break;
                    }
                if (message.stop_time_properties != null && message.hasOwnProperty("stop_time_properties")) {
                    let error = $root.transit_realtime.TripUpdate.StopTimeUpdate.StopTimeProperties.verify(message.stop_time_properties);
                    if (error)
                        return "stop_time_properties." + error;
                }
                return null;
            };

            /**
             * Creates a StopTimeUpdate message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof transit_realtime.TripUpdate.StopTimeUpdate
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {transit_realtime.TripUpdate.StopTimeUpdate} StopTimeUpdate
             */
            StopTimeUpdate.fromObject = function fromObject(object) {
                if (object instanceof $root.transit_realtime.TripUpdate.StopTimeUpdate)
                    return object;
                let message = new $root.transit_realtime.TripUpdate.StopTimeUpdate();
                if (object.stop_sequence != null)
                    message.stop_sequence = object.stop_sequence >>> 0;
                if (object.stop_id != null)
                    message.stop_id = String(object.stop_id);
                if (object.arrival != null) {
                    if (typeof object.arrival !== "object")
                        throw TypeError(".transit_realtime.TripUpdate.StopTimeUpdate.arrival: object expected");
                    message.arrival = $root.transit_realtime.TripUpdate.StopTimeEvent.fromObject(object.arrival);
                }
                if (object.departure != null) {
                    if (typeof object.departure !== "object")
                        throw TypeError(".transit_realtime.TripUpdate.StopTimeUpdate.departure: object expected");
                    message.departure = $root.transit_realtime.TripUpdate.StopTimeEvent.fromObject(object.departure);
                }
                switch (object.departure_occupancy_status) {
                default:
                    if (typeof object.departure_occupancy_status === "number") {
                        message.departure_occupancy_status = object.departure_occupancy_status;
                        break;
                    }
                    break;
                case "EMPTY":
                case 0:
                    message.departure_occupancy_status = 0;
                    break;
                case "MANY_SEATS_AVAILABLE":
                case 1:
                    message.departure_occupancy_status = 1;
                    break;
                case "FEW_SEATS_AVAILABLE":
                case 2:
                    message.departure_occupancy_status = 2;
                    break;
                case "STANDING_ROOM_ONLY":
                case 3:
                    message.departure_occupancy_status = 3;
                    break;
                case "CRUSHED_STANDING_ROOM_ONLY":
                case 4:
                    message.departure_occupancy_status = 4;
                    break;
                case "FULL":
                case 5:
                    message.departure_occupancy_status = 5;
                    break;
                case "NOT_ACCEPTING_PASSENGERS":
                case 6:
                    message.departure_occupancy_status = 6;
                    break;
                case "NO_DATA_AVAILABLE":
                case 7:
                    message.departure_occupancy_status = 7;
                    break;
                case "NOT_BOARDABLE":
                case 8:
                    message.departure_occupancy_status = 8;
                    break;
                }
                switch (object.schedule_relationship) {
                default:
                    if (typeof object.schedule_relationship === "number") {
                        message.schedule_relationship = object.schedule_relationship;
                        break;
                    }
                    break;
                case "SCHEDULED":
                case 0:
                    message.schedule_relationship = 0;
                    break;
                case "SKIPPED":
                case 1:
                    message.schedule_relationship = 1;
                    break;
                case "NO_DATA":
                case 2:
                    message.schedule_relationship = 2;
                    break;
                case "UNSCHEDULED":
                case 3:
                    message.schedule_relationship = 3;
                    break;
                }
                if (object.stop_time_properties != null) {
                    if (typeof object.stop_time_properties !== "object")
                        throw TypeError(".transit_realtime.TripUpdate.StopTimeUpdate.stop_time_properties: object expected");
                    message.stop_time_properties = $root.transit_realtime.TripUpdate.StopTimeUpdate.StopTimeProperties.fromObject(object.stop_time_properties);
                }
                return message;
            };

            /**
             * Creates a plain object from a StopTimeUpdate message. Also converts values to other types if specified.
             * @function toObject
             * @memberof transit_realtime.TripUpdate.StopTimeUpdate
             * @static
             * @param {transit_realtime.TripUpdate.StopTimeUpdate} message StopTimeUpdate
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            StopTimeUpdate.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.stop_sequence = 0;
                    object.arrival = null;
                    object.departure = null;
                    object.stop_id = "";
                    object.schedule_relationship = options.enums === String ? "SCHEDULED" : 0;
                    object.stop_time_properties = null;
                    object.departure_occupancy_status = options.enums === String ? "EMPTY" : 0;
                }
                if (message.stop_sequence != null && message.hasOwnProperty("stop_sequence"))
                    object.stop_sequence = message.stop_sequence;
                if (message.arrival != null && message.hasOwnProperty("arrival"))
                    object.arrival = $root.transit_realtime.TripUpdate.StopTimeEvent.toObject(message.arrival, options);
                if (message.departure != null && message.hasOwnProperty("departure"))
                    object.departure = $root.transit_realtime.TripUpdate.StopTimeEvent.toObject(message.departure, options);
                if (message.stop_id != null && message.hasOwnProperty("stop_id"))
                    object.stop_id = message.stop_id;
                if (message.schedule_relationship != null && message.hasOwnProperty("schedule_relationship"))
                    object.schedule_relationship = options.enums === String ? $root.transit_realtime.TripUpdate.StopTimeUpdate.ScheduleRelationship[message.schedule_relationship] === undefined ? message.schedule_relationship : $root.transit_realtime.TripUpdate.StopTimeUpdate.ScheduleRelationship[message.schedule_relationship] : message.schedule_relationship;
                if (message.stop_time_properties != null && message.hasOwnProperty("stop_time_properties"))
                    object.stop_time_properties = $root.transit_realtime.TripUpdate.StopTimeUpdate.StopTimeProperties.toObject(message.stop_time_properties, options);
                if (message.departure_occupancy_status != null && message.hasOwnProperty("departure_occupancy_status"))
                    object.departure_occupancy_status = options.enums === String ? $root.transit_realtime.VehiclePosition.OccupancyStatus[message.departure_occupancy_status] === undefined ? message.departure_occupancy_status : $root.transit_realtime.VehiclePosition.OccupancyStatus[message.departure_occupancy_status] : message.departure_occupancy_status;
                return object;
            };

            /**
             * Converts this StopTimeUpdate to JSON.
             * @function toJSON
             * @memberof transit_realtime.TripUpdate.StopTimeUpdate
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            StopTimeUpdate.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for StopTimeUpdate
             * @function getTypeUrl
             * @memberof transit_realtime.TripUpdate.StopTimeUpdate
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            StopTimeUpdate.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/transit_realtime.TripUpdate.StopTimeUpdate";
            };

            /**
             * ScheduleRelationship enum.
             * @name transit_realtime.TripUpdate.StopTimeUpdate.ScheduleRelationship
             * @enum {number}
             * @property {number} SCHEDULED=0 SCHEDULED value
             * @property {number} SKIPPED=1 SKIPPED value
             * @property {number} NO_DATA=2 NO_DATA value
             * @property {number} UNSCHEDULED=3 UNSCHEDULED value
             */
            StopTimeUpdate.ScheduleRelationship = (function() {
                const valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "SCHEDULED"] = 0;
                values[valuesById[1] = "SKIPPED"] = 1;
                values[valuesById[2] = "NO_DATA"] = 2;
                values[valuesById[3] = "UNSCHEDULED"] = 3;
                return values;
            })();

            StopTimeUpdate.StopTimeProperties = (function() {

                /**
                 * Properties of a StopTimeProperties.
                 * @memberof transit_realtime.TripUpdate.StopTimeUpdate
                 * @interface IStopTimeProperties
                 * @property {string|null} [assigned_stop_id] StopTimeProperties assigned_stop_id
                 * @property {string|null} [stop_headsign] StopTimeProperties stop_headsign
                 * @property {transit_realtime.TripUpdate.StopTimeUpdate.StopTimeProperties.DropOffPickupType|null} [pickup_type] StopTimeProperties pickup_type
                 * @property {transit_realtime.TripUpdate.StopTimeUpdate.StopTimeProperties.DropOffPickupType|null} [drop_off_type] StopTimeProperties drop_off_type
                 */

                /**
                 * Constructs a new StopTimeProperties.
                 * @memberof transit_realtime.TripUpdate.StopTimeUpdate
                 * @classdesc Represents a StopTimeProperties.
                 * @implements IStopTimeProperties
                 * @constructor
                 * @param {transit_realtime.TripUpdate.StopTimeUpdate.IStopTimeProperties=} [properties] Properties to set
                 */
                function StopTimeProperties(properties) {
                    if (properties)
                        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * StopTimeProperties assigned_stop_id.
                 * @member {string} assigned_stop_id
                 * @memberof transit_realtime.TripUpdate.StopTimeUpdate.StopTimeProperties
                 * @instance
                 */
                StopTimeProperties.prototype.assigned_stop_id = "";

                /**
                 * StopTimeProperties stop_headsign.
                 * @member {string} stop_headsign
                 * @memberof transit_realtime.TripUpdate.StopTimeUpdate.StopTimeProperties
                 * @instance
                 */
                StopTimeProperties.prototype.stop_headsign = "";

                /**
                 * StopTimeProperties pickup_type.
                 * @member {transit_realtime.TripUpdate.StopTimeUpdate.StopTimeProperties.DropOffPickupType} pickup_type
                 * @memberof transit_realtime.TripUpdate.StopTimeUpdate.StopTimeProperties
                 * @instance
                 */
                StopTimeProperties.prototype.pickup_type = 0;

                /**
                 * StopTimeProperties drop_off_type.
                 * @member {transit_realtime.TripUpdate.StopTimeUpdate.StopTimeProperties.DropOffPickupType} drop_off_type
                 * @memberof transit_realtime.TripUpdate.StopTimeUpdate.StopTimeProperties
                 * @instance
                 */
                StopTimeProperties.prototype.drop_off_type = 0;

                /**
                 * Creates a new StopTimeProperties instance using the specified properties.
                 * @function create
                 * @memberof transit_realtime.TripUpdate.StopTimeUpdate.StopTimeProperties
                 * @static
                 * @param {transit_realtime.TripUpdate.StopTimeUpdate.IStopTimeProperties=} [properties] Properties to set
                 * @returns {transit_realtime.TripUpdate.StopTimeUpdate.StopTimeProperties} StopTimeProperties instance
                 */
                StopTimeProperties.create = function create(properties) {
                    return new StopTimeProperties(properties);
                };

                /**
                 * Encodes the specified StopTimeProperties message. Does not implicitly {@link transit_realtime.TripUpdate.StopTimeUpdate.StopTimeProperties.verify|verify} messages.
                 * @function encode
                 * @memberof transit_realtime.TripUpdate.StopTimeUpdate.StopTimeProperties
                 * @static
                 * @param {transit_realtime.TripUpdate.StopTimeUpdate.IStopTimeProperties} message StopTimeProperties message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                StopTimeProperties.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.assigned_stop_id != null && Object.hasOwnProperty.call(message, "assigned_stop_id"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.assigned_stop_id);
                    if (message.stop_headsign != null && Object.hasOwnProperty.call(message, "stop_headsign"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.stop_headsign);
                    if (message.pickup_type != null && Object.hasOwnProperty.call(message, "pickup_type"))
                        writer.uint32(/* id 3, wireType 0 =*/24).int32(message.pickup_type);
                    if (message.drop_off_type != null && Object.hasOwnProperty.call(message, "drop_off_type"))
                        writer.uint32(/* id 4, wireType 0 =*/32).int32(message.drop_off_type);
                    return writer;
                };

                /**
                 * Encodes the specified StopTimeProperties message, length delimited. Does not implicitly {@link transit_realtime.TripUpdate.StopTimeUpdate.StopTimeProperties.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof transit_realtime.TripUpdate.StopTimeUpdate.StopTimeProperties
                 * @static
                 * @param {transit_realtime.TripUpdate.StopTimeUpdate.IStopTimeProperties} message StopTimeProperties message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                StopTimeProperties.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a StopTimeProperties message from the specified reader or buffer.
                 * @function decode
                 * @memberof transit_realtime.TripUpdate.StopTimeUpdate.StopTimeProperties
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {transit_realtime.TripUpdate.StopTimeUpdate.StopTimeProperties} StopTimeProperties
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                StopTimeProperties.decode = function decode(reader, length, error) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    let end = length === undefined ? reader.len : reader.pos + length, message = new $root.transit_realtime.TripUpdate.StopTimeUpdate.StopTimeProperties();
                    while (reader.pos < end) {
                        let tag = reader.uint32();
                        if (tag === error)
                            break;
                        switch (tag >>> 3) {
                        case 1: {
                                message.assigned_stop_id = reader.string();
                                break;
                            }
                        case 2: {
                                message.stop_headsign = reader.string();
                                break;
                            }
                        case 3: {
                                message.pickup_type = reader.int32();
                                break;
                            }
                        case 4: {
                                message.drop_off_type = reader.int32();
                                break;
                            }
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a StopTimeProperties message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof transit_realtime.TripUpdate.StopTimeUpdate.StopTimeProperties
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {transit_realtime.TripUpdate.StopTimeUpdate.StopTimeProperties} StopTimeProperties
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                StopTimeProperties.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a StopTimeProperties message.
                 * @function verify
                 * @memberof transit_realtime.TripUpdate.StopTimeUpdate.StopTimeProperties
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                StopTimeProperties.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.assigned_stop_id != null && message.hasOwnProperty("assigned_stop_id"))
                        if (!$util.isString(message.assigned_stop_id))
                            return "assigned_stop_id: string expected";
                    if (message.stop_headsign != null && message.hasOwnProperty("stop_headsign"))
                        if (!$util.isString(message.stop_headsign))
                            return "stop_headsign: string expected";
                    if (message.pickup_type != null && message.hasOwnProperty("pickup_type"))
                        switch (message.pickup_type) {
                        default:
                            return "pickup_type: enum value expected";
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                            break;
                        }
                    if (message.drop_off_type != null && message.hasOwnProperty("drop_off_type"))
                        switch (message.drop_off_type) {
                        default:
                            return "drop_off_type: enum value expected";
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                            break;
                        }
                    return null;
                };

                /**
                 * Creates a StopTimeProperties message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof transit_realtime.TripUpdate.StopTimeUpdate.StopTimeProperties
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {transit_realtime.TripUpdate.StopTimeUpdate.StopTimeProperties} StopTimeProperties
                 */
                StopTimeProperties.fromObject = function fromObject(object) {
                    if (object instanceof $root.transit_realtime.TripUpdate.StopTimeUpdate.StopTimeProperties)
                        return object;
                    let message = new $root.transit_realtime.TripUpdate.StopTimeUpdate.StopTimeProperties();
                    if (object.assigned_stop_id != null)
                        message.assigned_stop_id = String(object.assigned_stop_id);
                    if (object.stop_headsign != null)
                        message.stop_headsign = String(object.stop_headsign);
                    switch (object.pickup_type) {
                    default:
                        if (typeof object.pickup_type === "number") {
                            message.pickup_type = object.pickup_type;
                            break;
                        }
                        break;
                    case "REGULAR":
                    case 0:
                        message.pickup_type = 0;
                        break;
                    case "NONE":
                    case 1:
                        message.pickup_type = 1;
                        break;
                    case "PHONE_AGENCY":
                    case 2:
                        message.pickup_type = 2;
                        break;
                    case "COORDINATE_WITH_DRIVER":
                    case 3:
                        message.pickup_type = 3;
                        break;
                    }
                    switch (object.drop_off_type) {
                    default:
                        if (typeof object.drop_off_type === "number") {
                            message.drop_off_type = object.drop_off_type;
                            break;
                        }
                        break;
                    case "REGULAR":
                    case 0:
                        message.drop_off_type = 0;
                        break;
                    case "NONE":
                    case 1:
                        message.drop_off_type = 1;
                        break;
                    case "PHONE_AGENCY":
                    case 2:
                        message.drop_off_type = 2;
                        break;
                    case "COORDINATE_WITH_DRIVER":
                    case 3:
                        message.drop_off_type = 3;
                        break;
                    }
                    return message;
                };

                /**
                 * Creates a plain object from a StopTimeProperties message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof transit_realtime.TripUpdate.StopTimeUpdate.StopTimeProperties
                 * @static
                 * @param {transit_realtime.TripUpdate.StopTimeUpdate.StopTimeProperties} message StopTimeProperties
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                StopTimeProperties.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    let object = {};
                    if (options.defaults) {
                        object.assigned_stop_id = "";
                        object.stop_headsign = "";
                        object.pickup_type = options.enums === String ? "REGULAR" : 0;
                        object.drop_off_type = options.enums === String ? "REGULAR" : 0;
                    }
                    if (message.assigned_stop_id != null && message.hasOwnProperty("assigned_stop_id"))
                        object.assigned_stop_id = message.assigned_stop_id;
                    if (message.stop_headsign != null && message.hasOwnProperty("stop_headsign"))
                        object.stop_headsign = message.stop_headsign;
                    if (message.pickup_type != null && message.hasOwnProperty("pickup_type"))
                        object.pickup_type = options.enums === String ? $root.transit_realtime.TripUpdate.StopTimeUpdate.StopTimeProperties.DropOffPickupType[message.pickup_type] === undefined ? message.pickup_type : $root.transit_realtime.TripUpdate.StopTimeUpdate.StopTimeProperties.DropOffPickupType[message.pickup_type] : message.pickup_type;
                    if (message.drop_off_type != null && message.hasOwnProperty("drop_off_type"))
                        object.drop_off_type = options.enums === String ? $root.transit_realtime.TripUpdate.StopTimeUpdate.StopTimeProperties.DropOffPickupType[message.drop_off_type] === undefined ? message.drop_off_type : $root.transit_realtime.TripUpdate.StopTimeUpdate.StopTimeProperties.DropOffPickupType[message.drop_off_type] : message.drop_off_type;
                    return object;
                };

                /**
                 * Converts this StopTimeProperties to JSON.
                 * @function toJSON
                 * @memberof transit_realtime.TripUpdate.StopTimeUpdate.StopTimeProperties
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                StopTimeProperties.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                /**
                 * Gets the default type url for StopTimeProperties
                 * @function getTypeUrl
                 * @memberof transit_realtime.TripUpdate.StopTimeUpdate.StopTimeProperties
                 * @static
                 * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
                 * @returns {string} The default type url
                 */
                StopTimeProperties.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                    if (typeUrlPrefix === undefined) {
                        typeUrlPrefix = "type.googleapis.com";
                    }
                    return typeUrlPrefix + "/transit_realtime.TripUpdate.StopTimeUpdate.StopTimeProperties";
                };

                /**
                 * DropOffPickupType enum.
                 * @name transit_realtime.TripUpdate.StopTimeUpdate.StopTimeProperties.DropOffPickupType
                 * @enum {number}
                 * @property {number} REGULAR=0 REGULAR value
                 * @property {number} NONE=1 NONE value
                 * @property {number} PHONE_AGENCY=2 PHONE_AGENCY value
                 * @property {number} COORDINATE_WITH_DRIVER=3 COORDINATE_WITH_DRIVER value
                 */
                StopTimeProperties.DropOffPickupType = (function() {
                    const valuesById = {}, values = Object.create(valuesById);
                    values[valuesById[0] = "REGULAR"] = 0;
                    values[valuesById[1] = "NONE"] = 1;
                    values[valuesById[2] = "PHONE_AGENCY"] = 2;
                    values[valuesById[3] = "COORDINATE_WITH_DRIVER"] = 3;
                    return values;
                })();

                return StopTimeProperties;
            })();

            return StopTimeUpdate;
        })();

        TripUpdate.TripProperties = (function() {

            /**
             * Properties of a TripProperties.
             * @memberof transit_realtime.TripUpdate
             * @interface ITripProperties
             * @property {string|null} [trip_id] TripProperties trip_id
             * @property {string|null} [start_date] TripProperties start_date
             * @property {string|null} [start_time] TripProperties start_time
             * @property {string|null} [shape_id] TripProperties shape_id
             * @property {string|null} [trip_headsign] TripProperties trip_headsign
             * @property {string|null} [trip_short_name] TripProperties trip_short_name
             */

            /**
             * Constructs a new TripProperties.
             * @memberof transit_realtime.TripUpdate
             * @classdesc Represents a TripProperties.
             * @implements ITripProperties
             * @constructor
             * @param {transit_realtime.TripUpdate.ITripProperties=} [properties] Properties to set
             */
            function TripProperties(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * TripProperties trip_id.
             * @member {string} trip_id
             * @memberof transit_realtime.TripUpdate.TripProperties
             * @instance
             */
            TripProperties.prototype.trip_id = "";

            /**
             * TripProperties start_date.
             * @member {string} start_date
             * @memberof transit_realtime.TripUpdate.TripProperties
             * @instance
             */
            TripProperties.prototype.start_date = "";

            /**
             * TripProperties start_time.
             * @member {string} start_time
             * @memberof transit_realtime.TripUpdate.TripProperties
             * @instance
             */
            TripProperties.prototype.start_time = "";

            /**
             * TripProperties shape_id.
             * @member {string} shape_id
             * @memberof transit_realtime.TripUpdate.TripProperties
             * @instance
             */
            TripProperties.prototype.shape_id = "";

            /**
             * TripProperties trip_headsign.
             * @member {string} trip_headsign
             * @memberof transit_realtime.TripUpdate.TripProperties
             * @instance
             */
            TripProperties.prototype.trip_headsign = "";

            /**
             * TripProperties trip_short_name.
             * @member {string} trip_short_name
             * @memberof transit_realtime.TripUpdate.TripProperties
             * @instance
             */
            TripProperties.prototype.trip_short_name = "";

            /**
             * Creates a new TripProperties instance using the specified properties.
             * @function create
             * @memberof transit_realtime.TripUpdate.TripProperties
             * @static
             * @param {transit_realtime.TripUpdate.ITripProperties=} [properties] Properties to set
             * @returns {transit_realtime.TripUpdate.TripProperties} TripProperties instance
             */
            TripProperties.create = function create(properties) {
                return new TripProperties(properties);
            };

            /**
             * Encodes the specified TripProperties message. Does not implicitly {@link transit_realtime.TripUpdate.TripProperties.verify|verify} messages.
             * @function encode
             * @memberof transit_realtime.TripUpdate.TripProperties
             * @static
             * @param {transit_realtime.TripUpdate.ITripProperties} message TripProperties message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            TripProperties.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.trip_id != null && Object.hasOwnProperty.call(message, "trip_id"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.trip_id);
                if (message.start_date != null && Object.hasOwnProperty.call(message, "start_date"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.start_date);
                if (message.start_time != null && Object.hasOwnProperty.call(message, "start_time"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.start_time);
                if (message.shape_id != null && Object.hasOwnProperty.call(message, "shape_id"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.shape_id);
                if (message.trip_headsign != null && Object.hasOwnProperty.call(message, "trip_headsign"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.trip_headsign);
                if (message.trip_short_name != null && Object.hasOwnProperty.call(message, "trip_short_name"))
                    writer.uint32(/* id 6, wireType 2 =*/50).string(message.trip_short_name);
                return writer;
            };

            /**
             * Encodes the specified TripProperties message, length delimited. Does not implicitly {@link transit_realtime.TripUpdate.TripProperties.verify|verify} messages.
             * @function encodeDelimited
             * @memberof transit_realtime.TripUpdate.TripProperties
             * @static
             * @param {transit_realtime.TripUpdate.ITripProperties} message TripProperties message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            TripProperties.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a TripProperties message from the specified reader or buffer.
             * @function decode
             * @memberof transit_realtime.TripUpdate.TripProperties
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {transit_realtime.TripUpdate.TripProperties} TripProperties
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            TripProperties.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.transit_realtime.TripUpdate.TripProperties();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.trip_id = reader.string();
                            break;
                        }
                    case 2: {
                            message.start_date = reader.string();
                            break;
                        }
                    case 3: {
                            message.start_time = reader.string();
                            break;
                        }
                    case 4: {
                            message.shape_id = reader.string();
                            break;
                        }
                    case 5: {
                            message.trip_headsign = reader.string();
                            break;
                        }
                    case 6: {
                            message.trip_short_name = reader.string();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a TripProperties message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof transit_realtime.TripUpdate.TripProperties
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {transit_realtime.TripUpdate.TripProperties} TripProperties
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            TripProperties.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a TripProperties message.
             * @function verify
             * @memberof transit_realtime.TripUpdate.TripProperties
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            TripProperties.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.trip_id != null && message.hasOwnProperty("trip_id"))
                    if (!$util.isString(message.trip_id))
                        return "trip_id: string expected";
                if (message.start_date != null && message.hasOwnProperty("start_date"))
                    if (!$util.isString(message.start_date))
                        return "start_date: string expected";
                if (message.start_time != null && message.hasOwnProperty("start_time"))
                    if (!$util.isString(message.start_time))
                        return "start_time: string expected";
                if (message.shape_id != null && message.hasOwnProperty("shape_id"))
                    if (!$util.isString(message.shape_id))
                        return "shape_id: string expected";
                if (message.trip_headsign != null && message.hasOwnProperty("trip_headsign"))
                    if (!$util.isString(message.trip_headsign))
                        return "trip_headsign: string expected";
                if (message.trip_short_name != null && message.hasOwnProperty("trip_short_name"))
                    if (!$util.isString(message.trip_short_name))
                        return "trip_short_name: string expected";
                return null;
            };

            /**
             * Creates a TripProperties message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof transit_realtime.TripUpdate.TripProperties
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {transit_realtime.TripUpdate.TripProperties} TripProperties
             */
            TripProperties.fromObject = function fromObject(object) {
                if (object instanceof $root.transit_realtime.TripUpdate.TripProperties)
                    return object;
                let message = new $root.transit_realtime.TripUpdate.TripProperties();
                if (object.trip_id != null)
                    message.trip_id = String(object.trip_id);
                if (object.start_date != null)
                    message.start_date = String(object.start_date);
                if (object.start_time != null)
                    message.start_time = String(object.start_time);
                if (object.shape_id != null)
                    message.shape_id = String(object.shape_id);
                if (object.trip_headsign != null)
                    message.trip_headsign = String(object.trip_headsign);
                if (object.trip_short_name != null)
                    message.trip_short_name = String(object.trip_short_name);
                return message;
            };

            /**
             * Creates a plain object from a TripProperties message. Also converts values to other types if specified.
             * @function toObject
             * @memberof transit_realtime.TripUpdate.TripProperties
             * @static
             * @param {transit_realtime.TripUpdate.TripProperties} message TripProperties
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            TripProperties.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.trip_id = "";
                    object.start_date = "";
                    object.start_time = "";
                    object.shape_id = "";
                    object.trip_headsign = "";
                    object.trip_short_name = "";
                }
                if (message.trip_id != null && message.hasOwnProperty("trip_id"))
                    object.trip_id = message.trip_id;
                if (message.start_date != null && message.hasOwnProperty("start_date"))
                    object.start_date = message.start_date;
                if (message.start_time != null && message.hasOwnProperty("start_time"))
                    object.start_time = message.start_time;
                if (message.shape_id != null && message.hasOwnProperty("shape_id"))
                    object.shape_id = message.shape_id;
                if (message.trip_headsign != null && message.hasOwnProperty("trip_headsign"))
                    object.trip_headsign = message.trip_headsign;
                if (message.trip_short_name != null && message.hasOwnProperty("trip_short_name"))
                    object.trip_short_name = message.trip_short_name;
                return object;
            };

            /**
             * Converts this TripProperties to JSON.
             * @function toJSON
             * @memberof transit_realtime.TripUpdate.TripProperties
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            TripProperties.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for TripProperties
             * @function getTypeUrl
             * @memberof transit_realtime.TripUpdate.TripProperties
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            TripProperties.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/transit_realtime.TripUpdate.TripProperties";
            };

            return TripProperties;
        })();

        return TripUpdate;
    })();

    transit_realtime.VehiclePosition = (function() {

        /**
         * Properties of a VehiclePosition.
         * @memberof transit_realtime
         * @interface IVehiclePosition
         * @property {transit_realtime.ITripDescriptor|null} [trip] VehiclePosition trip
         * @property {transit_realtime.IVehicleDescriptor|null} [vehicle] VehiclePosition vehicle
         * @property {transit_realtime.IPosition|null} [position] VehiclePosition position
         * @property {number|null} [current_stop_sequence] VehiclePosition current_stop_sequence
         * @property {string|null} [stop_id] VehiclePosition stop_id
         * @property {transit_realtime.VehiclePosition.VehicleStopStatus|null} [current_status] VehiclePosition current_status
         * @property {number|Long|null} [timestamp] VehiclePosition timestamp
         * @property {transit_realtime.VehiclePosition.CongestionLevel|null} [congestion_level] VehiclePosition congestion_level
         * @property {transit_realtime.VehiclePosition.OccupancyStatus|null} [occupancy_status] VehiclePosition occupancy_status
         * @property {number|null} [occupancy_percentage] VehiclePosition occupancy_percentage
         * @property {Array.<transit_realtime.VehiclePosition.ICarriageDetails>|null} [multi_carriage_details] VehiclePosition multi_carriage_details
         */

        /**
         * Constructs a new VehiclePosition.
         * @memberof transit_realtime
         * @classdesc Represents a VehiclePosition.
         * @implements IVehiclePosition
         * @constructor
         * @param {transit_realtime.IVehiclePosition=} [properties] Properties to set
         */
        function VehiclePosition(properties) {
            this.multi_carriage_details = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * VehiclePosition trip.
         * @member {transit_realtime.ITripDescriptor|null|undefined} trip
         * @memberof transit_realtime.VehiclePosition
         * @instance
         */
        VehiclePosition.prototype.trip = null;

        /**
         * VehiclePosition vehicle.
         * @member {transit_realtime.IVehicleDescriptor|null|undefined} vehicle
         * @memberof transit_realtime.VehiclePosition
         * @instance
         */
        VehiclePosition.prototype.vehicle = null;

        /**
         * VehiclePosition position.
         * @member {transit_realtime.IPosition|null|undefined} position
         * @memberof transit_realtime.VehiclePosition
         * @instance
         */
        VehiclePosition.prototype.position = null;

        /**
         * VehiclePosition current_stop_sequence.
         * @member {number} current_stop_sequence
         * @memberof transit_realtime.VehiclePosition
         * @instance
         */
        VehiclePosition.prototype.current_stop_sequence = 0;

        /**
         * VehiclePosition stop_id.
         * @member {string} stop_id
         * @memberof transit_realtime.VehiclePosition
         * @instance
         */
        VehiclePosition.prototype.stop_id = "";

        /**
         * VehiclePosition current_status.
         * @member {transit_realtime.VehiclePosition.VehicleStopStatus} current_status
         * @memberof transit_realtime.VehiclePosition
         * @instance
         */
        VehiclePosition.prototype.current_status = 2;

        /**
         * VehiclePosition timestamp.
         * @member {number|Long} timestamp
         * @memberof transit_realtime.VehiclePosition
         * @instance
         */
        VehiclePosition.prototype.timestamp = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * VehiclePosition congestion_level.
         * @member {transit_realtime.VehiclePosition.CongestionLevel} congestion_level
         * @memberof transit_realtime.VehiclePosition
         * @instance
         */
        VehiclePosition.prototype.congestion_level = 0;

        /**
         * VehiclePosition occupancy_status.
         * @member {transit_realtime.VehiclePosition.OccupancyStatus} occupancy_status
         * @memberof transit_realtime.VehiclePosition
         * @instance
         */
        VehiclePosition.prototype.occupancy_status = 0;

        /**
         * VehiclePosition occupancy_percentage.
         * @member {number} occupancy_percentage
         * @memberof transit_realtime.VehiclePosition
         * @instance
         */
        VehiclePosition.prototype.occupancy_percentage = 0;

        /**
         * VehiclePosition multi_carriage_details.
         * @member {Array.<transit_realtime.VehiclePosition.ICarriageDetails>} multi_carriage_details
         * @memberof transit_realtime.VehiclePosition
         * @instance
         */
        VehiclePosition.prototype.multi_carriage_details = $util.emptyArray;

        /**
         * Creates a new VehiclePosition instance using the specified properties.
         * @function create
         * @memberof transit_realtime.VehiclePosition
         * @static
         * @param {transit_realtime.IVehiclePosition=} [properties] Properties to set
         * @returns {transit_realtime.VehiclePosition} VehiclePosition instance
         */
        VehiclePosition.create = function create(properties) {
            return new VehiclePosition(properties);
        };

        /**
         * Encodes the specified VehiclePosition message. Does not implicitly {@link transit_realtime.VehiclePosition.verify|verify} messages.
         * @function encode
         * @memberof transit_realtime.VehiclePosition
         * @static
         * @param {transit_realtime.IVehiclePosition} message VehiclePosition message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        VehiclePosition.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.trip != null && Object.hasOwnProperty.call(message, "trip"))
                $root.transit_realtime.TripDescriptor.encode(message.trip, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.position != null && Object.hasOwnProperty.call(message, "position"))
                $root.transit_realtime.Position.encode(message.position, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.current_stop_sequence != null && Object.hasOwnProperty.call(message, "current_stop_sequence"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.current_stop_sequence);
            if (message.current_status != null && Object.hasOwnProperty.call(message, "current_status"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.current_status);
            if (message.timestamp != null && Object.hasOwnProperty.call(message, "timestamp"))
                writer.uint32(/* id 5, wireType 0 =*/40).uint64(message.timestamp);
            if (message.congestion_level != null && Object.hasOwnProperty.call(message, "congestion_level"))
                writer.uint32(/* id 6, wireType 0 =*/48).int32(message.congestion_level);
            if (message.stop_id != null && Object.hasOwnProperty.call(message, "stop_id"))
                writer.uint32(/* id 7, wireType 2 =*/58).string(message.stop_id);
            if (message.vehicle != null && Object.hasOwnProperty.call(message, "vehicle"))
                $root.transit_realtime.VehicleDescriptor.encode(message.vehicle, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
            if (message.occupancy_status != null && Object.hasOwnProperty.call(message, "occupancy_status"))
                writer.uint32(/* id 9, wireType 0 =*/72).int32(message.occupancy_status);
            if (message.occupancy_percentage != null && Object.hasOwnProperty.call(message, "occupancy_percentage"))
                writer.uint32(/* id 10, wireType 0 =*/80).uint32(message.occupancy_percentage);
            if (message.multi_carriage_details != null && message.multi_carriage_details.length)
                for (let i = 0; i < message.multi_carriage_details.length; ++i)
                    $root.transit_realtime.VehiclePosition.CarriageDetails.encode(message.multi_carriage_details[i], writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified VehiclePosition message, length delimited. Does not implicitly {@link transit_realtime.VehiclePosition.verify|verify} messages.
         * @function encodeDelimited
         * @memberof transit_realtime.VehiclePosition
         * @static
         * @param {transit_realtime.IVehiclePosition} message VehiclePosition message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        VehiclePosition.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a VehiclePosition message from the specified reader or buffer.
         * @function decode
         * @memberof transit_realtime.VehiclePosition
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {transit_realtime.VehiclePosition} VehiclePosition
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        VehiclePosition.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.transit_realtime.VehiclePosition();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.trip = $root.transit_realtime.TripDescriptor.decode(reader, reader.uint32());
                        break;
                    }
                case 8: {
                        message.vehicle = $root.transit_realtime.VehicleDescriptor.decode(reader, reader.uint32());
                        break;
                    }
                case 2: {
                        message.position = $root.transit_realtime.Position.decode(reader, reader.uint32());
                        break;
                    }
                case 3: {
                        message.current_stop_sequence = reader.uint32();
                        break;
                    }
                case 7: {
                        message.stop_id = reader.string();
                        break;
                    }
                case 4: {
                        message.current_status = reader.int32();
                        break;
                    }
                case 5: {
                        message.timestamp = reader.uint64();
                        break;
                    }
                case 6: {
                        message.congestion_level = reader.int32();
                        break;
                    }
                case 9: {
                        message.occupancy_status = reader.int32();
                        break;
                    }
                case 10: {
                        message.occupancy_percentage = reader.uint32();
                        break;
                    }
                case 11: {
                        if (!(message.multi_carriage_details && message.multi_carriage_details.length))
                            message.multi_carriage_details = [];
                        message.multi_carriage_details.push($root.transit_realtime.VehiclePosition.CarriageDetails.decode(reader, reader.uint32()));
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a VehiclePosition message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof transit_realtime.VehiclePosition
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {transit_realtime.VehiclePosition} VehiclePosition
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        VehiclePosition.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a VehiclePosition message.
         * @function verify
         * @memberof transit_realtime.VehiclePosition
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        VehiclePosition.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.trip != null && message.hasOwnProperty("trip")) {
                let error = $root.transit_realtime.TripDescriptor.verify(message.trip);
                if (error)
                    return "trip." + error;
            }
            if (message.vehicle != null && message.hasOwnProperty("vehicle")) {
                let error = $root.transit_realtime.VehicleDescriptor.verify(message.vehicle);
                if (error)
                    return "vehicle." + error;
            }
            if (message.position != null && message.hasOwnProperty("position")) {
                let error = $root.transit_realtime.Position.verify(message.position);
                if (error)
                    return "position." + error;
            }
            if (message.current_stop_sequence != null && message.hasOwnProperty("current_stop_sequence"))
                if (!$util.isInteger(message.current_stop_sequence))
                    return "current_stop_sequence: integer expected";
            if (message.stop_id != null && message.hasOwnProperty("stop_id"))
                if (!$util.isString(message.stop_id))
                    return "stop_id: string expected";
            if (message.current_status != null && message.hasOwnProperty("current_status"))
                switch (message.current_status) {
                default:
                    return "current_status: enum value expected";
                case 0:
                case 1:
                case 2:
                    break;
                }
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (!$util.isInteger(message.timestamp) && !(message.timestamp && $util.isInteger(message.timestamp.low) && $util.isInteger(message.timestamp.high)))
                    return "timestamp: integer|Long expected";
            if (message.congestion_level != null && message.hasOwnProperty("congestion_level"))
                switch (message.congestion_level) {
                default:
                    return "congestion_level: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                    break;
                }
            if (message.occupancy_status != null && message.hasOwnProperty("occupancy_status"))
                switch (message.occupancy_status) {
                default:
                    return "occupancy_status: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                    break;
                }
            if (message.occupancy_percentage != null && message.hasOwnProperty("occupancy_percentage"))
                if (!$util.isInteger(message.occupancy_percentage))
                    return "occupancy_percentage: integer expected";
            if (message.multi_carriage_details != null && message.hasOwnProperty("multi_carriage_details")) {
                if (!Array.isArray(message.multi_carriage_details))
                    return "multi_carriage_details: array expected";
                for (let i = 0; i < message.multi_carriage_details.length; ++i) {
                    let error = $root.transit_realtime.VehiclePosition.CarriageDetails.verify(message.multi_carriage_details[i]);
                    if (error)
                        return "multi_carriage_details." + error;
                }
            }
            return null;
        };

        /**
         * Creates a VehiclePosition message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof transit_realtime.VehiclePosition
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {transit_realtime.VehiclePosition} VehiclePosition
         */
        VehiclePosition.fromObject = function fromObject(object) {
            if (object instanceof $root.transit_realtime.VehiclePosition)
                return object;
            let message = new $root.transit_realtime.VehiclePosition();
            if (object.trip != null) {
                if (typeof object.trip !== "object")
                    throw TypeError(".transit_realtime.VehiclePosition.trip: object expected");
                message.trip = $root.transit_realtime.TripDescriptor.fromObject(object.trip);
            }
            if (object.vehicle != null) {
                if (typeof object.vehicle !== "object")
                    throw TypeError(".transit_realtime.VehiclePosition.vehicle: object expected");
                message.vehicle = $root.transit_realtime.VehicleDescriptor.fromObject(object.vehicle);
            }
            if (object.position != null) {
                if (typeof object.position !== "object")
                    throw TypeError(".transit_realtime.VehiclePosition.position: object expected");
                message.position = $root.transit_realtime.Position.fromObject(object.position);
            }
            if (object.current_stop_sequence != null)
                message.current_stop_sequence = object.current_stop_sequence >>> 0;
            if (object.stop_id != null)
                message.stop_id = String(object.stop_id);
            switch (object.current_status) {
            case "INCOMING_AT":
            case 0:
                message.current_status = 0;
                break;
            case "STOPPED_AT":
            case 1:
                message.current_status = 1;
                break;
            default:
                if (typeof object.current_status === "number") {
                    message.current_status = object.current_status;
                    break;
                }
                break;
            case "IN_TRANSIT_TO":
            case 2:
                message.current_status = 2;
                break;
            }
            if (object.timestamp != null)
                if ($util.Long)
                    (message.timestamp = $util.Long.fromValue(object.timestamp)).unsigned = true;
                else if (typeof object.timestamp === "string")
                    message.timestamp = parseInt(object.timestamp, 10);
                else if (typeof object.timestamp === "number")
                    message.timestamp = object.timestamp;
                else if (typeof object.timestamp === "object")
                    message.timestamp = new $util.LongBits(object.timestamp.low >>> 0, object.timestamp.high >>> 0).toNumber(true);
            switch (object.congestion_level) {
            default:
                if (typeof object.congestion_level === "number") {
                    message.congestion_level = object.congestion_level;
                    break;
                }
                break;
            case "UNKNOWN_CONGESTION_LEVEL":
            case 0:
                message.congestion_level = 0;
                break;
            case "RUNNING_SMOOTHLY":
            case 1:
                message.congestion_level = 1;
                break;
            case "STOP_AND_GO":
            case 2:
                message.congestion_level = 2;
                break;
            case "CONGESTION":
            case 3:
                message.congestion_level = 3;
                break;
            case "SEVERE_CONGESTION":
            case 4:
                message.congestion_level = 4;
                break;
            }
            switch (object.occupancy_status) {
            default:
                if (typeof object.occupancy_status === "number") {
                    message.occupancy_status = object.occupancy_status;
                    break;
                }
                break;
            case "EMPTY":
            case 0:
                message.occupancy_status = 0;
                break;
            case "MANY_SEATS_AVAILABLE":
            case 1:
                message.occupancy_status = 1;
                break;
            case "FEW_SEATS_AVAILABLE":
            case 2:
                message.occupancy_status = 2;
                break;
            case "STANDING_ROOM_ONLY":
            case 3:
                message.occupancy_status = 3;
                break;
            case "CRUSHED_STANDING_ROOM_ONLY":
            case 4:
                message.occupancy_status = 4;
                break;
            case "FULL":
            case 5:
                message.occupancy_status = 5;
                break;
            case "NOT_ACCEPTING_PASSENGERS":
            case 6:
                message.occupancy_status = 6;
                break;
            case "NO_DATA_AVAILABLE":
            case 7:
                message.occupancy_status = 7;
                break;
            case "NOT_BOARDABLE":
            case 8:
                message.occupancy_status = 8;
                break;
            }
            if (object.occupancy_percentage != null)
                message.occupancy_percentage = object.occupancy_percentage >>> 0;
            if (object.multi_carriage_details) {
                if (!Array.isArray(object.multi_carriage_details))
                    throw TypeError(".transit_realtime.VehiclePosition.multi_carriage_details: array expected");
                message.multi_carriage_details = [];
                for (let i = 0; i < object.multi_carriage_details.length; ++i) {
                    if (typeof object.multi_carriage_details[i] !== "object")
                        throw TypeError(".transit_realtime.VehiclePosition.multi_carriage_details: object expected");
                    message.multi_carriage_details[i] = $root.transit_realtime.VehiclePosition.CarriageDetails.fromObject(object.multi_carriage_details[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a VehiclePosition message. Also converts values to other types if specified.
         * @function toObject
         * @memberof transit_realtime.VehiclePosition
         * @static
         * @param {transit_realtime.VehiclePosition} message VehiclePosition
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        VehiclePosition.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults)
                object.multi_carriage_details = [];
            if (options.defaults) {
                object.trip = null;
                object.position = null;
                object.current_stop_sequence = 0;
                object.current_status = options.enums === String ? "IN_TRANSIT_TO" : 2;
                if ($util.Long) {
                    let long = new $util.Long(0, 0, true);
                    object.timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.timestamp = options.longs === String ? "0" : 0;
                object.congestion_level = options.enums === String ? "UNKNOWN_CONGESTION_LEVEL" : 0;
                object.stop_id = "";
                object.vehicle = null;
                object.occupancy_status = options.enums === String ? "EMPTY" : 0;
                object.occupancy_percentage = 0;
            }
            if (message.trip != null && message.hasOwnProperty("trip"))
                object.trip = $root.transit_realtime.TripDescriptor.toObject(message.trip, options);
            if (message.position != null && message.hasOwnProperty("position"))
                object.position = $root.transit_realtime.Position.toObject(message.position, options);
            if (message.current_stop_sequence != null && message.hasOwnProperty("current_stop_sequence"))
                object.current_stop_sequence = message.current_stop_sequence;
            if (message.current_status != null && message.hasOwnProperty("current_status"))
                object.current_status = options.enums === String ? $root.transit_realtime.VehiclePosition.VehicleStopStatus[message.current_status] === undefined ? message.current_status : $root.transit_realtime.VehiclePosition.VehicleStopStatus[message.current_status] : message.current_status;
            if (message.timestamp != null && message.hasOwnProperty("timestamp"))
                if (typeof message.timestamp === "number")
                    object.timestamp = options.longs === String ? String(message.timestamp) : message.timestamp;
                else
                    object.timestamp = options.longs === String ? $util.Long.prototype.toString.call(message.timestamp) : options.longs === Number ? new $util.LongBits(message.timestamp.low >>> 0, message.timestamp.high >>> 0).toNumber(true) : message.timestamp;
            if (message.congestion_level != null && message.hasOwnProperty("congestion_level"))
                object.congestion_level = options.enums === String ? $root.transit_realtime.VehiclePosition.CongestionLevel[message.congestion_level] === undefined ? message.congestion_level : $root.transit_realtime.VehiclePosition.CongestionLevel[message.congestion_level] : message.congestion_level;
            if (message.stop_id != null && message.hasOwnProperty("stop_id"))
                object.stop_id = message.stop_id;
            if (message.vehicle != null && message.hasOwnProperty("vehicle"))
                object.vehicle = $root.transit_realtime.VehicleDescriptor.toObject(message.vehicle, options);
            if (message.occupancy_status != null && message.hasOwnProperty("occupancy_status"))
                object.occupancy_status = options.enums === String ? $root.transit_realtime.VehiclePosition.OccupancyStatus[message.occupancy_status] === undefined ? message.occupancy_status : $root.transit_realtime.VehiclePosition.OccupancyStatus[message.occupancy_status] : message.occupancy_status;
            if (message.occupancy_percentage != null && message.hasOwnProperty("occupancy_percentage"))
                object.occupancy_percentage = message.occupancy_percentage;
            if (message.multi_carriage_details && message.multi_carriage_details.length) {
                object.multi_carriage_details = [];
                for (let j = 0; j < message.multi_carriage_details.length; ++j)
                    object.multi_carriage_details[j] = $root.transit_realtime.VehiclePosition.CarriageDetails.toObject(message.multi_carriage_details[j], options);
            }
            return object;
        };

        /**
         * Converts this VehiclePosition to JSON.
         * @function toJSON
         * @memberof transit_realtime.VehiclePosition
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        VehiclePosition.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for VehiclePosition
         * @function getTypeUrl
         * @memberof transit_realtime.VehiclePosition
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        VehiclePosition.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/transit_realtime.VehiclePosition";
        };

        /**
         * VehicleStopStatus enum.
         * @name transit_realtime.VehiclePosition.VehicleStopStatus
         * @enum {number}
         * @property {number} INCOMING_AT=0 INCOMING_AT value
         * @property {number} STOPPED_AT=1 STOPPED_AT value
         * @property {number} IN_TRANSIT_TO=2 IN_TRANSIT_TO value
         */
        VehiclePosition.VehicleStopStatus = (function() {
            const valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "INCOMING_AT"] = 0;
            values[valuesById[1] = "STOPPED_AT"] = 1;
            values[valuesById[2] = "IN_TRANSIT_TO"] = 2;
            return values;
        })();

        /**
         * CongestionLevel enum.
         * @name transit_realtime.VehiclePosition.CongestionLevel
         * @enum {number}
         * @property {number} UNKNOWN_CONGESTION_LEVEL=0 UNKNOWN_CONGESTION_LEVEL value
         * @property {number} RUNNING_SMOOTHLY=1 RUNNING_SMOOTHLY value
         * @property {number} STOP_AND_GO=2 STOP_AND_GO value
         * @property {number} CONGESTION=3 CONGESTION value
         * @property {number} SEVERE_CONGESTION=4 SEVERE_CONGESTION value
         */
        VehiclePosition.CongestionLevel = (function() {
            const valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "UNKNOWN_CONGESTION_LEVEL"] = 0;
            values[valuesById[1] = "RUNNING_SMOOTHLY"] = 1;
            values[valuesById[2] = "STOP_AND_GO"] = 2;
            values[valuesById[3] = "CONGESTION"] = 3;
            values[valuesById[4] = "SEVERE_CONGESTION"] = 4;
            return values;
        })();

        /**
         * OccupancyStatus enum.
         * @name transit_realtime.VehiclePosition.OccupancyStatus
         * @enum {number}
         * @property {number} EMPTY=0 EMPTY value
         * @property {number} MANY_SEATS_AVAILABLE=1 MANY_SEATS_AVAILABLE value
         * @property {number} FEW_SEATS_AVAILABLE=2 FEW_SEATS_AVAILABLE value
         * @property {number} STANDING_ROOM_ONLY=3 STANDING_ROOM_ONLY value
         * @property {number} CRUSHED_STANDING_ROOM_ONLY=4 CRUSHED_STANDING_ROOM_ONLY value
         * @property {number} FULL=5 FULL value
         * @property {number} NOT_ACCEPTING_PASSENGERS=6 NOT_ACCEPTING_PASSENGERS value
         * @property {number} NO_DATA_AVAILABLE=7 NO_DATA_AVAILABLE value
         * @property {number} NOT_BOARDABLE=8 NOT_BOARDABLE value
         */
        VehiclePosition.OccupancyStatus = (function() {
            const valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "EMPTY"] = 0;
            values[valuesById[1] = "MANY_SEATS_AVAILABLE"] = 1;
            values[valuesById[2] = "FEW_SEATS_AVAILABLE"] = 2;
            values[valuesById[3] = "STANDING_ROOM_ONLY"] = 3;
            values[valuesById[4] = "CRUSHED_STANDING_ROOM_ONLY"] = 4;
            values[valuesById[5] = "FULL"] = 5;
            values[valuesById[6] = "NOT_ACCEPTING_PASSENGERS"] = 6;
            values[valuesById[7] = "NO_DATA_AVAILABLE"] = 7;
            values[valuesById[8] = "NOT_BOARDABLE"] = 8;
            return values;
        })();

        VehiclePosition.CarriageDetails = (function() {

            /**
             * Properties of a CarriageDetails.
             * @memberof transit_realtime.VehiclePosition
             * @interface ICarriageDetails
             * @property {string|null} [id] CarriageDetails id
             * @property {string|null} [label] CarriageDetails label
             * @property {transit_realtime.VehiclePosition.OccupancyStatus|null} [occupancy_status] CarriageDetails occupancy_status
             * @property {number|null} [occupancy_percentage] CarriageDetails occupancy_percentage
             * @property {number|null} [carriage_sequence] CarriageDetails carriage_sequence
             */

            /**
             * Constructs a new CarriageDetails.
             * @memberof transit_realtime.VehiclePosition
             * @classdesc Represents a CarriageDetails.
             * @implements ICarriageDetails
             * @constructor
             * @param {transit_realtime.VehiclePosition.ICarriageDetails=} [properties] Properties to set
             */
            function CarriageDetails(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * CarriageDetails id.
             * @member {string} id
             * @memberof transit_realtime.VehiclePosition.CarriageDetails
             * @instance
             */
            CarriageDetails.prototype.id = "";

            /**
             * CarriageDetails label.
             * @member {string} label
             * @memberof transit_realtime.VehiclePosition.CarriageDetails
             * @instance
             */
            CarriageDetails.prototype.label = "";

            /**
             * CarriageDetails occupancy_status.
             * @member {transit_realtime.VehiclePosition.OccupancyStatus} occupancy_status
             * @memberof transit_realtime.VehiclePosition.CarriageDetails
             * @instance
             */
            CarriageDetails.prototype.occupancy_status = 7;

            /**
             * CarriageDetails occupancy_percentage.
             * @member {number} occupancy_percentage
             * @memberof transit_realtime.VehiclePosition.CarriageDetails
             * @instance
             */
            CarriageDetails.prototype.occupancy_percentage = -1;

            /**
             * CarriageDetails carriage_sequence.
             * @member {number} carriage_sequence
             * @memberof transit_realtime.VehiclePosition.CarriageDetails
             * @instance
             */
            CarriageDetails.prototype.carriage_sequence = 0;

            /**
             * Creates a new CarriageDetails instance using the specified properties.
             * @function create
             * @memberof transit_realtime.VehiclePosition.CarriageDetails
             * @static
             * @param {transit_realtime.VehiclePosition.ICarriageDetails=} [properties] Properties to set
             * @returns {transit_realtime.VehiclePosition.CarriageDetails} CarriageDetails instance
             */
            CarriageDetails.create = function create(properties) {
                return new CarriageDetails(properties);
            };

            /**
             * Encodes the specified CarriageDetails message. Does not implicitly {@link transit_realtime.VehiclePosition.CarriageDetails.verify|verify} messages.
             * @function encode
             * @memberof transit_realtime.VehiclePosition.CarriageDetails
             * @static
             * @param {transit_realtime.VehiclePosition.ICarriageDetails} message CarriageDetails message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CarriageDetails.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
                if (message.label != null && Object.hasOwnProperty.call(message, "label"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.label);
                if (message.occupancy_status != null && Object.hasOwnProperty.call(message, "occupancy_status"))
                    writer.uint32(/* id 3, wireType 0 =*/24).int32(message.occupancy_status);
                if (message.occupancy_percentage != null && Object.hasOwnProperty.call(message, "occupancy_percentage"))
                    writer.uint32(/* id 4, wireType 0 =*/32).int32(message.occupancy_percentage);
                if (message.carriage_sequence != null && Object.hasOwnProperty.call(message, "carriage_sequence"))
                    writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.carriage_sequence);
                return writer;
            };

            /**
             * Encodes the specified CarriageDetails message, length delimited. Does not implicitly {@link transit_realtime.VehiclePosition.CarriageDetails.verify|verify} messages.
             * @function encodeDelimited
             * @memberof transit_realtime.VehiclePosition.CarriageDetails
             * @static
             * @param {transit_realtime.VehiclePosition.ICarriageDetails} message CarriageDetails message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            CarriageDetails.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a CarriageDetails message from the specified reader or buffer.
             * @function decode
             * @memberof transit_realtime.VehiclePosition.CarriageDetails
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {transit_realtime.VehiclePosition.CarriageDetails} CarriageDetails
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CarriageDetails.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.transit_realtime.VehiclePosition.CarriageDetails();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.id = reader.string();
                            break;
                        }
                    case 2: {
                            message.label = reader.string();
                            break;
                        }
                    case 3: {
                            message.occupancy_status = reader.int32();
                            break;
                        }
                    case 4: {
                            message.occupancy_percentage = reader.int32();
                            break;
                        }
                    case 5: {
                            message.carriage_sequence = reader.uint32();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a CarriageDetails message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof transit_realtime.VehiclePosition.CarriageDetails
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {transit_realtime.VehiclePosition.CarriageDetails} CarriageDetails
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            CarriageDetails.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a CarriageDetails message.
             * @function verify
             * @memberof transit_realtime.VehiclePosition.CarriageDetails
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            CarriageDetails.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.id != null && message.hasOwnProperty("id"))
                    if (!$util.isString(message.id))
                        return "id: string expected";
                if (message.label != null && message.hasOwnProperty("label"))
                    if (!$util.isString(message.label))
                        return "label: string expected";
                if (message.occupancy_status != null && message.hasOwnProperty("occupancy_status"))
                    switch (message.occupancy_status) {
                    default:
                        return "occupancy_status: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                    case 8:
                        break;
                    }
                if (message.occupancy_percentage != null && message.hasOwnProperty("occupancy_percentage"))
                    if (!$util.isInteger(message.occupancy_percentage))
                        return "occupancy_percentage: integer expected";
                if (message.carriage_sequence != null && message.hasOwnProperty("carriage_sequence"))
                    if (!$util.isInteger(message.carriage_sequence))
                        return "carriage_sequence: integer expected";
                return null;
            };

            /**
             * Creates a CarriageDetails message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof transit_realtime.VehiclePosition.CarriageDetails
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {transit_realtime.VehiclePosition.CarriageDetails} CarriageDetails
             */
            CarriageDetails.fromObject = function fromObject(object) {
                if (object instanceof $root.transit_realtime.VehiclePosition.CarriageDetails)
                    return object;
                let message = new $root.transit_realtime.VehiclePosition.CarriageDetails();
                if (object.id != null)
                    message.id = String(object.id);
                if (object.label != null)
                    message.label = String(object.label);
                switch (object.occupancy_status) {
                case "EMPTY":
                case 0:
                    message.occupancy_status = 0;
                    break;
                case "MANY_SEATS_AVAILABLE":
                case 1:
                    message.occupancy_status = 1;
                    break;
                case "FEW_SEATS_AVAILABLE":
                case 2:
                    message.occupancy_status = 2;
                    break;
                case "STANDING_ROOM_ONLY":
                case 3:
                    message.occupancy_status = 3;
                    break;
                case "CRUSHED_STANDING_ROOM_ONLY":
                case 4:
                    message.occupancy_status = 4;
                    break;
                case "FULL":
                case 5:
                    message.occupancy_status = 5;
                    break;
                case "NOT_ACCEPTING_PASSENGERS":
                case 6:
                    message.occupancy_status = 6;
                    break;
                default:
                    if (typeof object.occupancy_status === "number") {
                        message.occupancy_status = object.occupancy_status;
                        break;
                    }
                    break;
                case "NO_DATA_AVAILABLE":
                case 7:
                    message.occupancy_status = 7;
                    break;
                case "NOT_BOARDABLE":
                case 8:
                    message.occupancy_status = 8;
                    break;
                }
                if (object.occupancy_percentage != null)
                    message.occupancy_percentage = object.occupancy_percentage | 0;
                if (object.carriage_sequence != null)
                    message.carriage_sequence = object.carriage_sequence >>> 0;
                return message;
            };

            /**
             * Creates a plain object from a CarriageDetails message. Also converts values to other types if specified.
             * @function toObject
             * @memberof transit_realtime.VehiclePosition.CarriageDetails
             * @static
             * @param {transit_realtime.VehiclePosition.CarriageDetails} message CarriageDetails
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            CarriageDetails.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.id = "";
                    object.label = "";
                    object.occupancy_status = options.enums === String ? "NO_DATA_AVAILABLE" : 7;
                    object.occupancy_percentage = -1;
                    object.carriage_sequence = 0;
                }
                if (message.id != null && message.hasOwnProperty("id"))
                    object.id = message.id;
                if (message.label != null && message.hasOwnProperty("label"))
                    object.label = message.label;
                if (message.occupancy_status != null && message.hasOwnProperty("occupancy_status"))
                    object.occupancy_status = options.enums === String ? $root.transit_realtime.VehiclePosition.OccupancyStatus[message.occupancy_status] === undefined ? message.occupancy_status : $root.transit_realtime.VehiclePosition.OccupancyStatus[message.occupancy_status] : message.occupancy_status;
                if (message.occupancy_percentage != null && message.hasOwnProperty("occupancy_percentage"))
                    object.occupancy_percentage = message.occupancy_percentage;
                if (message.carriage_sequence != null && message.hasOwnProperty("carriage_sequence"))
                    object.carriage_sequence = message.carriage_sequence;
                return object;
            };

            /**
             * Converts this CarriageDetails to JSON.
             * @function toJSON
             * @memberof transit_realtime.VehiclePosition.CarriageDetails
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            CarriageDetails.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for CarriageDetails
             * @function getTypeUrl
             * @memberof transit_realtime.VehiclePosition.CarriageDetails
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            CarriageDetails.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/transit_realtime.VehiclePosition.CarriageDetails";
            };

            return CarriageDetails;
        })();

        return VehiclePosition;
    })();

    transit_realtime.Alert = (function() {

        /**
         * Properties of an Alert.
         * @memberof transit_realtime
         * @interface IAlert
         * @property {Array.<transit_realtime.ITimeRange>|null} [active_period] Alert active_period
         * @property {Array.<transit_realtime.IEntitySelector>|null} [informed_entity] Alert informed_entity
         * @property {transit_realtime.Alert.Cause|null} [cause] Alert cause
         * @property {transit_realtime.Alert.Effect|null} [effect] Alert effect
         * @property {transit_realtime.ITranslatedString|null} [url] Alert url
         * @property {transit_realtime.ITranslatedString|null} [header_text] Alert header_text
         * @property {transit_realtime.ITranslatedString|null} [description_text] Alert description_text
         * @property {transit_realtime.ITranslatedString|null} [tts_header_text] Alert tts_header_text
         * @property {transit_realtime.ITranslatedString|null} [tts_description_text] Alert tts_description_text
         * @property {transit_realtime.Alert.SeverityLevel|null} [severity_level] Alert severity_level
         * @property {transit_realtime.ITranslatedImage|null} [image] Alert image
         * @property {transit_realtime.ITranslatedString|null} [image_alternative_text] Alert image_alternative_text
         * @property {transit_realtime.ITranslatedString|null} [cause_detail] Alert cause_detail
         * @property {transit_realtime.ITranslatedString|null} [effect_detail] Alert effect_detail
         */

        /**
         * Constructs a new Alert.
         * @memberof transit_realtime
         * @classdesc Represents an Alert.
         * @implements IAlert
         * @constructor
         * @param {transit_realtime.IAlert=} [properties] Properties to set
         */
        function Alert(properties) {
            this.active_period = [];
            this.informed_entity = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Alert active_period.
         * @member {Array.<transit_realtime.ITimeRange>} active_period
         * @memberof transit_realtime.Alert
         * @instance
         */
        Alert.prototype.active_period = $util.emptyArray;

        /**
         * Alert informed_entity.
         * @member {Array.<transit_realtime.IEntitySelector>} informed_entity
         * @memberof transit_realtime.Alert
         * @instance
         */
        Alert.prototype.informed_entity = $util.emptyArray;

        /**
         * Alert cause.
         * @member {transit_realtime.Alert.Cause} cause
         * @memberof transit_realtime.Alert
         * @instance
         */
        Alert.prototype.cause = 1;

        /**
         * Alert effect.
         * @member {transit_realtime.Alert.Effect} effect
         * @memberof transit_realtime.Alert
         * @instance
         */
        Alert.prototype.effect = 8;

        /**
         * Alert url.
         * @member {transit_realtime.ITranslatedString|null|undefined} url
         * @memberof transit_realtime.Alert
         * @instance
         */
        Alert.prototype.url = null;

        /**
         * Alert header_text.
         * @member {transit_realtime.ITranslatedString|null|undefined} header_text
         * @memberof transit_realtime.Alert
         * @instance
         */
        Alert.prototype.header_text = null;

        /**
         * Alert description_text.
         * @member {transit_realtime.ITranslatedString|null|undefined} description_text
         * @memberof transit_realtime.Alert
         * @instance
         */
        Alert.prototype.description_text = null;

        /**
         * Alert tts_header_text.
         * @member {transit_realtime.ITranslatedString|null|undefined} tts_header_text
         * @memberof transit_realtime.Alert
         * @instance
         */
        Alert.prototype.tts_header_text = null;

        /**
         * Alert tts_description_text.
         * @member {transit_realtime.ITranslatedString|null|undefined} tts_description_text
         * @memberof transit_realtime.Alert
         * @instance
         */
        Alert.prototype.tts_description_text = null;

        /**
         * Alert severity_level.
         * @member {transit_realtime.Alert.SeverityLevel} severity_level
         * @memberof transit_realtime.Alert
         * @instance
         */
        Alert.prototype.severity_level = 1;

        /**
         * Alert image.
         * @member {transit_realtime.ITranslatedImage|null|undefined} image
         * @memberof transit_realtime.Alert
         * @instance
         */
        Alert.prototype.image = null;

        /**
         * Alert image_alternative_text.
         * @member {transit_realtime.ITranslatedString|null|undefined} image_alternative_text
         * @memberof transit_realtime.Alert
         * @instance
         */
        Alert.prototype.image_alternative_text = null;

        /**
         * Alert cause_detail.
         * @member {transit_realtime.ITranslatedString|null|undefined} cause_detail
         * @memberof transit_realtime.Alert
         * @instance
         */
        Alert.prototype.cause_detail = null;

        /**
         * Alert effect_detail.
         * @member {transit_realtime.ITranslatedString|null|undefined} effect_detail
         * @memberof transit_realtime.Alert
         * @instance
         */
        Alert.prototype.effect_detail = null;

        /**
         * Creates a new Alert instance using the specified properties.
         * @function create
         * @memberof transit_realtime.Alert
         * @static
         * @param {transit_realtime.IAlert=} [properties] Properties to set
         * @returns {transit_realtime.Alert} Alert instance
         */
        Alert.create = function create(properties) {
            return new Alert(properties);
        };

        /**
         * Encodes the specified Alert message. Does not implicitly {@link transit_realtime.Alert.verify|verify} messages.
         * @function encode
         * @memberof transit_realtime.Alert
         * @static
         * @param {transit_realtime.IAlert} message Alert message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Alert.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.active_period != null && message.active_period.length)
                for (let i = 0; i < message.active_period.length; ++i)
                    $root.transit_realtime.TimeRange.encode(message.active_period[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.informed_entity != null && message.informed_entity.length)
                for (let i = 0; i < message.informed_entity.length; ++i)
                    $root.transit_realtime.EntitySelector.encode(message.informed_entity[i], writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            if (message.cause != null && Object.hasOwnProperty.call(message, "cause"))
                writer.uint32(/* id 6, wireType 0 =*/48).int32(message.cause);
            if (message.effect != null && Object.hasOwnProperty.call(message, "effect"))
                writer.uint32(/* id 7, wireType 0 =*/56).int32(message.effect);
            if (message.url != null && Object.hasOwnProperty.call(message, "url"))
                $root.transit_realtime.TranslatedString.encode(message.url, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
            if (message.header_text != null && Object.hasOwnProperty.call(message, "header_text"))
                $root.transit_realtime.TranslatedString.encode(message.header_text, writer.uint32(/* id 10, wireType 2 =*/82).fork()).ldelim();
            if (message.description_text != null && Object.hasOwnProperty.call(message, "description_text"))
                $root.transit_realtime.TranslatedString.encode(message.description_text, writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
            if (message.tts_header_text != null && Object.hasOwnProperty.call(message, "tts_header_text"))
                $root.transit_realtime.TranslatedString.encode(message.tts_header_text, writer.uint32(/* id 12, wireType 2 =*/98).fork()).ldelim();
            if (message.tts_description_text != null && Object.hasOwnProperty.call(message, "tts_description_text"))
                $root.transit_realtime.TranslatedString.encode(message.tts_description_text, writer.uint32(/* id 13, wireType 2 =*/106).fork()).ldelim();
            if (message.severity_level != null && Object.hasOwnProperty.call(message, "severity_level"))
                writer.uint32(/* id 14, wireType 0 =*/112).int32(message.severity_level);
            if (message.image != null && Object.hasOwnProperty.call(message, "image"))
                $root.transit_realtime.TranslatedImage.encode(message.image, writer.uint32(/* id 15, wireType 2 =*/122).fork()).ldelim();
            if (message.image_alternative_text != null && Object.hasOwnProperty.call(message, "image_alternative_text"))
                $root.transit_realtime.TranslatedString.encode(message.image_alternative_text, writer.uint32(/* id 16, wireType 2 =*/130).fork()).ldelim();
            if (message.cause_detail != null && Object.hasOwnProperty.call(message, "cause_detail"))
                $root.transit_realtime.TranslatedString.encode(message.cause_detail, writer.uint32(/* id 17, wireType 2 =*/138).fork()).ldelim();
            if (message.effect_detail != null && Object.hasOwnProperty.call(message, "effect_detail"))
                $root.transit_realtime.TranslatedString.encode(message.effect_detail, writer.uint32(/* id 18, wireType 2 =*/146).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified Alert message, length delimited. Does not implicitly {@link transit_realtime.Alert.verify|verify} messages.
         * @function encodeDelimited
         * @memberof transit_realtime.Alert
         * @static
         * @param {transit_realtime.IAlert} message Alert message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Alert.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an Alert message from the specified reader or buffer.
         * @function decode
         * @memberof transit_realtime.Alert
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {transit_realtime.Alert} Alert
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Alert.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.transit_realtime.Alert();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.active_period && message.active_period.length))
                            message.active_period = [];
                        message.active_period.push($root.transit_realtime.TimeRange.decode(reader, reader.uint32()));
                        break;
                    }
                case 5: {
                        if (!(message.informed_entity && message.informed_entity.length))
                            message.informed_entity = [];
                        message.informed_entity.push($root.transit_realtime.EntitySelector.decode(reader, reader.uint32()));
                        break;
                    }
                case 6: {
                        message.cause = reader.int32();
                        break;
                    }
                case 7: {
                        message.effect = reader.int32();
                        break;
                    }
                case 8: {
                        message.url = $root.transit_realtime.TranslatedString.decode(reader, reader.uint32());
                        break;
                    }
                case 10: {
                        message.header_text = $root.transit_realtime.TranslatedString.decode(reader, reader.uint32());
                        break;
                    }
                case 11: {
                        message.description_text = $root.transit_realtime.TranslatedString.decode(reader, reader.uint32());
                        break;
                    }
                case 12: {
                        message.tts_header_text = $root.transit_realtime.TranslatedString.decode(reader, reader.uint32());
                        break;
                    }
                case 13: {
                        message.tts_description_text = $root.transit_realtime.TranslatedString.decode(reader, reader.uint32());
                        break;
                    }
                case 14: {
                        message.severity_level = reader.int32();
                        break;
                    }
                case 15: {
                        message.image = $root.transit_realtime.TranslatedImage.decode(reader, reader.uint32());
                        break;
                    }
                case 16: {
                        message.image_alternative_text = $root.transit_realtime.TranslatedString.decode(reader, reader.uint32());
                        break;
                    }
                case 17: {
                        message.cause_detail = $root.transit_realtime.TranslatedString.decode(reader, reader.uint32());
                        break;
                    }
                case 18: {
                        message.effect_detail = $root.transit_realtime.TranslatedString.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an Alert message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof transit_realtime.Alert
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {transit_realtime.Alert} Alert
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Alert.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an Alert message.
         * @function verify
         * @memberof transit_realtime.Alert
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Alert.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.active_period != null && message.hasOwnProperty("active_period")) {
                if (!Array.isArray(message.active_period))
                    return "active_period: array expected";
                for (let i = 0; i < message.active_period.length; ++i) {
                    let error = $root.transit_realtime.TimeRange.verify(message.active_period[i]);
                    if (error)
                        return "active_period." + error;
                }
            }
            if (message.informed_entity != null && message.hasOwnProperty("informed_entity")) {
                if (!Array.isArray(message.informed_entity))
                    return "informed_entity: array expected";
                for (let i = 0; i < message.informed_entity.length; ++i) {
                    let error = $root.transit_realtime.EntitySelector.verify(message.informed_entity[i]);
                    if (error)
                        return "informed_entity." + error;
                }
            }
            if (message.cause != null && message.hasOwnProperty("cause"))
                switch (message.cause) {
                default:
                    return "cause: enum value expected";
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                case 9:
                case 10:
                case 11:
                case 12:
                    break;
                }
            if (message.effect != null && message.hasOwnProperty("effect"))
                switch (message.effect) {
                default:
                    return "effect: enum value expected";
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                case 9:
                case 10:
                case 11:
                    break;
                }
            if (message.url != null && message.hasOwnProperty("url")) {
                let error = $root.transit_realtime.TranslatedString.verify(message.url);
                if (error)
                    return "url." + error;
            }
            if (message.header_text != null && message.hasOwnProperty("header_text")) {
                let error = $root.transit_realtime.TranslatedString.verify(message.header_text);
                if (error)
                    return "header_text." + error;
            }
            if (message.description_text != null && message.hasOwnProperty("description_text")) {
                let error = $root.transit_realtime.TranslatedString.verify(message.description_text);
                if (error)
                    return "description_text." + error;
            }
            if (message.tts_header_text != null && message.hasOwnProperty("tts_header_text")) {
                let error = $root.transit_realtime.TranslatedString.verify(message.tts_header_text);
                if (error)
                    return "tts_header_text." + error;
            }
            if (message.tts_description_text != null && message.hasOwnProperty("tts_description_text")) {
                let error = $root.transit_realtime.TranslatedString.verify(message.tts_description_text);
                if (error)
                    return "tts_description_text." + error;
            }
            if (message.severity_level != null && message.hasOwnProperty("severity_level"))
                switch (message.severity_level) {
                default:
                    return "severity_level: enum value expected";
                case 1:
                case 2:
                case 3:
                case 4:
                    break;
                }
            if (message.image != null && message.hasOwnProperty("image")) {
                let error = $root.transit_realtime.TranslatedImage.verify(message.image);
                if (error)
                    return "image." + error;
            }
            if (message.image_alternative_text != null && message.hasOwnProperty("image_alternative_text")) {
                let error = $root.transit_realtime.TranslatedString.verify(message.image_alternative_text);
                if (error)
                    return "image_alternative_text." + error;
            }
            if (message.cause_detail != null && message.hasOwnProperty("cause_detail")) {
                let error = $root.transit_realtime.TranslatedString.verify(message.cause_detail);
                if (error)
                    return "cause_detail." + error;
            }
            if (message.effect_detail != null && message.hasOwnProperty("effect_detail")) {
                let error = $root.transit_realtime.TranslatedString.verify(message.effect_detail);
                if (error)
                    return "effect_detail." + error;
            }
            return null;
        };

        /**
         * Creates an Alert message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof transit_realtime.Alert
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {transit_realtime.Alert} Alert
         */
        Alert.fromObject = function fromObject(object) {
            if (object instanceof $root.transit_realtime.Alert)
                return object;
            let message = new $root.transit_realtime.Alert();
            if (object.active_period) {
                if (!Array.isArray(object.active_period))
                    throw TypeError(".transit_realtime.Alert.active_period: array expected");
                message.active_period = [];
                for (let i = 0; i < object.active_period.length; ++i) {
                    if (typeof object.active_period[i] !== "object")
                        throw TypeError(".transit_realtime.Alert.active_period: object expected");
                    message.active_period[i] = $root.transit_realtime.TimeRange.fromObject(object.active_period[i]);
                }
            }
            if (object.informed_entity) {
                if (!Array.isArray(object.informed_entity))
                    throw TypeError(".transit_realtime.Alert.informed_entity: array expected");
                message.informed_entity = [];
                for (let i = 0; i < object.informed_entity.length; ++i) {
                    if (typeof object.informed_entity[i] !== "object")
                        throw TypeError(".transit_realtime.Alert.informed_entity: object expected");
                    message.informed_entity[i] = $root.transit_realtime.EntitySelector.fromObject(object.informed_entity[i]);
                }
            }
            switch (object.cause) {
            default:
                if (typeof object.cause === "number") {
                    message.cause = object.cause;
                    break;
                }
                break;
            case "UNKNOWN_CAUSE":
            case 1:
                message.cause = 1;
                break;
            case "OTHER_CAUSE":
            case 2:
                message.cause = 2;
                break;
            case "TECHNICAL_PROBLEM":
            case 3:
                message.cause = 3;
                break;
            case "STRIKE":
            case 4:
                message.cause = 4;
                break;
            case "DEMONSTRATION":
            case 5:
                message.cause = 5;
                break;
            case "ACCIDENT":
            case 6:
                message.cause = 6;
                break;
            case "HOLIDAY":
            case 7:
                message.cause = 7;
                break;
            case "WEATHER":
            case 8:
                message.cause = 8;
                break;
            case "MAINTENANCE":
            case 9:
                message.cause = 9;
                break;
            case "CONSTRUCTION":
            case 10:
                message.cause = 10;
                break;
            case "POLICE_ACTIVITY":
            case 11:
                message.cause = 11;
                break;
            case "MEDICAL_EMERGENCY":
            case 12:
                message.cause = 12;
                break;
            }
            switch (object.effect) {
            case "NO_SERVICE":
            case 1:
                message.effect = 1;
                break;
            case "REDUCED_SERVICE":
            case 2:
                message.effect = 2;
                break;
            case "SIGNIFICANT_DELAYS":
            case 3:
                message.effect = 3;
                break;
            case "DETOUR":
            case 4:
                message.effect = 4;
                break;
            case "ADDITIONAL_SERVICE":
            case 5:
                message.effect = 5;
                break;
            case "MODIFIED_SERVICE":
            case 6:
                message.effect = 6;
                break;
            case "OTHER_EFFECT":
            case 7:
                message.effect = 7;
                break;
            default:
                if (typeof object.effect === "number") {
                    message.effect = object.effect;
                    break;
                }
                break;
            case "UNKNOWN_EFFECT":
            case 8:
                message.effect = 8;
                break;
            case "STOP_MOVED":
            case 9:
                message.effect = 9;
                break;
            case "NO_EFFECT":
            case 10:
                message.effect = 10;
                break;
            case "ACCESSIBILITY_ISSUE":
            case 11:
                message.effect = 11;
                break;
            }
            if (object.url != null) {
                if (typeof object.url !== "object")
                    throw TypeError(".transit_realtime.Alert.url: object expected");
                message.url = $root.transit_realtime.TranslatedString.fromObject(object.url);
            }
            if (object.header_text != null) {
                if (typeof object.header_text !== "object")
                    throw TypeError(".transit_realtime.Alert.header_text: object expected");
                message.header_text = $root.transit_realtime.TranslatedString.fromObject(object.header_text);
            }
            if (object.description_text != null) {
                if (typeof object.description_text !== "object")
                    throw TypeError(".transit_realtime.Alert.description_text: object expected");
                message.description_text = $root.transit_realtime.TranslatedString.fromObject(object.description_text);
            }
            if (object.tts_header_text != null) {
                if (typeof object.tts_header_text !== "object")
                    throw TypeError(".transit_realtime.Alert.tts_header_text: object expected");
                message.tts_header_text = $root.transit_realtime.TranslatedString.fromObject(object.tts_header_text);
            }
            if (object.tts_description_text != null) {
                if (typeof object.tts_description_text !== "object")
                    throw TypeError(".transit_realtime.Alert.tts_description_text: object expected");
                message.tts_description_text = $root.transit_realtime.TranslatedString.fromObject(object.tts_description_text);
            }
            switch (object.severity_level) {
            default:
                if (typeof object.severity_level === "number") {
                    message.severity_level = object.severity_level;
                    break;
                }
                break;
            case "UNKNOWN_SEVERITY":
            case 1:
                message.severity_level = 1;
                break;
            case "INFO":
            case 2:
                message.severity_level = 2;
                break;
            case "WARNING":
            case 3:
                message.severity_level = 3;
                break;
            case "SEVERE":
            case 4:
                message.severity_level = 4;
                break;
            }
            if (object.image != null) {
                if (typeof object.image !== "object")
                    throw TypeError(".transit_realtime.Alert.image: object expected");
                message.image = $root.transit_realtime.TranslatedImage.fromObject(object.image);
            }
            if (object.image_alternative_text != null) {
                if (typeof object.image_alternative_text !== "object")
                    throw TypeError(".transit_realtime.Alert.image_alternative_text: object expected");
                message.image_alternative_text = $root.transit_realtime.TranslatedString.fromObject(object.image_alternative_text);
            }
            if (object.cause_detail != null) {
                if (typeof object.cause_detail !== "object")
                    throw TypeError(".transit_realtime.Alert.cause_detail: object expected");
                message.cause_detail = $root.transit_realtime.TranslatedString.fromObject(object.cause_detail);
            }
            if (object.effect_detail != null) {
                if (typeof object.effect_detail !== "object")
                    throw TypeError(".transit_realtime.Alert.effect_detail: object expected");
                message.effect_detail = $root.transit_realtime.TranslatedString.fromObject(object.effect_detail);
            }
            return message;
        };

        /**
         * Creates a plain object from an Alert message. Also converts values to other types if specified.
         * @function toObject
         * @memberof transit_realtime.Alert
         * @static
         * @param {transit_realtime.Alert} message Alert
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Alert.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults) {
                object.active_period = [];
                object.informed_entity = [];
            }
            if (options.defaults) {
                object.cause = options.enums === String ? "UNKNOWN_CAUSE" : 1;
                object.effect = options.enums === String ? "UNKNOWN_EFFECT" : 8;
                object.url = null;
                object.header_text = null;
                object.description_text = null;
                object.tts_header_text = null;
                object.tts_description_text = null;
                object.severity_level = options.enums === String ? "UNKNOWN_SEVERITY" : 1;
                object.image = null;
                object.image_alternative_text = null;
                object.cause_detail = null;
                object.effect_detail = null;
            }
            if (message.active_period && message.active_period.length) {
                object.active_period = [];
                for (let j = 0; j < message.active_period.length; ++j)
                    object.active_period[j] = $root.transit_realtime.TimeRange.toObject(message.active_period[j], options);
            }
            if (message.informed_entity && message.informed_entity.length) {
                object.informed_entity = [];
                for (let j = 0; j < message.informed_entity.length; ++j)
                    object.informed_entity[j] = $root.transit_realtime.EntitySelector.toObject(message.informed_entity[j], options);
            }
            if (message.cause != null && message.hasOwnProperty("cause"))
                object.cause = options.enums === String ? $root.transit_realtime.Alert.Cause[message.cause] === undefined ? message.cause : $root.transit_realtime.Alert.Cause[message.cause] : message.cause;
            if (message.effect != null && message.hasOwnProperty("effect"))
                object.effect = options.enums === String ? $root.transit_realtime.Alert.Effect[message.effect] === undefined ? message.effect : $root.transit_realtime.Alert.Effect[message.effect] : message.effect;
            if (message.url != null && message.hasOwnProperty("url"))
                object.url = $root.transit_realtime.TranslatedString.toObject(message.url, options);
            if (message.header_text != null && message.hasOwnProperty("header_text"))
                object.header_text = $root.transit_realtime.TranslatedString.toObject(message.header_text, options);
            if (message.description_text != null && message.hasOwnProperty("description_text"))
                object.description_text = $root.transit_realtime.TranslatedString.toObject(message.description_text, options);
            if (message.tts_header_text != null && message.hasOwnProperty("tts_header_text"))
                object.tts_header_text = $root.transit_realtime.TranslatedString.toObject(message.tts_header_text, options);
            if (message.tts_description_text != null && message.hasOwnProperty("tts_description_text"))
                object.tts_description_text = $root.transit_realtime.TranslatedString.toObject(message.tts_description_text, options);
            if (message.severity_level != null && message.hasOwnProperty("severity_level"))
                object.severity_level = options.enums === String ? $root.transit_realtime.Alert.SeverityLevel[message.severity_level] === undefined ? message.severity_level : $root.transit_realtime.Alert.SeverityLevel[message.severity_level] : message.severity_level;
            if (message.image != null && message.hasOwnProperty("image"))
                object.image = $root.transit_realtime.TranslatedImage.toObject(message.image, options);
            if (message.image_alternative_text != null && message.hasOwnProperty("image_alternative_text"))
                object.image_alternative_text = $root.transit_realtime.TranslatedString.toObject(message.image_alternative_text, options);
            if (message.cause_detail != null && message.hasOwnProperty("cause_detail"))
                object.cause_detail = $root.transit_realtime.TranslatedString.toObject(message.cause_detail, options);
            if (message.effect_detail != null && message.hasOwnProperty("effect_detail"))
                object.effect_detail = $root.transit_realtime.TranslatedString.toObject(message.effect_detail, options);
            return object;
        };

        /**
         * Converts this Alert to JSON.
         * @function toJSON
         * @memberof transit_realtime.Alert
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Alert.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Alert
         * @function getTypeUrl
         * @memberof transit_realtime.Alert
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Alert.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/transit_realtime.Alert";
        };

        /**
         * Cause enum.
         * @name transit_realtime.Alert.Cause
         * @enum {number}
         * @property {number} UNKNOWN_CAUSE=1 UNKNOWN_CAUSE value
         * @property {number} OTHER_CAUSE=2 OTHER_CAUSE value
         * @property {number} TECHNICAL_PROBLEM=3 TECHNICAL_PROBLEM value
         * @property {number} STRIKE=4 STRIKE value
         * @property {number} DEMONSTRATION=5 DEMONSTRATION value
         * @property {number} ACCIDENT=6 ACCIDENT value
         * @property {number} HOLIDAY=7 HOLIDAY value
         * @property {number} WEATHER=8 WEATHER value
         * @property {number} MAINTENANCE=9 MAINTENANCE value
         * @property {number} CONSTRUCTION=10 CONSTRUCTION value
         * @property {number} POLICE_ACTIVITY=11 POLICE_ACTIVITY value
         * @property {number} MEDICAL_EMERGENCY=12 MEDICAL_EMERGENCY value
         */
        Alert.Cause = (function() {
            const valuesById = {}, values = Object.create(valuesById);
            values[valuesById[1] = "UNKNOWN_CAUSE"] = 1;
            values[valuesById[2] = "OTHER_CAUSE"] = 2;
            values[valuesById[3] = "TECHNICAL_PROBLEM"] = 3;
            values[valuesById[4] = "STRIKE"] = 4;
            values[valuesById[5] = "DEMONSTRATION"] = 5;
            values[valuesById[6] = "ACCIDENT"] = 6;
            values[valuesById[7] = "HOLIDAY"] = 7;
            values[valuesById[8] = "WEATHER"] = 8;
            values[valuesById[9] = "MAINTENANCE"] = 9;
            values[valuesById[10] = "CONSTRUCTION"] = 10;
            values[valuesById[11] = "POLICE_ACTIVITY"] = 11;
            values[valuesById[12] = "MEDICAL_EMERGENCY"] = 12;
            return values;
        })();

        /**
         * Effect enum.
         * @name transit_realtime.Alert.Effect
         * @enum {number}
         * @property {number} NO_SERVICE=1 NO_SERVICE value
         * @property {number} REDUCED_SERVICE=2 REDUCED_SERVICE value
         * @property {number} SIGNIFICANT_DELAYS=3 SIGNIFICANT_DELAYS value
         * @property {number} DETOUR=4 DETOUR value
         * @property {number} ADDITIONAL_SERVICE=5 ADDITIONAL_SERVICE value
         * @property {number} MODIFIED_SERVICE=6 MODIFIED_SERVICE value
         * @property {number} OTHER_EFFECT=7 OTHER_EFFECT value
         * @property {number} UNKNOWN_EFFECT=8 UNKNOWN_EFFECT value
         * @property {number} STOP_MOVED=9 STOP_MOVED value
         * @property {number} NO_EFFECT=10 NO_EFFECT value
         * @property {number} ACCESSIBILITY_ISSUE=11 ACCESSIBILITY_ISSUE value
         */
        Alert.Effect = (function() {
            const valuesById = {}, values = Object.create(valuesById);
            values[valuesById[1] = "NO_SERVICE"] = 1;
            values[valuesById[2] = "REDUCED_SERVICE"] = 2;
            values[valuesById[3] = "SIGNIFICANT_DELAYS"] = 3;
            values[valuesById[4] = "DETOUR"] = 4;
            values[valuesById[5] = "ADDITIONAL_SERVICE"] = 5;
            values[valuesById[6] = "MODIFIED_SERVICE"] = 6;
            values[valuesById[7] = "OTHER_EFFECT"] = 7;
            values[valuesById[8] = "UNKNOWN_EFFECT"] = 8;
            values[valuesById[9] = "STOP_MOVED"] = 9;
            values[valuesById[10] = "NO_EFFECT"] = 10;
            values[valuesById[11] = "ACCESSIBILITY_ISSUE"] = 11;
            return values;
        })();

        /**
         * SeverityLevel enum.
         * @name transit_realtime.Alert.SeverityLevel
         * @enum {number}
         * @property {number} UNKNOWN_SEVERITY=1 UNKNOWN_SEVERITY value
         * @property {number} INFO=2 INFO value
         * @property {number} WARNING=3 WARNING value
         * @property {number} SEVERE=4 SEVERE value
         */
        Alert.SeverityLevel = (function() {
            const valuesById = {}, values = Object.create(valuesById);
            values[valuesById[1] = "UNKNOWN_SEVERITY"] = 1;
            values[valuesById[2] = "INFO"] = 2;
            values[valuesById[3] = "WARNING"] = 3;
            values[valuesById[4] = "SEVERE"] = 4;
            return values;
        })();

        return Alert;
    })();

    transit_realtime.TimeRange = (function() {

        /**
         * Properties of a TimeRange.
         * @memberof transit_realtime
         * @interface ITimeRange
         * @property {number|Long|null} [start] TimeRange start
         * @property {number|Long|null} [end] TimeRange end
         */

        /**
         * Constructs a new TimeRange.
         * @memberof transit_realtime
         * @classdesc Represents a TimeRange.
         * @implements ITimeRange
         * @constructor
         * @param {transit_realtime.ITimeRange=} [properties] Properties to set
         */
        function TimeRange(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * TimeRange start.
         * @member {number|Long} start
         * @memberof transit_realtime.TimeRange
         * @instance
         */
        TimeRange.prototype.start = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * TimeRange end.
         * @member {number|Long} end
         * @memberof transit_realtime.TimeRange
         * @instance
         */
        TimeRange.prototype.end = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

        /**
         * Creates a new TimeRange instance using the specified properties.
         * @function create
         * @memberof transit_realtime.TimeRange
         * @static
         * @param {transit_realtime.ITimeRange=} [properties] Properties to set
         * @returns {transit_realtime.TimeRange} TimeRange instance
         */
        TimeRange.create = function create(properties) {
            return new TimeRange(properties);
        };

        /**
         * Encodes the specified TimeRange message. Does not implicitly {@link transit_realtime.TimeRange.verify|verify} messages.
         * @function encode
         * @memberof transit_realtime.TimeRange
         * @static
         * @param {transit_realtime.ITimeRange} message TimeRange message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TimeRange.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.start != null && Object.hasOwnProperty.call(message, "start"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint64(message.start);
            if (message.end != null && Object.hasOwnProperty.call(message, "end"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint64(message.end);
            return writer;
        };

        /**
         * Encodes the specified TimeRange message, length delimited. Does not implicitly {@link transit_realtime.TimeRange.verify|verify} messages.
         * @function encodeDelimited
         * @memberof transit_realtime.TimeRange
         * @static
         * @param {transit_realtime.ITimeRange} message TimeRange message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TimeRange.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a TimeRange message from the specified reader or buffer.
         * @function decode
         * @memberof transit_realtime.TimeRange
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {transit_realtime.TimeRange} TimeRange
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TimeRange.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.transit_realtime.TimeRange();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.start = reader.uint64();
                        break;
                    }
                case 2: {
                        message.end = reader.uint64();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a TimeRange message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof transit_realtime.TimeRange
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {transit_realtime.TimeRange} TimeRange
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TimeRange.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a TimeRange message.
         * @function verify
         * @memberof transit_realtime.TimeRange
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        TimeRange.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.start != null && message.hasOwnProperty("start"))
                if (!$util.isInteger(message.start) && !(message.start && $util.isInteger(message.start.low) && $util.isInteger(message.start.high)))
                    return "start: integer|Long expected";
            if (message.end != null && message.hasOwnProperty("end"))
                if (!$util.isInteger(message.end) && !(message.end && $util.isInteger(message.end.low) && $util.isInteger(message.end.high)))
                    return "end: integer|Long expected";
            return null;
        };

        /**
         * Creates a TimeRange message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof transit_realtime.TimeRange
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {transit_realtime.TimeRange} TimeRange
         */
        TimeRange.fromObject = function fromObject(object) {
            if (object instanceof $root.transit_realtime.TimeRange)
                return object;
            let message = new $root.transit_realtime.TimeRange();
            if (object.start != null)
                if ($util.Long)
                    (message.start = $util.Long.fromValue(object.start)).unsigned = true;
                else if (typeof object.start === "string")
                    message.start = parseInt(object.start, 10);
                else if (typeof object.start === "number")
                    message.start = object.start;
                else if (typeof object.start === "object")
                    message.start = new $util.LongBits(object.start.low >>> 0, object.start.high >>> 0).toNumber(true);
            if (object.end != null)
                if ($util.Long)
                    (message.end = $util.Long.fromValue(object.end)).unsigned = true;
                else if (typeof object.end === "string")
                    message.end = parseInt(object.end, 10);
                else if (typeof object.end === "number")
                    message.end = object.end;
                else if (typeof object.end === "object")
                    message.end = new $util.LongBits(object.end.low >>> 0, object.end.high >>> 0).toNumber(true);
            return message;
        };

        /**
         * Creates a plain object from a TimeRange message. Also converts values to other types if specified.
         * @function toObject
         * @memberof transit_realtime.TimeRange
         * @static
         * @param {transit_realtime.TimeRange} message TimeRange
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        TimeRange.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                if ($util.Long) {
                    let long = new $util.Long(0, 0, true);
                    object.start = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.start = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    let long = new $util.Long(0, 0, true);
                    object.end = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.end = options.longs === String ? "0" : 0;
            }
            if (message.start != null && message.hasOwnProperty("start"))
                if (typeof message.start === "number")
                    object.start = options.longs === String ? String(message.start) : message.start;
                else
                    object.start = options.longs === String ? $util.Long.prototype.toString.call(message.start) : options.longs === Number ? new $util.LongBits(message.start.low >>> 0, message.start.high >>> 0).toNumber(true) : message.start;
            if (message.end != null && message.hasOwnProperty("end"))
                if (typeof message.end === "number")
                    object.end = options.longs === String ? String(message.end) : message.end;
                else
                    object.end = options.longs === String ? $util.Long.prototype.toString.call(message.end) : options.longs === Number ? new $util.LongBits(message.end.low >>> 0, message.end.high >>> 0).toNumber(true) : message.end;
            return object;
        };

        /**
         * Converts this TimeRange to JSON.
         * @function toJSON
         * @memberof transit_realtime.TimeRange
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        TimeRange.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for TimeRange
         * @function getTypeUrl
         * @memberof transit_realtime.TimeRange
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        TimeRange.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/transit_realtime.TimeRange";
        };

        return TimeRange;
    })();

    transit_realtime.Position = (function() {

        /**
         * Properties of a Position.
         * @memberof transit_realtime
         * @interface IPosition
         * @property {number} latitude Position latitude
         * @property {number} longitude Position longitude
         * @property {number|null} [bearing] Position bearing
         * @property {number|null} [odometer] Position odometer
         * @property {number|null} [speed] Position speed
         */

        /**
         * Constructs a new Position.
         * @memberof transit_realtime
         * @classdesc Represents a Position.
         * @implements IPosition
         * @constructor
         * @param {transit_realtime.IPosition=} [properties] Properties to set
         */
        function Position(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Position latitude.
         * @member {number} latitude
         * @memberof transit_realtime.Position
         * @instance
         */
        Position.prototype.latitude = 0;

        /**
         * Position longitude.
         * @member {number} longitude
         * @memberof transit_realtime.Position
         * @instance
         */
        Position.prototype.longitude = 0;

        /**
         * Position bearing.
         * @member {number} bearing
         * @memberof transit_realtime.Position
         * @instance
         */
        Position.prototype.bearing = 0;

        /**
         * Position odometer.
         * @member {number} odometer
         * @memberof transit_realtime.Position
         * @instance
         */
        Position.prototype.odometer = 0;

        /**
         * Position speed.
         * @member {number} speed
         * @memberof transit_realtime.Position
         * @instance
         */
        Position.prototype.speed = 0;

        /**
         * Creates a new Position instance using the specified properties.
         * @function create
         * @memberof transit_realtime.Position
         * @static
         * @param {transit_realtime.IPosition=} [properties] Properties to set
         * @returns {transit_realtime.Position} Position instance
         */
        Position.create = function create(properties) {
            return new Position(properties);
        };

        /**
         * Encodes the specified Position message. Does not implicitly {@link transit_realtime.Position.verify|verify} messages.
         * @function encode
         * @memberof transit_realtime.Position
         * @static
         * @param {transit_realtime.IPosition} message Position message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Position.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 5 =*/13).float(message.latitude);
            writer.uint32(/* id 2, wireType 5 =*/21).float(message.longitude);
            if (message.bearing != null && Object.hasOwnProperty.call(message, "bearing"))
                writer.uint32(/* id 3, wireType 5 =*/29).float(message.bearing);
            if (message.odometer != null && Object.hasOwnProperty.call(message, "odometer"))
                writer.uint32(/* id 4, wireType 1 =*/33).double(message.odometer);
            if (message.speed != null && Object.hasOwnProperty.call(message, "speed"))
                writer.uint32(/* id 5, wireType 5 =*/45).float(message.speed);
            return writer;
        };

        /**
         * Encodes the specified Position message, length delimited. Does not implicitly {@link transit_realtime.Position.verify|verify} messages.
         * @function encodeDelimited
         * @memberof transit_realtime.Position
         * @static
         * @param {transit_realtime.IPosition} message Position message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Position.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Position message from the specified reader or buffer.
         * @function decode
         * @memberof transit_realtime.Position
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {transit_realtime.Position} Position
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Position.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.transit_realtime.Position();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.latitude = reader.float();
                        break;
                    }
                case 2: {
                        message.longitude = reader.float();
                        break;
                    }
                case 3: {
                        message.bearing = reader.float();
                        break;
                    }
                case 4: {
                        message.odometer = reader.double();
                        break;
                    }
                case 5: {
                        message.speed = reader.float();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("latitude"))
                throw $util.ProtocolError("missing required 'latitude'", { instance: message });
            if (!message.hasOwnProperty("longitude"))
                throw $util.ProtocolError("missing required 'longitude'", { instance: message });
            return message;
        };

        /**
         * Decodes a Position message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof transit_realtime.Position
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {transit_realtime.Position} Position
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Position.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Position message.
         * @function verify
         * @memberof transit_realtime.Position
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Position.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (typeof message.latitude !== "number")
                return "latitude: number expected";
            if (typeof message.longitude !== "number")
                return "longitude: number expected";
            if (message.bearing != null && message.hasOwnProperty("bearing"))
                if (typeof message.bearing !== "number")
                    return "bearing: number expected";
            if (message.odometer != null && message.hasOwnProperty("odometer"))
                if (typeof message.odometer !== "number")
                    return "odometer: number expected";
            if (message.speed != null && message.hasOwnProperty("speed"))
                if (typeof message.speed !== "number")
                    return "speed: number expected";
            return null;
        };

        /**
         * Creates a Position message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof transit_realtime.Position
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {transit_realtime.Position} Position
         */
        Position.fromObject = function fromObject(object) {
            if (object instanceof $root.transit_realtime.Position)
                return object;
            let message = new $root.transit_realtime.Position();
            if (object.latitude != null)
                message.latitude = Number(object.latitude);
            if (object.longitude != null)
                message.longitude = Number(object.longitude);
            if (object.bearing != null)
                message.bearing = Number(object.bearing);
            if (object.odometer != null)
                message.odometer = Number(object.odometer);
            if (object.speed != null)
                message.speed = Number(object.speed);
            return message;
        };

        /**
         * Creates a plain object from a Position message. Also converts values to other types if specified.
         * @function toObject
         * @memberof transit_realtime.Position
         * @static
         * @param {transit_realtime.Position} message Position
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Position.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.latitude = 0;
                object.longitude = 0;
                object.bearing = 0;
                object.odometer = 0;
                object.speed = 0;
            }
            if (message.latitude != null && message.hasOwnProperty("latitude"))
                object.latitude = options.json && !isFinite(message.latitude) ? String(message.latitude) : message.latitude;
            if (message.longitude != null && message.hasOwnProperty("longitude"))
                object.longitude = options.json && !isFinite(message.longitude) ? String(message.longitude) : message.longitude;
            if (message.bearing != null && message.hasOwnProperty("bearing"))
                object.bearing = options.json && !isFinite(message.bearing) ? String(message.bearing) : message.bearing;
            if (message.odometer != null && message.hasOwnProperty("odometer"))
                object.odometer = options.json && !isFinite(message.odometer) ? String(message.odometer) : message.odometer;
            if (message.speed != null && message.hasOwnProperty("speed"))
                object.speed = options.json && !isFinite(message.speed) ? String(message.speed) : message.speed;
            return object;
        };

        /**
         * Converts this Position to JSON.
         * @function toJSON
         * @memberof transit_realtime.Position
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Position.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Position
         * @function getTypeUrl
         * @memberof transit_realtime.Position
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Position.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/transit_realtime.Position";
        };

        return Position;
    })();

    transit_realtime.TripDescriptor = (function() {

        /**
         * Properties of a TripDescriptor.
         * @memberof transit_realtime
         * @interface ITripDescriptor
         * @property {string|null} [trip_id] TripDescriptor trip_id
         * @property {string|null} [route_id] TripDescriptor route_id
         * @property {number|null} [direction_id] TripDescriptor direction_id
         * @property {string|null} [start_time] TripDescriptor start_time
         * @property {string|null} [start_date] TripDescriptor start_date
         * @property {transit_realtime.TripDescriptor.ScheduleRelationship|null} [schedule_relationship] TripDescriptor schedule_relationship
         * @property {transit_realtime.TripDescriptor.IModifiedTripSelector|null} [modified_trip] TripDescriptor modified_trip
         */

        /**
         * Constructs a new TripDescriptor.
         * @memberof transit_realtime
         * @classdesc Represents a TripDescriptor.
         * @implements ITripDescriptor
         * @constructor
         * @param {transit_realtime.ITripDescriptor=} [properties] Properties to set
         */
        function TripDescriptor(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * TripDescriptor trip_id.
         * @member {string} trip_id
         * @memberof transit_realtime.TripDescriptor
         * @instance
         */
        TripDescriptor.prototype.trip_id = "";

        /**
         * TripDescriptor route_id.
         * @member {string} route_id
         * @memberof transit_realtime.TripDescriptor
         * @instance
         */
        TripDescriptor.prototype.route_id = "";

        /**
         * TripDescriptor direction_id.
         * @member {number} direction_id
         * @memberof transit_realtime.TripDescriptor
         * @instance
         */
        TripDescriptor.prototype.direction_id = 0;

        /**
         * TripDescriptor start_time.
         * @member {string} start_time
         * @memberof transit_realtime.TripDescriptor
         * @instance
         */
        TripDescriptor.prototype.start_time = "";

        /**
         * TripDescriptor start_date.
         * @member {string} start_date
         * @memberof transit_realtime.TripDescriptor
         * @instance
         */
        TripDescriptor.prototype.start_date = "";

        /**
         * TripDescriptor schedule_relationship.
         * @member {transit_realtime.TripDescriptor.ScheduleRelationship} schedule_relationship
         * @memberof transit_realtime.TripDescriptor
         * @instance
         */
        TripDescriptor.prototype.schedule_relationship = 0;

        /**
         * TripDescriptor modified_trip.
         * @member {transit_realtime.TripDescriptor.IModifiedTripSelector|null|undefined} modified_trip
         * @memberof transit_realtime.TripDescriptor
         * @instance
         */
        TripDescriptor.prototype.modified_trip = null;

        /**
         * Creates a new TripDescriptor instance using the specified properties.
         * @function create
         * @memberof transit_realtime.TripDescriptor
         * @static
         * @param {transit_realtime.ITripDescriptor=} [properties] Properties to set
         * @returns {transit_realtime.TripDescriptor} TripDescriptor instance
         */
        TripDescriptor.create = function create(properties) {
            return new TripDescriptor(properties);
        };

        /**
         * Encodes the specified TripDescriptor message. Does not implicitly {@link transit_realtime.TripDescriptor.verify|verify} messages.
         * @function encode
         * @memberof transit_realtime.TripDescriptor
         * @static
         * @param {transit_realtime.ITripDescriptor} message TripDescriptor message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TripDescriptor.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.trip_id != null && Object.hasOwnProperty.call(message, "trip_id"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.trip_id);
            if (message.start_time != null && Object.hasOwnProperty.call(message, "start_time"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.start_time);
            if (message.start_date != null && Object.hasOwnProperty.call(message, "start_date"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.start_date);
            if (message.schedule_relationship != null && Object.hasOwnProperty.call(message, "schedule_relationship"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.schedule_relationship);
            if (message.route_id != null && Object.hasOwnProperty.call(message, "route_id"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.route_id);
            if (message.direction_id != null && Object.hasOwnProperty.call(message, "direction_id"))
                writer.uint32(/* id 6, wireType 0 =*/48).uint32(message.direction_id);
            if (message.modified_trip != null && Object.hasOwnProperty.call(message, "modified_trip"))
                $root.transit_realtime.TripDescriptor.ModifiedTripSelector.encode(message.modified_trip, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified TripDescriptor message, length delimited. Does not implicitly {@link transit_realtime.TripDescriptor.verify|verify} messages.
         * @function encodeDelimited
         * @memberof transit_realtime.TripDescriptor
         * @static
         * @param {transit_realtime.ITripDescriptor} message TripDescriptor message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TripDescriptor.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a TripDescriptor message from the specified reader or buffer.
         * @function decode
         * @memberof transit_realtime.TripDescriptor
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {transit_realtime.TripDescriptor} TripDescriptor
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TripDescriptor.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.transit_realtime.TripDescriptor();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.trip_id = reader.string();
                        break;
                    }
                case 5: {
                        message.route_id = reader.string();
                        break;
                    }
                case 6: {
                        message.direction_id = reader.uint32();
                        break;
                    }
                case 2: {
                        message.start_time = reader.string();
                        break;
                    }
                case 3: {
                        message.start_date = reader.string();
                        break;
                    }
                case 4: {
                        message.schedule_relationship = reader.int32();
                        break;
                    }
                case 7: {
                        message.modified_trip = $root.transit_realtime.TripDescriptor.ModifiedTripSelector.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a TripDescriptor message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof transit_realtime.TripDescriptor
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {transit_realtime.TripDescriptor} TripDescriptor
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TripDescriptor.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a TripDescriptor message.
         * @function verify
         * @memberof transit_realtime.TripDescriptor
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        TripDescriptor.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.trip_id != null && message.hasOwnProperty("trip_id"))
                if (!$util.isString(message.trip_id))
                    return "trip_id: string expected";
            if (message.route_id != null && message.hasOwnProperty("route_id"))
                if (!$util.isString(message.route_id))
                    return "route_id: string expected";
            if (message.direction_id != null && message.hasOwnProperty("direction_id"))
                if (!$util.isInteger(message.direction_id))
                    return "direction_id: integer expected";
            if (message.start_time != null && message.hasOwnProperty("start_time"))
                if (!$util.isString(message.start_time))
                    return "start_time: string expected";
            if (message.start_date != null && message.hasOwnProperty("start_date"))
                if (!$util.isString(message.start_date))
                    return "start_date: string expected";
            if (message.schedule_relationship != null && message.hasOwnProperty("schedule_relationship"))
                switch (message.schedule_relationship) {
                default:
                    return "schedule_relationship: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 5:
                case 6:
                case 7:
                case 8:
                    break;
                }
            if (message.modified_trip != null && message.hasOwnProperty("modified_trip")) {
                let error = $root.transit_realtime.TripDescriptor.ModifiedTripSelector.verify(message.modified_trip);
                if (error)
                    return "modified_trip." + error;
            }
            return null;
        };

        /**
         * Creates a TripDescriptor message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof transit_realtime.TripDescriptor
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {transit_realtime.TripDescriptor} TripDescriptor
         */
        TripDescriptor.fromObject = function fromObject(object) {
            if (object instanceof $root.transit_realtime.TripDescriptor)
                return object;
            let message = new $root.transit_realtime.TripDescriptor();
            if (object.trip_id != null)
                message.trip_id = String(object.trip_id);
            if (object.route_id != null)
                message.route_id = String(object.route_id);
            if (object.direction_id != null)
                message.direction_id = object.direction_id >>> 0;
            if (object.start_time != null)
                message.start_time = String(object.start_time);
            if (object.start_date != null)
                message.start_date = String(object.start_date);
            switch (object.schedule_relationship) {
            default:
                if (typeof object.schedule_relationship === "number") {
                    message.schedule_relationship = object.schedule_relationship;
                    break;
                }
                break;
            case "SCHEDULED":
            case 0:
                message.schedule_relationship = 0;
                break;
            case "ADDED":
            case 1:
                message.schedule_relationship = 1;
                break;
            case "UNSCHEDULED":
            case 2:
                message.schedule_relationship = 2;
                break;
            case "CANCELED":
            case 3:
                message.schedule_relationship = 3;
                break;
            case "REPLACEMENT":
            case 5:
                message.schedule_relationship = 5;
                break;
            case "DUPLICATED":
            case 6:
                message.schedule_relationship = 6;
                break;
            case "DELETED":
            case 7:
                message.schedule_relationship = 7;
                break;
            case "NEW":
            case 8:
                message.schedule_relationship = 8;
                break;
            }
            if (object.modified_trip != null) {
                if (typeof object.modified_trip !== "object")
                    throw TypeError(".transit_realtime.TripDescriptor.modified_trip: object expected");
                message.modified_trip = $root.transit_realtime.TripDescriptor.ModifiedTripSelector.fromObject(object.modified_trip);
            }
            return message;
        };

        /**
         * Creates a plain object from a TripDescriptor message. Also converts values to other types if specified.
         * @function toObject
         * @memberof transit_realtime.TripDescriptor
         * @static
         * @param {transit_realtime.TripDescriptor} message TripDescriptor
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        TripDescriptor.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.trip_id = "";
                object.start_time = "";
                object.start_date = "";
                object.schedule_relationship = options.enums === String ? "SCHEDULED" : 0;
                object.route_id = "";
                object.direction_id = 0;
                object.modified_trip = null;
            }
            if (message.trip_id != null && message.hasOwnProperty("trip_id"))
                object.trip_id = message.trip_id;
            if (message.start_time != null && message.hasOwnProperty("start_time"))
                object.start_time = message.start_time;
            if (message.start_date != null && message.hasOwnProperty("start_date"))
                object.start_date = message.start_date;
            if (message.schedule_relationship != null && message.hasOwnProperty("schedule_relationship"))
                object.schedule_relationship = options.enums === String ? $root.transit_realtime.TripDescriptor.ScheduleRelationship[message.schedule_relationship] === undefined ? message.schedule_relationship : $root.transit_realtime.TripDescriptor.ScheduleRelationship[message.schedule_relationship] : message.schedule_relationship;
            if (message.route_id != null && message.hasOwnProperty("route_id"))
                object.route_id = message.route_id;
            if (message.direction_id != null && message.hasOwnProperty("direction_id"))
                object.direction_id = message.direction_id;
            if (message.modified_trip != null && message.hasOwnProperty("modified_trip"))
                object.modified_trip = $root.transit_realtime.TripDescriptor.ModifiedTripSelector.toObject(message.modified_trip, options);
            return object;
        };

        /**
         * Converts this TripDescriptor to JSON.
         * @function toJSON
         * @memberof transit_realtime.TripDescriptor
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        TripDescriptor.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for TripDescriptor
         * @function getTypeUrl
         * @memberof transit_realtime.TripDescriptor
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        TripDescriptor.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/transit_realtime.TripDescriptor";
        };

        /**
         * ScheduleRelationship enum.
         * @name transit_realtime.TripDescriptor.ScheduleRelationship
         * @enum {number}
         * @property {number} SCHEDULED=0 SCHEDULED value
         * @property {number} ADDED=1 ADDED value
         * @property {number} UNSCHEDULED=2 UNSCHEDULED value
         * @property {number} CANCELED=3 CANCELED value
         * @property {number} REPLACEMENT=5 REPLACEMENT value
         * @property {number} DUPLICATED=6 DUPLICATED value
         * @property {number} DELETED=7 DELETED value
         * @property {number} NEW=8 NEW value
         */
        TripDescriptor.ScheduleRelationship = (function() {
            const valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "SCHEDULED"] = 0;
            values[valuesById[1] = "ADDED"] = 1;
            values[valuesById[2] = "UNSCHEDULED"] = 2;
            values[valuesById[3] = "CANCELED"] = 3;
            values[valuesById[5] = "REPLACEMENT"] = 5;
            values[valuesById[6] = "DUPLICATED"] = 6;
            values[valuesById[7] = "DELETED"] = 7;
            values[valuesById[8] = "NEW"] = 8;
            return values;
        })();

        TripDescriptor.ModifiedTripSelector = (function() {

            /**
             * Properties of a ModifiedTripSelector.
             * @memberof transit_realtime.TripDescriptor
             * @interface IModifiedTripSelector
             * @property {string|null} [modifications_id] ModifiedTripSelector modifications_id
             * @property {string|null} [affected_trip_id] ModifiedTripSelector affected_trip_id
             * @property {string|null} [start_time] ModifiedTripSelector start_time
             * @property {string|null} [start_date] ModifiedTripSelector start_date
             */

            /**
             * Constructs a new ModifiedTripSelector.
             * @memberof transit_realtime.TripDescriptor
             * @classdesc Represents a ModifiedTripSelector.
             * @implements IModifiedTripSelector
             * @constructor
             * @param {transit_realtime.TripDescriptor.IModifiedTripSelector=} [properties] Properties to set
             */
            function ModifiedTripSelector(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ModifiedTripSelector modifications_id.
             * @member {string} modifications_id
             * @memberof transit_realtime.TripDescriptor.ModifiedTripSelector
             * @instance
             */
            ModifiedTripSelector.prototype.modifications_id = "";

            /**
             * ModifiedTripSelector affected_trip_id.
             * @member {string} affected_trip_id
             * @memberof transit_realtime.TripDescriptor.ModifiedTripSelector
             * @instance
             */
            ModifiedTripSelector.prototype.affected_trip_id = "";

            /**
             * ModifiedTripSelector start_time.
             * @member {string} start_time
             * @memberof transit_realtime.TripDescriptor.ModifiedTripSelector
             * @instance
             */
            ModifiedTripSelector.prototype.start_time = "";

            /**
             * ModifiedTripSelector start_date.
             * @member {string} start_date
             * @memberof transit_realtime.TripDescriptor.ModifiedTripSelector
             * @instance
             */
            ModifiedTripSelector.prototype.start_date = "";

            /**
             * Creates a new ModifiedTripSelector instance using the specified properties.
             * @function create
             * @memberof transit_realtime.TripDescriptor.ModifiedTripSelector
             * @static
             * @param {transit_realtime.TripDescriptor.IModifiedTripSelector=} [properties] Properties to set
             * @returns {transit_realtime.TripDescriptor.ModifiedTripSelector} ModifiedTripSelector instance
             */
            ModifiedTripSelector.create = function create(properties) {
                return new ModifiedTripSelector(properties);
            };

            /**
             * Encodes the specified ModifiedTripSelector message. Does not implicitly {@link transit_realtime.TripDescriptor.ModifiedTripSelector.verify|verify} messages.
             * @function encode
             * @memberof transit_realtime.TripDescriptor.ModifiedTripSelector
             * @static
             * @param {transit_realtime.TripDescriptor.IModifiedTripSelector} message ModifiedTripSelector message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ModifiedTripSelector.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.modifications_id != null && Object.hasOwnProperty.call(message, "modifications_id"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.modifications_id);
                if (message.affected_trip_id != null && Object.hasOwnProperty.call(message, "affected_trip_id"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.affected_trip_id);
                if (message.start_time != null && Object.hasOwnProperty.call(message, "start_time"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.start_time);
                if (message.start_date != null && Object.hasOwnProperty.call(message, "start_date"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.start_date);
                return writer;
            };

            /**
             * Encodes the specified ModifiedTripSelector message, length delimited. Does not implicitly {@link transit_realtime.TripDescriptor.ModifiedTripSelector.verify|verify} messages.
             * @function encodeDelimited
             * @memberof transit_realtime.TripDescriptor.ModifiedTripSelector
             * @static
             * @param {transit_realtime.TripDescriptor.IModifiedTripSelector} message ModifiedTripSelector message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ModifiedTripSelector.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ModifiedTripSelector message from the specified reader or buffer.
             * @function decode
             * @memberof transit_realtime.TripDescriptor.ModifiedTripSelector
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {transit_realtime.TripDescriptor.ModifiedTripSelector} ModifiedTripSelector
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ModifiedTripSelector.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.transit_realtime.TripDescriptor.ModifiedTripSelector();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.modifications_id = reader.string();
                            break;
                        }
                    case 2: {
                            message.affected_trip_id = reader.string();
                            break;
                        }
                    case 3: {
                            message.start_time = reader.string();
                            break;
                        }
                    case 4: {
                            message.start_date = reader.string();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a ModifiedTripSelector message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof transit_realtime.TripDescriptor.ModifiedTripSelector
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {transit_realtime.TripDescriptor.ModifiedTripSelector} ModifiedTripSelector
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ModifiedTripSelector.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ModifiedTripSelector message.
             * @function verify
             * @memberof transit_realtime.TripDescriptor.ModifiedTripSelector
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ModifiedTripSelector.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.modifications_id != null && message.hasOwnProperty("modifications_id"))
                    if (!$util.isString(message.modifications_id))
                        return "modifications_id: string expected";
                if (message.affected_trip_id != null && message.hasOwnProperty("affected_trip_id"))
                    if (!$util.isString(message.affected_trip_id))
                        return "affected_trip_id: string expected";
                if (message.start_time != null && message.hasOwnProperty("start_time"))
                    if (!$util.isString(message.start_time))
                        return "start_time: string expected";
                if (message.start_date != null && message.hasOwnProperty("start_date"))
                    if (!$util.isString(message.start_date))
                        return "start_date: string expected";
                return null;
            };

            /**
             * Creates a ModifiedTripSelector message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof transit_realtime.TripDescriptor.ModifiedTripSelector
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {transit_realtime.TripDescriptor.ModifiedTripSelector} ModifiedTripSelector
             */
            ModifiedTripSelector.fromObject = function fromObject(object) {
                if (object instanceof $root.transit_realtime.TripDescriptor.ModifiedTripSelector)
                    return object;
                let message = new $root.transit_realtime.TripDescriptor.ModifiedTripSelector();
                if (object.modifications_id != null)
                    message.modifications_id = String(object.modifications_id);
                if (object.affected_trip_id != null)
                    message.affected_trip_id = String(object.affected_trip_id);
                if (object.start_time != null)
                    message.start_time = String(object.start_time);
                if (object.start_date != null)
                    message.start_date = String(object.start_date);
                return message;
            };

            /**
             * Creates a plain object from a ModifiedTripSelector message. Also converts values to other types if specified.
             * @function toObject
             * @memberof transit_realtime.TripDescriptor.ModifiedTripSelector
             * @static
             * @param {transit_realtime.TripDescriptor.ModifiedTripSelector} message ModifiedTripSelector
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ModifiedTripSelector.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.modifications_id = "";
                    object.affected_trip_id = "";
                    object.start_time = "";
                    object.start_date = "";
                }
                if (message.modifications_id != null && message.hasOwnProperty("modifications_id"))
                    object.modifications_id = message.modifications_id;
                if (message.affected_trip_id != null && message.hasOwnProperty("affected_trip_id"))
                    object.affected_trip_id = message.affected_trip_id;
                if (message.start_time != null && message.hasOwnProperty("start_time"))
                    object.start_time = message.start_time;
                if (message.start_date != null && message.hasOwnProperty("start_date"))
                    object.start_date = message.start_date;
                return object;
            };

            /**
             * Converts this ModifiedTripSelector to JSON.
             * @function toJSON
             * @memberof transit_realtime.TripDescriptor.ModifiedTripSelector
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ModifiedTripSelector.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ModifiedTripSelector
             * @function getTypeUrl
             * @memberof transit_realtime.TripDescriptor.ModifiedTripSelector
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ModifiedTripSelector.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/transit_realtime.TripDescriptor.ModifiedTripSelector";
            };

            return ModifiedTripSelector;
        })();

        return TripDescriptor;
    })();

    transit_realtime.VehicleDescriptor = (function() {

        /**
         * Properties of a VehicleDescriptor.
         * @memberof transit_realtime
         * @interface IVehicleDescriptor
         * @property {string|null} [id] VehicleDescriptor id
         * @property {string|null} [label] VehicleDescriptor label
         * @property {string|null} [license_plate] VehicleDescriptor license_plate
         * @property {transit_realtime.VehicleDescriptor.WheelchairAccessible|null} [wheelchair_accessible] VehicleDescriptor wheelchair_accessible
         */

        /**
         * Constructs a new VehicleDescriptor.
         * @memberof transit_realtime
         * @classdesc Represents a VehicleDescriptor.
         * @implements IVehicleDescriptor
         * @constructor
         * @param {transit_realtime.IVehicleDescriptor=} [properties] Properties to set
         */
        function VehicleDescriptor(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * VehicleDescriptor id.
         * @member {string} id
         * @memberof transit_realtime.VehicleDescriptor
         * @instance
         */
        VehicleDescriptor.prototype.id = "";

        /**
         * VehicleDescriptor label.
         * @member {string} label
         * @memberof transit_realtime.VehicleDescriptor
         * @instance
         */
        VehicleDescriptor.prototype.label = "";

        /**
         * VehicleDescriptor license_plate.
         * @member {string} license_plate
         * @memberof transit_realtime.VehicleDescriptor
         * @instance
         */
        VehicleDescriptor.prototype.license_plate = "";

        /**
         * VehicleDescriptor wheelchair_accessible.
         * @member {transit_realtime.VehicleDescriptor.WheelchairAccessible} wheelchair_accessible
         * @memberof transit_realtime.VehicleDescriptor
         * @instance
         */
        VehicleDescriptor.prototype.wheelchair_accessible = 0;

        /**
         * Creates a new VehicleDescriptor instance using the specified properties.
         * @function create
         * @memberof transit_realtime.VehicleDescriptor
         * @static
         * @param {transit_realtime.IVehicleDescriptor=} [properties] Properties to set
         * @returns {transit_realtime.VehicleDescriptor} VehicleDescriptor instance
         */
        VehicleDescriptor.create = function create(properties) {
            return new VehicleDescriptor(properties);
        };

        /**
         * Encodes the specified VehicleDescriptor message. Does not implicitly {@link transit_realtime.VehicleDescriptor.verify|verify} messages.
         * @function encode
         * @memberof transit_realtime.VehicleDescriptor
         * @static
         * @param {transit_realtime.IVehicleDescriptor} message VehicleDescriptor message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        VehicleDescriptor.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
            if (message.label != null && Object.hasOwnProperty.call(message, "label"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.label);
            if (message.license_plate != null && Object.hasOwnProperty.call(message, "license_plate"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.license_plate);
            if (message.wheelchair_accessible != null && Object.hasOwnProperty.call(message, "wheelchair_accessible"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.wheelchair_accessible);
            return writer;
        };

        /**
         * Encodes the specified VehicleDescriptor message, length delimited. Does not implicitly {@link transit_realtime.VehicleDescriptor.verify|verify} messages.
         * @function encodeDelimited
         * @memberof transit_realtime.VehicleDescriptor
         * @static
         * @param {transit_realtime.IVehicleDescriptor} message VehicleDescriptor message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        VehicleDescriptor.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a VehicleDescriptor message from the specified reader or buffer.
         * @function decode
         * @memberof transit_realtime.VehicleDescriptor
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {transit_realtime.VehicleDescriptor} VehicleDescriptor
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        VehicleDescriptor.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.transit_realtime.VehicleDescriptor();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.id = reader.string();
                        break;
                    }
                case 2: {
                        message.label = reader.string();
                        break;
                    }
                case 3: {
                        message.license_plate = reader.string();
                        break;
                    }
                case 4: {
                        message.wheelchair_accessible = reader.int32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a VehicleDescriptor message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof transit_realtime.VehicleDescriptor
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {transit_realtime.VehicleDescriptor} VehicleDescriptor
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        VehicleDescriptor.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a VehicleDescriptor message.
         * @function verify
         * @memberof transit_realtime.VehicleDescriptor
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        VehicleDescriptor.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isString(message.id))
                    return "id: string expected";
            if (message.label != null && message.hasOwnProperty("label"))
                if (!$util.isString(message.label))
                    return "label: string expected";
            if (message.license_plate != null && message.hasOwnProperty("license_plate"))
                if (!$util.isString(message.license_plate))
                    return "license_plate: string expected";
            if (message.wheelchair_accessible != null && message.hasOwnProperty("wheelchair_accessible"))
                switch (message.wheelchair_accessible) {
                default:
                    return "wheelchair_accessible: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            return null;
        };

        /**
         * Creates a VehicleDescriptor message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof transit_realtime.VehicleDescriptor
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {transit_realtime.VehicleDescriptor} VehicleDescriptor
         */
        VehicleDescriptor.fromObject = function fromObject(object) {
            if (object instanceof $root.transit_realtime.VehicleDescriptor)
                return object;
            let message = new $root.transit_realtime.VehicleDescriptor();
            if (object.id != null)
                message.id = String(object.id);
            if (object.label != null)
                message.label = String(object.label);
            if (object.license_plate != null)
                message.license_plate = String(object.license_plate);
            switch (object.wheelchair_accessible) {
            default:
                if (typeof object.wheelchair_accessible === "number") {
                    message.wheelchair_accessible = object.wheelchair_accessible;
                    break;
                }
                break;
            case "NO_VALUE":
            case 0:
                message.wheelchair_accessible = 0;
                break;
            case "UNKNOWN":
            case 1:
                message.wheelchair_accessible = 1;
                break;
            case "WHEELCHAIR_ACCESSIBLE":
            case 2:
                message.wheelchair_accessible = 2;
                break;
            case "WHEELCHAIR_INACCESSIBLE":
            case 3:
                message.wheelchair_accessible = 3;
                break;
            }
            return message;
        };

        /**
         * Creates a plain object from a VehicleDescriptor message. Also converts values to other types if specified.
         * @function toObject
         * @memberof transit_realtime.VehicleDescriptor
         * @static
         * @param {transit_realtime.VehicleDescriptor} message VehicleDescriptor
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        VehicleDescriptor.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.id = "";
                object.label = "";
                object.license_plate = "";
                object.wheelchair_accessible = options.enums === String ? "NO_VALUE" : 0;
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.label != null && message.hasOwnProperty("label"))
                object.label = message.label;
            if (message.license_plate != null && message.hasOwnProperty("license_plate"))
                object.license_plate = message.license_plate;
            if (message.wheelchair_accessible != null && message.hasOwnProperty("wheelchair_accessible"))
                object.wheelchair_accessible = options.enums === String ? $root.transit_realtime.VehicleDescriptor.WheelchairAccessible[message.wheelchair_accessible] === undefined ? message.wheelchair_accessible : $root.transit_realtime.VehicleDescriptor.WheelchairAccessible[message.wheelchair_accessible] : message.wheelchair_accessible;
            return object;
        };

        /**
         * Converts this VehicleDescriptor to JSON.
         * @function toJSON
         * @memberof transit_realtime.VehicleDescriptor
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        VehicleDescriptor.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for VehicleDescriptor
         * @function getTypeUrl
         * @memberof transit_realtime.VehicleDescriptor
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        VehicleDescriptor.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/transit_realtime.VehicleDescriptor";
        };

        /**
         * WheelchairAccessible enum.
         * @name transit_realtime.VehicleDescriptor.WheelchairAccessible
         * @enum {number}
         * @property {number} NO_VALUE=0 NO_VALUE value
         * @property {number} UNKNOWN=1 UNKNOWN value
         * @property {number} WHEELCHAIR_ACCESSIBLE=2 WHEELCHAIR_ACCESSIBLE value
         * @property {number} WHEELCHAIR_INACCESSIBLE=3 WHEELCHAIR_INACCESSIBLE value
         */
        VehicleDescriptor.WheelchairAccessible = (function() {
            const valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "NO_VALUE"] = 0;
            values[valuesById[1] = "UNKNOWN"] = 1;
            values[valuesById[2] = "WHEELCHAIR_ACCESSIBLE"] = 2;
            values[valuesById[3] = "WHEELCHAIR_INACCESSIBLE"] = 3;
            return values;
        })();

        return VehicleDescriptor;
    })();

    transit_realtime.EntitySelector = (function() {

        /**
         * Properties of an EntitySelector.
         * @memberof transit_realtime
         * @interface IEntitySelector
         * @property {string|null} [agency_id] EntitySelector agency_id
         * @property {string|null} [route_id] EntitySelector route_id
         * @property {number|null} [route_type] EntitySelector route_type
         * @property {transit_realtime.ITripDescriptor|null} [trip] EntitySelector trip
         * @property {string|null} [stop_id] EntitySelector stop_id
         * @property {number|null} [direction_id] EntitySelector direction_id
         */

        /**
         * Constructs a new EntitySelector.
         * @memberof transit_realtime
         * @classdesc Represents an EntitySelector.
         * @implements IEntitySelector
         * @constructor
         * @param {transit_realtime.IEntitySelector=} [properties] Properties to set
         */
        function EntitySelector(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * EntitySelector agency_id.
         * @member {string} agency_id
         * @memberof transit_realtime.EntitySelector
         * @instance
         */
        EntitySelector.prototype.agency_id = "";

        /**
         * EntitySelector route_id.
         * @member {string} route_id
         * @memberof transit_realtime.EntitySelector
         * @instance
         */
        EntitySelector.prototype.route_id = "";

        /**
         * EntitySelector route_type.
         * @member {number} route_type
         * @memberof transit_realtime.EntitySelector
         * @instance
         */
        EntitySelector.prototype.route_type = 0;

        /**
         * EntitySelector trip.
         * @member {transit_realtime.ITripDescriptor|null|undefined} trip
         * @memberof transit_realtime.EntitySelector
         * @instance
         */
        EntitySelector.prototype.trip = null;

        /**
         * EntitySelector stop_id.
         * @member {string} stop_id
         * @memberof transit_realtime.EntitySelector
         * @instance
         */
        EntitySelector.prototype.stop_id = "";

        /**
         * EntitySelector direction_id.
         * @member {number} direction_id
         * @memberof transit_realtime.EntitySelector
         * @instance
         */
        EntitySelector.prototype.direction_id = 0;

        /**
         * Creates a new EntitySelector instance using the specified properties.
         * @function create
         * @memberof transit_realtime.EntitySelector
         * @static
         * @param {transit_realtime.IEntitySelector=} [properties] Properties to set
         * @returns {transit_realtime.EntitySelector} EntitySelector instance
         */
        EntitySelector.create = function create(properties) {
            return new EntitySelector(properties);
        };

        /**
         * Encodes the specified EntitySelector message. Does not implicitly {@link transit_realtime.EntitySelector.verify|verify} messages.
         * @function encode
         * @memberof transit_realtime.EntitySelector
         * @static
         * @param {transit_realtime.IEntitySelector} message EntitySelector message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EntitySelector.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.agency_id != null && Object.hasOwnProperty.call(message, "agency_id"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.agency_id);
            if (message.route_id != null && Object.hasOwnProperty.call(message, "route_id"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.route_id);
            if (message.route_type != null && Object.hasOwnProperty.call(message, "route_type"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.route_type);
            if (message.trip != null && Object.hasOwnProperty.call(message, "trip"))
                $root.transit_realtime.TripDescriptor.encode(message.trip, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.stop_id != null && Object.hasOwnProperty.call(message, "stop_id"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.stop_id);
            if (message.direction_id != null && Object.hasOwnProperty.call(message, "direction_id"))
                writer.uint32(/* id 6, wireType 0 =*/48).uint32(message.direction_id);
            return writer;
        };

        /**
         * Encodes the specified EntitySelector message, length delimited. Does not implicitly {@link transit_realtime.EntitySelector.verify|verify} messages.
         * @function encodeDelimited
         * @memberof transit_realtime.EntitySelector
         * @static
         * @param {transit_realtime.IEntitySelector} message EntitySelector message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EntitySelector.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an EntitySelector message from the specified reader or buffer.
         * @function decode
         * @memberof transit_realtime.EntitySelector
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {transit_realtime.EntitySelector} EntitySelector
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EntitySelector.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.transit_realtime.EntitySelector();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.agency_id = reader.string();
                        break;
                    }
                case 2: {
                        message.route_id = reader.string();
                        break;
                    }
                case 3: {
                        message.route_type = reader.int32();
                        break;
                    }
                case 4: {
                        message.trip = $root.transit_realtime.TripDescriptor.decode(reader, reader.uint32());
                        break;
                    }
                case 5: {
                        message.stop_id = reader.string();
                        break;
                    }
                case 6: {
                        message.direction_id = reader.uint32();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an EntitySelector message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof transit_realtime.EntitySelector
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {transit_realtime.EntitySelector} EntitySelector
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EntitySelector.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an EntitySelector message.
         * @function verify
         * @memberof transit_realtime.EntitySelector
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        EntitySelector.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.agency_id != null && message.hasOwnProperty("agency_id"))
                if (!$util.isString(message.agency_id))
                    return "agency_id: string expected";
            if (message.route_id != null && message.hasOwnProperty("route_id"))
                if (!$util.isString(message.route_id))
                    return "route_id: string expected";
            if (message.route_type != null && message.hasOwnProperty("route_type"))
                if (!$util.isInteger(message.route_type))
                    return "route_type: integer expected";
            if (message.trip != null && message.hasOwnProperty("trip")) {
                let error = $root.transit_realtime.TripDescriptor.verify(message.trip);
                if (error)
                    return "trip." + error;
            }
            if (message.stop_id != null && message.hasOwnProperty("stop_id"))
                if (!$util.isString(message.stop_id))
                    return "stop_id: string expected";
            if (message.direction_id != null && message.hasOwnProperty("direction_id"))
                if (!$util.isInteger(message.direction_id))
                    return "direction_id: integer expected";
            return null;
        };

        /**
         * Creates an EntitySelector message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof transit_realtime.EntitySelector
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {transit_realtime.EntitySelector} EntitySelector
         */
        EntitySelector.fromObject = function fromObject(object) {
            if (object instanceof $root.transit_realtime.EntitySelector)
                return object;
            let message = new $root.transit_realtime.EntitySelector();
            if (object.agency_id != null)
                message.agency_id = String(object.agency_id);
            if (object.route_id != null)
                message.route_id = String(object.route_id);
            if (object.route_type != null)
                message.route_type = object.route_type | 0;
            if (object.trip != null) {
                if (typeof object.trip !== "object")
                    throw TypeError(".transit_realtime.EntitySelector.trip: object expected");
                message.trip = $root.transit_realtime.TripDescriptor.fromObject(object.trip);
            }
            if (object.stop_id != null)
                message.stop_id = String(object.stop_id);
            if (object.direction_id != null)
                message.direction_id = object.direction_id >>> 0;
            return message;
        };

        /**
         * Creates a plain object from an EntitySelector message. Also converts values to other types if specified.
         * @function toObject
         * @memberof transit_realtime.EntitySelector
         * @static
         * @param {transit_realtime.EntitySelector} message EntitySelector
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        EntitySelector.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.agency_id = "";
                object.route_id = "";
                object.route_type = 0;
                object.trip = null;
                object.stop_id = "";
                object.direction_id = 0;
            }
            if (message.agency_id != null && message.hasOwnProperty("agency_id"))
                object.agency_id = message.agency_id;
            if (message.route_id != null && message.hasOwnProperty("route_id"))
                object.route_id = message.route_id;
            if (message.route_type != null && message.hasOwnProperty("route_type"))
                object.route_type = message.route_type;
            if (message.trip != null && message.hasOwnProperty("trip"))
                object.trip = $root.transit_realtime.TripDescriptor.toObject(message.trip, options);
            if (message.stop_id != null && message.hasOwnProperty("stop_id"))
                object.stop_id = message.stop_id;
            if (message.direction_id != null && message.hasOwnProperty("direction_id"))
                object.direction_id = message.direction_id;
            return object;
        };

        /**
         * Converts this EntitySelector to JSON.
         * @function toJSON
         * @memberof transit_realtime.EntitySelector
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        EntitySelector.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for EntitySelector
         * @function getTypeUrl
         * @memberof transit_realtime.EntitySelector
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        EntitySelector.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/transit_realtime.EntitySelector";
        };

        return EntitySelector;
    })();

    transit_realtime.TranslatedString = (function() {

        /**
         * Properties of a TranslatedString.
         * @memberof transit_realtime
         * @interface ITranslatedString
         * @property {Array.<transit_realtime.TranslatedString.ITranslation>|null} [translation] TranslatedString translation
         */

        /**
         * Constructs a new TranslatedString.
         * @memberof transit_realtime
         * @classdesc Represents a TranslatedString.
         * @implements ITranslatedString
         * @constructor
         * @param {transit_realtime.ITranslatedString=} [properties] Properties to set
         */
        function TranslatedString(properties) {
            this.translation = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * TranslatedString translation.
         * @member {Array.<transit_realtime.TranslatedString.ITranslation>} translation
         * @memberof transit_realtime.TranslatedString
         * @instance
         */
        TranslatedString.prototype.translation = $util.emptyArray;

        /**
         * Creates a new TranslatedString instance using the specified properties.
         * @function create
         * @memberof transit_realtime.TranslatedString
         * @static
         * @param {transit_realtime.ITranslatedString=} [properties] Properties to set
         * @returns {transit_realtime.TranslatedString} TranslatedString instance
         */
        TranslatedString.create = function create(properties) {
            return new TranslatedString(properties);
        };

        /**
         * Encodes the specified TranslatedString message. Does not implicitly {@link transit_realtime.TranslatedString.verify|verify} messages.
         * @function encode
         * @memberof transit_realtime.TranslatedString
         * @static
         * @param {transit_realtime.ITranslatedString} message TranslatedString message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TranslatedString.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.translation != null && message.translation.length)
                for (let i = 0; i < message.translation.length; ++i)
                    $root.transit_realtime.TranslatedString.Translation.encode(message.translation[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified TranslatedString message, length delimited. Does not implicitly {@link transit_realtime.TranslatedString.verify|verify} messages.
         * @function encodeDelimited
         * @memberof transit_realtime.TranslatedString
         * @static
         * @param {transit_realtime.ITranslatedString} message TranslatedString message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TranslatedString.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a TranslatedString message from the specified reader or buffer.
         * @function decode
         * @memberof transit_realtime.TranslatedString
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {transit_realtime.TranslatedString} TranslatedString
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TranslatedString.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.transit_realtime.TranslatedString();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.translation && message.translation.length))
                            message.translation = [];
                        message.translation.push($root.transit_realtime.TranslatedString.Translation.decode(reader, reader.uint32()));
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a TranslatedString message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof transit_realtime.TranslatedString
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {transit_realtime.TranslatedString} TranslatedString
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TranslatedString.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a TranslatedString message.
         * @function verify
         * @memberof transit_realtime.TranslatedString
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        TranslatedString.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.translation != null && message.hasOwnProperty("translation")) {
                if (!Array.isArray(message.translation))
                    return "translation: array expected";
                for (let i = 0; i < message.translation.length; ++i) {
                    let error = $root.transit_realtime.TranslatedString.Translation.verify(message.translation[i]);
                    if (error)
                        return "translation." + error;
                }
            }
            return null;
        };

        /**
         * Creates a TranslatedString message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof transit_realtime.TranslatedString
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {transit_realtime.TranslatedString} TranslatedString
         */
        TranslatedString.fromObject = function fromObject(object) {
            if (object instanceof $root.transit_realtime.TranslatedString)
                return object;
            let message = new $root.transit_realtime.TranslatedString();
            if (object.translation) {
                if (!Array.isArray(object.translation))
                    throw TypeError(".transit_realtime.TranslatedString.translation: array expected");
                message.translation = [];
                for (let i = 0; i < object.translation.length; ++i) {
                    if (typeof object.translation[i] !== "object")
                        throw TypeError(".transit_realtime.TranslatedString.translation: object expected");
                    message.translation[i] = $root.transit_realtime.TranslatedString.Translation.fromObject(object.translation[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a TranslatedString message. Also converts values to other types if specified.
         * @function toObject
         * @memberof transit_realtime.TranslatedString
         * @static
         * @param {transit_realtime.TranslatedString} message TranslatedString
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        TranslatedString.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults)
                object.translation = [];
            if (message.translation && message.translation.length) {
                object.translation = [];
                for (let j = 0; j < message.translation.length; ++j)
                    object.translation[j] = $root.transit_realtime.TranslatedString.Translation.toObject(message.translation[j], options);
            }
            return object;
        };

        /**
         * Converts this TranslatedString to JSON.
         * @function toJSON
         * @memberof transit_realtime.TranslatedString
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        TranslatedString.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for TranslatedString
         * @function getTypeUrl
         * @memberof transit_realtime.TranslatedString
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        TranslatedString.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/transit_realtime.TranslatedString";
        };

        TranslatedString.Translation = (function() {

            /**
             * Properties of a Translation.
             * @memberof transit_realtime.TranslatedString
             * @interface ITranslation
             * @property {string} text Translation text
             * @property {string|null} [language] Translation language
             */

            /**
             * Constructs a new Translation.
             * @memberof transit_realtime.TranslatedString
             * @classdesc Represents a Translation.
             * @implements ITranslation
             * @constructor
             * @param {transit_realtime.TranslatedString.ITranslation=} [properties] Properties to set
             */
            function Translation(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Translation text.
             * @member {string} text
             * @memberof transit_realtime.TranslatedString.Translation
             * @instance
             */
            Translation.prototype.text = "";

            /**
             * Translation language.
             * @member {string} language
             * @memberof transit_realtime.TranslatedString.Translation
             * @instance
             */
            Translation.prototype.language = "";

            /**
             * Creates a new Translation instance using the specified properties.
             * @function create
             * @memberof transit_realtime.TranslatedString.Translation
             * @static
             * @param {transit_realtime.TranslatedString.ITranslation=} [properties] Properties to set
             * @returns {transit_realtime.TranslatedString.Translation} Translation instance
             */
            Translation.create = function create(properties) {
                return new Translation(properties);
            };

            /**
             * Encodes the specified Translation message. Does not implicitly {@link transit_realtime.TranslatedString.Translation.verify|verify} messages.
             * @function encode
             * @memberof transit_realtime.TranslatedString.Translation
             * @static
             * @param {transit_realtime.TranslatedString.ITranslation} message Translation message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Translation.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.text);
                if (message.language != null && Object.hasOwnProperty.call(message, "language"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.language);
                return writer;
            };

            /**
             * Encodes the specified Translation message, length delimited. Does not implicitly {@link transit_realtime.TranslatedString.Translation.verify|verify} messages.
             * @function encodeDelimited
             * @memberof transit_realtime.TranslatedString.Translation
             * @static
             * @param {transit_realtime.TranslatedString.ITranslation} message Translation message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Translation.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Translation message from the specified reader or buffer.
             * @function decode
             * @memberof transit_realtime.TranslatedString.Translation
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {transit_realtime.TranslatedString.Translation} Translation
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Translation.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.transit_realtime.TranslatedString.Translation();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.text = reader.string();
                            break;
                        }
                    case 2: {
                            message.language = reader.string();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                if (!message.hasOwnProperty("text"))
                    throw $util.ProtocolError("missing required 'text'", { instance: message });
                return message;
            };

            /**
             * Decodes a Translation message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof transit_realtime.TranslatedString.Translation
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {transit_realtime.TranslatedString.Translation} Translation
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Translation.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Translation message.
             * @function verify
             * @memberof transit_realtime.TranslatedString.Translation
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Translation.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (!$util.isString(message.text))
                    return "text: string expected";
                if (message.language != null && message.hasOwnProperty("language"))
                    if (!$util.isString(message.language))
                        return "language: string expected";
                return null;
            };

            /**
             * Creates a Translation message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof transit_realtime.TranslatedString.Translation
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {transit_realtime.TranslatedString.Translation} Translation
             */
            Translation.fromObject = function fromObject(object) {
                if (object instanceof $root.transit_realtime.TranslatedString.Translation)
                    return object;
                let message = new $root.transit_realtime.TranslatedString.Translation();
                if (object.text != null)
                    message.text = String(object.text);
                if (object.language != null)
                    message.language = String(object.language);
                return message;
            };

            /**
             * Creates a plain object from a Translation message. Also converts values to other types if specified.
             * @function toObject
             * @memberof transit_realtime.TranslatedString.Translation
             * @static
             * @param {transit_realtime.TranslatedString.Translation} message Translation
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Translation.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.text = "";
                    object.language = "";
                }
                if (message.text != null && message.hasOwnProperty("text"))
                    object.text = message.text;
                if (message.language != null && message.hasOwnProperty("language"))
                    object.language = message.language;
                return object;
            };

            /**
             * Converts this Translation to JSON.
             * @function toJSON
             * @memberof transit_realtime.TranslatedString.Translation
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Translation.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for Translation
             * @function getTypeUrl
             * @memberof transit_realtime.TranslatedString.Translation
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Translation.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/transit_realtime.TranslatedString.Translation";
            };

            return Translation;
        })();

        return TranslatedString;
    })();

    transit_realtime.TranslatedImage = (function() {

        /**
         * Properties of a TranslatedImage.
         * @memberof transit_realtime
         * @interface ITranslatedImage
         * @property {Array.<transit_realtime.TranslatedImage.ILocalizedImage>|null} [localized_image] TranslatedImage localized_image
         */

        /**
         * Constructs a new TranslatedImage.
         * @memberof transit_realtime
         * @classdesc Represents a TranslatedImage.
         * @implements ITranslatedImage
         * @constructor
         * @param {transit_realtime.ITranslatedImage=} [properties] Properties to set
         */
        function TranslatedImage(properties) {
            this.localized_image = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * TranslatedImage localized_image.
         * @member {Array.<transit_realtime.TranslatedImage.ILocalizedImage>} localized_image
         * @memberof transit_realtime.TranslatedImage
         * @instance
         */
        TranslatedImage.prototype.localized_image = $util.emptyArray;

        /**
         * Creates a new TranslatedImage instance using the specified properties.
         * @function create
         * @memberof transit_realtime.TranslatedImage
         * @static
         * @param {transit_realtime.ITranslatedImage=} [properties] Properties to set
         * @returns {transit_realtime.TranslatedImage} TranslatedImage instance
         */
        TranslatedImage.create = function create(properties) {
            return new TranslatedImage(properties);
        };

        /**
         * Encodes the specified TranslatedImage message. Does not implicitly {@link transit_realtime.TranslatedImage.verify|verify} messages.
         * @function encode
         * @memberof transit_realtime.TranslatedImage
         * @static
         * @param {transit_realtime.ITranslatedImage} message TranslatedImage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TranslatedImage.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.localized_image != null && message.localized_image.length)
                for (let i = 0; i < message.localized_image.length; ++i)
                    $root.transit_realtime.TranslatedImage.LocalizedImage.encode(message.localized_image[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified TranslatedImage message, length delimited. Does not implicitly {@link transit_realtime.TranslatedImage.verify|verify} messages.
         * @function encodeDelimited
         * @memberof transit_realtime.TranslatedImage
         * @static
         * @param {transit_realtime.ITranslatedImage} message TranslatedImage message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TranslatedImage.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a TranslatedImage message from the specified reader or buffer.
         * @function decode
         * @memberof transit_realtime.TranslatedImage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {transit_realtime.TranslatedImage} TranslatedImage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TranslatedImage.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.transit_realtime.TranslatedImage();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.localized_image && message.localized_image.length))
                            message.localized_image = [];
                        message.localized_image.push($root.transit_realtime.TranslatedImage.LocalizedImage.decode(reader, reader.uint32()));
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a TranslatedImage message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof transit_realtime.TranslatedImage
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {transit_realtime.TranslatedImage} TranslatedImage
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TranslatedImage.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a TranslatedImage message.
         * @function verify
         * @memberof transit_realtime.TranslatedImage
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        TranslatedImage.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.localized_image != null && message.hasOwnProperty("localized_image")) {
                if (!Array.isArray(message.localized_image))
                    return "localized_image: array expected";
                for (let i = 0; i < message.localized_image.length; ++i) {
                    let error = $root.transit_realtime.TranslatedImage.LocalizedImage.verify(message.localized_image[i]);
                    if (error)
                        return "localized_image." + error;
                }
            }
            return null;
        };

        /**
         * Creates a TranslatedImage message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof transit_realtime.TranslatedImage
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {transit_realtime.TranslatedImage} TranslatedImage
         */
        TranslatedImage.fromObject = function fromObject(object) {
            if (object instanceof $root.transit_realtime.TranslatedImage)
                return object;
            let message = new $root.transit_realtime.TranslatedImage();
            if (object.localized_image) {
                if (!Array.isArray(object.localized_image))
                    throw TypeError(".transit_realtime.TranslatedImage.localized_image: array expected");
                message.localized_image = [];
                for (let i = 0; i < object.localized_image.length; ++i) {
                    if (typeof object.localized_image[i] !== "object")
                        throw TypeError(".transit_realtime.TranslatedImage.localized_image: object expected");
                    message.localized_image[i] = $root.transit_realtime.TranslatedImage.LocalizedImage.fromObject(object.localized_image[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a TranslatedImage message. Also converts values to other types if specified.
         * @function toObject
         * @memberof transit_realtime.TranslatedImage
         * @static
         * @param {transit_realtime.TranslatedImage} message TranslatedImage
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        TranslatedImage.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults)
                object.localized_image = [];
            if (message.localized_image && message.localized_image.length) {
                object.localized_image = [];
                for (let j = 0; j < message.localized_image.length; ++j)
                    object.localized_image[j] = $root.transit_realtime.TranslatedImage.LocalizedImage.toObject(message.localized_image[j], options);
            }
            return object;
        };

        /**
         * Converts this TranslatedImage to JSON.
         * @function toJSON
         * @memberof transit_realtime.TranslatedImage
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        TranslatedImage.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for TranslatedImage
         * @function getTypeUrl
         * @memberof transit_realtime.TranslatedImage
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        TranslatedImage.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/transit_realtime.TranslatedImage";
        };

        TranslatedImage.LocalizedImage = (function() {

            /**
             * Properties of a LocalizedImage.
             * @memberof transit_realtime.TranslatedImage
             * @interface ILocalizedImage
             * @property {string} url LocalizedImage url
             * @property {string} media_type LocalizedImage media_type
             * @property {string|null} [language] LocalizedImage language
             */

            /**
             * Constructs a new LocalizedImage.
             * @memberof transit_realtime.TranslatedImage
             * @classdesc Represents a LocalizedImage.
             * @implements ILocalizedImage
             * @constructor
             * @param {transit_realtime.TranslatedImage.ILocalizedImage=} [properties] Properties to set
             */
            function LocalizedImage(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * LocalizedImage url.
             * @member {string} url
             * @memberof transit_realtime.TranslatedImage.LocalizedImage
             * @instance
             */
            LocalizedImage.prototype.url = "";

            /**
             * LocalizedImage media_type.
             * @member {string} media_type
             * @memberof transit_realtime.TranslatedImage.LocalizedImage
             * @instance
             */
            LocalizedImage.prototype.media_type = "";

            /**
             * LocalizedImage language.
             * @member {string} language
             * @memberof transit_realtime.TranslatedImage.LocalizedImage
             * @instance
             */
            LocalizedImage.prototype.language = "";

            /**
             * Creates a new LocalizedImage instance using the specified properties.
             * @function create
             * @memberof transit_realtime.TranslatedImage.LocalizedImage
             * @static
             * @param {transit_realtime.TranslatedImage.ILocalizedImage=} [properties] Properties to set
             * @returns {transit_realtime.TranslatedImage.LocalizedImage} LocalizedImage instance
             */
            LocalizedImage.create = function create(properties) {
                return new LocalizedImage(properties);
            };

            /**
             * Encodes the specified LocalizedImage message. Does not implicitly {@link transit_realtime.TranslatedImage.LocalizedImage.verify|verify} messages.
             * @function encode
             * @memberof transit_realtime.TranslatedImage.LocalizedImage
             * @static
             * @param {transit_realtime.TranslatedImage.ILocalizedImage} message LocalizedImage message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LocalizedImage.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.url);
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.media_type);
                if (message.language != null && Object.hasOwnProperty.call(message, "language"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.language);
                return writer;
            };

            /**
             * Encodes the specified LocalizedImage message, length delimited. Does not implicitly {@link transit_realtime.TranslatedImage.LocalizedImage.verify|verify} messages.
             * @function encodeDelimited
             * @memberof transit_realtime.TranslatedImage.LocalizedImage
             * @static
             * @param {transit_realtime.TranslatedImage.ILocalizedImage} message LocalizedImage message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            LocalizedImage.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a LocalizedImage message from the specified reader or buffer.
             * @function decode
             * @memberof transit_realtime.TranslatedImage.LocalizedImage
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {transit_realtime.TranslatedImage.LocalizedImage} LocalizedImage
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LocalizedImage.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.transit_realtime.TranslatedImage.LocalizedImage();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.url = reader.string();
                            break;
                        }
                    case 2: {
                            message.media_type = reader.string();
                            break;
                        }
                    case 3: {
                            message.language = reader.string();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                if (!message.hasOwnProperty("url"))
                    throw $util.ProtocolError("missing required 'url'", { instance: message });
                if (!message.hasOwnProperty("media_type"))
                    throw $util.ProtocolError("missing required 'media_type'", { instance: message });
                return message;
            };

            /**
             * Decodes a LocalizedImage message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof transit_realtime.TranslatedImage.LocalizedImage
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {transit_realtime.TranslatedImage.LocalizedImage} LocalizedImage
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            LocalizedImage.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a LocalizedImage message.
             * @function verify
             * @memberof transit_realtime.TranslatedImage.LocalizedImage
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            LocalizedImage.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (!$util.isString(message.url))
                    return "url: string expected";
                if (!$util.isString(message.media_type))
                    return "media_type: string expected";
                if (message.language != null && message.hasOwnProperty("language"))
                    if (!$util.isString(message.language))
                        return "language: string expected";
                return null;
            };

            /**
             * Creates a LocalizedImage message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof transit_realtime.TranslatedImage.LocalizedImage
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {transit_realtime.TranslatedImage.LocalizedImage} LocalizedImage
             */
            LocalizedImage.fromObject = function fromObject(object) {
                if (object instanceof $root.transit_realtime.TranslatedImage.LocalizedImage)
                    return object;
                let message = new $root.transit_realtime.TranslatedImage.LocalizedImage();
                if (object.url != null)
                    message.url = String(object.url);
                if (object.media_type != null)
                    message.media_type = String(object.media_type);
                if (object.language != null)
                    message.language = String(object.language);
                return message;
            };

            /**
             * Creates a plain object from a LocalizedImage message. Also converts values to other types if specified.
             * @function toObject
             * @memberof transit_realtime.TranslatedImage.LocalizedImage
             * @static
             * @param {transit_realtime.TranslatedImage.LocalizedImage} message LocalizedImage
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            LocalizedImage.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.url = "";
                    object.media_type = "";
                    object.language = "";
                }
                if (message.url != null && message.hasOwnProperty("url"))
                    object.url = message.url;
                if (message.media_type != null && message.hasOwnProperty("media_type"))
                    object.media_type = message.media_type;
                if (message.language != null && message.hasOwnProperty("language"))
                    object.language = message.language;
                return object;
            };

            /**
             * Converts this LocalizedImage to JSON.
             * @function toJSON
             * @memberof transit_realtime.TranslatedImage.LocalizedImage
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            LocalizedImage.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for LocalizedImage
             * @function getTypeUrl
             * @memberof transit_realtime.TranslatedImage.LocalizedImage
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            LocalizedImage.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/transit_realtime.TranslatedImage.LocalizedImage";
            };

            return LocalizedImage;
        })();

        return TranslatedImage;
    })();

    transit_realtime.Shape = (function() {

        /**
         * Properties of a Shape.
         * @memberof transit_realtime
         * @interface IShape
         * @property {string|null} [shape_id] Shape shape_id
         * @property {string|null} [encoded_polyline] Shape encoded_polyline
         */

        /**
         * Constructs a new Shape.
         * @memberof transit_realtime
         * @classdesc Represents a Shape.
         * @implements IShape
         * @constructor
         * @param {transit_realtime.IShape=} [properties] Properties to set
         */
        function Shape(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Shape shape_id.
         * @member {string} shape_id
         * @memberof transit_realtime.Shape
         * @instance
         */
        Shape.prototype.shape_id = "";

        /**
         * Shape encoded_polyline.
         * @member {string} encoded_polyline
         * @memberof transit_realtime.Shape
         * @instance
         */
        Shape.prototype.encoded_polyline = "";

        /**
         * Creates a new Shape instance using the specified properties.
         * @function create
         * @memberof transit_realtime.Shape
         * @static
         * @param {transit_realtime.IShape=} [properties] Properties to set
         * @returns {transit_realtime.Shape} Shape instance
         */
        Shape.create = function create(properties) {
            return new Shape(properties);
        };

        /**
         * Encodes the specified Shape message. Does not implicitly {@link transit_realtime.Shape.verify|verify} messages.
         * @function encode
         * @memberof transit_realtime.Shape
         * @static
         * @param {transit_realtime.IShape} message Shape message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Shape.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.shape_id != null && Object.hasOwnProperty.call(message, "shape_id"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.shape_id);
            if (message.encoded_polyline != null && Object.hasOwnProperty.call(message, "encoded_polyline"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.encoded_polyline);
            return writer;
        };

        /**
         * Encodes the specified Shape message, length delimited. Does not implicitly {@link transit_realtime.Shape.verify|verify} messages.
         * @function encodeDelimited
         * @memberof transit_realtime.Shape
         * @static
         * @param {transit_realtime.IShape} message Shape message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Shape.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Shape message from the specified reader or buffer.
         * @function decode
         * @memberof transit_realtime.Shape
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {transit_realtime.Shape} Shape
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Shape.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.transit_realtime.Shape();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.shape_id = reader.string();
                        break;
                    }
                case 2: {
                        message.encoded_polyline = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Shape message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof transit_realtime.Shape
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {transit_realtime.Shape} Shape
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Shape.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Shape message.
         * @function verify
         * @memberof transit_realtime.Shape
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Shape.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.shape_id != null && message.hasOwnProperty("shape_id"))
                if (!$util.isString(message.shape_id))
                    return "shape_id: string expected";
            if (message.encoded_polyline != null && message.hasOwnProperty("encoded_polyline"))
                if (!$util.isString(message.encoded_polyline))
                    return "encoded_polyline: string expected";
            return null;
        };

        /**
         * Creates a Shape message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof transit_realtime.Shape
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {transit_realtime.Shape} Shape
         */
        Shape.fromObject = function fromObject(object) {
            if (object instanceof $root.transit_realtime.Shape)
                return object;
            let message = new $root.transit_realtime.Shape();
            if (object.shape_id != null)
                message.shape_id = String(object.shape_id);
            if (object.encoded_polyline != null)
                message.encoded_polyline = String(object.encoded_polyline);
            return message;
        };

        /**
         * Creates a plain object from a Shape message. Also converts values to other types if specified.
         * @function toObject
         * @memberof transit_realtime.Shape
         * @static
         * @param {transit_realtime.Shape} message Shape
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Shape.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.shape_id = "";
                object.encoded_polyline = "";
            }
            if (message.shape_id != null && message.hasOwnProperty("shape_id"))
                object.shape_id = message.shape_id;
            if (message.encoded_polyline != null && message.hasOwnProperty("encoded_polyline"))
                object.encoded_polyline = message.encoded_polyline;
            return object;
        };

        /**
         * Converts this Shape to JSON.
         * @function toJSON
         * @memberof transit_realtime.Shape
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Shape.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Shape
         * @function getTypeUrl
         * @memberof transit_realtime.Shape
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Shape.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/transit_realtime.Shape";
        };

        return Shape;
    })();

    transit_realtime.Stop = (function() {

        /**
         * Properties of a Stop.
         * @memberof transit_realtime
         * @interface IStop
         * @property {string|null} [stop_id] Stop stop_id
         * @property {transit_realtime.ITranslatedString|null} [stop_code] Stop stop_code
         * @property {transit_realtime.ITranslatedString|null} [stop_name] Stop stop_name
         * @property {transit_realtime.ITranslatedString|null} [tts_stop_name] Stop tts_stop_name
         * @property {transit_realtime.ITranslatedString|null} [stop_desc] Stop stop_desc
         * @property {number|null} [stop_lat] Stop stop_lat
         * @property {number|null} [stop_lon] Stop stop_lon
         * @property {string|null} [zone_id] Stop zone_id
         * @property {transit_realtime.ITranslatedString|null} [stop_url] Stop stop_url
         * @property {string|null} [parent_station] Stop parent_station
         * @property {string|null} [stop_timezone] Stop stop_timezone
         * @property {transit_realtime.Stop.WheelchairBoarding|null} [wheelchair_boarding] Stop wheelchair_boarding
         * @property {string|null} [level_id] Stop level_id
         * @property {transit_realtime.ITranslatedString|null} [platform_code] Stop platform_code
         */

        /**
         * Constructs a new Stop.
         * @memberof transit_realtime
         * @classdesc Represents a Stop.
         * @implements IStop
         * @constructor
         * @param {transit_realtime.IStop=} [properties] Properties to set
         */
        function Stop(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Stop stop_id.
         * @member {string} stop_id
         * @memberof transit_realtime.Stop
         * @instance
         */
        Stop.prototype.stop_id = "";

        /**
         * Stop stop_code.
         * @member {transit_realtime.ITranslatedString|null|undefined} stop_code
         * @memberof transit_realtime.Stop
         * @instance
         */
        Stop.prototype.stop_code = null;

        /**
         * Stop stop_name.
         * @member {transit_realtime.ITranslatedString|null|undefined} stop_name
         * @memberof transit_realtime.Stop
         * @instance
         */
        Stop.prototype.stop_name = null;

        /**
         * Stop tts_stop_name.
         * @member {transit_realtime.ITranslatedString|null|undefined} tts_stop_name
         * @memberof transit_realtime.Stop
         * @instance
         */
        Stop.prototype.tts_stop_name = null;

        /**
         * Stop stop_desc.
         * @member {transit_realtime.ITranslatedString|null|undefined} stop_desc
         * @memberof transit_realtime.Stop
         * @instance
         */
        Stop.prototype.stop_desc = null;

        /**
         * Stop stop_lat.
         * @member {number} stop_lat
         * @memberof transit_realtime.Stop
         * @instance
         */
        Stop.prototype.stop_lat = 0;

        /**
         * Stop stop_lon.
         * @member {number} stop_lon
         * @memberof transit_realtime.Stop
         * @instance
         */
        Stop.prototype.stop_lon = 0;

        /**
         * Stop zone_id.
         * @member {string} zone_id
         * @memberof transit_realtime.Stop
         * @instance
         */
        Stop.prototype.zone_id = "";

        /**
         * Stop stop_url.
         * @member {transit_realtime.ITranslatedString|null|undefined} stop_url
         * @memberof transit_realtime.Stop
         * @instance
         */
        Stop.prototype.stop_url = null;

        /**
         * Stop parent_station.
         * @member {string} parent_station
         * @memberof transit_realtime.Stop
         * @instance
         */
        Stop.prototype.parent_station = "";

        /**
         * Stop stop_timezone.
         * @member {string} stop_timezone
         * @memberof transit_realtime.Stop
         * @instance
         */
        Stop.prototype.stop_timezone = "";

        /**
         * Stop wheelchair_boarding.
         * @member {transit_realtime.Stop.WheelchairBoarding} wheelchair_boarding
         * @memberof transit_realtime.Stop
         * @instance
         */
        Stop.prototype.wheelchair_boarding = 0;

        /**
         * Stop level_id.
         * @member {string} level_id
         * @memberof transit_realtime.Stop
         * @instance
         */
        Stop.prototype.level_id = "";

        /**
         * Stop platform_code.
         * @member {transit_realtime.ITranslatedString|null|undefined} platform_code
         * @memberof transit_realtime.Stop
         * @instance
         */
        Stop.prototype.platform_code = null;

        /**
         * Creates a new Stop instance using the specified properties.
         * @function create
         * @memberof transit_realtime.Stop
         * @static
         * @param {transit_realtime.IStop=} [properties] Properties to set
         * @returns {transit_realtime.Stop} Stop instance
         */
        Stop.create = function create(properties) {
            return new Stop(properties);
        };

        /**
         * Encodes the specified Stop message. Does not implicitly {@link transit_realtime.Stop.verify|verify} messages.
         * @function encode
         * @memberof transit_realtime.Stop
         * @static
         * @param {transit_realtime.IStop} message Stop message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Stop.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.stop_id != null && Object.hasOwnProperty.call(message, "stop_id"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.stop_id);
            if (message.stop_code != null && Object.hasOwnProperty.call(message, "stop_code"))
                $root.transit_realtime.TranslatedString.encode(message.stop_code, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.stop_name != null && Object.hasOwnProperty.call(message, "stop_name"))
                $root.transit_realtime.TranslatedString.encode(message.stop_name, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.tts_stop_name != null && Object.hasOwnProperty.call(message, "tts_stop_name"))
                $root.transit_realtime.TranslatedString.encode(message.tts_stop_name, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.stop_desc != null && Object.hasOwnProperty.call(message, "stop_desc"))
                $root.transit_realtime.TranslatedString.encode(message.stop_desc, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            if (message.stop_lat != null && Object.hasOwnProperty.call(message, "stop_lat"))
                writer.uint32(/* id 6, wireType 5 =*/53).float(message.stop_lat);
            if (message.stop_lon != null && Object.hasOwnProperty.call(message, "stop_lon"))
                writer.uint32(/* id 7, wireType 5 =*/61).float(message.stop_lon);
            if (message.zone_id != null && Object.hasOwnProperty.call(message, "zone_id"))
                writer.uint32(/* id 8, wireType 2 =*/66).string(message.zone_id);
            if (message.stop_url != null && Object.hasOwnProperty.call(message, "stop_url"))
                $root.transit_realtime.TranslatedString.encode(message.stop_url, writer.uint32(/* id 9, wireType 2 =*/74).fork()).ldelim();
            if (message.parent_station != null && Object.hasOwnProperty.call(message, "parent_station"))
                writer.uint32(/* id 11, wireType 2 =*/90).string(message.parent_station);
            if (message.stop_timezone != null && Object.hasOwnProperty.call(message, "stop_timezone"))
                writer.uint32(/* id 12, wireType 2 =*/98).string(message.stop_timezone);
            if (message.wheelchair_boarding != null && Object.hasOwnProperty.call(message, "wheelchair_boarding"))
                writer.uint32(/* id 13, wireType 0 =*/104).int32(message.wheelchair_boarding);
            if (message.level_id != null && Object.hasOwnProperty.call(message, "level_id"))
                writer.uint32(/* id 14, wireType 2 =*/114).string(message.level_id);
            if (message.platform_code != null && Object.hasOwnProperty.call(message, "platform_code"))
                $root.transit_realtime.TranslatedString.encode(message.platform_code, writer.uint32(/* id 15, wireType 2 =*/122).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified Stop message, length delimited. Does not implicitly {@link transit_realtime.Stop.verify|verify} messages.
         * @function encodeDelimited
         * @memberof transit_realtime.Stop
         * @static
         * @param {transit_realtime.IStop} message Stop message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Stop.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Stop message from the specified reader or buffer.
         * @function decode
         * @memberof transit_realtime.Stop
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {transit_realtime.Stop} Stop
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Stop.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.transit_realtime.Stop();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.stop_id = reader.string();
                        break;
                    }
                case 2: {
                        message.stop_code = $root.transit_realtime.TranslatedString.decode(reader, reader.uint32());
                        break;
                    }
                case 3: {
                        message.stop_name = $root.transit_realtime.TranslatedString.decode(reader, reader.uint32());
                        break;
                    }
                case 4: {
                        message.tts_stop_name = $root.transit_realtime.TranslatedString.decode(reader, reader.uint32());
                        break;
                    }
                case 5: {
                        message.stop_desc = $root.transit_realtime.TranslatedString.decode(reader, reader.uint32());
                        break;
                    }
                case 6: {
                        message.stop_lat = reader.float();
                        break;
                    }
                case 7: {
                        message.stop_lon = reader.float();
                        break;
                    }
                case 8: {
                        message.zone_id = reader.string();
                        break;
                    }
                case 9: {
                        message.stop_url = $root.transit_realtime.TranslatedString.decode(reader, reader.uint32());
                        break;
                    }
                case 11: {
                        message.parent_station = reader.string();
                        break;
                    }
                case 12: {
                        message.stop_timezone = reader.string();
                        break;
                    }
                case 13: {
                        message.wheelchair_boarding = reader.int32();
                        break;
                    }
                case 14: {
                        message.level_id = reader.string();
                        break;
                    }
                case 15: {
                        message.platform_code = $root.transit_realtime.TranslatedString.decode(reader, reader.uint32());
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Stop message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof transit_realtime.Stop
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {transit_realtime.Stop} Stop
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Stop.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Stop message.
         * @function verify
         * @memberof transit_realtime.Stop
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Stop.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.stop_id != null && message.hasOwnProperty("stop_id"))
                if (!$util.isString(message.stop_id))
                    return "stop_id: string expected";
            if (message.stop_code != null && message.hasOwnProperty("stop_code")) {
                let error = $root.transit_realtime.TranslatedString.verify(message.stop_code);
                if (error)
                    return "stop_code." + error;
            }
            if (message.stop_name != null && message.hasOwnProperty("stop_name")) {
                let error = $root.transit_realtime.TranslatedString.verify(message.stop_name);
                if (error)
                    return "stop_name." + error;
            }
            if (message.tts_stop_name != null && message.hasOwnProperty("tts_stop_name")) {
                let error = $root.transit_realtime.TranslatedString.verify(message.tts_stop_name);
                if (error)
                    return "tts_stop_name." + error;
            }
            if (message.stop_desc != null && message.hasOwnProperty("stop_desc")) {
                let error = $root.transit_realtime.TranslatedString.verify(message.stop_desc);
                if (error)
                    return "stop_desc." + error;
            }
            if (message.stop_lat != null && message.hasOwnProperty("stop_lat"))
                if (typeof message.stop_lat !== "number")
                    return "stop_lat: number expected";
            if (message.stop_lon != null && message.hasOwnProperty("stop_lon"))
                if (typeof message.stop_lon !== "number")
                    return "stop_lon: number expected";
            if (message.zone_id != null && message.hasOwnProperty("zone_id"))
                if (!$util.isString(message.zone_id))
                    return "zone_id: string expected";
            if (message.stop_url != null && message.hasOwnProperty("stop_url")) {
                let error = $root.transit_realtime.TranslatedString.verify(message.stop_url);
                if (error)
                    return "stop_url." + error;
            }
            if (message.parent_station != null && message.hasOwnProperty("parent_station"))
                if (!$util.isString(message.parent_station))
                    return "parent_station: string expected";
            if (message.stop_timezone != null && message.hasOwnProperty("stop_timezone"))
                if (!$util.isString(message.stop_timezone))
                    return "stop_timezone: string expected";
            if (message.wheelchair_boarding != null && message.hasOwnProperty("wheelchair_boarding"))
                switch (message.wheelchair_boarding) {
                default:
                    return "wheelchair_boarding: enum value expected";
                case 0:
                case 1:
                case 2:
                    break;
                }
            if (message.level_id != null && message.hasOwnProperty("level_id"))
                if (!$util.isString(message.level_id))
                    return "level_id: string expected";
            if (message.platform_code != null && message.hasOwnProperty("platform_code")) {
                let error = $root.transit_realtime.TranslatedString.verify(message.platform_code);
                if (error)
                    return "platform_code." + error;
            }
            return null;
        };

        /**
         * Creates a Stop message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof transit_realtime.Stop
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {transit_realtime.Stop} Stop
         */
        Stop.fromObject = function fromObject(object) {
            if (object instanceof $root.transit_realtime.Stop)
                return object;
            let message = new $root.transit_realtime.Stop();
            if (object.stop_id != null)
                message.stop_id = String(object.stop_id);
            if (object.stop_code != null) {
                if (typeof object.stop_code !== "object")
                    throw TypeError(".transit_realtime.Stop.stop_code: object expected");
                message.stop_code = $root.transit_realtime.TranslatedString.fromObject(object.stop_code);
            }
            if (object.stop_name != null) {
                if (typeof object.stop_name !== "object")
                    throw TypeError(".transit_realtime.Stop.stop_name: object expected");
                message.stop_name = $root.transit_realtime.TranslatedString.fromObject(object.stop_name);
            }
            if (object.tts_stop_name != null) {
                if (typeof object.tts_stop_name !== "object")
                    throw TypeError(".transit_realtime.Stop.tts_stop_name: object expected");
                message.tts_stop_name = $root.transit_realtime.TranslatedString.fromObject(object.tts_stop_name);
            }
            if (object.stop_desc != null) {
                if (typeof object.stop_desc !== "object")
                    throw TypeError(".transit_realtime.Stop.stop_desc: object expected");
                message.stop_desc = $root.transit_realtime.TranslatedString.fromObject(object.stop_desc);
            }
            if (object.stop_lat != null)
                message.stop_lat = Number(object.stop_lat);
            if (object.stop_lon != null)
                message.stop_lon = Number(object.stop_lon);
            if (object.zone_id != null)
                message.zone_id = String(object.zone_id);
            if (object.stop_url != null) {
                if (typeof object.stop_url !== "object")
                    throw TypeError(".transit_realtime.Stop.stop_url: object expected");
                message.stop_url = $root.transit_realtime.TranslatedString.fromObject(object.stop_url);
            }
            if (object.parent_station != null)
                message.parent_station = String(object.parent_station);
            if (object.stop_timezone != null)
                message.stop_timezone = String(object.stop_timezone);
            switch (object.wheelchair_boarding) {
            default:
                if (typeof object.wheelchair_boarding === "number") {
                    message.wheelchair_boarding = object.wheelchair_boarding;
                    break;
                }
                break;
            case "UNKNOWN":
            case 0:
                message.wheelchair_boarding = 0;
                break;
            case "AVAILABLE":
            case 1:
                message.wheelchair_boarding = 1;
                break;
            case "NOT_AVAILABLE":
            case 2:
                message.wheelchair_boarding = 2;
                break;
            }
            if (object.level_id != null)
                message.level_id = String(object.level_id);
            if (object.platform_code != null) {
                if (typeof object.platform_code !== "object")
                    throw TypeError(".transit_realtime.Stop.platform_code: object expected");
                message.platform_code = $root.transit_realtime.TranslatedString.fromObject(object.platform_code);
            }
            return message;
        };

        /**
         * Creates a plain object from a Stop message. Also converts values to other types if specified.
         * @function toObject
         * @memberof transit_realtime.Stop
         * @static
         * @param {transit_realtime.Stop} message Stop
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Stop.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.stop_id = "";
                object.stop_code = null;
                object.stop_name = null;
                object.tts_stop_name = null;
                object.stop_desc = null;
                object.stop_lat = 0;
                object.stop_lon = 0;
                object.zone_id = "";
                object.stop_url = null;
                object.parent_station = "";
                object.stop_timezone = "";
                object.wheelchair_boarding = options.enums === String ? "UNKNOWN" : 0;
                object.level_id = "";
                object.platform_code = null;
            }
            if (message.stop_id != null && message.hasOwnProperty("stop_id"))
                object.stop_id = message.stop_id;
            if (message.stop_code != null && message.hasOwnProperty("stop_code"))
                object.stop_code = $root.transit_realtime.TranslatedString.toObject(message.stop_code, options);
            if (message.stop_name != null && message.hasOwnProperty("stop_name"))
                object.stop_name = $root.transit_realtime.TranslatedString.toObject(message.stop_name, options);
            if (message.tts_stop_name != null && message.hasOwnProperty("tts_stop_name"))
                object.tts_stop_name = $root.transit_realtime.TranslatedString.toObject(message.tts_stop_name, options);
            if (message.stop_desc != null && message.hasOwnProperty("stop_desc"))
                object.stop_desc = $root.transit_realtime.TranslatedString.toObject(message.stop_desc, options);
            if (message.stop_lat != null && message.hasOwnProperty("stop_lat"))
                object.stop_lat = options.json && !isFinite(message.stop_lat) ? String(message.stop_lat) : message.stop_lat;
            if (message.stop_lon != null && message.hasOwnProperty("stop_lon"))
                object.stop_lon = options.json && !isFinite(message.stop_lon) ? String(message.stop_lon) : message.stop_lon;
            if (message.zone_id != null && message.hasOwnProperty("zone_id"))
                object.zone_id = message.zone_id;
            if (message.stop_url != null && message.hasOwnProperty("stop_url"))
                object.stop_url = $root.transit_realtime.TranslatedString.toObject(message.stop_url, options);
            if (message.parent_station != null && message.hasOwnProperty("parent_station"))
                object.parent_station = message.parent_station;
            if (message.stop_timezone != null && message.hasOwnProperty("stop_timezone"))
                object.stop_timezone = message.stop_timezone;
            if (message.wheelchair_boarding != null && message.hasOwnProperty("wheelchair_boarding"))
                object.wheelchair_boarding = options.enums === String ? $root.transit_realtime.Stop.WheelchairBoarding[message.wheelchair_boarding] === undefined ? message.wheelchair_boarding : $root.transit_realtime.Stop.WheelchairBoarding[message.wheelchair_boarding] : message.wheelchair_boarding;
            if (message.level_id != null && message.hasOwnProperty("level_id"))
                object.level_id = message.level_id;
            if (message.platform_code != null && message.hasOwnProperty("platform_code"))
                object.platform_code = $root.transit_realtime.TranslatedString.toObject(message.platform_code, options);
            return object;
        };

        /**
         * Converts this Stop to JSON.
         * @function toJSON
         * @memberof transit_realtime.Stop
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Stop.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Stop
         * @function getTypeUrl
         * @memberof transit_realtime.Stop
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Stop.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/transit_realtime.Stop";
        };

        /**
         * WheelchairBoarding enum.
         * @name transit_realtime.Stop.WheelchairBoarding
         * @enum {number}
         * @property {number} UNKNOWN=0 UNKNOWN value
         * @property {number} AVAILABLE=1 AVAILABLE value
         * @property {number} NOT_AVAILABLE=2 NOT_AVAILABLE value
         */
        Stop.WheelchairBoarding = (function() {
            const valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "UNKNOWN"] = 0;
            values[valuesById[1] = "AVAILABLE"] = 1;
            values[valuesById[2] = "NOT_AVAILABLE"] = 2;
            return values;
        })();

        return Stop;
    })();

    transit_realtime.TripModifications = (function() {

        /**
         * Properties of a TripModifications.
         * @memberof transit_realtime
         * @interface ITripModifications
         * @property {Array.<transit_realtime.TripModifications.ISelectedTrips>|null} [selected_trips] TripModifications selected_trips
         * @property {Array.<string>|null} [start_times] TripModifications start_times
         * @property {Array.<string>|null} [service_dates] TripModifications service_dates
         * @property {Array.<transit_realtime.TripModifications.IModification>|null} [modifications] TripModifications modifications
         */

        /**
         * Constructs a new TripModifications.
         * @memberof transit_realtime
         * @classdesc Represents a TripModifications.
         * @implements ITripModifications
         * @constructor
         * @param {transit_realtime.ITripModifications=} [properties] Properties to set
         */
        function TripModifications(properties) {
            this.selected_trips = [];
            this.start_times = [];
            this.service_dates = [];
            this.modifications = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * TripModifications selected_trips.
         * @member {Array.<transit_realtime.TripModifications.ISelectedTrips>} selected_trips
         * @memberof transit_realtime.TripModifications
         * @instance
         */
        TripModifications.prototype.selected_trips = $util.emptyArray;

        /**
         * TripModifications start_times.
         * @member {Array.<string>} start_times
         * @memberof transit_realtime.TripModifications
         * @instance
         */
        TripModifications.prototype.start_times = $util.emptyArray;

        /**
         * TripModifications service_dates.
         * @member {Array.<string>} service_dates
         * @memberof transit_realtime.TripModifications
         * @instance
         */
        TripModifications.prototype.service_dates = $util.emptyArray;

        /**
         * TripModifications modifications.
         * @member {Array.<transit_realtime.TripModifications.IModification>} modifications
         * @memberof transit_realtime.TripModifications
         * @instance
         */
        TripModifications.prototype.modifications = $util.emptyArray;

        /**
         * Creates a new TripModifications instance using the specified properties.
         * @function create
         * @memberof transit_realtime.TripModifications
         * @static
         * @param {transit_realtime.ITripModifications=} [properties] Properties to set
         * @returns {transit_realtime.TripModifications} TripModifications instance
         */
        TripModifications.create = function create(properties) {
            return new TripModifications(properties);
        };

        /**
         * Encodes the specified TripModifications message. Does not implicitly {@link transit_realtime.TripModifications.verify|verify} messages.
         * @function encode
         * @memberof transit_realtime.TripModifications
         * @static
         * @param {transit_realtime.ITripModifications} message TripModifications message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TripModifications.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.selected_trips != null && message.selected_trips.length)
                for (let i = 0; i < message.selected_trips.length; ++i)
                    $root.transit_realtime.TripModifications.SelectedTrips.encode(message.selected_trips[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.start_times != null && message.start_times.length)
                for (let i = 0; i < message.start_times.length; ++i)
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.start_times[i]);
            if (message.service_dates != null && message.service_dates.length)
                for (let i = 0; i < message.service_dates.length; ++i)
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.service_dates[i]);
            if (message.modifications != null && message.modifications.length)
                for (let i = 0; i < message.modifications.length; ++i)
                    $root.transit_realtime.TripModifications.Modification.encode(message.modifications[i], writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified TripModifications message, length delimited. Does not implicitly {@link transit_realtime.TripModifications.verify|verify} messages.
         * @function encodeDelimited
         * @memberof transit_realtime.TripModifications
         * @static
         * @param {transit_realtime.ITripModifications} message TripModifications message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TripModifications.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a TripModifications message from the specified reader or buffer.
         * @function decode
         * @memberof transit_realtime.TripModifications
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {transit_realtime.TripModifications} TripModifications
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TripModifications.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.transit_realtime.TripModifications();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        if (!(message.selected_trips && message.selected_trips.length))
                            message.selected_trips = [];
                        message.selected_trips.push($root.transit_realtime.TripModifications.SelectedTrips.decode(reader, reader.uint32()));
                        break;
                    }
                case 2: {
                        if (!(message.start_times && message.start_times.length))
                            message.start_times = [];
                        message.start_times.push(reader.string());
                        break;
                    }
                case 3: {
                        if (!(message.service_dates && message.service_dates.length))
                            message.service_dates = [];
                        message.service_dates.push(reader.string());
                        break;
                    }
                case 4: {
                        if (!(message.modifications && message.modifications.length))
                            message.modifications = [];
                        message.modifications.push($root.transit_realtime.TripModifications.Modification.decode(reader, reader.uint32()));
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a TripModifications message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof transit_realtime.TripModifications
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {transit_realtime.TripModifications} TripModifications
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TripModifications.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a TripModifications message.
         * @function verify
         * @memberof transit_realtime.TripModifications
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        TripModifications.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.selected_trips != null && message.hasOwnProperty("selected_trips")) {
                if (!Array.isArray(message.selected_trips))
                    return "selected_trips: array expected";
                for (let i = 0; i < message.selected_trips.length; ++i) {
                    let error = $root.transit_realtime.TripModifications.SelectedTrips.verify(message.selected_trips[i]);
                    if (error)
                        return "selected_trips." + error;
                }
            }
            if (message.start_times != null && message.hasOwnProperty("start_times")) {
                if (!Array.isArray(message.start_times))
                    return "start_times: array expected";
                for (let i = 0; i < message.start_times.length; ++i)
                    if (!$util.isString(message.start_times[i]))
                        return "start_times: string[] expected";
            }
            if (message.service_dates != null && message.hasOwnProperty("service_dates")) {
                if (!Array.isArray(message.service_dates))
                    return "service_dates: array expected";
                for (let i = 0; i < message.service_dates.length; ++i)
                    if (!$util.isString(message.service_dates[i]))
                        return "service_dates: string[] expected";
            }
            if (message.modifications != null && message.hasOwnProperty("modifications")) {
                if (!Array.isArray(message.modifications))
                    return "modifications: array expected";
                for (let i = 0; i < message.modifications.length; ++i) {
                    let error = $root.transit_realtime.TripModifications.Modification.verify(message.modifications[i]);
                    if (error)
                        return "modifications." + error;
                }
            }
            return null;
        };

        /**
         * Creates a TripModifications message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof transit_realtime.TripModifications
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {transit_realtime.TripModifications} TripModifications
         */
        TripModifications.fromObject = function fromObject(object) {
            if (object instanceof $root.transit_realtime.TripModifications)
                return object;
            let message = new $root.transit_realtime.TripModifications();
            if (object.selected_trips) {
                if (!Array.isArray(object.selected_trips))
                    throw TypeError(".transit_realtime.TripModifications.selected_trips: array expected");
                message.selected_trips = [];
                for (let i = 0; i < object.selected_trips.length; ++i) {
                    if (typeof object.selected_trips[i] !== "object")
                        throw TypeError(".transit_realtime.TripModifications.selected_trips: object expected");
                    message.selected_trips[i] = $root.transit_realtime.TripModifications.SelectedTrips.fromObject(object.selected_trips[i]);
                }
            }
            if (object.start_times) {
                if (!Array.isArray(object.start_times))
                    throw TypeError(".transit_realtime.TripModifications.start_times: array expected");
                message.start_times = [];
                for (let i = 0; i < object.start_times.length; ++i)
                    message.start_times[i] = String(object.start_times[i]);
            }
            if (object.service_dates) {
                if (!Array.isArray(object.service_dates))
                    throw TypeError(".transit_realtime.TripModifications.service_dates: array expected");
                message.service_dates = [];
                for (let i = 0; i < object.service_dates.length; ++i)
                    message.service_dates[i] = String(object.service_dates[i]);
            }
            if (object.modifications) {
                if (!Array.isArray(object.modifications))
                    throw TypeError(".transit_realtime.TripModifications.modifications: array expected");
                message.modifications = [];
                for (let i = 0; i < object.modifications.length; ++i) {
                    if (typeof object.modifications[i] !== "object")
                        throw TypeError(".transit_realtime.TripModifications.modifications: object expected");
                    message.modifications[i] = $root.transit_realtime.TripModifications.Modification.fromObject(object.modifications[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a TripModifications message. Also converts values to other types if specified.
         * @function toObject
         * @memberof transit_realtime.TripModifications
         * @static
         * @param {transit_realtime.TripModifications} message TripModifications
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        TripModifications.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults) {
                object.selected_trips = [];
                object.start_times = [];
                object.service_dates = [];
                object.modifications = [];
            }
            if (message.selected_trips && message.selected_trips.length) {
                object.selected_trips = [];
                for (let j = 0; j < message.selected_trips.length; ++j)
                    object.selected_trips[j] = $root.transit_realtime.TripModifications.SelectedTrips.toObject(message.selected_trips[j], options);
            }
            if (message.start_times && message.start_times.length) {
                object.start_times = [];
                for (let j = 0; j < message.start_times.length; ++j)
                    object.start_times[j] = message.start_times[j];
            }
            if (message.service_dates && message.service_dates.length) {
                object.service_dates = [];
                for (let j = 0; j < message.service_dates.length; ++j)
                    object.service_dates[j] = message.service_dates[j];
            }
            if (message.modifications && message.modifications.length) {
                object.modifications = [];
                for (let j = 0; j < message.modifications.length; ++j)
                    object.modifications[j] = $root.transit_realtime.TripModifications.Modification.toObject(message.modifications[j], options);
            }
            return object;
        };

        /**
         * Converts this TripModifications to JSON.
         * @function toJSON
         * @memberof transit_realtime.TripModifications
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        TripModifications.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for TripModifications
         * @function getTypeUrl
         * @memberof transit_realtime.TripModifications
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        TripModifications.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/transit_realtime.TripModifications";
        };

        TripModifications.Modification = (function() {

            /**
             * Properties of a Modification.
             * @memberof transit_realtime.TripModifications
             * @interface IModification
             * @property {transit_realtime.IStopSelector|null} [start_stop_selector] Modification start_stop_selector
             * @property {transit_realtime.IStopSelector|null} [end_stop_selector] Modification end_stop_selector
             * @property {number|null} [propagated_modification_delay] Modification propagated_modification_delay
             * @property {Array.<transit_realtime.IReplacementStop>|null} [replacement_stops] Modification replacement_stops
             * @property {string|null} [service_alert_id] Modification service_alert_id
             * @property {number|Long|null} [last_modified_time] Modification last_modified_time
             */

            /**
             * Constructs a new Modification.
             * @memberof transit_realtime.TripModifications
             * @classdesc Represents a Modification.
             * @implements IModification
             * @constructor
             * @param {transit_realtime.TripModifications.IModification=} [properties] Properties to set
             */
            function Modification(properties) {
                this.replacement_stops = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Modification start_stop_selector.
             * @member {transit_realtime.IStopSelector|null|undefined} start_stop_selector
             * @memberof transit_realtime.TripModifications.Modification
             * @instance
             */
            Modification.prototype.start_stop_selector = null;

            /**
             * Modification end_stop_selector.
             * @member {transit_realtime.IStopSelector|null|undefined} end_stop_selector
             * @memberof transit_realtime.TripModifications.Modification
             * @instance
             */
            Modification.prototype.end_stop_selector = null;

            /**
             * Modification propagated_modification_delay.
             * @member {number} propagated_modification_delay
             * @memberof transit_realtime.TripModifications.Modification
             * @instance
             */
            Modification.prototype.propagated_modification_delay = 0;

            /**
             * Modification replacement_stops.
             * @member {Array.<transit_realtime.IReplacementStop>} replacement_stops
             * @memberof transit_realtime.TripModifications.Modification
             * @instance
             */
            Modification.prototype.replacement_stops = $util.emptyArray;

            /**
             * Modification service_alert_id.
             * @member {string} service_alert_id
             * @memberof transit_realtime.TripModifications.Modification
             * @instance
             */
            Modification.prototype.service_alert_id = "";

            /**
             * Modification last_modified_time.
             * @member {number|Long} last_modified_time
             * @memberof transit_realtime.TripModifications.Modification
             * @instance
             */
            Modification.prototype.last_modified_time = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * Creates a new Modification instance using the specified properties.
             * @function create
             * @memberof transit_realtime.TripModifications.Modification
             * @static
             * @param {transit_realtime.TripModifications.IModification=} [properties] Properties to set
             * @returns {transit_realtime.TripModifications.Modification} Modification instance
             */
            Modification.create = function create(properties) {
                return new Modification(properties);
            };

            /**
             * Encodes the specified Modification message. Does not implicitly {@link transit_realtime.TripModifications.Modification.verify|verify} messages.
             * @function encode
             * @memberof transit_realtime.TripModifications.Modification
             * @static
             * @param {transit_realtime.TripModifications.IModification} message Modification message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Modification.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.start_stop_selector != null && Object.hasOwnProperty.call(message, "start_stop_selector"))
                    $root.transit_realtime.StopSelector.encode(message.start_stop_selector, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.end_stop_selector != null && Object.hasOwnProperty.call(message, "end_stop_selector"))
                    $root.transit_realtime.StopSelector.encode(message.end_stop_selector, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.propagated_modification_delay != null && Object.hasOwnProperty.call(message, "propagated_modification_delay"))
                    writer.uint32(/* id 3, wireType 0 =*/24).int32(message.propagated_modification_delay);
                if (message.replacement_stops != null && message.replacement_stops.length)
                    for (let i = 0; i < message.replacement_stops.length; ++i)
                        $root.transit_realtime.ReplacementStop.encode(message.replacement_stops[i], writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                if (message.service_alert_id != null && Object.hasOwnProperty.call(message, "service_alert_id"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.service_alert_id);
                if (message.last_modified_time != null && Object.hasOwnProperty.call(message, "last_modified_time"))
                    writer.uint32(/* id 6, wireType 0 =*/48).uint64(message.last_modified_time);
                return writer;
            };

            /**
             * Encodes the specified Modification message, length delimited. Does not implicitly {@link transit_realtime.TripModifications.Modification.verify|verify} messages.
             * @function encodeDelimited
             * @memberof transit_realtime.TripModifications.Modification
             * @static
             * @param {transit_realtime.TripModifications.IModification} message Modification message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Modification.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a Modification message from the specified reader or buffer.
             * @function decode
             * @memberof transit_realtime.TripModifications.Modification
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {transit_realtime.TripModifications.Modification} Modification
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Modification.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.transit_realtime.TripModifications.Modification();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            message.start_stop_selector = $root.transit_realtime.StopSelector.decode(reader, reader.uint32());
                            break;
                        }
                    case 2: {
                            message.end_stop_selector = $root.transit_realtime.StopSelector.decode(reader, reader.uint32());
                            break;
                        }
                    case 3: {
                            message.propagated_modification_delay = reader.int32();
                            break;
                        }
                    case 4: {
                            if (!(message.replacement_stops && message.replacement_stops.length))
                                message.replacement_stops = [];
                            message.replacement_stops.push($root.transit_realtime.ReplacementStop.decode(reader, reader.uint32()));
                            break;
                        }
                    case 5: {
                            message.service_alert_id = reader.string();
                            break;
                        }
                    case 6: {
                            message.last_modified_time = reader.uint64();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a Modification message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof transit_realtime.TripModifications.Modification
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {transit_realtime.TripModifications.Modification} Modification
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Modification.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a Modification message.
             * @function verify
             * @memberof transit_realtime.TripModifications.Modification
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Modification.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.start_stop_selector != null && message.hasOwnProperty("start_stop_selector")) {
                    let error = $root.transit_realtime.StopSelector.verify(message.start_stop_selector);
                    if (error)
                        return "start_stop_selector." + error;
                }
                if (message.end_stop_selector != null && message.hasOwnProperty("end_stop_selector")) {
                    let error = $root.transit_realtime.StopSelector.verify(message.end_stop_selector);
                    if (error)
                        return "end_stop_selector." + error;
                }
                if (message.propagated_modification_delay != null && message.hasOwnProperty("propagated_modification_delay"))
                    if (!$util.isInteger(message.propagated_modification_delay))
                        return "propagated_modification_delay: integer expected";
                if (message.replacement_stops != null && message.hasOwnProperty("replacement_stops")) {
                    if (!Array.isArray(message.replacement_stops))
                        return "replacement_stops: array expected";
                    for (let i = 0; i < message.replacement_stops.length; ++i) {
                        let error = $root.transit_realtime.ReplacementStop.verify(message.replacement_stops[i]);
                        if (error)
                            return "replacement_stops." + error;
                    }
                }
                if (message.service_alert_id != null && message.hasOwnProperty("service_alert_id"))
                    if (!$util.isString(message.service_alert_id))
                        return "service_alert_id: string expected";
                if (message.last_modified_time != null && message.hasOwnProperty("last_modified_time"))
                    if (!$util.isInteger(message.last_modified_time) && !(message.last_modified_time && $util.isInteger(message.last_modified_time.low) && $util.isInteger(message.last_modified_time.high)))
                        return "last_modified_time: integer|Long expected";
                return null;
            };

            /**
             * Creates a Modification message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof transit_realtime.TripModifications.Modification
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {transit_realtime.TripModifications.Modification} Modification
             */
            Modification.fromObject = function fromObject(object) {
                if (object instanceof $root.transit_realtime.TripModifications.Modification)
                    return object;
                let message = new $root.transit_realtime.TripModifications.Modification();
                if (object.start_stop_selector != null) {
                    if (typeof object.start_stop_selector !== "object")
                        throw TypeError(".transit_realtime.TripModifications.Modification.start_stop_selector: object expected");
                    message.start_stop_selector = $root.transit_realtime.StopSelector.fromObject(object.start_stop_selector);
                }
                if (object.end_stop_selector != null) {
                    if (typeof object.end_stop_selector !== "object")
                        throw TypeError(".transit_realtime.TripModifications.Modification.end_stop_selector: object expected");
                    message.end_stop_selector = $root.transit_realtime.StopSelector.fromObject(object.end_stop_selector);
                }
                if (object.propagated_modification_delay != null)
                    message.propagated_modification_delay = object.propagated_modification_delay | 0;
                if (object.replacement_stops) {
                    if (!Array.isArray(object.replacement_stops))
                        throw TypeError(".transit_realtime.TripModifications.Modification.replacement_stops: array expected");
                    message.replacement_stops = [];
                    for (let i = 0; i < object.replacement_stops.length; ++i) {
                        if (typeof object.replacement_stops[i] !== "object")
                            throw TypeError(".transit_realtime.TripModifications.Modification.replacement_stops: object expected");
                        message.replacement_stops[i] = $root.transit_realtime.ReplacementStop.fromObject(object.replacement_stops[i]);
                    }
                }
                if (object.service_alert_id != null)
                    message.service_alert_id = String(object.service_alert_id);
                if (object.last_modified_time != null)
                    if ($util.Long)
                        (message.last_modified_time = $util.Long.fromValue(object.last_modified_time)).unsigned = true;
                    else if (typeof object.last_modified_time === "string")
                        message.last_modified_time = parseInt(object.last_modified_time, 10);
                    else if (typeof object.last_modified_time === "number")
                        message.last_modified_time = object.last_modified_time;
                    else if (typeof object.last_modified_time === "object")
                        message.last_modified_time = new $util.LongBits(object.last_modified_time.low >>> 0, object.last_modified_time.high >>> 0).toNumber(true);
                return message;
            };

            /**
             * Creates a plain object from a Modification message. Also converts values to other types if specified.
             * @function toObject
             * @memberof transit_realtime.TripModifications.Modification
             * @static
             * @param {transit_realtime.TripModifications.Modification} message Modification
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Modification.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults)
                    object.replacement_stops = [];
                if (options.defaults) {
                    object.start_stop_selector = null;
                    object.end_stop_selector = null;
                    object.propagated_modification_delay = 0;
                    object.service_alert_id = "";
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.last_modified_time = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.last_modified_time = options.longs === String ? "0" : 0;
                }
                if (message.start_stop_selector != null && message.hasOwnProperty("start_stop_selector"))
                    object.start_stop_selector = $root.transit_realtime.StopSelector.toObject(message.start_stop_selector, options);
                if (message.end_stop_selector != null && message.hasOwnProperty("end_stop_selector"))
                    object.end_stop_selector = $root.transit_realtime.StopSelector.toObject(message.end_stop_selector, options);
                if (message.propagated_modification_delay != null && message.hasOwnProperty("propagated_modification_delay"))
                    object.propagated_modification_delay = message.propagated_modification_delay;
                if (message.replacement_stops && message.replacement_stops.length) {
                    object.replacement_stops = [];
                    for (let j = 0; j < message.replacement_stops.length; ++j)
                        object.replacement_stops[j] = $root.transit_realtime.ReplacementStop.toObject(message.replacement_stops[j], options);
                }
                if (message.service_alert_id != null && message.hasOwnProperty("service_alert_id"))
                    object.service_alert_id = message.service_alert_id;
                if (message.last_modified_time != null && message.hasOwnProperty("last_modified_time"))
                    if (typeof message.last_modified_time === "number")
                        object.last_modified_time = options.longs === String ? String(message.last_modified_time) : message.last_modified_time;
                    else
                        object.last_modified_time = options.longs === String ? $util.Long.prototype.toString.call(message.last_modified_time) : options.longs === Number ? new $util.LongBits(message.last_modified_time.low >>> 0, message.last_modified_time.high >>> 0).toNumber(true) : message.last_modified_time;
                return object;
            };

            /**
             * Converts this Modification to JSON.
             * @function toJSON
             * @memberof transit_realtime.TripModifications.Modification
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Modification.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for Modification
             * @function getTypeUrl
             * @memberof transit_realtime.TripModifications.Modification
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            Modification.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/transit_realtime.TripModifications.Modification";
            };

            return Modification;
        })();

        TripModifications.SelectedTrips = (function() {

            /**
             * Properties of a SelectedTrips.
             * @memberof transit_realtime.TripModifications
             * @interface ISelectedTrips
             * @property {Array.<string>|null} [trip_ids] SelectedTrips trip_ids
             * @property {string|null} [shape_id] SelectedTrips shape_id
             */

            /**
             * Constructs a new SelectedTrips.
             * @memberof transit_realtime.TripModifications
             * @classdesc Represents a SelectedTrips.
             * @implements ISelectedTrips
             * @constructor
             * @param {transit_realtime.TripModifications.ISelectedTrips=} [properties] Properties to set
             */
            function SelectedTrips(properties) {
                this.trip_ids = [];
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * SelectedTrips trip_ids.
             * @member {Array.<string>} trip_ids
             * @memberof transit_realtime.TripModifications.SelectedTrips
             * @instance
             */
            SelectedTrips.prototype.trip_ids = $util.emptyArray;

            /**
             * SelectedTrips shape_id.
             * @member {string} shape_id
             * @memberof transit_realtime.TripModifications.SelectedTrips
             * @instance
             */
            SelectedTrips.prototype.shape_id = "";

            /**
             * Creates a new SelectedTrips instance using the specified properties.
             * @function create
             * @memberof transit_realtime.TripModifications.SelectedTrips
             * @static
             * @param {transit_realtime.TripModifications.ISelectedTrips=} [properties] Properties to set
             * @returns {transit_realtime.TripModifications.SelectedTrips} SelectedTrips instance
             */
            SelectedTrips.create = function create(properties) {
                return new SelectedTrips(properties);
            };

            /**
             * Encodes the specified SelectedTrips message. Does not implicitly {@link transit_realtime.TripModifications.SelectedTrips.verify|verify} messages.
             * @function encode
             * @memberof transit_realtime.TripModifications.SelectedTrips
             * @static
             * @param {transit_realtime.TripModifications.ISelectedTrips} message SelectedTrips message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SelectedTrips.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.trip_ids != null && message.trip_ids.length)
                    for (let i = 0; i < message.trip_ids.length; ++i)
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.trip_ids[i]);
                if (message.shape_id != null && Object.hasOwnProperty.call(message, "shape_id"))
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.shape_id);
                return writer;
            };

            /**
             * Encodes the specified SelectedTrips message, length delimited. Does not implicitly {@link transit_realtime.TripModifications.SelectedTrips.verify|verify} messages.
             * @function encodeDelimited
             * @memberof transit_realtime.TripModifications.SelectedTrips
             * @static
             * @param {transit_realtime.TripModifications.ISelectedTrips} message SelectedTrips message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SelectedTrips.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a SelectedTrips message from the specified reader or buffer.
             * @function decode
             * @memberof transit_realtime.TripModifications.SelectedTrips
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {transit_realtime.TripModifications.SelectedTrips} SelectedTrips
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SelectedTrips.decode = function decode(reader, length, error) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.transit_realtime.TripModifications.SelectedTrips();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    if (tag === error)
                        break;
                    switch (tag >>> 3) {
                    case 1: {
                            if (!(message.trip_ids && message.trip_ids.length))
                                message.trip_ids = [];
                            message.trip_ids.push(reader.string());
                            break;
                        }
                    case 2: {
                            message.shape_id = reader.string();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a SelectedTrips message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof transit_realtime.TripModifications.SelectedTrips
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {transit_realtime.TripModifications.SelectedTrips} SelectedTrips
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SelectedTrips.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a SelectedTrips message.
             * @function verify
             * @memberof transit_realtime.TripModifications.SelectedTrips
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SelectedTrips.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.trip_ids != null && message.hasOwnProperty("trip_ids")) {
                    if (!Array.isArray(message.trip_ids))
                        return "trip_ids: array expected";
                    for (let i = 0; i < message.trip_ids.length; ++i)
                        if (!$util.isString(message.trip_ids[i]))
                            return "trip_ids: string[] expected";
                }
                if (message.shape_id != null && message.hasOwnProperty("shape_id"))
                    if (!$util.isString(message.shape_id))
                        return "shape_id: string expected";
                return null;
            };

            /**
             * Creates a SelectedTrips message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof transit_realtime.TripModifications.SelectedTrips
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {transit_realtime.TripModifications.SelectedTrips} SelectedTrips
             */
            SelectedTrips.fromObject = function fromObject(object) {
                if (object instanceof $root.transit_realtime.TripModifications.SelectedTrips)
                    return object;
                let message = new $root.transit_realtime.TripModifications.SelectedTrips();
                if (object.trip_ids) {
                    if (!Array.isArray(object.trip_ids))
                        throw TypeError(".transit_realtime.TripModifications.SelectedTrips.trip_ids: array expected");
                    message.trip_ids = [];
                    for (let i = 0; i < object.trip_ids.length; ++i)
                        message.trip_ids[i] = String(object.trip_ids[i]);
                }
                if (object.shape_id != null)
                    message.shape_id = String(object.shape_id);
                return message;
            };

            /**
             * Creates a plain object from a SelectedTrips message. Also converts values to other types if specified.
             * @function toObject
             * @memberof transit_realtime.TripModifications.SelectedTrips
             * @static
             * @param {transit_realtime.TripModifications.SelectedTrips} message SelectedTrips
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SelectedTrips.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.arrays || options.defaults)
                    object.trip_ids = [];
                if (options.defaults)
                    object.shape_id = "";
                if (message.trip_ids && message.trip_ids.length) {
                    object.trip_ids = [];
                    for (let j = 0; j < message.trip_ids.length; ++j)
                        object.trip_ids[j] = message.trip_ids[j];
                }
                if (message.shape_id != null && message.hasOwnProperty("shape_id"))
                    object.shape_id = message.shape_id;
                return object;
            };

            /**
             * Converts this SelectedTrips to JSON.
             * @function toJSON
             * @memberof transit_realtime.TripModifications.SelectedTrips
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SelectedTrips.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for SelectedTrips
             * @function getTypeUrl
             * @memberof transit_realtime.TripModifications.SelectedTrips
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            SelectedTrips.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/transit_realtime.TripModifications.SelectedTrips";
            };

            return SelectedTrips;
        })();

        return TripModifications;
    })();

    transit_realtime.StopSelector = (function() {

        /**
         * Properties of a StopSelector.
         * @memberof transit_realtime
         * @interface IStopSelector
         * @property {number|null} [stop_sequence] StopSelector stop_sequence
         * @property {string|null} [stop_id] StopSelector stop_id
         */

        /**
         * Constructs a new StopSelector.
         * @memberof transit_realtime
         * @classdesc Represents a StopSelector.
         * @implements IStopSelector
         * @constructor
         * @param {transit_realtime.IStopSelector=} [properties] Properties to set
         */
        function StopSelector(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * StopSelector stop_sequence.
         * @member {number} stop_sequence
         * @memberof transit_realtime.StopSelector
         * @instance
         */
        StopSelector.prototype.stop_sequence = 0;

        /**
         * StopSelector stop_id.
         * @member {string} stop_id
         * @memberof transit_realtime.StopSelector
         * @instance
         */
        StopSelector.prototype.stop_id = "";

        /**
         * Creates a new StopSelector instance using the specified properties.
         * @function create
         * @memberof transit_realtime.StopSelector
         * @static
         * @param {transit_realtime.IStopSelector=} [properties] Properties to set
         * @returns {transit_realtime.StopSelector} StopSelector instance
         */
        StopSelector.create = function create(properties) {
            return new StopSelector(properties);
        };

        /**
         * Encodes the specified StopSelector message. Does not implicitly {@link transit_realtime.StopSelector.verify|verify} messages.
         * @function encode
         * @memberof transit_realtime.StopSelector
         * @static
         * @param {transit_realtime.IStopSelector} message StopSelector message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        StopSelector.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.stop_sequence != null && Object.hasOwnProperty.call(message, "stop_sequence"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.stop_sequence);
            if (message.stop_id != null && Object.hasOwnProperty.call(message, "stop_id"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.stop_id);
            return writer;
        };

        /**
         * Encodes the specified StopSelector message, length delimited. Does not implicitly {@link transit_realtime.StopSelector.verify|verify} messages.
         * @function encodeDelimited
         * @memberof transit_realtime.StopSelector
         * @static
         * @param {transit_realtime.IStopSelector} message StopSelector message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        StopSelector.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a StopSelector message from the specified reader or buffer.
         * @function decode
         * @memberof transit_realtime.StopSelector
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {transit_realtime.StopSelector} StopSelector
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        StopSelector.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.transit_realtime.StopSelector();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.stop_sequence = reader.uint32();
                        break;
                    }
                case 2: {
                        message.stop_id = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a StopSelector message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof transit_realtime.StopSelector
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {transit_realtime.StopSelector} StopSelector
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        StopSelector.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a StopSelector message.
         * @function verify
         * @memberof transit_realtime.StopSelector
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        StopSelector.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.stop_sequence != null && message.hasOwnProperty("stop_sequence"))
                if (!$util.isInteger(message.stop_sequence))
                    return "stop_sequence: integer expected";
            if (message.stop_id != null && message.hasOwnProperty("stop_id"))
                if (!$util.isString(message.stop_id))
                    return "stop_id: string expected";
            return null;
        };

        /**
         * Creates a StopSelector message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof transit_realtime.StopSelector
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {transit_realtime.StopSelector} StopSelector
         */
        StopSelector.fromObject = function fromObject(object) {
            if (object instanceof $root.transit_realtime.StopSelector)
                return object;
            let message = new $root.transit_realtime.StopSelector();
            if (object.stop_sequence != null)
                message.stop_sequence = object.stop_sequence >>> 0;
            if (object.stop_id != null)
                message.stop_id = String(object.stop_id);
            return message;
        };

        /**
         * Creates a plain object from a StopSelector message. Also converts values to other types if specified.
         * @function toObject
         * @memberof transit_realtime.StopSelector
         * @static
         * @param {transit_realtime.StopSelector} message StopSelector
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        StopSelector.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.stop_sequence = 0;
                object.stop_id = "";
            }
            if (message.stop_sequence != null && message.hasOwnProperty("stop_sequence"))
                object.stop_sequence = message.stop_sequence;
            if (message.stop_id != null && message.hasOwnProperty("stop_id"))
                object.stop_id = message.stop_id;
            return object;
        };

        /**
         * Converts this StopSelector to JSON.
         * @function toJSON
         * @memberof transit_realtime.StopSelector
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        StopSelector.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for StopSelector
         * @function getTypeUrl
         * @memberof transit_realtime.StopSelector
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        StopSelector.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/transit_realtime.StopSelector";
        };

        return StopSelector;
    })();

    transit_realtime.ReplacementStop = (function() {

        /**
         * Properties of a ReplacementStop.
         * @memberof transit_realtime
         * @interface IReplacementStop
         * @property {number|null} [travel_time_to_stop] ReplacementStop travel_time_to_stop
         * @property {string|null} [stop_id] ReplacementStop stop_id
         */

        /**
         * Constructs a new ReplacementStop.
         * @memberof transit_realtime
         * @classdesc Represents a ReplacementStop.
         * @implements IReplacementStop
         * @constructor
         * @param {transit_realtime.IReplacementStop=} [properties] Properties to set
         */
        function ReplacementStop(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ReplacementStop travel_time_to_stop.
         * @member {number} travel_time_to_stop
         * @memberof transit_realtime.ReplacementStop
         * @instance
         */
        ReplacementStop.prototype.travel_time_to_stop = 0;

        /**
         * ReplacementStop stop_id.
         * @member {string} stop_id
         * @memberof transit_realtime.ReplacementStop
         * @instance
         */
        ReplacementStop.prototype.stop_id = "";

        /**
         * Creates a new ReplacementStop instance using the specified properties.
         * @function create
         * @memberof transit_realtime.ReplacementStop
         * @static
         * @param {transit_realtime.IReplacementStop=} [properties] Properties to set
         * @returns {transit_realtime.ReplacementStop} ReplacementStop instance
         */
        ReplacementStop.create = function create(properties) {
            return new ReplacementStop(properties);
        };

        /**
         * Encodes the specified ReplacementStop message. Does not implicitly {@link transit_realtime.ReplacementStop.verify|verify} messages.
         * @function encode
         * @memberof transit_realtime.ReplacementStop
         * @static
         * @param {transit_realtime.IReplacementStop} message ReplacementStop message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ReplacementStop.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.travel_time_to_stop != null && Object.hasOwnProperty.call(message, "travel_time_to_stop"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.travel_time_to_stop);
            if (message.stop_id != null && Object.hasOwnProperty.call(message, "stop_id"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.stop_id);
            return writer;
        };

        /**
         * Encodes the specified ReplacementStop message, length delimited. Does not implicitly {@link transit_realtime.ReplacementStop.verify|verify} messages.
         * @function encodeDelimited
         * @memberof transit_realtime.ReplacementStop
         * @static
         * @param {transit_realtime.IReplacementStop} message ReplacementStop message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ReplacementStop.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ReplacementStop message from the specified reader or buffer.
         * @function decode
         * @memberof transit_realtime.ReplacementStop
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {transit_realtime.ReplacementStop} ReplacementStop
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ReplacementStop.decode = function decode(reader, length, error) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.transit_realtime.ReplacementStop();
            while (reader.pos < end) {
                let tag = reader.uint32();
                if (tag === error)
                    break;
                switch (tag >>> 3) {
                case 1: {
                        message.travel_time_to_stop = reader.int32();
                        break;
                    }
                case 2: {
                        message.stop_id = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ReplacementStop message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof transit_realtime.ReplacementStop
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {transit_realtime.ReplacementStop} ReplacementStop
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ReplacementStop.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ReplacementStop message.
         * @function verify
         * @memberof transit_realtime.ReplacementStop
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ReplacementStop.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.travel_time_to_stop != null && message.hasOwnProperty("travel_time_to_stop"))
                if (!$util.isInteger(message.travel_time_to_stop))
                    return "travel_time_to_stop: integer expected";
            if (message.stop_id != null && message.hasOwnProperty("stop_id"))
                if (!$util.isString(message.stop_id))
                    return "stop_id: string expected";
            return null;
        };

        /**
         * Creates a ReplacementStop message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof transit_realtime.ReplacementStop
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {transit_realtime.ReplacementStop} ReplacementStop
         */
        ReplacementStop.fromObject = function fromObject(object) {
            if (object instanceof $root.transit_realtime.ReplacementStop)
                return object;
            let message = new $root.transit_realtime.ReplacementStop();
            if (object.travel_time_to_stop != null)
                message.travel_time_to_stop = object.travel_time_to_stop | 0;
            if (object.stop_id != null)
                message.stop_id = String(object.stop_id);
            return message;
        };

        /**
         * Creates a plain object from a ReplacementStop message. Also converts values to other types if specified.
         * @function toObject
         * @memberof transit_realtime.ReplacementStop
         * @static
         * @param {transit_realtime.ReplacementStop} message ReplacementStop
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ReplacementStop.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.travel_time_to_stop = 0;
                object.stop_id = "";
            }
            if (message.travel_time_to_stop != null && message.hasOwnProperty("travel_time_to_stop"))
                object.travel_time_to_stop = message.travel_time_to_stop;
            if (message.stop_id != null && message.hasOwnProperty("stop_id"))
                object.stop_id = message.stop_id;
            return object;
        };

        /**
         * Converts this ReplacementStop to JSON.
         * @function toJSON
         * @memberof transit_realtime.ReplacementStop
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ReplacementStop.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for ReplacementStop
         * @function getTypeUrl
         * @memberof transit_realtime.ReplacementStop
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        ReplacementStop.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/transit_realtime.ReplacementStop";
        };

        return ReplacementStop;
    })();

    return transit_realtime;
})();

export { $root as default };
