import express from 'express';
// import path from 'path';
import TtcApi from '../models/TtcApi.ts';

const app = express();
const PORT = 3000;

const ttcApi = new TtcApi();
await ttcApi.loadGtfs();
// await ttcApi.regenerateStations();

// Serve static files
app.use(express.static('.'));

// API endpoint
app.get('/api/fetch', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    try {
        const alerts = [];

        const liveAlertResponse = await fetch('https://alerts.ttc.ca/api/alerts/live-alerts');
        const jsonData = await liveAlertResponse.json();
        console.log(`Found ${jsonData.routes.length} route alerts, ${jsonData.accessibility.length} accessibility alerts.`);

        /*const slowZoneResponse = await fetch('https://www.ttc.ca/riding-the-ttc/Updates/Reduced-Speed-Zones');
        const slowZoneText = await slowZoneResponse.text();
        const slowZoneTables = slowZoneText.match(/<table[\s\S]*?<\/table>/g) || [];
        console.log(`Found ${slowZoneTables.length} slow zone tables.`);
        
        // Process slow zone tables
        for (let i = 0; i < slowZoneTables.length; i++) {
            const table = slowZoneTables[i];
            const rows = table.match(/<tr[\s\S]*?<\/tr>/g) || [];
            for (let j = 1; j < rows.length; j++) { // Skip the header row
                const row = rows[j];
                const cells = row.match(/<td[\s\S]*?<\/td>/g) || [];
                const descCell = cells[0] || '';
                const causeCell = cells[6] || '';
                const trimmedDesc = descCell.replace(/<\/?td[^>]*>/g, '').trim().replace(/\&nbsp;/g, '').replace(' (x2)', '');
                const trimmedCause = causeCell.replace(/<\/?td[^>]*>/g, '').trim();

                let stopStart = trimmedDesc.split(' to ')[0].trim();
                const firstSpaceIndex = stopStart.indexOf(' ');
                stopStart = stopStart.substring(firstSpaceIndex + 1).trim();
                const stopEnd = trimmedDesc.split(' to ')[1].trim();

                const description = 'Reduced speed ' +
                                    trimmedDesc.charAt(0).toLowerCase() +
                                    trimmedDesc.slice(1) +
                                    ' due to ' +
                                    trimmedCause.toLowerCase();
                console.log(`Slow zone alert found: ${description}`);

                let lineIdx = -1;
                if (i == 0 || i == 1) {lineIdx = 0;} // Line 1
                else if (i == 2 || i == 3) {lineIdx = 1;} // Line 2

                alerts.push({
                    lineIdx: lineIdx, // Assuming each table corresponds to a line index
                    startStation: stopStart,
                    endStation: stopEnd,
                    effectDesc: "Delays",
                    description: description,
                });
            }
        }*/

        // Select each alert item
        jsonData.routes.forEach(route => {
            let lineIdx = -1;
            let description = "";

            // if route.headerText is not null, use it
            if (route.headerText) {
                if (route.headerText.includes(": "))
                    description = route.headerText.split(": ")[1];
                else
                    description = route.headerText;
            }
            // if route.title is null and route.description is not null, use route.description
            else if (!route.title && route.description) {
                description = route.description;
            }
            // if route.description is null and route.title is not null, use route.title
            else if (!route.description && route.title) {
                description = route.title;
            }
            // if both are not null, use the longer one
            else if (route.title && route.description) {
                if (route.description.length > route.title.length)
                    description = route.description;
                else
                    description = route.title;
            }
            // if everything is null, skip this route
            else {
                console.log("Skipping route alert with no description.");
                return;
            }

            if (route.routeType == "Subway") {
                if (route.route == "1") { lineIdx = 0; }
                else if (route.route == "2") { lineIdx = 1; }
                else if (route.route == "4") { lineIdx = 3; }
                else {
                    if (description.includes("Line 1")) { lineIdx = 0; }
                    else if (description.includes("Line 2")) { lineIdx = 1; }
                    else if (description.includes("Line 4")) { lineIdx = 3; }
                }
            }

            else if (route.routeType == "Streetcar") { return; }
            else if (route.routeType == "Bus") { return; }

            alerts.push({
                lineIdx: lineIdx,
                startStation: route.stopStart,
                endStation: route.stopEnd,
                effectDesc: route.effectDesc,
                description: description,
            });
        });

        jsonData.accessibility.forEach(access => {
            let lineIdx = -1;

            // if access.title is null and access.description is not null, use access.description
            if (!access.title && access.description) {
                access.title = access.description;
            }
            // if access.description is null and access.title is not null, use access.title
            else if (!access.description && access.title) {
                access.description = access.title;
            }
            // if both are null, skip this accessibility alert
            else if (!access.title && !access.description) {
                console.log("Skipping accessibility alert with no title or description.");
                return;
            }

            let description = access.title;
            if (access.description.length > access.title.length) {
                description = access.description;
            }

            if (access.routeType == "Elevator") {
                if (access.route.split(",").includes("1")) { lineIdx = 0; }
                else if (access.route.split(",").includes("2")) { lineIdx = 1; }
                else if (access.route.split(",").includes("4")) { lineIdx = 3; }
            }

            else if (access.routeType == "Escalator") { return; }

            let station = access.headerText.split(":")[0].trim();

            alerts.push({
                lineIdx: lineIdx,
                startStation: station,
                endStation: station,
                effectDesc: "Elevator alert",
                description: description,
            });
        });

        console.log(`Scraping complete. Found ${alerts.length} relevant alerts.`);
        res.json({ alerts, lastUpdated: jsonData.lastUpdated });

    } catch (error) {
        console.error('Scraping error:', error);
        res.status(500).json({
            error: 'Failed to fetch data',
            alerts: []
        });
    }
});

app.get('/api/subway/routes', async (req, res) => {
    const start = Date.now();
    res.json(await ttcApi.getSubwayRoutes());
    console.log('/api/subway/routes:', Date.now() - start, 'ms');
});

app.get('/api/subway/stations', async (req, res) => {
    const start = Date.now();
    res.json(await ttcApi.getSubwayStations());
    console.log('/api/subway/stations:', Date.now() - start, 'ms');
});

app.get('/api/subway/platforms', async (req, res) => {
    const start = Date.now();
    res.json(await ttcApi.getSubwayPlatforms());
    console.log('/api/subway/platforms:', Date.now() - start, 'ms');
});

app.get('/api/streetcar/routes', async (req, res) => {
    // TODO
});

app.get('/api/streetcar/platforms', async (req, res) => {
    // TODO
});

app.get('/api/alerts', async (req, res) => {
    const start = Date.now();
    res.json(await ttcApi.getAlerts());
    console.log('/api/alerts:', Date.now() - start, 'ms');
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

// module.exports = app; // Export the app for testing purposes