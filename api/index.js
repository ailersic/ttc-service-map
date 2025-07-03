const express = require('express');
const path = require('path');
const app = express();
//const PORT = 3000;

// Serve static files
app.use(express.static('.'));

// API endpoint
app.get('/api/fetch', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    
    try {
        const response = await fetch('https://alerts.ttc.ca/api/alerts/live-alerts');
        const jsonData = await response.json();
        const alerts = [];

        // Select each alert item
        console.log(`Found ${jsonData.routes.length} alerts.`);
        jsonData.routes.forEach(route => {
            let lineIdx = -1;

            let description = route.title;
            if (route.description.length > route.title.length) {
                description = route.description;
            }

            if (route.routeType == "Subway") {
                if (route.route == "1") {lineIdx = 0;}
                else if (route.route == "2") {lineIdx = 1;}
                else if (route.route == "4") {lineIdx = 3;}
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

//app.listen(PORT, () => {
//    console.log(`Server running at http://localhost:${PORT}`);
//});

module.exports = app; // Export the app for testing purposes