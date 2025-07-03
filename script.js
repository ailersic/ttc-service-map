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
    constructor(startStationIdx, endStationIdx, typeIdx, description) {
        this.startStationIdx = startStationIdx;
        this.endStationIdx = endStationIdx;
        this.typeIdx = typeIdx;
        this.description = description;
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

        if (effectDesc === null) { effectDesc = "Alert"; } // Default to "Alert" if no effect description is provided

        // Find type of alert
        let typeIdx = serviceReductionTypes.findIndex(type => type.name.toLowerCase() === effectDesc.toLowerCase());

        // If the type is not found, we try to interpret it
        if (typeIdx === -1) {
            if (effectDesc.toLowerCase().includes("closure")) {
                if (description.toLowerCase().includes("will be")) {
                    typeIdx = serviceReductionTypes.findIndex(type => type.name === "Planned disruption");
                } else {
                    typeIdx = serviceReductionTypes.findIndex(type => type.name === "No service");
                }
            }

            if (effectDesc.toLowerCase().includes("regular service")) {
                typeIdx = serviceReductionTypes.findIndex(type => type.name === "Service restored");
            }
            // more interpretation logic can be added here
            // can also check for strings in description
        }

        // If the type is still not found, default to "Alert"
        if (typeIdx === -1) {
            typeIdx = serviceReductionTypes.findIndex(type => type.name === "Alert");
        }

        // Find the indices of the start and end stations
        let startStationIdx = this.stations.findIndex(station => station.name === startStation);
        let endStationIdx = this.stations.findIndex(station => station.name === endStation);

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
            } else {
                console.error(`Error: could not find stations in the description. Matching stations: ${matchingStations.join(", ")}`);
                return;
            }
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

        let serviceReduction = new ServiceReduction(
            startStationIdx,
            endStationIdx,
            typeIdx,
            description
        );
        this.serviceReductions.push(serviceReduction);
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
            new Station("Vaughan Metropolitan Centre", 43.79359492365686, -79.52692630674109),
            new Station("Highway 407", 43.78320639592452, -79.52373678592252),
            new Station("Pioneer Village", 43.77768026474626, -79.51102028702846),
            new Station("York University", 43.7739463783467, -79.49968857490713),
            new Station("Finch West", 43.763449486829394, -79.49100539351348),
            new Station("Downsview Park", 43.754678782960696, -79.47854687227645),
            new Station("Sheppard West", 43.75019738198139, -79.46338106477877),
            new Station("Wilson", 43.734000942635326, -79.4499210834251),
            new Station("Yorkdale", 43.72570315385812, -79.44790964629057),
            new Station("Lawrence West", 43.71607620491878, -79.4442270314626),
            new Station("Glencairn", 43.70953037049754, -79.44122305518754),
            new Station("Eglinton West", 43.69873284217742, -79.43586106172029),
            new Station("St Clair West", 43.68378028148699, -79.41531235945945),
            new Station("Dupont", 43.674812167696075, -79.40706011190075),
            new Station("Spadina", 43.6666836721813, -79.40379151979856),
            new Station("St George", 43.66753162794397, -79.39983394394515),
            new Station("Museum", 43.667001094688864, -79.39342228999425),
            new Station("Queen's Park", 43.65982914288105, -79.39041528757528),
            new Station("St Patrick", 43.65485383359176, -79.38832288888297),
            new Station("Osgoode", 43.65083536237515, -79.3866308412332),
            new Station("St Andrew", 43.6476522582488, -79.38479965053693),
            new Station("Union", 43.645205213069175, -79.38062332345591),
            new Station("King", 43.64915316616652, -79.3778703059319),
            new Station("Queen", 43.652389965280314, -79.37917263440282),
            new Station("Dundas", 43.656337119376246, -79.38091870872829),
            new Station("College", 43.66131086431013, -79.38307664264218),
            new Station("Wellesley", 43.66495708267232, -79.38456153203441),
            new Station("Bloor-Yonge", 43.67026016107548, -79.38673613009153),
            new Station("Rosedale", 43.676963390798626, -79.3895103712672),
            new Station("Summerhill", 43.681990445499345, -79.39157534637779),
            new Station("St Clair", 43.688059621112565, -79.39410004447326),
            new Station("Davisville", 43.69828585917402, -79.39659973903765),
            new Station("Eglinton", 43.70674370334689, -79.39832509993391),
            new Station("Lawrence", 43.72509836615263, -79.40220833297154),
            new Station("York Mills", 43.74413353692663, -79.40671799668762),
            new Station("Sheppard-Yonge", 43.76153070078085, -79.41093025541747),
            new Station("North York Centre", 43.76924830590284, -79.41287900817571),
            new Station("Finch", 43.779761878191316, -79.415529367082)
        ]
    ),
    new Line(
        "Line 2 - Bloor-Danforth",
        " #00A754",
        [
            new Station("Kipling", 43.63785564754179, -79.5355699483404),
            new Station("Islington", 43.64470471454407, -79.52345449184159),
            new Station("Royal York", 43.64739029090547, -79.51138964688396),
            new Station("Old Mill", 43.649640472229045, -79.49534358713495),
            new Station("Jane", 43.6493291493194, -79.48443066948187),
            new Station("Runnymede", 43.651151797587595, -79.4762489082027),
            new Station("High Park", 43.653240895422435, -79.46689872636507),
            new Station("Keele", 43.654729236752324, -79.45999538319852),
            new Station("Dundas West", 43.65637105335467, -79.45240510046536),
            new Station("Lansdowne", 43.658371343829565, -79.44274718952472),
            new Station("Dufferin", 43.65984404803366, -79.43532388756613),
            new Station("Ossington", 43.66201115847902, -79.42563327206157),
            new Station("Christie", 43.66356894014715, -79.41842770430013),
            new Station("Bathurst", 43.6651267566993, -79.41118571181181),
            new Station("Spadina", 43.6666836721813, -79.40379151979856),
            new Station("St George", 43.66753162794397, -79.39983394394515),
            new Station("Bay", 43.66969955004571, -79.38946192844412),
            new Station("Bloor-Yonge", 43.67026016107548, -79.38673613009153),
            new Station("Sherbourne", 43.67232921261314, -79.3768831623304),
            new Station("Castle Frank", 43.67376265187694, -79.36818662216531),
            new Station("Broadview", 43.67625521238776, -79.35875712452531),
            new Station("Chester", 43.677548084692624, -79.35193111069097),
            new Station("Pape", 43.678969363710564, -79.34488799857674),
            new Station("Donlands", 43.68049732892602, -79.33726739556741),
            new Station("Greenwood", 43.682033730431016, -79.32976415639875),
            new Station("Coxwell", 43.68334950469772, -79.32355424190305),
            new Station("Woodbine", 43.685689475916874, -79.31280219695455),
            new Station("Main Street", 43.68815792565607, -79.30181477751674),
            new Station("Victoria Park", 43.69441154264908, -79.2896714567281),
            new Station("Warden", 43.7114735689491, -79.2789781918863),
            new Station("Kennedy", 43.7321803500438, -79.26411932394124)
        ]
    ),
    new Line(
        "Line 3 - Scarborough",
        " #00A6E4",
        [
            new Station("Kennedy", 43.7321803500438, -79.26411932394124),
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
            new Station("Sheppard-Yonge", 43.76153070078085, -79.41093025541747),
            new Station("Bayview", 43.766663035226046, -79.38788911346154),
            new Station("Bessarion", 43.7692030527566, -79.376629282403),
            new Station("Leslie", 43.77117957888656, -79.36750434836519),
            new Station("Don Mills", 43.775497096215354, -79.3452958317072)
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
            //icons: [{icon: serviceReductionType.icon,offset: '50%',fixedRotation: true}]
        });

        // Store the polyline in the global array
        allReductionPolylines.push(serviceReductionPolyLine);

        // get midpoint of the polyline for the marker
        const path = serviceReductionPolyLine.getPath().getArray();
        let midLat = path[0].lat();
        let midLng = path[0].lng();

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
    }
}