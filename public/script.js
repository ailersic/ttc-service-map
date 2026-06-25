const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    ('ontouchstart' in window);

class AlertTypeDisplayInfo {
    constructor(short_name, long_name, icon) {
        /** @type {AlertType} */
        this.short_name = short_name;
        /** @type {string} */
        this.long_name = long_name;
        this.icon = icon;
    }
}

const alertTypeDisplayInfo = Object.freeze({
    Delays: new AlertTypeDisplayInfo("Delays", "Delays", snail),
    Bypass: new AlertTypeDisplayInfo("Bypass", "Bypass", noentry),
    Closure: new AlertTypeDisplayInfo("Closure", "No service", cross),
    Planned: new AlertTypeDisplayInfo("Planned", "Planned alert", clock),
    Accessibility: new AlertTypeDisplayInfo("Accessibility", "Accessibility alert", accessibility),
    //Restored: new ServiceAlertType("Restored", "Service restored", check),
    Other: new AlertTypeDisplayInfo("Other", "Other alert", exclamation),
    Multiple: new AlertTypeDisplayInfo("Multiple", "Multiple alerts", multiple)
});

/** @typedef {Exclude<keyof typeof alertTypeDisplayInfo, 'Multiple'>} AlertType */

class LayerTree {
    /** @type {L.Map} */
    #map;

    /** @type {L.LayerGroup} */
    #platformMarkerGroup;
    /** @type {L.LayerGroup} */
    #stationPlatformConnectionGroup;
    /** @type {{ [k in string]: any }} */
    #platformMarkersByPlatformId = {};
    /** @type {{ [k in string]: any }} */
    #stationPlatformConnectionsByPlatformId = {};
    /** @type {{ [k in string]: string[] }} */
    #platformsByRouteId = {};

    /** @type {L.LayerGroup} */
    #stationMarkerGroup;
    /** @type {{ [k in string]: any }} */
    #stationMarkersByStationId = {};
    /** @type {{ [k in string]: string[] }} */
    #stationsByRouteId = {}

    /** @type {L.LayerGroup} */
    #routeSegmentGroup;
    /** @type {{ [k in string]: any }} */
    #routeSegmentGroupsByRouteId = {};
    /** @typedef {'subway-lrt' | 'streetcar' | 'bus' | 'blue-night'} RouteGroupName */
    /** @type {{ [k in RouteGroupName]: string[] }} */
    #routeIdsByGroup = {
        'subway-lrt': [],
        streetcar: [],
        bus: [],
        'blue-night': [],
    };
    /** @type {{ [k in RouteGroupName]?: Element }} */
    #routeGroupVisibilityButtonsByGroup = {};

    /** @import { LatLng } from "../utils/geometry.ts" */
    /** @type {{ [k in string]: { [k in string]: LatLng[] } }} */
    #segmentsByRouteIdAndPlatformId = {} // keyed by the id of the platform at the start of the segment in the direction of travel

    /** @type {L.LayerGroup} */
    #alertMarkerGroup;
    /** @type {L.LayerGroup} */
    #alertSegmentGroup;
    /**
     * @typedef {Object} DisplayAlert
     * @property {string} id
     * @property {AlertTypeDisplayInfo} displayInfo
     * @property {true | undefined} stale
     * @property {string} header
     * @property {string} description
     * @property {string} routeId
     * @property {string[]} platformIds
     * @property {string[]} stationIds
     * @property {any[]} markers
     * @property {any[]} segments
     */
    /** @type {{ [k in string]: DisplayAlert[] }} */
    #alertsByRouteId = {};

    #visibility = {
        /** @type {{ [k in AlertType]: boolean }} */
        alertTypes: {},
        /** @type {{ [k in string]: boolean }} */
        routes: {},
        /** @type {{ [k in string]: number }} */
        stations: {},
        /** @type {{ [k in string]: number }} */
        platforms: {},
    };

    /** @type {string[]} */
    #spadinaTunnelNames;
    /** @type {L.Polyline<GeoJSON.LineString | GeoJSON.MultiLineString, any>} */
    #spadinaTunnel;
    #spadina1 = '99976';
    #spadina2 = '99976-ns';

    /** @param {L.Map} map */
    constructor(map) {
        this.#map = map;
        map.on('zoomend', this.#onZoom.bind(this));
        this.#platformMarkerGroup = L.layerGroup();
        this.#platformMarkerGroup.addTo(this.#map);
        this.#stationPlatformConnectionGroup = L.layerGroup();
        this.#stationPlatformConnectionGroup.addTo(this.#map);
        this.#stationMarkerGroup = L.layerGroup();
        this.#stationMarkerGroup.addTo(this.#map);
        this.#routeSegmentGroup = L.layerGroup();
        this.#routeSegmentGroup.addTo(this.#map);
        this.#alertMarkerGroup = L.layerGroup();
        this.#alertMarkerGroup.addTo(this.#map);
        this.#alertSegmentGroup = L.layerGroup();
        this.#alertSegmentGroup.addTo(this.#map);
        Object.values(alertTypeDisplayInfo).forEach(({ short_name }) => {
            this.showAlertType(short_name);
        });
        this.#onZoom();
    }

    #onZoom() {
        const zoom = this.#map.getZoom();
        this.#platformMarkerGroup.removeFrom(this.#map);
        this.#stationPlatformConnectionGroup.removeFrom(this.#map);
        if (zoom >= 14) {
            this.#platformMarkerGroup.addTo(this.#map);
            this.#stationPlatformConnectionGroup.addTo(this.#map);
        }
        this.#stationMarkerGroup.removeFrom(this.#map);
        if (zoom >= 12.5) {
            this.#stationMarkerGroup.addTo(this.#map);
        }
    }

    //#region map objects

    /**
     * @param {{ latitude: number, longitude: number, name: string }} platform 
     */
    #makePlatformMarker(platform) {
        const marker = L.circleMarker([platform.latitude, platform.longitude], {
            radius: 6,
            color: '#000',
            fillColor: '#fff',
            fillOpacity: 1,
            weight: 5,
            opacity: 1,
            pane: 'PlatformMarker',
        });
        const tooltip = L.tooltip({
            direction: 'top',
            sticky: false,
            className: 'station-tooltip',
            offset: [0, 0],
        });
        tooltip.setContent(`<p>${platform.name}</p>`);
        marker.bindTooltip(tooltip);
        return marker;
    }

    /**
     * @param {{ latitude: number, longitude: number, name: string, formerly?: string }} station 
     */
    #makeStationMarker(station) {
        const marker = L.circleMarker([station.latitude, station.longitude], {
            radius: 8,
            color: '#000',
            fillColor: '#fff',
            fillOpacity: .9,
            weight: 5,
            opacity: .9,
            pane: 'StationMarker',
        });
        const tooltip = L.tooltip({
            direction: 'top',
            sticky: false,
            className: 'station-tooltip',
            offset: [0, 0]
        });
        tooltip.setContent(`
            <p>${station.name}</p>
            ${station.formerly && `<p>Formerly ${station.formerly}</p>` || ''}
        `);
        marker.bindTooltip(tooltip);
        return marker;
    }

    #makeStationPlatformConnection(station, platform) {
        return L.polyline([[station.latitude, station.longitude], [platform.latitude, platform.longitude]], {
            color: '#888',
            weight: 6,
            opacity: 1,
            pane: 'PlatformConnection',
        });
    }

    #makeSpadinaTunnel(station1, station2) {
        const tunnel = L.polyline([
            [station1.latitude, station1.longitude],
            [station2.latitude, station2.longitude],
        ], {
            color: '#000',
            weight: 12,
            opacity: 1,
            pane: 'PlatformConnection',
        });
        const tooltip = L.tooltip({
            direction: 'top',
            sticky: true,
            className: 'route-tooltip',
            offset: [0, 0],
        });
        tunnel.bindTooltip(tooltip);
        tunnel.on('tooltipopen', () => {
            const randomName = this.#spadinaTunnelNames[Math.floor(Math.random() * this.#spadinaTunnelNames.length)];
            tooltip.setContent(`<p>Spadina ${randomName}</p>`);
        });
        return tunnel;
    }

    /**
     * @param {Transit['routes'][0]} route 
     * @param {Transit['routes'][0]['segments']['forward'][0]} segment 
     * @param {string} start
     * @param {string} end
     */
    #makeRouteSegment(route, segment, start, end) {
        const weight = route.type === 'SubwayLRT'
            ? 16 : (
                route.type === 'Streetcar'
                    ? 8
                    : 6
            );
        const pane = route.type === 'SubwayLRT'
            ? 'SubwayLrtLine' : (
                route.type === 'Streetcar'
                    ? 'StreetcarLine'
                    : 'BusLine'
            );
        const shadowPane = route.type === 'SubwayLRT'
            ? 'SubwayLrtShadow' : (
                route.type === 'Streetcar'
                    ? 'StreetcarShadow'
                    : 'BusShadow'
            );
        const polyline = L.polyline(segment.map(({ latitude, longitude }) => [latitude, longitude]), {
            color: route.color,
            weight,
            opacity: 1,
            pane,
        });
        const shadow = L.polyline(segment.map(({ latitude, longitude }) => [latitude, longitude]), {
            color: 'black',
            weight: weight + 2,
            opacity: 1,
            pane: shadowPane,
        });
        const tooltip = L.tooltip({
            direction: 'top',
            sticky: true,
            className: 'route-tooltip',
            offset: [0, 0]
        });
        tooltip.setContent(`<p>${route.short_name} ${route.long_name}</p><p>Normal service between ${start} and ${end}</p>`);
        polyline.bindTooltip(tooltip);
        return { polyline, shadow };
    }

    #makeAlertMarker(icon, latitude, longitude, header, description) {
        const size = 36;
        const marker = L.marker([latitude, longitude], {
            icon: L.divIcon({
                className: 'alert-div-icon',
                html: `<svg width="${size}" height="${size}" viewBox="${-12 * icon.scale} ${-12 * icon.scale} ${24 * icon.scale} ${24 * icon.scale}">
                    <g transform="scale(${icon.scale})">
                    <path d="${icon.path}" 
                    stroke="${icon.strokeColor}" 
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="${icon.strokeWeight / icon.scale}" 
                    fill="${icon.fillColor}"/>
                    </g>
                    </svg>`,
                iconSize: [size, size],
                iconAnchor: [size / 2, size / 2],
                tooltipAnchor: [0, -.375 * size],
            }),
            pane: 'AlertMarker',
        });
        const tooltip = L.tooltip({
            direction: 'top',
            sticky: true,
            className: 'alert-tooltip',
            offset: [0, 0],
        });
        tooltip.setContent(`<p>${header}</p>${description ? `<p>${description}</p>` : ''}`);
        marker.bindTooltip(tooltip);
        return marker;
    }

    #makeAlertSegment(polyline, alertType, header, description) {
        // TODO
    }

    //#endregion map objects

    //#region data

    /**
     * @param {Transit} transit
     * @param {string[]} tunnelNames
     */
    loadTransitData(transit, tunnelNames) {
        this.#spadinaTunnelNames = tunnelNames;
        transit.routes.forEach(r => {
            if (/3\d\d/.test(r.id)) {
                this.#routeIdsByGroup['blue-night'].push(r.id);
            } else {
                switch (r.type) {
                    case 'SubwayLRT':
                        this.#routeIdsByGroup['subway-lrt'].push(r.id);
                        break;
                    case 'Streetcar':
                        this.#routeIdsByGroup.streetcar.push(r.id);
                        break;
                    case 'Bus':
                        this.#routeIdsByGroup.bus.push(r.id);
                        break;
                }
            }
            this.#platformsByRouteId[r.id] = r.stops.forward.concat(r.stops.backward);
            this.#stationsByRouteId[r.id] = r.stops.forward.concat(r.stops.backward)
                .map(pid => transit.platforms[pid].parent_station_id)
                .filter(Boolean)                                     // filter out nulls
                .sort()                                              // sort to collect duplicates
                .filter((sid, i, a) => i === 0 || sid !== a[i - 1]); // remove duplicates
            this.#routeSegmentGroupsByRouteId[r.id] = L.layerGroup();
            this.#segmentsByRouteIdAndPlatformId[r.id] = {};
            for (let i = 0; i < r.stops.forward.length - 1; i++) {
                const start = r.stops.forward[i];
                const end = r.stops.forward[i + 1];
                const segment = r.segments.forward[i + 1];
                this.#segmentsByRouteIdAndPlatformId[r.id][start] = segment;
                const startName = transit.platforms[start].parent_station_id
                    ? transit.stations[transit.platforms[start].parent_station_id].name
                    : transit.platforms[start].name;
                const endName = transit.platforms[end].parent_station_id
                    ? transit.stations[transit.platforms[end].parent_station_id].name
                    : transit.platforms[end].name;
                const { polyline, shadow } = this.#makeRouteSegment(r, segment, startName, endName);
                shadow.addTo(this.#routeSegmentGroupsByRouteId[r.id]);
                polyline.addTo(this.#routeSegmentGroupsByRouteId[r.id]);
            }
            for (let i = 0; i < r.stops.backward.length - 1; i++) {
                const start = r.stops.backward[i];
                const end = r.stops.backward[i + 1];
                const segment = r.segments.backward[i + 1];
                this.#segmentsByRouteIdAndPlatformId[r.id][start] = segment;
                const startName = transit.platforms[start].parent_station_id
                    ? transit.stations[transit.platforms[start].parent_station_id].name
                    : transit.platforms[start].name;
                const endName = transit.platforms[end].parent_station_id
                    ? transit.stations[transit.platforms[end].parent_station_id].name
                    : transit.platforms[end].name;
                const { polyline, shadow } = this.#makeRouteSegment(r, segment, startName, endName);
                shadow.addTo(this.#routeSegmentGroupsByRouteId[r.id]);
                polyline.addTo(this.#routeSegmentGroupsByRouteId[r.id]);
            }
        });

        // add platform markers
        Object.entries(transit.platforms).forEach(([pid, p]) => {
            this.#visibility.platforms[pid] = 0;
            if (p.parent_station_id && transit.routes
                .filter(({ id }) => ['1', '2', '3', '4', '5', '6'].includes(id))
                .some(({ stops: { forward, backward } }) => forward.includes(pid) || backward.includes(pid))
            ) {
                console.info('skipping platform:', pid, 'has parent', transit.stations[p.parent_station_id]);
                // DO NOT add subway/lrt platforms with a parent station to map
            } else {
                console.info('add marker for platform:', pid);
                this.#platformMarkersByPlatformId[pid] = this.#makePlatformMarker(p);
            }
            // p.parent_station_id && (this.#stationPlatformConnectionsByPlatformId[id] = this.#makeStationPlatformConnection(transit.stations[p.parent_station_id], p));
        });

        // add station markers
        Object.entries(transit.stations).forEach(([id, s]) => {
            this.#visibility.stations[id] = 0;
            this.#stationMarkersByStationId[id] = this.#makeStationMarker(s);
        });

        // add spadina tunnel
        this.#spadinaTunnel = this.#makeSpadinaTunnel(transit.stations[this.#spadina1], transit.stations[this.#spadina2]);

        // set default visibility depending on time of day
        const now = new Date();
        const sunday = now.getDay() === 0;
        if (sunday ? (now.getHours() > 8 || now.getHours() < 2) : (now.getHours() > 6 || now.getHours() < 2)) {
            // subway/lrt and streetcar visible by default during operating hours
            this.showRouteGroup('subway-lrt');
            this.showRouteGroup('streetcar');
            this.hideRouteGroup('bus');
            this.hideRouteGroup('blue-night');
        }
        if ((now.getHours() + now.getMinutes() / 60) > 1.5 && (now.getHours() + now.getMinutes() / 60) < 5.5) {
            this.hideRouteGroup('subway-lrt');
            this.hideRouteGroup('streetcar');
            this.hideRouteGroup('bus');
            this.showRouteGroup('blue-night'); // blue night visible by default during operating hours
        }

        this.#onZoom();
    }

    /**
     * @param {string} alertId 
     * @param {AlertTypeDisplayInfo} displayInfo 
     * @param {string} header 
     * @param {string} description 
     * @param {string} routeId 
     * @param {string[]} platformIds 
     * @param {string[]} stationIds 
     */
    addAlert(alertId, displayInfo, header, description, routeId, platformIds, stationIds) {
        console.info('add alert:', alertId, displayInfo.short_name, 'on route', routeId, `\n'${header}'\n`, platformIds);
        if (!routeId) {
            console.warn('no route id on alert');
        }
        /** @type {DisplayAlert} */
        const newAlert = {
            id: alertId,
            displayInfo,
            header,
            description,
            routeId,
            platformIds,
            stationIds,
            markers: [],
            segments: [],
        };
        (this.#alertsByRouteId[routeId] || (this.#alertsByRouteId[routeId] = [])).push(newAlert);
        platformIds.forEach(pid => {
            const platformMarker = this.#platformMarkersByPlatformId[pid];
            if (!platformMarker) {
                console.warn('platform', pid, 'has no marker');
                return;
            }
            const { lat, lng } = platformMarker.getLatLng();
            const marker = this.#makeAlertMarker(displayInfo.icon, lat, lng, header, description);
            newAlert.markers.push(marker);
            // console.info('alert visibility:', this.isAlertTypeVisible(displayInfo.short_name), this.isRouteVisible(routeId));
            if (
                this.isAlertTypeVisible(displayInfo.short_name) &&
                this.isRouteVisible(routeId)
            ) {
                marker.addTo(this.#alertMarkerGroup);
            }
        });
        stationIds.forEach(sid => {
            const stationMarker = this.#stationMarkersByStationId[sid];
            if (!stationMarker) {
                return;
            }
            const { lat, lng } = stationMarker.getLatLng();
            const marker = this.#makeAlertMarker(displayInfo.icon, lat, lng, header, description);
            newAlert.markers.push(marker);
            if (this.isAlertTypeVisible(displayInfo)) {
                marker.addTo(this.#alertMarkerGroup);
            }
        });
        // TODO: segments
        // TODO: special handling for spadina?
    }

    clearAlerts() {
        Object.values(this.#alertsByRouteId).forEach(alerts =>
            alerts.forEach(({ markers, segments }) => {
                markers.forEach(m => m.removeFrom(this.#alertMarkerGroup));
                segments.forEach(s => s.removeFrom(this.#alertSegmentGroup));
            }),
        );
        this.#alertsByRouteId = {};
    }

    //#endregion data

    //#region visibility

    /** @param {AlertType} type */
    showAlertType(type) {
        if (this.#visibility.alertTypes[type]) {
            return;
        }
        this.#visibility.alertTypes[type] = true;
        Object.values(this.#alertsByRouteId).forEach(alerts =>
            alerts.forEach(({ displayInfo: alertType, routeId, markers }) => {
                if (type === alertType.short_name && this.isRouteVisible(routeId)) {
                    markers.forEach(m => m.addTo(this.#alertMarkerGroup));
                }
            }),
        );
    }

    /** @param {AlertType} type */
    hideAlertType(type) {
        if (!this.#visibility.alertTypes[type]) {
            return;
        }
        this.#visibility.alertTypes[type] = false;
        Object.values(this.#alertsByRouteId).forEach(alerts =>
            alerts.forEach(({ displayInfo: alertType, markers }) => {
                if (type === alertType.short_name) {
                    markers.forEach(m => m.removeFrom(this.#alertMarkerGroup));
                }
            }),
        );
    }

    /** @param {AlertType} type */
    isAlertTypeVisible(type) {
        return this.#visibility.alertTypes[type];
    }

    #incrementStationVisibility(id) {
        this.#visibility.stations[id]++;
        if (this.#visibility.stations[id] === 1) {
            this.#stationMarkersByStationId[id].addTo(this.#stationMarkerGroup);
            if ((id === this.#spadina1 && this.#visibility.stations[this.#spadina2]) ||
                (id === this.#spadina2 && this.#visibility.stations[this.#spadina1])) {
                this.#spadinaTunnel.addTo(this.#stationMarkerGroup);
            }
        }
    }

    #decrementStationVisibility(id) {
        this.#visibility.stations[id]--;
        if (this.#visibility.stations[id] === 0) {
            this.#stationMarkersByStationId[id].removeFrom(this.#stationMarkerGroup);
            if ((id === this.#spadina1 && this.#visibility.stations[this.#spadina2]) ||
                (id === this.#spadina2 && this.#visibility.stations[this.#spadina1])) {
                this.#spadinaTunnel.removeFrom(this.#stationMarkerGroup);
            }
        }
    }

    #incrementPlatformVisibility(id) {
        this.#visibility.platforms[id]++;
        if (this.#visibility.platforms[id] === 1) {
            this.#platformMarkersByPlatformId[id]?.addTo(this.#platformMarkerGroup);
            this.#stationPlatformConnectionsByPlatformId[id]?.addTo(this.#stationPlatformConnectionGroup)
        }
    }

    #decrementPlatformVisibility(id) {
        this.#visibility.platforms[id]--;
        if (this.#visibility.platforms[id] === 0) {
            this.#platformMarkersByPlatformId[id]?.removeFrom(this.#platformMarkerGroup);
            this.#stationPlatformConnectionsByPlatformId[id]?.removeFrom(this.#stationPlatformConnectionGroup);
        }
    }

    /** @param {string} id */
    showRoute(id) {
        if (this.#visibility.routes[id]) {
            return;
        }
        this.#visibility.routes[id] = true;
        this.#routeSegmentGroupsByRouteId[id].addTo(this.#routeSegmentGroup);
        this.#platformsByRouteId[id].forEach(this.#incrementPlatformVisibility.bind(this));
        this.#stationsByRouteId[id].forEach(this.#incrementStationVisibility.bind(this));
        id in this.#alertsByRouteId && this.#alertsByRouteId[id].forEach(({ markers }) =>
            markers.forEach(m => m.addTo(this.#alertMarkerGroup)),
        );
    }

    /** @param {string} id */
    hideRoute(id) {
        if (!this.#visibility.routes[id]) {
            return;
        }
        this.#visibility.routes[id] = false;
        this.#routeSegmentGroupsByRouteId[id].removeFrom(this.#routeSegmentGroup);
        this.#platformsByRouteId[id].forEach(this.#decrementPlatformVisibility.bind(this));
        this.#stationsByRouteId[id].forEach(this.#decrementStationVisibility.bind(this));
        (id in this.#alertsByRouteId) && this.#alertsByRouteId[id].forEach(({ markers }) =>
            markers.forEach(m => m.removeFrom(this.#alertMarkerGroup)),
        );
    }

    /** @param {string} id */
    isRouteVisible(id) {
        return !!this.#visibility.routes[id];
    }

    /**
     * @param {RouteGroupName} group 
     * @param {HTMLElement} element 
     */
    addRouteGroupVisibilityButton(group, element) {
        this.#routeGroupVisibilityButtonsByGroup[group] = element;
        element.onclick = () => this.toggleRouteGroup(group);
    }

    /**
     * @param {RouteGroupName} group 
     */
    showRouteGroup(group) {
        const button = this.#routeGroupVisibilityButtonsByGroup[group];
        button.className = button.className.replace('fa-eye-slash', 'fa-eye');
        document
            .querySelector(`#${group}-group-content`)
            .querySelectorAll('.legend-content-row')
            .forEach(row => {
                const btn = row.querySelector('.view-button');
                btn.className = btn.className.replace('fa-eye-slash', 'fa-eye');
            })
        this.#routeIdsByGroup[group].forEach(id => this.showRoute(id));
    }

    /**
     * @param {RouteGroupName} group 
    */
    hideRouteGroup(group) {
        const button = this.#routeGroupVisibilityButtonsByGroup[group];
        button.className = button.className.replace(/fa-eye($| )/, 'fa-eye-slash$1');
        document
            .querySelector(`#${group}-group-content`)
            .querySelectorAll('.legend-content-row')
            .forEach(row => {
                const btn = row.querySelector('.view-button');
                btn.className = btn.className.replace(/fa-eye($| )/, 'fa-eye-slash$1');
            });
        this.#routeIdsByGroup[group].forEach(id => this.hideRoute(id));
    }

    /**
     * @param {RouteGroupName} group 
     */
    toggleRouteGroup(group) {
        if (this.isRouteGroupVisible(group)) {
            this.hideRouteGroup(group)
        } else {
            this.showRouteGroup(group)
        }
    }

    /**
     * @param {RouteGroupName} group 
     */
    isRouteGroupVisible(group) {
        return this.#routeIdsByGroup[group].some(id => this.isRouteVisible(id));
    }

    //#endregion visibility
};

/** @type {LayerTree} */
let layerTree;

/** @import { PlatformCollection, StationCollection, RouteCollection } from "../models/TtcApi.ts" */
/**
 * @typedef {Object} Transit
 * @property {PlatformCollection} platforms
 * @property {StationCollection} stations
 * @property {RouteCollection} routes
 */
/** @type {Transit} */
const transit = {
    platforms: {},
    stations: {},
    routes: [],
};

async function loadTransitData() {
    transit.platforms = await fetch('/api/platforms').then(res => res.json());
    transit.stations = await fetch('/api/stations').then(res => res.json());
    transit.routes = await fetch('/api/routes').then(res => res.json());
    const tunnelNames = await fetch('/spadina.txt')
        .then(response => response.text())
        .then(text => text.split('\n').map(line => line.trim()).filter(line => line.length > 0));
    console.debug('got', transit.routes.length, 'routes from api');
    console.debug('got', tunnelNames.length, 'tunnel names from api');

    layerTree.loadTransitData(transit, tunnelNames);
}

/** @import { AlertCollection } from "../models/TtcApi.ts" */
/**
 * @typedef {Object} AlertInfo
 * @property {AlertCollection} subway
 * @property {AlertCollection} streetcar
 * @property {AlertCollection} bus
 * @property {AlertCollection} accessibility
 * @property {AlertCollection} stop
 */
/** @type {AlertInfo} */
const alerts = {
    // fromApi: {
    subway: null,
    streetcar: null,
    bus: null,
    accessibility: null,
    stop: null,
    // },
    // byRouteAndAlertType: {},
};

async function loadAlerts() {
    const start = Date.now();
    alerts.subway = await fetch('/api/alerts/subway')
        .then(res => res.json())
        .catch(r => console.warn('fetch subway alerts failed:', r));
    alerts.streetcar = await fetch('/api/alerts/streetcar')
        .then(res => res.json())
        .catch(r => console.warn('fetch streetcar alerts failed:', r));
    alerts.bus = await fetch('/api/alerts/bus')
        .then(res => res.json())
        .catch(r => console.warn('fetch bus alerts failed:', r));
    alerts.accessibility = await fetch('/api/alerts/accessibility')
        .then(res => res.json())
        .catch(r => console.warn('fetch accessibility alerts failed:', r));
    alerts.stop = await fetch('/api/alerts/stops')
        .then(res => res.json())
        .catch(r => console.warn('fetch stop alerts failed:', r));
    assembleAlerts();
    console.debug('loadAlerts() in', Date.now() - start, 'ms');
}

const Panes = {
    AlertMarker: 70,
    StationMarker: 60,
    PlatformMarker: 50,
    AlertOverlay: 40,
    PlatformConnection: 30,
    SubwayLrtLine: 25,
    SubwayLrtShadow: 20,
    StreetcarLine: 15,
    StreetcarShadow: 10,
    BusLine: 5,
    BusShadow: 0,
};
/** @typedef {keyof typeof Panes} Pane */

let map;

var currentInfoWindow = null;

function assembleAlerts() {
    const count = Object.values(alerts).reduce((sum, { alerts }) => sum + alerts.length, 0);
    console.debug('got', count, 'alerts from api');
    layerTree.clearAlerts();
    Object.values(alerts).forEach(({ alerts }) =>
        alerts.forEach(({ id, periods, effect, criteria, header, description }) => {

            // console.warn(`Alert ${id} with effect ${effect} for the following periods: ${periods
            //     .map(({ start, end }) => `${Date(start).toLocaleString()} to ${Date(end).toLocaleString()}`).join(', ')
            //     }`);

            // map alert type
            let display = alertTypeDisplayInfo.Other; // default
            if (periods.every(({ start }) => start > Date.now())) {
                display = alertTypeDisplayInfo.Planned;
            } else {
                switch (effect) {
                    case 'AccessibilityIssue':
                        display = alertTypeDisplayInfo.Accessibility;
                        break;
                    // case 'AdditionalService':
                    //     // TODO: ignore?
                    //     break;
                    case 'Detour':
                        display = alertTypeDisplayInfo.Bypass;
                        break;
                    case 'ModifiedService':
                        // TODO: what is this
                        // console.warn('ModifiedService:', header, '-', description);
                        display = alertTypeDisplayInfo.Other;
                        break;
                    case 'NoService':
                        display = alertTypeDisplayInfo.Closure;
                        break;
                    case 'ReducedService':
                        // if (header.toLowerCase().includes("there will be no")) {
                        display = alertTypeDisplayInfo.Planned;
                        // }
                        break;
                    case 'SignificantDelay':
                        display = alertTypeDisplayInfo.Delays;
                        break;
                    default:
                        console.warn('Unsupported Alert.Effect:', effect);
                        return;
                }
            }

            const platformsEffected = [];
            const stationsEffected = [];
            let routeId;

            criteria.forEach(({ direction, platform_id, route_id, route_type }) => {
                direction && console.warn('direction in criteria!', direction);
                route_type && console.warn('route_type in criteria!', route_type);
                routeId && route_id && routeId !== route_id && console.warn('multiple routes in criteria!');

                route_id && (routeId = route_id);

                platform_id && platformsEffected.push(platform_id);

                const platform = platform_id === undefined ? null : transit.platforms[platform_id];
                const station_id = platform?.parent_station_id || undefined;
                station_id && stationsEffected.push(station_id);

                const station = station_id === undefined ? null : transit.stations[station_id];
                // console.warn(`effecting
                //     platform ${platform?.name}
                //     at station ${station?.name}
                //     on route ${route_id}`.replace(/ +/, ' '));
            });

            layerTree.addAlert(id, display, header, description, routeId, platformsEffected, stationsEffected);
        }));

    // // if any alert has a station list with a gap, fill in the missing stations
    // Object.entries(alerts.byRouteAndAlertType).forEach(([route_id, alertTypes]) => {
    //     const route = transit.routes.find(r => r.id === route_id);
    //     const stationOrder = route.stops.forward.map(p => transit.platforms[p]?.parent_station_id).filter(Boolean);
    //     Object.values(alertTypes).forEach(alerts =>
    //         Object.values(alerts).forEach(alert => {
    //             const indices = alert.stations.map(s => stationOrder.indexOf(s)).filter(i => i >= 0).sort((a, b) => a - b);
    //             if (indices.length > 1) {
    //                 for (let i = indices[0]; i <= indices[indices.length - 1]; i++) {
    //                     if (stationOrder[i] && !alert.stations.includes(stationOrder[i])) alert.stations.push(stationOrder[i]);
    //                 }
    //             }
    //         })
    //     );
    // });
    // );
}

function addLineSegments() {
    transit.routes.forEach(({ id: route_id, type, long_name: route_name, stops, segments, color }) => {
        let visOpacity = 0.8;
        if (!visibility.routes[route_id]) visOpacity = 0.2;

        normalSegments = [];
        alertSegments = [];
        lastSegmentAlert = false;

        stops.forward.forEach((platformId, i) => {
            if (i >= segments.forward.length) return;
            const segmentLatLngs = segments.forward[i].map(({ latitude, longitude }) => [latitude, longitude]);
            const s1 = transit.platforms[platformId]?.parent_station_id;
            const s2 = transit.platforms[stops[i + 1]]?.parent_station_id;
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

        // console.warn(`Route ${route_name} (${route_id}): ${normalSegments.length} normal segments, ${alertSegments.length} alert segments`);

        if (normalSegments.length) {
            // For each normal segment, make a tooltip polyline
            normalSegments.forEach(({ segment, s1, s2 }) => {
                const transitPolyLine = L.polyline(segment, {
                    color,
                    weight: type === 'SubwayLRT' ? 16 : 12,
                    opacity: visOpacity,
                    // zIndex: Panes.SubwayLrtLine,
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
                                Normal service from ${transit.stations[s1]?.name || 'Unknown Station'} to ${transit.stations[s2]?.name || 'Unknown Station'}
                            </div>
                        </div>
                    `);
                    transitPolyLine.bindTooltip(lineInfoWindow);
                }

                allSegmentPolylines.push(transitPolyLine);
            });
        }

        if (alertSegments.length) {
            alertSegments.forEach(({ segment, s1, s2 }) => {
                const alertPolyLine = L.polyline(segment, {
                    color: 'rgba(100, 100, 100, 1)',
                    weight: 6,
                    opacity: visOpacity,
                    dashArray: '5, 15',
                    // zIndex: Panes.AlertOverlay,
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

// function addServiceAlerts() {
//     processedAlerts = {};

//     // for each route
//     transit.routes.forEach(({ id: route_id, long_name: route_name, stops, segments }) => {
//         if (!visibility.routes[route_id]) return;
//         processedAlerts[route_id] = {};

//         // for each alert type in that route
//         Object.entries(alerts.byRouteAndAlertType[route_id] || {}).forEach(([alertGroupKey, alertGroup]) => {
//             if (!visibility.alerts[alertGroupKey]) return;
//             processedAlerts[route_id][alertGroupKey] = {};

//             // for each alert in that type
//             Object.entries(alertGroup).forEach(([alertKey, alert]) => {
//                 // if two alerts of the same alert_type have overlapping stations, merge them
//                 let merged = false;
//                 Object.values(processedAlerts[route_id][alertGroupKey]).forEach(existingAlert => {
//                     const intersection = existingAlert.stations.filter(station => alert.stations.includes(station));
//                     if (intersection.length > 0) {
//                         // merge
//                         existingAlert.stations = Array.from(new Set([...existingAlert.stations, ...alert.stations]));
//                         existingAlert.header += "\n<hr>\n" + alert.header;
//                         merged = true;
//                     }
//                 });
//                 if (!merged) {
//                     processedAlerts[route_id][alertGroupKey][alertKey] = { ...alert };
//                 }
//             });
//         });
//     });

//     // Now, for each processed alert, create markers and polylines
//     transit.routes.forEach(({ id: route_id, long_name: route_name, stops, segments }) => {
//         if (!visibility.routes[route_id]) return;
//         Object.entries(processedAlerts[route_id] || {}).forEach(([alertGroupKey, alertGroup]) => {
//             if (!visibility.alerts[alertGroupKey]) return;
//             Object.values(alertGroup).forEach(alert => {
//                 // Create an info window for the alert
//                 let alertInfoWindow = L.tooltip({
//                     direction: 'top',
//                     sticky: true,
//                     className: 'alert-tooltip',
//                     offset: [0, 0]
//                 });

//                 let stationString = "";
//                 // If the start and end stations are the same, we show "at <station name>"
//                 // Otherwise, we show "from <start station> to <end station>"
//                 if (alert.stations.length === 1) {
//                     stationString = `at ${transit.stations[alert.stations[0]].name}`;
//                 } else {
//                     const start_station_name = transit.stations[alert.stations.reduce((a, b) => {
//                         return stops.forward.findIndex(p => transit.platforms[p]?.parent_station_id === a) <
//                             stops.forward.findIndex(p => transit.platforms[p]?.parent_station_id === b) ? a : b;
//                     })].name;
//                     const end_station_name = transit.stations[alert.stations.reduce((a, b) => {
//                         return stops.forward.findIndex(p => transit.platforms[p]?.parent_station_id === a) >
//                             stops.forward.findIndex(p => transit.platforms[p]?.parent_station_id === b) ? a : b;
//                     })].name;
//                     stationString = `from ${start_station_name} to ${end_station_name}`;
//                 }

//                 alertInfoWindow.setContent(`
//                     <div style="color: black; text-align: center; margin-right: 0px; margin-left: 0px;">
//                         <div style="font-size: 14px; font-weight: bold; text-align: center;">${route_name}</div>
//                         <div style="font-size: 12px; margin-top: 4px; text-align: center;">
//                             ${alert.alert_type.long_name} ${stationString}
//                         </div>
//                         <div style="font-size: 12px; color: #666; margin-top: 4px; margin-bottom: 4px; text-align: center;">
//                             ${alert.header}
//                         </div>
//                     </div>
//                 `);

//                 const alertSegs = [];
//                 if (alert.stations.length >= 2) {
//                     // Highlight segment for each alert
//                     stops.forward.forEach((platformId, i) => {
//                         if (i >= segments.length) return;
//                         const s1 = transit.platforms[platformId]?.parent_station_id;
//                         const s2 = transit.platforms[stops[i + 1]]?.parent_station_id;
//                         if (alert.stations.includes(s1) && alert.stations.includes(s2)) {
//                             const segmentLatLngs = segments[i].map(({ latitude, longitude }) => [latitude, longitude]);
//                             alertSegs.push(...segmentLatLngs);
//                         }
//                     });
//                 }

//                 const icon = alert.alert_type.icon;
//                 const alertIcon = L.divIcon({
//                     className: 'my-custom-svg-icon', // Optional: for CSS styling
//                     html: `<svg width="${24 * icon.scale}" height="${24 * icon.scale}" viewBox="${-12 * icon.scale} ${-12 * icon.scale} ${24 * icon.scale} ${24 * icon.scale}" xmlns="http://www.w3.org/2000/svg">
//                         <g transform="scale(${icon.scale})">
//                         <path d="${icon.path}" 
//                         stroke="${icon.strokeColor}" 
//                         stroke-linecap="round"
//                         stroke-linejoin="round"
//                         stroke-width="${icon.strokeWeight / icon.scale}" 
//                         fill="${icon.fillColor}"/>
//                         </g>
//                         </svg>`,
//                     iconSize: [48, 48], // Set the size of your SVG
//                     iconAnchor: [24, 24], // Point of the icon corresponding to marker's location
//                     tooltipAnchor: [0, -18] // Point from which the tooltip should open relative to the iconAnchor
//                 });

//                 let marker_latlng = null;

//                 // plot icons at midpoint of segment if alert.stations.length >= 2, else at station
//                 if (alertSegs.length >= 2) {
//                     const midpoint = getMidpointAlongCurve(alertSegs.map(([lat, lng]) => L.latLng(lat, lng)));
//                     marker_latlng = midpoint;
//                 } else {
//                     // If there's only one station in the alert, place the marker at that station
//                     const firstStationId = alert.stations[0];
//                     const firstStation = transit.stations[firstStationId];
//                     marker_latlng = L.latLng(firstStation.latitude, firstStation.longitude);
//                 }

//                 let alertMarker = L.marker([marker_latlng.lat, marker_latlng.lng], {
//                     icon: alertIcon,
//                     // zIndex: Panes.AlertMarker,
//                 });

//                 alertMarker.bindTooltip(alertInfoWindow);
//                 allAlertMarkers.push(alertMarker);

//                 if (alertSegs.length) {
//                     const alertPolyLine = L.polyline(alertSegs, {
//                         color: alert.alert_type.icon.strokeColor,
//                         weight: 20,
//                         opacity: 0.5,
//                         // zIndex: Panes.AlertOverlay + 1,
//                     });

//                     alertPolyLine.bindTooltip(alertInfoWindow);

//                     // Store the polyline in the global array
//                     allAlertPolylines.push(alertPolyLine);
//                 }
//             })
//         });
//     });
// }

// function addServiceAlertsOld(line) {
//     // Check if any service alerts of the same type overlap, and combine them if they are
//     let i1 = 0;
//     while (i1 < line.serviceAlerts.length) {
//         let i2 = 0;
//         while (i2 < i1) {
//             if (!alertTypeDisplayInfo[line.serviceAlerts[i1].typeIdx].view ||
//                 !alertTypeDisplayInfo[line.serviceAlerts[i2].typeIdx].view) {
//                 i2++;
//                 continue;
//             }

//             let i1Start = line.serviceAlerts[i1].startStationIdx;
//             let i1End = line.serviceAlerts[i1].endStationIdx;
//             let i2Start = line.serviceAlerts[i2].startStationIdx;
//             let i2End = line.serviceAlerts[i2].endStationIdx;
//             if (((i1Start >= i2Start && i1Start <= i2End) || // i1 starts inside i2
//                 (i1End >= i2Start && i1End <= i2End) || // i1 ends inside i2
//                 (i2Start >= i1Start && i2Start <= i1End) || // i2 starts inside i1
//                 (i2End >= i1Start && i2End <= i1End)) && // i2 ends inside i1
//                 (line.serviceAlerts[i1].typeIdx === line.serviceAlerts[i2].typeIdx)) {

//                 // If the service alert is adjacent to a previous one and the same type, combine them
//                 line.serviceAlerts[i1].startStationIdx = Math.min(line.serviceAlerts[i1].startStationIdx, line.serviceAlerts[i2].startStationIdx);
//                 line.serviceAlerts[i1].endStationIdx = Math.max(line.serviceAlerts[i1].endStationIdx, line.serviceAlerts[i2].endStationIdx);

//                 // Combine descriptions
//                 line.serviceAlerts[i1].description += `<hr>${line.serviceAlerts[i2].description}`;

//                 // Combine directions
//                 if (line.serviceAlerts[i1].direction != line.serviceAlerts[i2].direction) {
//                     line.serviceAlerts[i1].direction = "both";
//                 }

//                 // Remove the previous service alert
//                 line.delServiceAlert(i2);
//                 i1 = 0; // Adjust index since we removed an item
//                 break; // Exit the loop since we modified the array
//             }
//             i2++;
//         }
//         i1++;
//     }

//     // Check if any service alerts cover the same stations, and combine them if they do
//     i1 = 0;
//     while (i1 < line.serviceAlerts.length) {
//         let i2 = 0;
//         while (i2 < i1) {
//             if (!alertTypeDisplayInfo[line.serviceAlerts[i1].typeIdx].view ||
//                 !alertTypeDisplayInfo[line.serviceAlerts[i2].typeIdx].view) {
//                 i2++;
//                 continue;
//             }

//             if (line.serviceAlerts[i1].startStationIdx === line.serviceAlerts[i2].startStationIdx &&
//                 line.serviceAlerts[i1].endStationIdx === line.serviceAlerts[i2].endStationIdx) {

//                 // If the service alert is the same as a previous one, combine them
//                 line.serviceAlerts[i1].description += `<hr>${line.serviceAlerts[i2].description}`;
//                 // Combine directions
//                 if (line.serviceAlerts[i1].direction != line.serviceAlerts[i2].direction) {
//                     line.serviceAlerts[i1].direction = "both";
//                 }

//                 // If service alert types differ
//                 if (line.serviceAlerts[i2].typeIdx != line.serviceAlerts[i1].typeIdx) {
//                     let noServiceIdx = alertTypeDisplayInfo.findIndex(type => type.short_name === "Closure");
//                     let restoredIdx = alertTypeDisplayInfo.findIndex(type => type.short_name === "Restored");

//                     // If one of them is "No service", set the combined alert to that
//                     if (line.serviceAlerts[i2].typeIdx === noServiceIdx || line.serviceAlerts[i1].typeIdx === noServiceIdx) {
//                         line.serviceAlerts[i1].typeIdx = noServiceIdx;
//                     }

//                     // If one of them is "Service restored", set the combined alert to the other one
//                     //else if (line.serviceReductions[i1].typeIdx === restoredIdx) {
//                     //    line.serviceReductions[i1].typeIdx = line.serviceReductions[i2].typeIdx;
//                     //}
//                     //else if (line.serviceReductions[i2].typeIdx === restoredIdx) {} // Do nothing, we already set the typeIdx to the other one

//                     // Otherwise, set the combined alert to "Multiple alerts"
//                     else {
//                         line.serviceAlerts[i1].typeIdx = alertTypeDisplayInfo.findIndex(type => type.short_name === "Multiple");
//                     }
//                 }

//                 // Remove the previous service alert
//                 line.delServiceAlert(i2);
//                 i1 = 0; // Adjust index since we removed an item
//                 break; // Exit the loop since we modified the array
//             }
//             i2++;
//         }
//         i1++;
//     }

//     // Create polylines for service alerts
//     // These show infoboxes on mouseover with information about the service alert
//     for (let i = 0; i < line.serviceAlerts.length; i++) {
//         if (!alertTypeDisplayInfo[line.serviceAlerts[i].typeIdx].view) {
//             continue; // Skip service alerts that are not set to be viewed
//         }

//         const stationIdxs = [];
//         for (let j = line.serviceAlerts[i].startStationIdx; j <= line.serviceAlerts[i].endStationIdx; j++) {
//             stationIdxs.push(j);
//         }
//         let serviceAlertType = alertTypeDisplayInfo[line.serviceAlerts[i].typeIdx];

//         let directionIcon = bothwaysarrow;
//         if (line.serviceAlerts[i].direction === "forward") {
//             directionIcon = forwardarrow;
//         } else if (line.serviceAlerts[i].direction === "reverse") {
//             directionIcon = reversearrow;
//         }

//         let serviceAlertPolyLine = L.polyline(stationIdxs.map(idx => [
//             line.stations[idx].lat,
//             line.stations[idx].lng
//         ]), {
//             color: serviceAlertType.icon.strokeColor,
//             weight: 12,
//             opacity: 0.5,
//             // zIndex: Panes.AlertOverlay,
//         });

//         let serviceAlertHighlightPolyLine = L.polyline(stationIdxs.map(idx => [
//             line.stations[idx].lat,
//             line.stations[idx].lng
//         ]), {
//             color: "rgba(0, 255, 255, 0.5)",
//             weight: 20,
//             opacity: 0,
//             // zIndex: Panes.AlertOverlay + 1,
//         });

//         // Store the polyline in the global array
//         allAlertPolylines.push(serviceAlertPolyLine);
//         allAlertPolylines.push(serviceAlertHighlightPolyLine);

//         // get midpoint of the polyline for the marker
//         const path = serviceAlertPolyLine.getLatLngs();
//         let midLat = path[0].lat;
//         let midLng = path[0].lng;
//         let rotAngle = 0;

//         let totalDistance = 0;
//         for (let i = 0; i < path.length - 1; i++) {
//             totalDistance += L.latLng(path[i]).distanceTo(L.latLng(path[i + 1]));
//         }
//         let accumulatedDistance = 0;
//         for (let i = 0; i < path.length - 1; i++) {
//             delta = L.latLng(path[i]).distanceTo(L.latLng(path[i + 1]));
//             accumulatedDistance += delta;
//             if (accumulatedDistance >= totalDistance / 2) {
//                 // We found the midpoint
//                 let ratio = (totalDistance / 2 - accumulatedDistance + delta) / delta;
//                 midLat = path[i].lat + ratio * (path[i + 1].lat - path[i].lat);
//                 midLng = path[i].lng + ratio * (path[i + 1].lng - path[i].lng);
//                 rotAngle = getHeading(path[i], path[i + 1]); // Get the heading between the two points
//                 break;
//             }
//         }

//         let stationString = "";
//         // If the start and end stations are the same, we show "at <station name>"
//         // Otherwise, we show "from <start station> to <end station>"
//         if (line.serviceAlerts[i].startStationIdx === line.serviceAlerts[i].endStationIdx) {
//             stationString = `at ${line.stations[line.serviceAlerts[i].startStationIdx].name}`;
//         } else {
//             stationString = `from ${line.stations[line.serviceAlerts[i].startStationIdx].name} to ${line.stations[line.serviceAlerts[i].endStationIdx].name}`;
//         }

//         // Create a marker at the midpoint of the polyline
//         const icon = serviceAlertType.icon;
//         const serviceAlertIcon = L.divIcon({
//             className: 'my-custom-svg-icon', // Optional: for CSS styling
//             html: `<svg width="${24 * icon.scale}" height="${24 * icon.scale}" viewBox="${-12 * icon.scale} ${-12 * icon.scale} ${24 * icon.scale} ${24 * icon.scale}" xmlns="http://www.w3.org/2000/svg">
//                 <g transform="scale(${icon.scale})">
//                 <path d="${icon.path}" 
//                 stroke="${icon.strokeColor}" 
//                 stroke-linecap="round"
//                 stroke-linejoin="round"
//                 stroke-width="${icon.strokeWeight / icon.scale}" 
//                 fill="${icon.fillColor}"/>
//                 </g>
//                 </svg>`,
//             iconSize: [48, 48], // Set the size of your SVG
//             iconAnchor: [24, 24], // Point of the icon corresponding to marker's location
//             tooltipAnchor: [0, -18] // Point from which the tooltip should open relative to the iconAnchor
//         });

//         // Bind the info window to the service alert marker
//         let serviceAlertInfoWindow = L.tooltip({
//             direction: 'top',
//             sticky: false,
//             className: 'service-alert-tooltip',
//             offset: [0, 0]
//         });

//         serviceAlertInfoWindow.setContent(`
//             <div style="color: black; text-align: center; margin-right: 0px; margin-left: 0px;">
//                 <div style="font-size: 14px; font-weight: bold; text-align: center;">${line.name}</div>
//                 <div style="font-size: 12px; margin-top: 4px; text-align: center;">
//                     ${serviceAlertType.long_name} ${stationString}
//                 </div>
//                 <div style="font-size: 12px; color: #666; margin-top: 4px; margin-bottom: 4px; text-align: center;">
//                     ${line.serviceAlerts[i].description}
//                 </div>
//             </div>
//         `);

//         let serviceAlertMarker = L.marker([midLat, midLng], {
//             icon: serviceAlertIcon,
//             // zIndex: Panes.AlertMarker,
//         });
//         serviceAlertMarker.bindTooltip(serviceAlertInfoWindow);
//         serviceAlertMarker.on('tooltipopen', function () {
//             serviceAlertHighlightPolyLine.setStyle({ opacity: 1 });
//         });
//         serviceAlertMarker.on('tooltipclose', function () {
//             serviceAlertHighlightPolyLine.setStyle({ opacity: 0 });
//         });

//         const scaleRGB = c => c.replace(/\d+/g, n => Math.round(n * 0.75));
//         directionIcon.rotation = rotAngle; // Set the rotation of the direction marker
//         directionIcon.strokeColor = scaleRGB(serviceAlertType.icon.strokeColor); // Set the stroke color of the direction marker
//         directionIcon.fillColor = directionIcon.strokeColor; // Set the fill color of the direction marker

//         let directionMarkerIcon = L.divIcon({
//             className: 'my-custom-svg-icon',
//             html: `<svg width="${32 * directionIcon.scale}" height="${32 * directionIcon.scale}" viewBox="${-16 * directionIcon.scale} ${-16 * directionIcon.scale} ${32 * directionIcon.scale} ${32 * directionIcon.scale}" xmlns="http://www.w3.org/2000/svg">
//                 <g transform="scale(${directionIcon.scale})">
//                 <path d="${directionIcon.path}"
//                 transform="rotate(${rotAngle}, 0, 0)"
//                 stroke="${directionIcon.strokeColor}" 
//                 stroke-linecap="round"
//                 stroke-linejoin="round"
//                 stroke-width="${directionIcon.strokeWeight / directionIcon.scale}" 
//                 fill="${directionIcon.fillColor}"/>
//                 </g>
//                 </svg>`,
//             iconSize: [64, 64], // Set the size of your SVG
//             iconAnchor: [32, 32], // Point of the icon corresponding to marker's location
//         });
//         let directionMarker = L.marker([midLat, midLng], {
//             icon: directionMarkerIcon,
//             // zIndex: Panes.AlertMarker,
//         });

//         // Store the marker in the global array
//         allAlertMarkers.push(serviceAlertMarker);
//         allAlertMarkers.push(directionMarker);
//     }
// }

async function fetchAndPlotAlerts() {
    const start = Date.now();

    await loadAlerts();

    // const lastUpdatedDate = new Date(alertsjson.lastUpdated);
    const ts = Math.max(...Object.values(alerts).map(({ timestamp }) => timestamp))
    console.debug('alert timestamp:', ts);
    const lastUpdatedDate = new Date(ts);
    const options = {
        timeZone: 'America/Toronto',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    };

    document.getElementById("subheading").innerHTML = `Last updated: ${lastUpdatedDate.toLocaleString('en-CA', options)} `;
    document.getElementById("loading-modal").style.display = "none"; // Hide loading modal

    // refreshMap(map);
    console.debug('fetchAndPlotAlerts() finished in', Date.now() - start, 'ms');
}

async function initMap() {
    const start = Date.now();

    map = L.map('map', {
        maxBounds: [[43.201, -80.161], [44.182, -78.717]], // Toronto area bounds
        maxBoundsViscosity: 1.0, // Prevents panning outside bounds
        minZoom: 12.5, // Minimum zoom level
        maxZoom: 17, // Maximum zoom level
        zoomSnap: 0,
        zoomDelta: 0.25,
        // renderer: L.svg({ padding: 2 }),
        worldCopyJump: true,
    }).setView([43.669999, -79.390939], 13);
    baseZIndex = 201 // just over default tile pane
    Object.entries(Panes).forEach(([pane, z]) => {
        map.createPane(pane);
        map.getPane(pane).style.zIndex = baseZIndex + z;
    })
    layerTree = new LayerTree(map);

    // connect to pmtiles hosted on cloudflare
    var layer = protomapsL.leafletLayer({
        url: 'https://tiles.ttcmap.ca/toronto.pmtiles',
        flavor: 'light',
    });
    layer.addTo(map);

    console.debug('initMap() finished in', Date.now() - start, 'ms');
}

/**
 * @param {HTMLElement} legend
 * @param {HTMLElement} button
 */
function openLegend(legend, button) {
    legend.className += ' expanded';
    button.innerHTML = '&minus;';
}

/**
 * @param {HTMLElement} legend
 * @param {HTMLElement} button
 */
function closeLegend(legend, button) {
    legend.className = legend.className.replace(' expanded', '');
    button.innerHTML = '+';
}

// // helper for route group toggle buttons
// function toggleRouteGroup(groupName) {
//     return ({ currentTarget }) => {
//         if (layerTree.isRouteGroupVisible(groupName)) {
//             layerTree.hideRouteGroup(groupName);
//             currentTarget.className = currentTarget.className.replace('fa-eye', 'fa-eye-slash');
//         } else {
//             layerTree.showRouteGroup(groupName);
//             currentTarget.className = currentTarget.className.replace('fa-eye-slash', 'fa-eye');
//         }
//     };
// }

// helper for route toggle buttons

function toggleAlertType(type) {
    return ({ currentTarget }) => {
        if (layerTree.isAlertTypeVisible(type)) {
            layerTree.hideAlertType(type);
            currentTarget.className = currentTarget.className.replace(/fa-eye($| )/, 'fa-eye-slash$1');
        } else {
            layerTree.showAlertType(type);
            currentTarget.className = currentTarget.className.replace('fa-eye-slash', 'fa-eye');
        }
    };
}

function toggleRoute(id) {
    return ({ currentTarget }) => {
        if (layerTree.isRouteVisible(id)) {
            layerTree.hideRoute(id);
            currentTarget.className = currentTarget.className.replace(/fa-eye($| )/, 'fa-eye-slash$1');
        } else {
            layerTree.showRoute(id);
            currentTarget.className = currentTarget.className.replace('fa-eye-slash', 'fa-eye');
        }
    };
}

function initLegends() {
    const alertLegend = document.getElementById('alert-legend');
    const alertButton = document.querySelector('#alert-legend-header .legend-button');
    const routeLegend = document.getElementById('route-legend');
    const routeButton = document.querySelector('#route-legend-header .legend-button');
    let activeLegend = null;

    alertButton.addEventListener('click', () => {
        switch (activeLegend) {
            case 'alert':
                closeLegend(alertLegend, alertButton);
                activeLegend = null;
                return;
            case 'route':
                closeLegend(routeLegend, routeButton);
                break;
        }
        openLegend(alertLegend, alertButton);
        activeLegend = 'alert';
    });
    routeButton.addEventListener('click', () => {
        switch (activeLegend) {
            case 'route':
                closeLegend(routeLegend, routeButton);
                activeLegend = null;
                return;
            case 'alert':
                closeLegend(alertLegend, alertButton);
                break;
        }
        openLegend(routeLegend, routeButton);
        activeLegend = 'route';
    });

    Object.entries(alertTypeDisplayInfo).forEach(([key, serviceAlertType]) => {
        const icon = serviceAlertType.icon;
        const name = serviceAlertType.short_name;

        const size = 32;
        const scale = icon.scale;
        let svg = `<svg width="${size}" height="${size}" viewBox="${-size / 2} ${-size / 2} ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
            <g transform="scale(${scale * (size / 48)})">
            <path d="${icon.path}" 
            stroke="${icon.strokeColor}" 
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="${icon.strokeWeight / scale}" 
            fill="${icon.fillColor}"/>
            </g>
            </svg>`;

        const typeDiv = document.createElement("div");
        typeDiv.className = 'legend-content-row';
        typeDiv.innerHTML = `${svg}<p class="alert-type-label">${name}</p>${name !== alertTypeDisplayInfo.Multiple.short_name
                ? `<button class="small-button view-button fa-regular ${layerTree.isAlertTypeVisible(serviceAlertType.short_name) ? 'fa-eye' : 'fa-eye-slash'}"></button>`
                : ''
            }`;
        const button = typeDiv.querySelector('.view-button');
        button && (button.onclick = toggleAlertType(name));
        alertLegend.querySelector('#alert-legend-content').appendChild(typeDiv);
    });

    // hookup route group toggle buttons
    layerTree.addRouteGroupVisibilityButton('subway-lrt', document.querySelector("#subway-lrt-group-header .view-button"));
    layerTree.addRouteGroupVisibilityButton('streetcar', document.querySelector("#streetcar-group-header .view-button"));
    layerTree.addRouteGroupVisibilityButton('bus', document.querySelector("#bus-group-header .view-button"));
    layerTree.addRouteGroupVisibilityButton('blue-night', document.querySelector("#blue-night-group-header .view-button"));

    // hookup route search
    document.getElementById('route-search').oninput = function (event) {
        document.querySelectorAll('.route-legend-group-content')
            .forEach(group => group.innerHTML = '');

        if (!event.target.value) {
            return;
        }

        // for each route, create an entry in the legend with route icon and visibility toggle button
        transit.routes.forEach(({ id, type, short_name, color, text_color }) => {
            if (!short_name.includes(event.target.value)) {
                return;
            }

            // select the right group for this route
            let groupContent;
            switch (type) {
                case 'SubwayLRT':
                    groupContent = document.getElementById('subway-lrt-group-content');
                    break;
                case 'Streetcar':
                    groupContent = /3\d\d/.test(short_name)
                        ? document.getElementById('blue-night-group-content')
                        : document.getElementById('streetcar-group-content');
                    break;
                case 'Bus':
                    groupContent = /3\d\d/.test(short_name)
                        ? document.getElementById('blue-night-group-content')
                        : document.getElementById('bus-group-content');
                    break;
            }

            const icon = (type === 'SubwayLRT')
                ? `<div class="route-icon subway-lrt-icon" style="background-color: ${color}; color: ${text_color};">${short_name}</div>`
                : `<div class="route-icon streetcar-bus-icon" style="background-color: ${color}; color: ${text_color};">${short_name}</div>`;

            const entryDiv = document.createElement("div");
            entryDiv.className = 'legend-content-row';
            entryDiv.innerHTML = `${icon}<button class="small-button view-button fa-regular ${layerTree.isRouteVisible(id) ? 'fa-eye' : 'fa-eye-slash'}"></button>`;
            entryDiv.querySelector('.view-button').onclick = toggleRoute(id);
            groupContent.appendChild(entryDiv);
        });
    };
}

window.onload = function () {

    // When the user clicks on the button, open the modal
    document.getElementById("about-button").onclick = function () {
        document.getElementById("about-modal").style.display = "flex";
    }

    // When the user clicks on <span> (x), close the modal
    document.getElementsByClassName("close")[0].onclick = function () {
        document.getElementById("about-modal").style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        let modal = document.getElementById("about-modal");
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    initMap()
        .then(initLegends)
        .then(loadTransitData)
        .then(fetchAndPlotAlerts);

    // refetch every 5 minutes
    setInterval(fetchAndPlotAlerts, 5 * 60 * 1000);
}
