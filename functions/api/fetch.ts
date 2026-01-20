import { PagesFunction, Response } from '@cloudflare/workers-types';
import Logger from '../../utils/Logger.ts';

// API endpoint
export const onRequestGet: PagesFunction = async (context) => {
    try {
        const alerts: any[] = [];

        const liveAlertResponse = await fetch('https://alerts.ttc.ca/api/alerts/live-alerts');
        const jsonData = await liveAlertResponse.json();
        // const jsonData = require(path.join(__dirname, '..', 'local-test-alerts.json')); // For testing with local file
        // Logger.info('Fetched test alerts data.');
        Logger.info(`Found ${jsonData.routes.length} route alerts, ${jsonData.accessibility.length} accessibility alerts.`);

        // Select each alert item
        jsonData.routes.forEach((route: any) => {
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
                Logger.info("Skipping route alert with no description.");
                return;
            }

            if (route.routeType == "Subway") {
                if (route.route == "1") {lineIdx = 0;}
                else if (route.route == "2") {lineIdx = 1;}
                else if (route.route == "4") {lineIdx = 3;}
                else if (route.route == "6") {lineIdx = 4;}
                else {
                    if (description.includes("Line 1")) { lineIdx = 0; }
                    else if (description.includes("Line 2")) { lineIdx = 1; }
                    else if (description.includes("Line 4")) { lineIdx = 3; }
                    else if (description.includes("Line 6")) { lineIdx = 4; }
                }
            }
            else if (route.routeType == "LRT") {
                if (route.route == "6") {lineIdx = 4;}
                else {
                    if (description.includes("Line 6")) { lineIdx = 4; }
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

        jsonData.accessibility.forEach((access: any) => {
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
                Logger.info("Skipping accessibility alert with no title or description.");
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

        Logger.info(`Scraping complete. Found ${alerts.length} relevant alerts.`);
        return new global.Response(JSON.stringify({ 
            alerts, 
            lastUpdated: jsonData.lastUpdated 
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET'
            }
        }) as unknown as Response;
      
    } catch (error) {
        console.error('Scraping error:', error);
        return new global.Response(JSON.stringify({
            error: 'Scraping error'
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET'
            }
        }) as unknown as Response;
    }
}
