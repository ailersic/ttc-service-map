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
    }
}

const serviceReductionTypes = [
    new ServiceReductionType("Alert", exclamation),
    new ServiceReductionType("Delays", snail),
    new ServiceReductionType("Bypass", noentry),
    new ServiceReductionType("No service", cross),
    new ServiceReductionType("Planned disruption", clock),
    new ServiceReductionType("Service restored", check)
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

        if (effectDesc === null) { effectDesc = "Broken"; } // Default to unrecognized string so we can interpret it later or default to "Alert"

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
                    typeIdx = serviceReductionTypes.findIndex(type => type.name === "Planned disruption");
                } else {
                    typeIdx = serviceReductionTypes.findIndex(type => type.name === "No service");
                }
            }

            if (effectDesc.toLowerCase().includes("regular service")) {
                typeIdx = serviceReductionTypes.findIndex(type => type.name === "Service restored");
            }

            if (description.toLowerCase().includes("there will be no")) {
                typeIdx = serviceReductionTypes.findIndex(type => type.name === "Planned disruption");
            }

            // more interpretation logic can be added here

            // If the type is still not found, default to "Alert"
            if (typeIdx === -1) {
                typeIdx = serviceReductionTypes.findIndex(type => type.name === "Alert");
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
                console.error(`Error: could not find stations in the description. Matching stations: ${matchingStations.join(", ")}`);
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

        // If the start and end stations are the same, we expand the range by one station in each direction
        if (startStationIdx === endStationIdx) {
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
            new Station("Eglinton West", 43.6999980, -79.4364910),
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
            new Station("Dundas", 43.6565490, -79.3809880),
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
            new Station("Scarborough Town Centre", 43.77439342976872, -79.25795440901479),
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

var allSegmentPolylines = [];
var allReductionPolylines = [];
var allStationMarkers = [];
var allReductionMarkers = [];

var currentInfoWindow = null;

function refreshMap() {
    // Clear existing markers and polylines
    allSegmentPolylines.forEach(polyline => polyline.setMap(null));
    allStationMarkers.forEach(marker => marker.setMap(null));
    allReductionPolylines.forEach(polyline => polyline.setMap(null));
    allReductionMarkers.forEach(marker => marker.setMap(null));
    if (currentInfoWindow !== null && currentInfoWindow.getMap()) { currentInfoWindow.close(); }

    allSegmentPolylines = [];
    allStationMarkers = [];
    allReductionPolylines = [];
    allReductionMarkers = [];
    currentInfoWindow = null;

    // Re-render all lines
    renderLines();

    allSegmentPolylines.forEach(polyline => polyline.setMap(map));
    allStationMarkers.forEach(marker => marker.setMap(map));
    allReductionPolylines.forEach(polyline => polyline.setMap(map));
    allReductionMarkers.forEach(marker => marker.setMap(map));

    // Connect the two Spadinas
    let spadinaTunnel = new google.maps.Polyline({
        path: [
            { lat: lines[0].stations[14].lat, lng: lines[0].stations[14].lng }, // Line 1 Spadina
            { lat: lines[1].stations[14].lat, lng: lines[1].stations[14].lng }  // Line 2 Spadina
        ],
        geodesic: true,
        strokeColor: "#000000",
        strokeOpacity: 1.0,
        strokeWeight: 6,
        zIndex: 1
    });

    spadinaTunnel.setMap(map);
    allSegmentPolylines.push(spadinaTunnel);
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

    for (let i = 0; i < line.stations.length; i++) {
        let normalServiceFlag = true;
        for (let j = 0; j < line.serviceReductions.length; j++) {
            if (i >= line.serviceReductions[j].startStationIdx && i < line.serviceReductions[j].endStationIdx) {
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
            let transitPolyLine = new google.maps.Polyline({
                path: normalServiceSegments[i].map(idx => ({
                    lat: line.stations[idx].lat,
                    lng: line.stations[idx].lng
                })),
                geodesic: true,
                strokeColor: line.colour,
                strokeOpacity: 1.0,
                strokeWeight: 6,
                zIndex: 1
            });

            let startStationName = line.stations[normalServiceSegments[i][0]].name;
            let endStationName = line.stations[normalServiceSegments[i][normalServiceSegments[i].length - 1]].name;

            const lineInfoWindow = new google.maps.InfoWindow({ maxWidth: 200 });
            lineInfoWindow.setContent(`
                <div style="color: black; font-weight: bold; text-align: center; margin-right: 0px; margin-left: 0px;">
                    <div style="font-size: 14px; text-align: center;">${line.name}</div>
                    <div style="font-size: 12px; margin-top: 4px; margin-bottom: 4px; text-align: center;">
                        Normal service from ${startStationName} to ${endStationName}
                    </div>
                </div>
            `);
            
            // If on mobile device
            if (isMobile) {
                // Toggle the info window on click event
                transitPolyLine.addListener('click', (event) => {
                    if (lineInfoWindow.getMap()) {
                        lineInfoWindow.close();
                        currentInfoWindow = null;
                    }
                    else {
                        if (currentInfoWindow !== null) { currentInfoWindow.close();}
                        lineInfoWindow.setPosition(event.latLng);
                        lineInfoWindow.open(map);
                        currentInfoWindow = lineInfoWindow;

                        // After the info window opens, close it if clicked on
                        currentInfoWindow.addListener('domready', () => {
                            const iwOuter = document.querySelector('.gm-style-iw-c');
                            if (iwOuter) {
                                iwOuter.addEventListener('click', (e) => {
                                    currentInfoWindow.close();
                                    currentInfoWindow = null;
                                    e.stopPropagation();
                                });
                            }
                        });
                    }
                });

                // If the user clicks anywhere else, close the info window
                map.addListener('click', () => {
                    currentInfoWindow.close();
                    currentInfoWindow = null;
                });
            }

            // If on computer
            else {
                transitPolyLine.addListener('mouseover', (event) => {
                    lineInfoWindow.setPosition(event.latLng);
                    lineInfoWindow.open(map);
                });
                transitPolyLine.addListener('mouseout', () => {
                    lineInfoWindow.close();
                });
            }

            // Store the polyline in the global array
            allSegmentPolylines.push(transitPolyLine);
        }
    }

    // Create polylines for reduced service segments
    // These are dashed lines that do not have infoboxes
    for (let i = 0; i < reducedServiceSegments.length; i++) {
        if (reducedServiceSegments[i].length > 1) {
            let transitPolyLine = new google.maps.Polyline({
                path: reducedServiceSegments[i].map(idx => ({
                    lat: line.stations[idx].lat,
                    lng: line.stations[idx].lng
                })),
                geodesic: true,
                strokeColor: line.colour,
                strokeOpacity: 0.0,
                strokeWeight: 6,
                zIndex: 1,
                icons: [{
                    icon: dash,
                    offset: '5px',
                    repeat: '15px',
                }]
            });

            // Store the polyline in the global array
            allSegmentPolylines.push(transitPolyLine);
        }
    }
}

function createStationHandler(infoWindow, station) {
    return function(event) {
        infoWindow.setContent(`
            <div style="color: black; font-weight: bold; text-align: center; margin-right: 0px; margin-left: 0px;">
                <div style="font-size: 14px; text-align: center;">${station.name}</div>
            </div>
        `);
        infoWindow.setPosition(event.latLng);
        infoWindow.open(map);
    }
}

function addStationMarkers(line) {
    line.stations.forEach(station => {
        // Create a circle marker for each station
        let stationMarker = new google.maps.Marker({
            position: { lat: station.lat, lng: station.lng },
            map: map,
            zIndex: 1,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 3,
                fillColor: '#FFFFFF',
                fillOpacity: 1,
                strokeColor: '#000000',
                strokeWeight: 2,
                strokeOpacity: 1
            }
        });

        // Create an info window for the station
        //const infoWindow = new google.maps.InfoWindow({ maxWidth: 200 });
        //const stationHandler = createStationHandler(infoWindow, station);

        // Add event listeners for the marker
        //stationMarker.addListener('mouseover', stationHandler);
        //stationMarker.addListener('click', stationHandler);

        // Close the info window on mouseout
        //stationMarker.addListener('mouseout', () => { infoWindow.close(); });
        //map.addListener('click', () => { infoWindow.close(); });

        // Store the marker in the global array
        allStationMarkers.push(stationMarker);
    });
}

function addServiceReductions(line) {
    // Check if any service reductions cover the same stations, and combine them if they do
    // This is done to avoid having multiple service reductions for the same segment
    let i1 = 0;
    while (i1 < line.serviceReductions.length) {
        let i2 = 0;
        while (i2 < i1) {
            if (line.serviceReductions[i1].startStationIdx === line.serviceReductions[i2].startStationIdx &&
                line.serviceReductions[i1].endStationIdx === line.serviceReductions[i2].endStationIdx) {
                
                // If the service reduction is the same as a previous one, combine them
                line.serviceReductions[i1].description += `<br> *** <br>${line.serviceReductions[i2].description}`;

                if (line.serviceReductions[i2].typeIdx != line.serviceReductions[i1].typeIdx) {

                    // If service reduction types differ, check if one is "No service" and set it to that
                    // Otherwise, set it to "Alert"
                    let noServiceIdx = serviceReductionTypes.findIndex(type => type.name === "No service");

                    if (line.serviceReductions[i2].typeIdx === noServiceIdx || line.serviceReductions[i1].typeIdx === noServiceIdx) {
                        line.serviceReductions[i1].typeIdx = noServiceIdx;
                    } else {
                        line.serviceReductions[i1].typeIdx = serviceReductionTypes.findIndex(type => type.name === "Alert");
                    }
                }
                // Remove the previous service reduction
                line.delServiceReduction(i2);
                i1--; // Adjust index since we removed an item
                break; // Exit the loop since we modified the array
            }
            i2++;
        }
        i1++;
    }

    // Create polylines for service reductions
    // These show infoboxes on mouseover with information about the service reduction
    for (let i = 0; i < line.serviceReductions.length; i++) {
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

        let serviceReductionPolyLine = new google.maps.Polyline({
            path: stationIdxs.map(idx => ({
                lat: line.stations[idx].lat,
                lng: line.stations[idx].lng
            })),
            geodesic: true,
            strokeColor: serviceReductionType.icon.strokeColor,
            strokeOpacity: 0.3,
            strokeWeight: 16,
            zIndex: 100,
            //icons: [{icon: directionIcon, offset: '50%'}]
        });

        // Store the polyline in the global array
        allReductionPolylines.push(serviceReductionPolyLine);

        // get midpoint of the polyline for the marker
        const path = serviceReductionPolyLine.getPath().getArray();
        let midLat = path[0].lat();
        let midLng = path[0].lng();
        let rotAngle = 0;

        let totalDistance = 0;
        for (let i = 0; i < path.length - 1; i++) {
            totalDistance += google.maps.geometry.spherical.computeDistanceBetween(path[i], path[i + 1]);
        }
        let accumulatedDistance = 0;
        for (let i = 0; i < path.length - 1; i++) {
            delta = google.maps.geometry.spherical.computeDistanceBetween(path[i], path[i + 1]);
            accumulatedDistance += delta;
            if (accumulatedDistance >= totalDistance / 2) {
                // We found the midpoint
                let ratio = (totalDistance / 2 - accumulatedDistance + delta) / delta;
                midLat = path[i].lat() + ratio * (path[i + 1].lat() - path[i].lat());
                midLng = path[i].lng() + ratio * (path[i + 1].lng() - path[i].lng());
                rotAngle = google.maps.geometry.spherical.computeHeading(path[i], path[i + 1]);
                break;
            }
        }

        // Create a marker at the midpoint of the polyline
        let serviceReductionMarker = new google.maps.Marker({
            position: { lat: midLat, lng: midLng },
            map: map,
            zIndex: 100,
            icon: serviceReductionType.icon
        });

        const scaleRGB = c => c.replace(/\d+/g, n => Math.round(n * 0.75));
        directionIcon.rotation = rotAngle; // Set the rotation of the direction marker
        directionIcon.strokeColor = scaleRGB(serviceReductionType.icon.strokeColor); // Set the stroke color of the direction marker
        directionIcon.fillColor = directionIcon.strokeColor; // Set the fill color of the direction marker

        let directionMarker = new google.maps.Marker({
            position: { lat: midLat, lng: midLng },
            map: map,
            zIndex: 10,
            icon: directionIcon
        });

        let serviceReductionInfoWindow = new google.maps.InfoWindow({ maxWidth: 200 });
        serviceReductionInfoWindow.setContent(`
            <div style="color: black; font-weight: bold; text-align: center; margin-right: 0px; margin-left: 0px;">
                <div style="font-size: 14px; text-align: center;">${line.name}</div>
                <div style="font-size: 12px; margin-top: 4px; text-align: center;">
                    ${serviceReductionType.name} from ${line.stations[line.serviceReductions[i].startStationIdx].name} to ${line.stations[line.serviceReductions[i].endStationIdx].name}
                </div>
                <div style="font-size: 11px; color: #666; margin-top: 4px; margin-bottom: 4px; text-align: center;">
                    ${line.serviceReductions[i].description}
                </div>
            </div>
        `);

        // If on mobile device
        if (isMobile) {
            // Toggle the info window on click event
            serviceReductionMarker.addListener('click', (event) => {
                if (serviceReductionInfoWindow.getMap()) {
                    serviceReductionInfoWindow.close();
                    currentInfoWindow = null;
                }
                else {
                    if (currentInfoWindow !== null) { currentInfoWindow.close();}
                    serviceReductionInfoWindow.setPosition(event.latLng);
                    serviceReductionInfoWindow.open(map);
                    currentInfoWindow = serviceReductionInfoWindow;

                    // After the info window opens, close it if clicked on
                    currentInfoWindow.addListener('domready', () => {
                        const iwOuter = document.querySelector('.gm-style-iw-c');
                        if (iwOuter) {
                            iwOuter.addEventListener('click', (e) => {
                                currentInfoWindow.close();
                                currentInfoWindow = null;
                                e.stopPropagation();
                            });
                        }
                    });
                }
            });

            // If the user clicks anywhere else, close the info window
            map.addListener('click', () => {
                currentInfoWindow.close();
                currentInfoWindow = null;
            });
        }

        // If on computer
        else {
            serviceReductionMarker.addListener('mouseover', (event) => {
                serviceReductionInfoWindow.setPosition(event.latLng);
                serviceReductionInfoWindow.open(map);
            });
            serviceReductionMarker.addListener('mouseout', () => {
                serviceReductionInfoWindow.close();
            });
        }

        // Store the marker in the global array
        allReductionMarkers.push(serviceReductionMarker);
        allReductionMarkers.push(directionMarker);
    }
}