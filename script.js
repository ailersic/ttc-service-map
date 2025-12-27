const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    ('ontouchstart' in window);

class Station {
    constructor(name, lat, lng) {
        this.name = name;
        this.lat = lat;
        this.lng = lng;
    }
}

class ServiceReduction {
    constructor(startStationIdx, endStationIdx, typeIdx, description, direction) {
        this.startStationIdx = startStationIdx;
        this.endStationIdx = endStationIdx;
        this.typeIdx = typeIdx;
        this.description = description;
        this.direction = direction;
    }
}

class ServiceReductionType {
    constructor(name, icon) {
        this.name = name;
        this.icon = icon;
        this.view = true;
    }
}

const serviceReductionTypes = [
    new ServiceReductionType("Delays", snail),
    new ServiceReductionType("Bypass", noentry),
    new ServiceReductionType("No service", cross),
    new ServiceReductionType("Planned alert", clock),
    new ServiceReductionType("Elevator alert", accessibility),
    new ServiceReductionType("Service restored", check),
    new ServiceReductionType("Other alert", exclamation),
    new ServiceReductionType("Multiple alerts", multiple)
]

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

        // If station name is "Eglinton West", change it to "Cedarvale"
        if (startStation === "Eglinton West") { startStation = "Cedarvale (formerly Eglinton West)"; }
        if (endStation === "Eglinton West") { endStation = "Cedarvale (formerly Eglinton West)"; }

        // If station name is "Dundas", change it to "TMU"
        if (startStation === "Dundas") { startStation = "TMU (formerly Dundas)"; }
        if (endStation === "Dundas") { endStation = "TMU (formerly Dundas)"; }

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
            new Station("Finch West", 43.7648550, -79.4911180),
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
    )
];


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

async function loadSubway() {
    subway.platforms = await fetch('/api/subway/platforms').then(res => res.json());
    subway.stations = await fetch('/api/subway/stations').then(res => res.json());
    subway.routes = await fetch('/api/subway/routes').then(res => res.json());
}

/**
 * @typedef {Object} AlertInfo
 * @property {import("./models/TtcApi.ts").AlertCollection} fromApi
 * @property {{ [k in string]: Pick<Alert, 'id' | 'header' | 'effect' | 'description'>[] }} perStation
 */
/** @type {AlertInfo} */
const alerts = {
    fromApi: {},
    perStation: {},
};

async function loadAlerts() {
    alerts.fromApi = await fetch('/api/alerts').then(res => res.json());
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
var allReductionPolylines = [];
var allStationMarkers = [];
var allReductionMarkers = [];

var currentInfoWindow = null;

function refreshMap(map) {
    // Clear existing markers and polylines
    allSegmentPolylines.forEach(polyline => polyline.remove());
    allStationMarkers.forEach(marker => marker.remove());
    allReductionPolylines.forEach(polyline => polyline.remove());
    allReductionMarkers.forEach(marker => marker.remove());

    allSegmentPolylines = [];
    allStationMarkers = [];
    allReductionPolylines = [];
    allReductionMarkers = [];

    // Re-render all lines
    renderLines();

    // Connect the two Spadinas
    const spadina1 = subway.stations['spadina-station-1'];
    const spadina2 = subway.stations['spadina-station-2'];
    const spadinaTunnel = L.polyline([
        [spadina1.latitude, spadina1.longitude],
        [spadina2.latitude, spadina2.longitude],
    ], {
        color: "#000",
        weight: 4,
        opacity: 1.0,
        zIndex: Layers.Top,
    });

    // spadinaTunnel.addTo(map);
    allSegmentPolylines.push(spadinaTunnel);

    allSegmentPolylines.forEach(polyline => polyline.addTo(map));
    // allReductionPolylines.forEach(polyline => polyline.addTo(map));
    allStationMarkers.forEach(marker => marker.addTo(map));
    // allReductionMarkers.forEach(marker => marker.addTo(map));
}

function renderLines() {
    lines.forEach(line => {
        addLineSegments(line);
    });
    lines.forEach(line => {
        addServiceReductions(line);
    });
    lines.forEach(line => {
        addStationMarkers(line);
    });
}

function addLineSegments(line) {
    let normalServiceSegments = [[]];
    let reducedServiceSegments = [[]];
    let iseg = 0;
    let isegRed = 0;
    let lastStationNormal = true;

    subway.routes
        .sort(({ id }, _) => id === '2' ? -1 : 0) // draw line 2 first
        .forEach(({ color, shape }) => {
            const transitPolyLine = L.polyline(shape.map(({ latitude, longitude }) => [latitude, longitude]), {
                color,
                weight: 16,
                opacity: 0.8,
                zIndex: Layers.SubwayLine,
            });
            allSegmentPolylines.push(transitPolyLine);
        });

    console.warn('got', alerts.fromApi.alerts.length, 'alerts from api');
    alerts.fromApi.alerts.forEach(({ id, effect, criteria, header, description }) =>
        criteria.forEach(({ direction, platform_id, route_id, route_type }) => {
            // We currently only pay attention to alerts with:
            // - a defined platform with a parent station
            if (platform_id === undefined) return;
            const platform = subway.platforms[platform_id];
            if (platform === undefined || platform.parent_station_id === null) return;
            const station_id = platform.parent_station_id;
            const station = subway.stations[station_id];
            if (station === undefined) return;
            // const route = subway.routes.find(({ id }) => id === route_id);
            // if (route === undefined) return;
            switch (effect) {
                case 'AccessibilityIssue':
                    // TODO (hi prio)
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
                    // TODO
                    break;
                case 'ReducedService':
                    // TODO
                    break;
                case 'SignificantDelay':
                    const newAlert = { id, effect, header, description };
                    if (station_id in alerts.perStation) {
                        if (alerts.perStation[station_id].some(({ id: existing_id }) => existing_id === id)) {
                            return;
                        }
                        alerts.perStation[station_id].push(newAlert);
                    } else {
                        alerts.perStation[station_id] = [newAlert];
                    }
                    break;
                default:
                    console.warn('Unsupported Alert.Effect:', effect);
                    return;
            }
        }
        ));

    subway.routes.forEach(({ stops, segments }) => {
        /** @type {{ [k in string]: [number, number][] }} */
        const pointsPerAlert = {};
        stops.forEach((platformId, i) => {
            if (i === 0) return;
            /** @type {string} */
            const prevStationId = subway.platforms[stops[i - 1]].parent_station_id;
            // const prevStation = subway.stations[prevStationId];
            const prevStationAlerts = alerts.perStation[prevStationId];
            if (!prevStationAlerts) return;
            /** @type {string} */
            const stationId = subway.platforms[platformId].parent_station_id;
            // const station = subway.stations[stationId];
            const stationAlerts = alerts.perStation[stationId];
            if (!stationAlerts) return;
            // const point = [station.latitude, station.longitude];
            const segment = segments[i - 1].map(({ latitude, longitude }) => [latitude, longitude]);
            stationAlerts
                .filter(({ id }) => prevStationAlerts.some(({ id: prevId }) => id === prevId))
                .forEach(({ id }) => {
                    if (id in pointsPerAlert) {
                        pointsPerAlert[id].push(segment);
                    } else {
                        pointsPerAlert[id] = [segment];
                    }
                });
        });
        Object.values(pointsPerAlert).forEach(points => {
            allSegmentPolylines.push(L.polyline(points, {
                color: 'rgba(100, 100, 100, 1)',
                weight: 6,
                opacity: 1.0,
                dashArray: '5, 15', // Create a dashed line
                zIndex: Layers.AlertOverlay,
            }));
        });
    });

    /*
    for (let i = 0; i < line.stations.length; i++) {
        let normalServiceFlag = true;
        for (let j = 0; j < line.serviceReductions.length; j++) {
            if (i >= line.serviceReductions[j].startStationIdx &&
                i < line.serviceReductions[j].endStationIdx &&
                serviceReductionTypes[line.serviceReductions[j].typeIdx].view) {
                normalServiceFlag = false;
            }
        }

        if (lastStationNormal == normalServiceFlag) {
            if (normalServiceFlag) {
                normalServiceSegments[iseg].push(i);
            } else {
                reducedServiceSegments[isegRed].push(i);
            }
        }
        else {
            if (normalServiceFlag) {
                iseg++;
                normalServiceSegments.push([]);
            }
            else {
                isegRed++;
                reducedServiceSegments.push([]);
            }
            normalServiceSegments[iseg].push(i);
            reducedServiceSegments[isegRed].push(i);
        }

        lastStationNormal = normalServiceFlag;
    }

    // Create polylines for normal service segments
    // These show infoboxes on mouseover
    for (let i = 0; i < normalServiceSegments.length; i++) {
        if (normalServiceSegments[i].length > 1) {
            let transitPolyLine = L.polyline(normalServiceSegments[i].map(idx => [
                line.stations[idx].lat,
                line.stations[idx].lng
            ]), {
                color: line.colour,
                weight: 6,
                opacity: 1.0
            });

            let startStationName = line.stations[normalServiceSegments[i][0]].name;
            let endStationName = line.stations[normalServiceSegments[i][normalServiceSegments[i].length - 1]].name;

            // Create a tooltip for the polyline
            const lineInfoWindow = L.tooltip({
                direction: 'top',
                sticky: true,
                className: 'line-tooltip',
                offset: [0, 0]
            });
            lineInfoWindow.setContent(`
                <div style="color: black; font-weight: bold; text-align: center; margin-right: 0px; margin-left: 0px;">
                    <div style="font-size: 14px; text-align: center;">${line.name}</div>
                    <div style="font-size: 12px; margin-top: 4px; margin-bottom: 4px; text-align: center;">
                        Normal service from ${startStationName} to ${endStationName}
                    </div>
                </div>
            `);
            transitPolyLine.bindTooltip(lineInfoWindow);

            // Store the polyline in the global array
            allSegmentPolylines.push(transitPolyLine);
        }
    }

    let reducedServiceColour = "rgb(100, 100, 100)"; // Default colour for reduced service segments

    // Create polylines for reduced service segments
    // These are dashed lines that do not have infoboxes
    for (let i = 0; i < reducedServiceSegments.length; i++) {
        if (reducedServiceSegments[i].length > 1) {
            let transitPolyLine = L.polyline(reducedServiceSegments[i].map(idx => [
                line.stations[idx].lat,
                line.stations[idx].lng
            ]), {
                color: reducedServiceColour,
                weight: 6,
                opacity: 1.0,
                dashArray: '5, 15' // Create a dashed line
            });

            // Store the polyline in the global array
            allSegmentPolylines.push(transitPolyLine);
        }
    }
    */
}

function addStationMarkers(line) {
    Object.values(subway.stations).forEach(({ latitude, longitude, name }) => {
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

        // Store the marker in the global array
        allStationMarkers.push(stationMarker);
    });

    // DEBUG
    if (false) {
        subway.routes.forEach(({ id, color, shape }) => {
            if (id === '1') {
                console.log(`[${shape.slice(162, 197).map(({ latitude, longitude }) => `[${longitude}, ${latitude}]`).join(', ')}]`);
            }
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

function addServiceReductions(line) {
    // Check if any service reductions of the same type overlap, and combine them if they are
    let i1 = 0;
    while (i1 < line.serviceReductions.length) {
        let i2 = 0;
        while (i2 < i1) {
            if (!serviceReductionTypes[line.serviceReductions[i1].typeIdx].view ||
                !serviceReductionTypes[line.serviceReductions[i2].typeIdx].view) {
                i2++;
                continue;
            }

            let i1Start = line.serviceReductions[i1].startStationIdx;
            let i1End = line.serviceReductions[i1].endStationIdx;
            let i2Start = line.serviceReductions[i2].startStationIdx;
            let i2End = line.serviceReductions[i2].endStationIdx;

            if (((i1Start >= i2Start && i1Start <= i2End) || // i1 starts inside i2
                (i1End >= i2Start && i1End <= i2End) || // i1 ends inside i2
                (i2Start >= i1Start && i2Start <= i1End) || // i2 starts inside i1
                (i2End >= i1Start && i2End <= i1End)) && // i2 ends inside i1
                (line.serviceReductions[i1].typeIdx === line.serviceReductions[i2].typeIdx)) {

                // If the service reduction is adjacent to a previous one and the same type, combine them
                line.serviceReductions[i1].startStationIdx = Math.min(line.serviceReductions[i1].startStationIdx, line.serviceReductions[i2].startStationIdx);
                line.serviceReductions[i1].endStationIdx = Math.max(line.serviceReductions[i1].endStationIdx, line.serviceReductions[i2].endStationIdx);

                // Combine descriptions
                line.serviceReductions[i1].description += `<hr>${line.serviceReductions[i2].description}`;

                // Combine directions
                if (line.serviceReductions[i1].direction != line.serviceReductions[i2].direction) {
                    line.serviceReductions[i1].direction = "both";
                }

                // Remove the previous service reduction
                line.delServiceReduction(i2);
                i1 = 0; // Adjust index since we removed an item
                break; // Exit the loop since we modified the array
            }
            i2++;
        }
        i1++;
    }

    // Check if any service reductions cover the same stations, and combine them if they do
    i1 = 0;
    while (i1 < line.serviceReductions.length) {
        let i2 = 0;
        while (i2 < i1) {
            if (!serviceReductionTypes[line.serviceReductions[i1].typeIdx].view ||
                !serviceReductionTypes[line.serviceReductions[i2].typeIdx].view) {
                i2++;
                continue;
            }

            if (line.serviceReductions[i1].startStationIdx === line.serviceReductions[i2].startStationIdx &&
                line.serviceReductions[i1].endStationIdx === line.serviceReductions[i2].endStationIdx) {

                // If the service reduction is the same as a previous one, combine them
                line.serviceReductions[i1].description += `<hr>${line.serviceReductions[i2].description}`;

                // Combine directions
                if (line.serviceReductions[i1].direction != line.serviceReductions[i2].direction) {
                    line.serviceReductions[i1].direction = "both";
                }

                // If service reduction types differ
                if (line.serviceReductions[i2].typeIdx != line.serviceReductions[i1].typeIdx) {
                    let noServiceIdx = serviceReductionTypes.findIndex(type => type.name === "No service");
                    let restoredIdx = serviceReductionTypes.findIndex(type => type.name === "Service restored");

                    // If one of them is "No service", set the combined alert to that
                    if (line.serviceReductions[i2].typeIdx === noServiceIdx || line.serviceReductions[i1].typeIdx === noServiceIdx) {
                        line.serviceReductions[i1].typeIdx = noServiceIdx;
                    }

                    // If one of them is "Service restored", set the combined alert to the other one
                    //else if (line.serviceReductions[i1].typeIdx === restoredIdx) {
                    //    line.serviceReductions[i1].typeIdx = line.serviceReductions[i2].typeIdx;
                    //}
                    //else if (line.serviceReductions[i2].typeIdx === restoredIdx) {} // Do nothing, we already set the typeIdx to the other one

                    // Otherwise, set the combined alert to "Multiple alerts"
                    else {
                        line.serviceReductions[i1].typeIdx = serviceReductionTypes.findIndex(type => type.name === "Multiple alerts");
                    }
                }

                // Remove the previous service reduction
                line.delServiceReduction(i2);
                i1 = 0; // Adjust index since we removed an item
                break; // Exit the loop since we modified the array
            }
            i2++;
        }
        i1++;
    }

    // Create polylines for service reductions
    // These show infoboxes on mouseover with information about the service reduction
    for (let i = 0; i < line.serviceReductions.length; i++) {
        if (!serviceReductionTypes[line.serviceReductions[i].typeIdx].view) {
            continue; // Skip service reductions that are not set to be viewed
        }

        const stationIdxs = [];
        for (let j = line.serviceReductions[i].startStationIdx; j <= line.serviceReductions[i].endStationIdx; j++) {
            stationIdxs.push(j);
        }
        let serviceReductionType = serviceReductionTypes[line.serviceReductions[i].typeIdx];

        let directionIcon = bothwaysarrow;
        if (line.serviceReductions[i].direction === "forward") {
            directionIcon = forwardarrow;
        } else if (line.serviceReductions[i].direction === "reverse") {
            directionIcon = reversearrow;
        }

        let serviceReductionPolyLine = L.polyline(stationIdxs.map(idx => [
            line.stations[idx].lat,
            line.stations[idx].lng
        ]), {
            color: serviceReductionType.icon.strokeColor,
            weight: 12,
            opacity: 0.5,
            zIndex: Layers.AlertOverlay,
        });

        let serviceReductionHighlightPolyLine = L.polyline(stationIdxs.map(idx => [
            line.stations[idx].lat,
            line.stations[idx].lng
        ]), {
            color: "rgba(0, 255, 255, 0.5)",
            weight: 20,
            opacity: 0,
            zIndex: Layers.AlertOverlay + 1,
        });

        // Store the polyline in the global array
        allReductionPolylines.push(serviceReductionPolyLine);
        allReductionPolylines.push(serviceReductionHighlightPolyLine);

        // get midpoint of the polyline for the marker
        const path = serviceReductionPolyLine.getLatLngs();
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
        if (line.serviceReductions[i].startStationIdx === line.serviceReductions[i].endStationIdx) {
            stationString = `at ${line.stations[line.serviceReductions[i].startStationIdx].name}`;
        } else {
            stationString = `from ${line.stations[line.serviceReductions[i].startStationIdx].name} to ${line.stations[line.serviceReductions[i].endStationIdx].name}`;
        }

        // Create a marker at the midpoint of the polyline
        const icon = serviceReductionType.icon;
        const serviceReductionIcon = L.divIcon({
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

        // Bind the info window to the service reduction marker
        let serviceReductionInfoWindow = L.tooltip({
            direction: 'top',
            sticky: false,
            className: 'service-reduction-tooltip',
            offset: [0, 0]
        });

        serviceReductionInfoWindow.setContent(`
            <div style="color: black; text-align: center; margin-right: 0px; margin-left: 0px;">
                <div style="font-size: 14px; font-weight: bold; text-align: center;">${line.name}</div>
                <div style="font-size: 12px; margin-top: 4px; text-align: center;">
                    ${serviceReductionType.name} ${stationString}
                </div>
                <div style="font-size: 12px; color: #666; margin-top: 4px; margin-bottom: 4px; text-align: center;">
                    ${line.serviceReductions[i].description}
                </div>
            </div>
        `);

        let serviceReductionMarker = L.marker([midLat, midLng], {
            icon: serviceReductionIcon,
            zIndex: Layers.AlertMarker,
        });
        serviceReductionMarker.bindTooltip(serviceReductionInfoWindow);

        serviceReductionMarker.on('tooltipopen', function () {
            serviceReductionHighlightPolyLine.setStyle({ opacity: 1 });
        });
        serviceReductionMarker.on('tooltipclose', function () {
            serviceReductionHighlightPolyLine.setStyle({ opacity: 0 });
        });

        const scaleRGB = c => c.replace(/\d+/g, n => Math.round(n * 0.75));
        directionIcon.rotation = rotAngle; // Set the rotation of the direction marker
        directionIcon.strokeColor = scaleRGB(serviceReductionType.icon.strokeColor); // Set the stroke color of the direction marker
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
        allReductionMarkers.push(serviceReductionMarker);
        allReductionMarkers.push(directionMarker);
    }
}