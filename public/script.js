const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    ('ontouchstart' in window);

/*class Station {
    constructor(name, lat, lng) {
        this.name = name;
        this.lat = lat;
        this.lng = lng;
    }
}*/

class ServiceAlertType {
    constructor(short_name, long_name, icon) {
        this.short_name = short_name;
        this.long_name = long_name;
        this.icon = icon;
    }
}

const serviceAlertTypes = {
    Delays: new ServiceAlertType("Delays", "Delays", snail),
    Bypass: new ServiceAlertType("Bypass", "Bypass", noentry),
    Closure: new ServiceAlertType("Closure", "No service", cross),
    Planned: new ServiceAlertType("Planned", "Planned alert", clock),
    Accessibility: new ServiceAlertType("Access.", "Accessibility alert", accessibility),
    //Restored: new ServiceAlertType("Restored", "Service restored", check),
    Other: new ServiceAlertType("Other", "Other alert", exclamation),
    Multiple: new ServiceAlertType("Multiple", "Multiple alerts", multiple)
}

/*
class Line {
    constructor(name, colour, stations) {
        this.name = name;
        this.colour = colour;
        this.stations = stations;
        this.serviceReductions = [];
    }
    addServiceReduction(startStation, endStation, effectDesc, description) {
        if (description === null || description === "") {
            console.error("Error: description must be non-empty.");
            return;
        }
        description = description.replace(/<a[\s\S]*?\/a>/gi, ""); // Remove <a> tags
        description = description.trim();

        if (effectDesc === null) { effectDesc = "Broken"; } // Default to unrecognized string so we can interpret it later or default to "Other alert"

        // Find type of alert
        let typeIdx = serviceReductionTypes.findIndex(type => type.name.toLowerCase() === effectDesc.toLowerCase());

        // If the type is not found, we try to interpret it
        if (typeIdx === -1) {
            if (effectDesc.toLowerCase().includes("closure")) {
                if (description.toLowerCase().includes("will be") ||
                    description.toLowerCase().includes("will start") ||
                    description.toLowerCase().includes("will end") ||
                    description.toLowerCase().includes("will close") ||
                    description.toLowerCase().includes("will open")
                ) {
                    typeIdx = serviceReductionTypes.findIndex(type => type.name === "Planned alert");
                } else {
                    typeIdx = serviceReductionTypes.findIndex(type => type.name === "No service");
                }
            }

            if (effectDesc.toLowerCase().includes("regular service")) {
                typeIdx = serviceReductionTypes.findIndex(type => type.name === "Service restored");
            }

            if (effectDesc.toLowerCase().includes("reduced speed zone")) {
                typeIdx = serviceReductionTypes.findIndex(type => type.name === "Delays");
            }

            if (description.toLowerCase().includes("there will be no")) {
                typeIdx = serviceReductionTypes.findIndex(type => type.name === "Planned alert");
            }

            // more interpretation logic can be added here

            // If the type is still not found, default to "Other alert"
            if (typeIdx === -1) {
                typeIdx = serviceReductionTypes.findIndex(type => type.name === "Other alert");
            }
        }

        // If station name is "Eglinton West", change it to "Cedarvale (...)"
        if (startStation === "Eglinton West") { startStation = "Cedarvale (formerly Eglinton West)"; }
        if (endStation === "Eglinton West") { endStation = "Cedarvale (formerly Eglinton West)"; }

        // If station name is "Cedarvale", change it to "Cedarvale (...)"
        if (startStation === "Cedarvale") { startStation = "Cedarvale (formerly Eglinton West)"; }
        if (endStation === "Cedarvale") { endStation = "Cedarvale (formerly Eglinton West)"; }

        // If station name is "Dundas", change it to "TMU (...)"
        if (startStation === "Dundas") { startStation = "TMU (formerly Dundas)"; }
        if (endStation === "Dundas") { endStation = "TMU (formerly Dundas)"; }

        // If station name is "TMU", change it to "TMU (...)"
        if (startStation === "TMU") { startStation = "TMU (formerly Dundas)"; }
        if (endStation === "TMU") { endStation = "TMU (formerly Dundas)"; }

        // If station name is "Vaughan Metropolitan Centre", change it to "Vaughan"
        if (startStation === "Vaughan Metropolitan Centre") { startStation = "Vaughan"; }
        if (endStation === "Vaughan Metropolitan Centre") { endStation = "Vaughan"; }

        // If station name is "Sheppard", change it to "Sheppard-Yonge"
        if (startStation === "Sheppard") { startStation = "Sheppard-Yonge"; }
        if (endStation === "Sheppard") { endStation = "Sheppard-Yonge"; }

        // If station name is "Bloor", change it to "Bloor-Yonge"
        if (startStation === "Bloor") { startStation = "Bloor-Yonge"; }
        if (endStation === "Bloor") { endStation = "Bloor-Yonge"; }

        // If station name is "Yonge", change it to "Bloor-Yonge" if Line 2, or "Sheppard-Yonge" if Line 4
        if (startStation === "Yonge") {
            if (this.name === "Line 2 - Bloor-Danforth") {
                startStation = "Bloor-Yonge";
            } else if (this.name === "Line 4 - Sheppard") {
                startStation = "Sheppard-Yonge";
            }
        }
        if (endStation === "Yonge") {
            if (this.name === "Line 2 - Bloor-Danforth") {
                endStation = "Bloor-Yonge";
            } else if (this.name === "Line 4 - Sheppard") {
                endStation = "Sheppard-Yonge";
            }
        }

        // Find the indices of the start and end stations
        let startStationIdx = this.stations.findIndex(station => station.name === startStation);
        let endStationIdx = this.stations.findIndex(station => station.name === endStation);
        let extraStartStationIdx = -1;
        let extraEndStationIdx = -1;
        let extraAlert = false;

        // If both stations are not found, we try to find them in the description
        if (startStationIdx === -1 && endStationIdx === -1) {
            let matchingStations = []
            this.stations.forEach((station) => {
                if (description.includes(station.name)) {
                    matchingStations.push(station.name);
                }
            });

            // check if any matching stations are substrings of other matching stations
            matchingStations = matchingStations.filter((station, index) => {
                return !matchingStations.some((otherStation, otherIndex) => {
                    return (index !== otherIndex) && otherStation.includes(station);
                });
            });

            // If we have two matching stations, we assume they are the start and end stations
            if (matchingStations.length === 2) {
                startStationIdx = this.stations.findIndex(station => station.name === matchingStations[0]);
                endStationIdx = this.stations.findIndex(station => station.name === matchingStations[1]);
            } else if (matchingStations.length === 1) {
                startStationIdx = this.stations.findIndex(station => station.name === matchingStations[0]);
                endStationIdx = startStationIdx; // If only one station is found, we assume it's both start and end
            } else if (matchingStations.length === 4) {
                // assume there are two alerts in the description
                // sort matchingStations by the order they appear in the description, then group them into pairs
                extraAlert = true;

                let sortedStations = matchingStations.sort((a, b) => {
                    return description.indexOf(a) - description.indexOf(b);
                });

                startStationIdx = this.stations.findIndex(station => station.name === sortedStations[0]);
                endStationIdx = this.stations.findIndex(station => station.name === sortedStations[1]);

                extraStartStationIdx = this.stations.findIndex(station => station.name === sortedStations[2]);
                extraEndStationIdx = this.stations.findIndex(station => station.name === sortedStations[3]);
            } else {
                console.error(`Error: could not find stations in the description. Description: "${description}"`);
                return;
            }
        } else if (startStationIdx === -1 || endStationIdx === -1) {
            // If one of the stations can't be identified, we return an error
            if (startStationIdx === -1) {
                console.error(`Error: could not find start station "${startStation}" in the list of stations.`);
            } else {
                console.error(`Error: could not find end station "${endStation}" in the list of stations.`);
            }
            return;
        }

        // If the start and end stations are the same and it's not a station-specific elevator alert, we expand the range by one station in each direction
        let elevatorIdx = serviceReductionTypes.findIndex(type => type.name === "Elevator alert");
        if (startStationIdx === endStationIdx && typeIdx !== elevatorIdx) {
            startStationIdx = Math.max(0, startStationIdx - 1);
            endStationIdx = Math.min(this.stations.length - 1, endStationIdx + 1);
        }

        if (startStationIdx > endStationIdx) {
            let temp = startStationIdx;
            startStationIdx = endStationIdx;
            endStationIdx = temp;
        }

        if (extraAlert && extraStartStationIdx > extraEndStationIdx) {
            let temp = extraStartStationIdx;
            extraStartStationIdx = extraEndStationIdx;
            extraEndStationIdx = temp;
        }

        let direction = "both"; // Default direction is both
        if (typeIdx !== elevatorIdx) {
            if (this.name === "Line 1 - Yonge-University") {
                if ((startStationIdx + endStationIdx) / 2 <= 21) {
                    if (description.toLowerCase().includes("southbound") && !description.toLowerCase().includes("northbound")) {
                        direction = "forward";
                    } else if (description.toLowerCase().includes("northbound") && !description.toLowerCase().includes("southbound")) {
                        direction = "reverse";
                    }
                } else {
                    if (description.toLowerCase().includes("northbound") && !description.toLowerCase().includes("southbound")) {
                        direction = "forward";
                    } else if (description.toLowerCase().includes("southbound") && !description.toLowerCase().includes("northbound")) {
                        direction = "reverse";
                    }
                }
            } else if (this.name === "Line 2 - Bloor-Danforth" || this.name === "Line 4 - Sheppard") {
                if (description.toLowerCase().includes("eastbound") && !description.toLowerCase().includes("westbound")) {
                    direction = "forward";
                } else if (description.toLowerCase().includes("westbound") && !description.toLowerCase().includes("eastbound")) {
                    direction = "reverse";
                }
            }
        }

        console.log(`Adding service reduction from ${this.stations[startStationIdx].name} to ${this.stations[endStationIdx].name} of type ${serviceReductionTypes[typeIdx].name} with description "${description}" and direction "${direction}".`);
        if (extraAlert) {
            console.log(`Adding extra service reduction from ${this.stations[extraStartStationIdx].name} to ${this.stations[extraEndStationIdx].name} of type ${serviceReductionTypes[typeIdx].name} with description "${description}" and direction "${direction}".`);
        }

        let serviceReduction = new ServiceReduction(
            startStationIdx,
            endStationIdx,
            typeIdx,
            description,
            direction
        );
        this.serviceReductions.push(serviceReduction);

        if (extraAlert) {
            let extraServiceReduction = new ServiceReduction(
                extraStartStationIdx,
                extraEndStationIdx,
                typeIdx,
                description,
                direction
            );
            this.serviceReductions.push(extraServiceReduction);
        }
    }
    delServiceReduction(serviceReductionIdx) {
        if (serviceReductionIdx >= 0 && serviceReductionIdx < this.serviceReductions.length) {
            this.serviceReductions.splice(serviceReductionIdx, 1);
        } else {
            console.error(`Invalid service reduction index: ${serviceReductionIdx} when length is ${this.serviceReductions.length}.`);
        }
    }
    clearServiceReductions() {
        this.serviceReductions = [];
    }
}

var lines = [
    new Line(
        "Line 1 - Yonge-University",
        " #FFCA09",
        [
            new Station("Vaughan", 43.7940210, -79.5279060),
            new Station("Highway 407", 43.7833590, -79.5234540),
            new Station("Pioneer Village", 43.7767455, -79.5093530),
            new Station("York University", 43.7740970, -79.4998880),
            new Station("Finch West", 43.7644147, -79.4913299),
            new Station("Downsview Park", 43.7533110, -79.4786930),
            new Station("Sheppard West", 43.7496755, -79.4623870),
            new Station("Wilson", 43.7344480, -79.4500420),
            new Station("Yorkdale", 43.7245980, -79.4474920),
            new Station("Lawrence West", 43.7152660, -79.4439145),
            new Station("Glencairn", 43.7085980, -79.4405415),
            new Station("Cedarvale (formerly Eglinton West)", 43.6999980, -79.4364910),
            new Station("St Clair West", 43.6845480, -79.4156400),
            new Station("Dupont", 43.6743490, -79.4068895),
            new Station("Spadina", 43.6696490, -79.4049890),
            new Station("St George", 43.6683990, -79.3988140),
            new Station("Museum", 43.6665990, -79.3931890),
            new Station("Queen's Park", 43.6598990, -79.3904890),
            new Station("St Patrick", 43.6546490, -79.3881880),
            new Station("Osgoode", 43.6510990, -79.3866880),
            new Station("St Andrew", 43.6476490, -79.3847880),
            new Station("Union", 43.6456990, -79.3805880),
            new Station("King", 43.6490490, -79.3778880),
            new Station("Queen", 43.6527490, -79.3793880),
            new Station("TMU (formerly Dundas)", 43.6565490, -79.3809880),
            new Station("College", 43.6607990, -79.3828880),
            new Station("Wellesley", 43.6655490, -79.3836380),
            new Station("Bloor-Yonge", 43.6705465, -79.3856535),
            new Station("Rosedale", 43.6766490, -79.3883390),
            new Station("Summerhill", 43.6826990, -79.3909890),
            new Station("St Clair", 43.6880490, -79.3932890),
            new Station("Davisville", 43.6976480, -79.3970900),
            new Station("Eglinton", 43.7055980, -79.3986400),
            new Station("Lawrence", 43.7259480, -79.4023900),
            new Station("York Mills", 43.7438480, -79.4060910),
            new Station("Sheppard-Yonge", 43.7612845, -79.4105167),
            new Station("North York Centre", 43.7679470, -79.4125420),
            new Station("Finch", 43.7804970, -79.4154915)
        ]
    ),
    new Line(
        "Line 2 - Bloor-Danforth",
        " #00A754",
        [
            new Station("Kipling", 43.6375200, -79.5357930),
            new Station("Islington", 43.6453980, -79.5241435),
            new Station("Royal York", 43.6484480, -79.5095930),
            new Station("Old Mill", 43.6497480, -79.4941420),
            new Station("Jane", 43.6499490, -79.4837420),
            new Station("Runnymede", 43.6518990, -79.4758420),
            new Station("High Park", 43.6536990, -79.4678410),
            new Station("Keele", 43.6554990, -79.4595410),
            new Station("Dundas West", 43.6572990, -79.4519410),
            new Station("Lansdowne", 43.6592800, -79.4424670),
            new Station("Dufferin", 43.6606990, -79.4347900),
            new Station("Ossington", 43.6621990, -79.4269900),
            new Station("Christie", 43.6642990, -79.4181400),
            new Station("Bathurst", 43.6657990, -79.4114395),
            new Station("Spadina", 43.6670990, -79.4047890),
            new Station("St George", 43.6683990, -79.3988140),
            new Station("Bay", 43.6699990, -79.3909390),
            new Station("Bloor-Yonge", 43.6705465, -79.3856535),//43.6710230, -79.3863725
            new Station("Sherbourne", 43.6721385, -79.3761675),
            new Station("Castle Frank", 43.6737990, -79.3689380),
            new Station("Broadview", 43.6766990, -79.3588380),
            new Station("Chester", 43.6782960, -79.3525195),
            new Station("Pape", 43.6797990, -79.3449370),
            new Station("Donlands", 43.6810490, -79.3383370),
            new Station("Greenwood", 43.6826990, -79.3308370),
            new Station("Coxwell", 43.6843990, -79.3228360),
            new Station("Woodbine", 43.6864990, -79.3131360),
            new Station("Main Street", 43.6890990, -79.3015360),
            new Station("Victoria Park", 43.6948990, -79.2886850),
            new Station("Warden", 43.7115490, -79.2789350),
            new Station("Kennedy", 43.7321527, -79.2635679)
        ]
    ),
    new Line(
        "Line 3 - Scarborough",
        " #00A6E4",
        [
            new Station("Kennedy", 43.7321527, -79.2635679),
            new Station("Lawrence East", 43.750492758336705, -79.27022397820112),
            new Station("Ellesmere", 43.76684906706332, -79.27622767390194),
            new Station("Midland", 43.77042753260233, -79.27198857241383),
            new Station("Scarborough Centre", 43.77439342976872, -79.25795440901479),
            new Station("McCowan", 43.77467540310604, -79.2522365349571)
        ]
    ),
    new Line(
        "Line 4 - Sheppard",
        " #B51A79",
        [
            new Station("Sheppard-Yonge", 43.7612845, -79.4105167),
            new Station("Bayview", 43.7669115, -79.3867165),
            new Station("Bessarion", 43.7692490, -79.3763285),
            new Station("Leslie", 43.7712980, -79.3658900),
            new Station("Don Mills", 43.7753975, -79.3463865)
        ]
    ),
    new Line(
        "Line 6 - Finch West LRT",
        " #646464",
        [
            new Station("Humber College", 43.7299048, -79.6015296),
            new Station("Westmore", 43.7348147, -79.6003652),
            new Station("Martin Grove", 43.7366316, -79.5923394),
            new Station("Albion", 43.7411377, -79.5892051),
            new Station("Stevenson", 43.7432573, -79.5865726),
            new Station("Mount Olive", 43.7433737, -79.5813581),
            new Station("Rowntree Mills", 43.7462218, -79.5685629),
            new Station("Pearldale", 43.7476892, -79.5629559),
            new Station("Duncanwoods", 43.7489724, -79.556895),
            new Station("Milvan Rumike", 43.7499601, -79.552337),
            new Station("Emery", 43.7520405, -79.5423827),
            new Station("Signet Arrow", 43.7532955, -79.5361882),
            new Station("Norfinch Oakdale", 43.7559301, -79.524251),
            new Station("Jane and Finch", 43.7572507, -79.517746),
            new Station("Driftwood", 43.7580635, -79.5133814),
            new Station("Tobermory", 43.7592824, -79.5079134),
            new Station("Sentinel", 43.7610537, -79.500013),
            new Station("Finch West", 43.7644147, -79.4913299),
        ]
    )
];
*/

/**
 * @typedef {Object} SubwayInfo
 * @property {import("./models/TtcApi.ts").SubwayPlatformCollection} platforms
 * @property {import("./models/TtcApi.ts").SubwayStationCollection} stations
 * @property {import("./models/TtcApi.ts").SubwayRouteCollection} routes
 */
/** @type {SubwayInfo} */
const subway = {
    platforms: {},
    stations: {},
    routes: [],
};

const visibility = {
    routes: {},
    alerts: {},
}

async function loadSubway() {
    subway.platforms = await fetch('/api/subway/platforms').then(res => res.json());
    subway.stations = await fetch('/api/subway/stations').then(res => res.json());
    subway.routes = await fetch('/api/subway/routes').then(res => res.json());
}

function setVisibilityDefaults() {
    subway.routes.forEach(route => {
        visibility.routes[route.id] = true;
    });

    // Example: hide Line 2 by default
    //visibility.routes['2'] = false;

    Object.values(serviceAlertTypes).forEach(alertType => {
        visibility.alerts[alertType.short_name] = true;
    });

    // Example: hide Planned alerts by default
    //visibility.alerts[serviceAlertTypes.Planned.short_name] = false;
}

/**
 * @typedef {Object} AlertInfo
 * @property {import("./models/TtcApi.ts").AlertCollection} fromApi
 * @property {{ [k in string]: Pick<Alert, 'id' | 'header' | 'effect' | 'description'>[] }} perStation
 */
/** @type {AlertInfo} */
const alerts = {
    fromApi: {
        subway: null,
        streetcar: null,
        bus: null,
        accessibility: null,
        stop: null,
    },
    byRouteAndAlertType: {/* [route_id]: { [alert_type]: { [alert_id]: ... } } */},
};

async function loadAlerts() {
    const start = Date.now();
    alerts.fromApi.subway = await fetch('/api/subway/alerts').then(res => res.json());
    assembleAlerts();
    console.log('loadAlerts() in', Date.now() - start, 'ms');
}

const Layers = {
    Top: 10000,
    AlertMarker: 4000,
    StationMarker: 3000,
    AlertOverlay: 2000,
    SubwayLine: 1000,
    Bottom: 1,
};

var allSegmentPolylines = [];
var allAlertPolylines = [];
var allStationMarkers = [];
var allAlertMarkers = [];

var currentInfoWindow = null;

function refreshMap(map) {
    // Clear existing markers and polylines
    allSegmentPolylines.forEach(polyline => polyline.remove());
    allStationMarkers.forEach(marker => marker.remove());
    allAlertPolylines.forEach(polyline => polyline.remove());
    allAlertMarkers.forEach(marker => marker.remove());

    allSegmentPolylines = [];
    allStationMarkers = [];
    allAlertPolylines = [];
    allAlertMarkers = [];

    // Re-render all lines
    renderLines();

    // Connect the two Spadinas if both line 1 and line 2 are visible
    if (visibility.routes['1'] && visibility.routes['2']) {
        const spadina1 = subway.stations['spadina-station-1'];
        const spadina2 = subway.stations['spadina-station-2'];
        const spadinaTunnel = L.polyline([
            [spadina1.latitude, spadina1.longitude],
            [spadina2.latitude, spadina2.longitude],
        ], {
            color: "#000",
            weight: 6,
            opacity: 1.0,
            zIndex: Layers.Top,
        });

        allSegmentPolylines.push(spadinaTunnel);
    }

    allSegmentPolylines.forEach(polyline => polyline.addTo(map));
    allAlertPolylines.forEach(polyline => polyline.addTo(map));
    allStationMarkers.forEach(marker => marker.addTo(map));
    allAlertMarkers.forEach(marker => marker.addTo(map));
}

function renderLines() {
    addLineSegments();
    addStationMarkers();
    addServiceAlerts();
}

function assembleAlerts() {
    alerts.byRouteAndAlertType = {};
    // subway alerts
    if (alerts.fromApi.subway) {
        console.warn('got', alerts.fromApi.subway.alerts.length, 'alerts from api');
        // for each route and each alert type, process the alerts and append to alerts.byRouteAndAlertType
        alerts.fromApi.subway.alerts.forEach(({ id, effect, criteria, header, description }) =>
            criteria.forEach(({ direction, platform_id, route_id, route_type }) => {
                // We currently only pay attention to alerts with:
                // - a defined platform with a parent station

                if (platform_id === undefined) return;
                const platform = subway.platforms[platform_id];
                if (platform === undefined || platform.parent_station_id === null) return;
                const station_id = platform.parent_station_id;
                const station = subway.stations[station_id];
                if (station === undefined) return;

                console.warn(`Platform ${platform_id} at station ${station.name} on route ${route_id} has alert ${id} with effect ${effect}`);

                let alert_type = serviceAlertTypes.Other; // default

                switch (effect) {
                    case 'AccessibilityIssue':
                        alert_type = serviceAlertTypes.Accessibility;
                        break;
                    case 'AdditionalService':
                        // TODO
                        break;
                    case 'Detour':
                        // TODO (hi prio)
                        break;
                    case 'ModifiedService':
                        // TODO
                        break;
                    case 'NoService':
                        alert_type = serviceAlertTypes.Closure;
                        break;
                    case 'ReducedService':
                        if (header.toLowerCase().includes("there will be no")) {
                            alert_type = serviceAlertTypes.Planned;
                        }
                        break;
                    case 'SignificantDelay':
                        alert_type = serviceAlertTypes.Delays;
                        break;
                    default:
                        console.warn('Unsupported Alert.Effect:', effect);
                        return;
                }

                const newAlert = { alert_type, header, description, stations: [station_id] };

                alerts.byRouteAndAlertType[route_id] = alerts.byRouteAndAlertType[route_id] || {};
                alerts.byRouteAndAlertType[route_id][alert_type.short_name] = alerts.byRouteAndAlertType[route_id][alert_type.short_name] || {};
                
                if (!(id in alerts.byRouteAndAlertType[route_id][alert_type.short_name])) {
                    alerts.byRouteAndAlertType[route_id][alert_type.short_name][id] = newAlert;
                } else {
                    alerts.byRouteAndAlertType[route_id][alert_type.short_name][id].stations.push(station_id);
                }
            }
        ));

        // if any alert has a station list with a gap, fill in the missing stations
        Object.entries(alerts.byRouteAndAlertType).forEach(([route_id, alertTypes]) => {
            const route = subway.routes.find(r => r.id === route_id);
            if (!route) return;
            const stationOrder = route.stops.map(p => subway.platforms[p]?.parent_station_id).filter(Boolean);
            Object.values(alertTypes).forEach(alerts =>
                Object.values(alerts).forEach(alert => {
                    const indices = alert.stations.map(s => stationOrder.indexOf(s)).filter(i => i >= 0).sort((a,b) => a-b);
                    if (indices.length > 1) {
                        for (let i = indices[0]; i <= indices[indices.length-1]; i++) {
                            if (stationOrder[i] && !alert.stations.includes(stationOrder[i])) alert.stations.push(stationOrder[i]);
                        }
                    }
                })
            );
        });
    }
}


function addLineSegments() {
    subway.routes.forEach(({ id: route_id, long_name: route_name, stops, segments, color }) => {
        let visOpacity = 0.8;
        if (!visibility.routes[route_id]) visOpacity = 0.1;

        normalSegments = [];
        alertSegments = [];
        lastSegmentAlert = false;

        stops.forEach((platformId, i) => {
            if (i >= segments.length) return;
            const segmentLatLngs = segments[i].map(({ latitude, longitude }) => [latitude, longitude]);
            const s1 = subway.platforms[platformId]?.parent_station_id;
            const s2 = subway.platforms[stops[i + 1]]?.parent_station_id;
            let isAlertSegment = false;

            // Check if this segment is affected by any alerts
            Object.entries(alerts.byRouteAndAlertType[route_id] || {}).forEach(([alert_type_name, alertGroup]) => {
                if (!visibility.alerts[alert_type_name]) return;
                Object.values(alertGroup).forEach(alert => {
                    if (alert.stations.includes(s1) && alert.stations.includes(s2)) {
                        isAlertSegment = true;
                    }
                });
            });

            if (isAlertSegment == lastSegmentAlert && (normalSegments.length > 0 || alertSegments.length > 0)) {
                // continue the current segment
                if (isAlertSegment) {
                    alertSegments[alertSegments.length - 1].segment.push(...segmentLatLngs);
                    alertSegments[alertSegments.length - 1].s2 = s2;
                } else {
                    normalSegments[normalSegments.length - 1].segment.push(...segmentLatLngs);
                    normalSegments[normalSegments.length - 1].s2 = s2;
                }
            } else {
                // start a new segment
                if (isAlertSegment) {
                    alertSegments.push({ segment: [...segmentLatLngs], s1, s2 });
                } else {
                    normalSegments.push({ segment: [...segmentLatLngs], s1, s2 });
                }
                lastSegmentAlert = isAlertSegment;
            }
        });

        console.warn(`Route ${route_name} (${route_id}): ${normalSegments.length} normal segments, ${alertSegments.length} alert segments`);

        if (normalSegments.length) {
            // For each normal segment, make a tooltip polyline
            normalSegments.forEach(({segment, s1, s2}) => {
                const transitPolyLine = L.polyline(segment, {
                    color,
                    weight: 16,
                    opacity: visOpacity,
                    zIndex: Layers.SubwayLine,
                });
                
                if (!visibility.routes[route_id]) {
                    // add listener for click to make line visible
                    transitPolyLine.on('click', () => {
                        visibility.routes[route_id] = true;
                        // change visibility icon in legend too
                        const viewButton = document.querySelector(`#route-visibility-button-${route_id}`);
                        viewButton.innerHTML = `<i class="fa-regular fa-eye"></i>`;
                        refreshMap(map);
                    });
                }
                else {
                    // Create an info window for the line segment
                    const lineInfoWindow = L.tooltip({
                        direction: 'top',
                        sticky: true,
                        className: 'line-tooltip',
                        offset: [0, 0]
                    });
                    lineInfoWindow.setContent(`
                        <div style="color: black; font-weight: bold; text-align: center; margin-right: 0px; margin-left: 0px;">
                            <div style="font-size: 14px; text-align: center;">${route_name}</div>
                            <div style="font-size: 12px; margin-top: 4px; margin-bottom: 4px; text-align: center;">
                                Normal service from ${subway.stations[s1]?.name || 'Unknown Station'} to ${subway.stations[s2]?.name || 'Unknown Station'}
                            </div>
                        </div>
                    `);
                    transitPolyLine.bindTooltip(lineInfoWindow);
                }

                allSegmentPolylines.push(transitPolyLine);
            });
        }

        if (alertSegments.length) {
            alertSegments.forEach(({segment, s1, s2}) => {
                const alertPolyLine = L.polyline(segment, {
                    color: 'rgba(100, 100, 100, 1)',
                    weight: 6,
                    opacity: visOpacity,
                    dashArray: '5, 15',
                    zIndex: Layers.AlertOverlay,
                });

                if (!visibility.routes[route_id]) {
                    // add listener for click to make line visible
                    alertPolyLine.on('click', () => {
                        visibility.routes[route_id] = true;
                        // change visibility icon in legend too
                        const viewButton = document.querySelector(`#route-visibility-button-${route_id}`);
                        viewButton.innerHTML = `<i class="fa-regular fa-eye"></i>`;
                        refreshMap(map);
                    });
                }

                allSegmentPolylines.push(alertPolyLine);
            });
        }
    });
}

function addStationMarkers() {
    subway.routes.forEach(({ id: route_id, long_name: route_name, stops }) => {
        if (!visibility.routes[route_id]) return;

        stops.forEach(platformId => {
            const platform = subway.platforms[platformId];
            if (!platform || !platform.parent_station_id) return;
            const station = subway.stations[platform.parent_station_id];
            if (!station) return;

            const { name, latitude, longitude } = station;

            // Check if we already added this station marker
            if (allStationMarkers.some(marker => {
                const latlng = marker.getLatLng();
                return latlng.lat === latitude && latlng.lng === longitude;
            })) {
                return;
            }

            const stationMarker = L.circleMarker([latitude, longitude], {
                radius: 8,
                color: '#000',
                fillColor: '#fff',
                fillOpacity: 1,
                weight: 5,
                opacity: 1,
                zIndex: Layers.StationMarker,
            });
            // Create an info window for the station marker
            const stationInfoWindow = L.tooltip({
                direction: 'top',
                sticky: false,
                className: 'station-tooltip',
                offset: [0, 0]
            });
            stationInfoWindow.setContent(`
                <div style="color: black; font-weight: bold; text-align: center; margin-right: 0px; margin-left: 0px;">
                    <div style="font-size: 14px; text-align: center;">${name}</div>
                </div>
            `);
            stationMarker.bindTooltip(stationInfoWindow);
            allStationMarkers.push(stationMarker);
        });
    });

    // DEBUG
    if (false) {
        subway.routes.forEach(({ id, color, shape }) => {
            shape.forEach(({ latitude, longitude }, i) => {
                const debugMarker = L.circleMarker([latitude, longitude], {
                    radius: 6,
                    color: '#000',
                    weight: 2,
                    opacity: 1,
                    fillColor: color,
                    fillOpacity: 1,
                    zIndex: Layers.SubwayLine + 1,
                });
                const debugTooltip = L.tooltip({
                    direction: 'top',
                    sticky: false,
                    className: 'station-tooltip',
                    offset: [0, 0],
                });
                debugTooltip.setContent(`${i}: ${latitude}, ${longitude}`);
                debugMarker.bindTooltip(debugTooltip);
                allStationMarkers.push(debugMarker);
            });
        });
    }
}

function getHeading(latlng1, latlng2) {
    const toRad = deg => deg * Math.PI / 180;
    const toDeg = rad => rad * 180 / Math.PI;

    const lat1 = toRad(latlng1.lat);
    const lat2 = toRad(latlng2.lat);
    const deltaLng = toRad(latlng2.lng - latlng1.lng);

    const y = Math.sin(deltaLng) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) -
        Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLng);

    const angle = Math.atan2(y, x);
    return (toDeg(angle) + 360) % 360;  // normalize to 0-360
}

function getMidpointAlongCurve(latlngs) {
    let totalDistance = 0;
    const distances = [];

    for (let i = 1; i < latlngs.length; i++) {
        const dist = latlngs[i - 1].distanceTo(latlngs[i]);
        distances.push(dist);
        totalDistance += dist;
    }

    const halfDistance = totalDistance / 2;
    let accumulatedDistance = 0;

    for (let i = 0; i < distances.length; i++) {
        if (accumulatedDistance + distances[i] >= halfDistance) {
            const overshoot = halfDistance - accumulatedDistance;
            const ratio = overshoot / distances[i];

            const lat = latlngs[i].lat + ratio * (latlngs[i + 1].lat - latlngs[i].lat);
            const lng = latlngs[i].lng + ratio * (latlngs[i + 1].lng - latlngs[i].lng);
            return L.latLng(lat, lng);
        }
        accumulatedDistance += distances[i];
    }

    return latlngs[latlngs.length - 1];
}

function addServiceAlerts() {
    processedAlerts = {};

    // for each route
    subway.routes.forEach(({ id: route_id, long_name: route_name, stops, segments }) => {
        if (!visibility.routes[route_id]) return;
        processedAlerts[route_id] = {};

        // for each alert type in that route
        Object.entries(alerts.byRouteAndAlertType[route_id] || {}).forEach(([alertGroupKey, alertGroup]) => {
            if (!visibility.alerts[alertGroupKey]) return;
            processedAlerts[route_id][alertGroupKey] = {};
            
            // for each alert in that type
            Object.entries(alertGroup).forEach(([alertKey, alert]) => {
                // if two alerts of the same alert_type have overlapping stations, merge them
                let merged = false;
                Object.values(processedAlerts[route_id][alertGroupKey]).forEach(existingAlert => {
                    const intersection = existingAlert.stations.filter(station => alert.stations.includes(station));
                    if (intersection.length > 0) {
                        // merge
                        existingAlert.stations = Array.from(new Set([...existingAlert.stations, ...alert.stations]));
                        existingAlert.header += "\n<hr>\n" + alert.header;
                        merged = true;
                    }
                });
                if (!merged) {
                    processedAlerts[route_id][alertGroupKey][alertKey] = { ...alert };
                }
            });
        });
    });

    // Now, for each processed alert, create markers and polylines
    subway.routes.forEach(({ id: route_id, long_name: route_name, stops, segments }) => {
        if (!visibility.routes[route_id]) return;
        Object.entries(processedAlerts[route_id] || {}).forEach(([alertGroupKey, alertGroup]) => {
            if (!visibility.alerts[alertGroupKey]) return;
            Object.values(alertGroup).forEach(alert => {
                // Create an info window for the alert
                let alertInfoWindow = L.tooltip({
                    direction: 'top',
                    sticky: true,
                    className: 'alert-tooltip',
                    offset: [0, 0]
                });
                
                let stationString = "";
                // If the start and end stations are the same, we show "at <station name>"
                // Otherwise, we show "from <start station> to <end station>"
                if (alert.stations.length === 1) {
                    stationString = `at ${subway.stations[alert.stations[0]].name}`;
                } else {
                    const start_station_name = subway.stations[alert.stations.reduce((a, b) => {
                        return stops.findIndex(p => subway.platforms[p]?.parent_station_id === a) <
                               stops.findIndex(p => subway.platforms[p]?.parent_station_id === b) ? a : b;
                    })].name;
                    const end_station_name = subway.stations[alert.stations.reduce((a, b) => {
                        return stops.findIndex(p => subway.platforms[p]?.parent_station_id === a) >
                               stops.findIndex(p => subway.platforms[p]?.parent_station_id === b) ? a : b;
                    })].name;
                    stationString = `from ${start_station_name} to ${end_station_name}`;
                }

                alertInfoWindow.setContent(`
                    <div style="color: black; text-align: center; margin-right: 0px; margin-left: 0px;">
                        <div style="font-size: 14px; font-weight: bold; text-align: center;">${route_name}</div>
                        <div style="font-size: 12px; margin-top: 4px; text-align: center;">
                            ${alert.alert_type.long_name} ${stationString}
                        </div>
                        <div style="font-size: 12px; color: #666; margin-top: 4px; margin-bottom: 4px; text-align: center;">
                            ${alert.header}
                        </div>
                    </div>
                `);

                const alertSegs = [];
                if (alert.stations.length >= 2) {
                    // Highlight segment for each alert
                    stops.forEach((platformId, i) => {
                        if (i >= segments.length) return;
                        const s1 = subway.platforms[platformId]?.parent_station_id;
                        const s2 = subway.platforms[stops[i + 1]]?.parent_station_id;
                        if (alert.stations.includes(s1) && alert.stations.includes(s2)) {
                            const segmentLatLngs = segments[i].map(({ latitude, longitude }) => [latitude, longitude]);
                            alertSegs.push(...segmentLatLngs);
                        }
                    });
                }

                const icon = alert.alert_type.icon;
                const alertIcon = L.divIcon({
                    className: 'my-custom-svg-icon', // Optional: for CSS styling
                    html: `<svg width="${24 * icon.scale}" height="${24 * icon.scale}" viewBox="${-12 * icon.scale} ${-12 * icon.scale} ${24 * icon.scale} ${24 * icon.scale}" xmlns="http://www.w3.org/2000/svg">
                        <g transform="scale(${icon.scale})">
                        <path d="${icon.path}" 
                        stroke="${icon.strokeColor}" 
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="${icon.strokeWeight / icon.scale}" 
                        fill="${icon.fillColor}"/>
                        </g>
                        </svg>`,
                    iconSize: [48, 48], // Set the size of your SVG
                    iconAnchor: [24, 24], // Point of the icon corresponding to marker's location
                    tooltipAnchor: [0, -18] // Point from which the tooltip should open relative to the iconAnchor
                });

                let marker_latlng = null;

                // plot icons at midpoint of segment if alert.stations.length >= 2, else at station
                if (alertSegs.length >= 2) {
                    const midpoint = getMidpointAlongCurve(alertSegs.map(([lat, lng]) => L.latLng(lat, lng)));
                    marker_latlng = midpoint;
                } else {
                    // If there's only one station in the alert, place the marker at that station
                    const firstStationId = alert.stations[0];
                    const firstStation = subway.stations[firstStationId];
                    marker_latlng = L.latLng(firstStation.latitude, firstStation.longitude);
                }

                let alertMarker = L.marker([marker_latlng.lat, marker_latlng.lng], {
                    icon: alertIcon,
                    zIndex: Layers.AlertMarker,
                });

                alertMarker.bindTooltip(alertInfoWindow);
                allAlertMarkers.push(alertMarker);

                if (alertSegs.length) {
                    const alertPolyLine = L.polyline(alertSegs, {
                        color: alert.alert_type.icon.strokeColor,
                        weight: 20,
                        opacity: 0.5,
                        zIndex: Layers.AlertOverlay + 1,
                    });

                    alertPolyLine.bindTooltip(alertInfoWindow);

                    // Store the polyline in the global array
                    allAlertPolylines.push(alertPolyLine);
                }
            })
        });
    });
}

function addServiceAlertsOld(line) {
    // Check if any service alerts of the same type overlap, and combine them if they are
    let i1 = 0;
    while (i1 < line.serviceAlerts.length) {
        let i2 = 0;
        while (i2 < i1) {
            if (!serviceAlertTypes[line.serviceAlerts[i1].typeIdx].view ||
                !serviceAlertTypes[line.serviceAlerts[i2].typeIdx].view) {
                i2++;
                continue;
            }

            let i1Start = line.serviceAlerts[i1].startStationIdx;
            let i1End = line.serviceAlerts[i1].endStationIdx;
            let i2Start = line.serviceAlerts[i2].startStationIdx;
            let i2End = line.serviceAlerts[i2].endStationIdx;
            if (((i1Start >= i2Start && i1Start <= i2End) || // i1 starts inside i2
                (i1End >= i2Start && i1End <= i2End) || // i1 ends inside i2
                (i2Start >= i1Start && i2Start <= i1End) || // i2 starts inside i1
                (i2End >= i1Start && i2End <= i1End)) && // i2 ends inside i1
                (line.serviceAlerts[i1].typeIdx === line.serviceAlerts[i2].typeIdx)) {

                // If the service alert is adjacent to a previous one and the same type, combine them
                line.serviceAlerts[i1].startStationIdx = Math.min(line.serviceAlerts[i1].startStationIdx, line.serviceAlerts[i2].startStationIdx);
                line.serviceAlerts[i1].endStationIdx = Math.max(line.serviceAlerts[i1].endStationIdx, line.serviceAlerts[i2].endStationIdx);

                // Combine descriptions
                line.serviceAlerts[i1].description += `<hr>${line.serviceAlerts[i2].description}`;

                // Combine directions
                if (line.serviceAlerts[i1].direction != line.serviceAlerts[i2].direction) {
                    line.serviceAlerts[i1].direction = "both";
                }

                // Remove the previous service alert
                line.delServiceAlert(i2);
                i1 = 0; // Adjust index since we removed an item
                break; // Exit the loop since we modified the array
            }
            i2++;
        }
        i1++;
    }

    // Check if any service alerts cover the same stations, and combine them if they do
    i1 = 0;
    while (i1 < line.serviceAlerts.length) {
        let i2 = 0;
        while (i2 < i1) {
            if (!serviceAlertTypes[line.serviceAlerts[i1].typeIdx].view ||
                !serviceAlertTypes[line.serviceAlerts[i2].typeIdx].view) {
                i2++;
                continue;
            }

            if (line.serviceAlerts[i1].startStationIdx === line.serviceAlerts[i2].startStationIdx &&
                line.serviceAlerts[i1].endStationIdx === line.serviceAlerts[i2].endStationIdx) {

                // If the service alert is the same as a previous one, combine them
                line.serviceAlerts[i1].description += `<hr>${line.serviceAlerts[i2].description}`;
                // Combine directions
                if (line.serviceAlerts[i1].direction != line.serviceAlerts[i2].direction) {
                    line.serviceAlerts[i1].direction = "both";
                }

                // If service alert types differ
                if (line.serviceAlerts[i2].typeIdx != line.serviceAlerts[i1].typeIdx) {
                    let noServiceIdx = serviceAlertTypes.findIndex(type => type.short_name === "Closure");
                    let restoredIdx = serviceAlertTypes.findIndex(type => type.short_name === "Restored");

                    // If one of them is "No service", set the combined alert to that
                    if (line.serviceAlerts[i2].typeIdx === noServiceIdx || line.serviceAlerts[i1].typeIdx === noServiceIdx) {
                        line.serviceAlerts[i1].typeIdx = noServiceIdx;
                    }

                    // If one of them is "Service restored", set the combined alert to the other one
                    //else if (line.serviceReductions[i1].typeIdx === restoredIdx) {
                    //    line.serviceReductions[i1].typeIdx = line.serviceReductions[i2].typeIdx;
                    //}
                    //else if (line.serviceReductions[i2].typeIdx === restoredIdx) {} // Do nothing, we already set the typeIdx to the other one

                    // Otherwise, set the combined alert to "Multiple alerts"
                    else {
                        line.serviceAlerts[i1].typeIdx = serviceAlertTypes.findIndex(type => type.short_name === "Multiple");
                    }
                }

                // Remove the previous service alert
                line.delServiceAlert(i2);
                i1 = 0; // Adjust index since we removed an item
                break; // Exit the loop since we modified the array
            }
            i2++;
        }
        i1++;
    }

    // Create polylines for service alerts
    // These show infoboxes on mouseover with information about the service alert
    for (let i = 0; i < line.serviceAlerts.length; i++) {
        if (!serviceAlertTypes[line.serviceAlerts[i].typeIdx].view) {
            continue; // Skip service alerts that are not set to be viewed
        }

        const stationIdxs = [];
        for (let j = line.serviceAlerts[i].startStationIdx; j <= line.serviceAlerts[i].endStationIdx; j++) {
            stationIdxs.push(j);
        }
        let serviceAlertType = serviceAlertTypes[line.serviceAlerts[i].typeIdx];

        let directionIcon = bothwaysarrow;
        if (line.serviceAlerts[i].direction === "forward") {
            directionIcon = forwardarrow;
        } else if (line.serviceAlerts[i].direction === "reverse") {
            directionIcon = reversearrow;
        }

        let serviceAlertPolyLine = L.polyline(stationIdxs.map(idx => [
            line.stations[idx].lat,
            line.stations[idx].lng
        ]), {
            color: serviceAlertType.icon.strokeColor,
            weight: 12,
            opacity: 0.5,
            zIndex: Layers.AlertOverlay,
        });

        let serviceAlertHighlightPolyLine = L.polyline(stationIdxs.map(idx => [
            line.stations[idx].lat,
            line.stations[idx].lng
        ]), {
            color: "rgba(0, 255, 255, 0.5)",
            weight: 20,
            opacity: 0,
            zIndex: Layers.AlertOverlay + 1,
        });

        // Store the polyline in the global array
        allAlertPolylines.push(serviceAlertPolyLine);
        allAlertPolylines.push(serviceAlertHighlightPolyLine);

        // get midpoint of the polyline for the marker
        const path = serviceAlertPolyLine.getLatLngs();
        let midLat = path[0].lat;
        let midLng = path[0].lng;
        let rotAngle = 0;

        let totalDistance = 0;
        for (let i = 0; i < path.length - 1; i++) {
            totalDistance += L.latLng(path[i]).distanceTo(L.latLng(path[i + 1]));
        }
        let accumulatedDistance = 0;
        for (let i = 0; i < path.length - 1; i++) {
            delta = L.latLng(path[i]).distanceTo(L.latLng(path[i + 1]));
            accumulatedDistance += delta;
            if (accumulatedDistance >= totalDistance / 2) {
                // We found the midpoint
                let ratio = (totalDistance / 2 - accumulatedDistance + delta) / delta;
                midLat = path[i].lat + ratio * (path[i + 1].lat - path[i].lat);
                midLng = path[i].lng + ratio * (path[i + 1].lng - path[i].lng);
                rotAngle = getHeading(path[i], path[i + 1]); // Get the heading between the two points
                break;
            }
        }

        let stationString = "";
        // If the start and end stations are the same, we show "at <station name>"
        // Otherwise, we show "from <start station> to <end station>"
        if (line.serviceAlerts[i].startStationIdx === line.serviceAlerts[i].endStationIdx) {
            stationString = `at ${line.stations[line.serviceAlerts[i].startStationIdx].name}`;
        } else {
            stationString = `from ${line.stations[line.serviceAlerts[i].startStationIdx].name} to ${line.stations[line.serviceAlerts[i].endStationIdx].name}`;
        }

        // Create a marker at the midpoint of the polyline
        const icon = serviceAlertType.icon;
        const serviceAlertIcon = L.divIcon({
            className: 'my-custom-svg-icon', // Optional: for CSS styling
            html: `<svg width="${24 * icon.scale}" height="${24 * icon.scale}" viewBox="${-12 * icon.scale} ${-12 * icon.scale} ${24 * icon.scale} ${24 * icon.scale}" xmlns="http://www.w3.org/2000/svg">
                <g transform="scale(${icon.scale})">
                <path d="${icon.path}" 
                stroke="${icon.strokeColor}" 
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="${icon.strokeWeight / icon.scale}" 
                fill="${icon.fillColor}"/>
                </g>
                </svg>`,
            iconSize: [48, 48], // Set the size of your SVG
            iconAnchor: [24, 24], // Point of the icon corresponding to marker's location
            tooltipAnchor: [0, -18] // Point from which the tooltip should open relative to the iconAnchor
        });

        // Bind the info window to the service alert marker
        let serviceAlertInfoWindow = L.tooltip({
            direction: 'top',
            sticky: false,
            className: 'service-alert-tooltip',
            offset: [0, 0]
        });

        serviceAlertInfoWindow.setContent(`
            <div style="color: black; text-align: center; margin-right: 0px; margin-left: 0px;">
                <div style="font-size: 14px; font-weight: bold; text-align: center;">${line.name}</div>
                <div style="font-size: 12px; margin-top: 4px; text-align: center;">
                    ${serviceAlertType.long_name} ${stationString}
                </div>
                <div style="font-size: 12px; color: #666; margin-top: 4px; margin-bottom: 4px; text-align: center;">
                    ${line.serviceAlerts[i].description}
                </div>
            </div>
        `);

        let serviceAlertMarker = L.marker([midLat, midLng], {
            icon: serviceAlertIcon,
            zIndex: Layers.AlertMarker,
        });
        serviceAlertMarker.bindTooltip(serviceAlertInfoWindow);
        serviceAlertMarker.on('tooltipopen', function () {
            serviceAlertHighlightPolyLine.setStyle({ opacity: 1 });
        });
        serviceAlertMarker.on('tooltipclose', function () {
            serviceAlertHighlightPolyLine.setStyle({ opacity: 0 });
        });

        const scaleRGB = c => c.replace(/\d+/g, n => Math.round(n * 0.75));
        directionIcon.rotation = rotAngle; // Set the rotation of the direction marker
        directionIcon.strokeColor = scaleRGB(serviceAlertType.icon.strokeColor); // Set the stroke color of the direction marker
        directionIcon.fillColor = directionIcon.strokeColor; // Set the fill color of the direction marker

        let directionMarkerIcon = L.divIcon({
            className: 'my-custom-svg-icon',
            html: `<svg width="${32 * directionIcon.scale}" height="${32 * directionIcon.scale}" viewBox="${-16 * directionIcon.scale} ${-16 * directionIcon.scale} ${32 * directionIcon.scale} ${32 * directionIcon.scale}" xmlns="http://www.w3.org/2000/svg">
                <g transform="scale(${directionIcon.scale})">
                <path d="${directionIcon.path}"
                transform="rotate(${rotAngle}, 0, 0)"
                stroke="${directionIcon.strokeColor}" 
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="${directionIcon.strokeWeight / directionIcon.scale}" 
                fill="${directionIcon.fillColor}"/>
                </g>
                </svg>`,
            iconSize: [64, 64], // Set the size of your SVG
            iconAnchor: [32, 32], // Point of the icon corresponding to marker's location
        });
        let directionMarker = L.marker([midLat, midLng], {
            icon: directionMarkerIcon,
            zIndex: Layers.AlertMarker,
        });

        // Store the marker in the global array
        allAlertMarkers.push(serviceAlertMarker);
        allAlertMarkers.push(directionMarker);
    }
}