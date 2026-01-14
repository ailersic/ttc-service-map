const iconScale = 2;

const cross = {
    path: "M 0,0 m -8,0 a 8,8 0 1,0 16,0 a 8,8 0 1,0 -16,0 M 5.65,5.65 L -5.65,-5.65 M 5.65,-5.65 L -5.65,5.65",
    strokeColor: "rgb(255, 75, 75)",
    strokeWeight: 4,
    strokeOpacity: 1,
    fillColor: "#ffffff",
    fillOpacity: 1,
    scale: iconScale
};

const noentry = {
    path: "M 0,0 m -8,0 a 8,8 0 1,0 16,0 a 8,8 0 1,0 -16,0 M 5.65,5.65 L -5.65,-5.65",
    strokeColor: "rgb(100, 100, 255)",
    strokeWeight: 4,
    strokeOpacity: 1,
    fillColor: "#ffffff",
    fillOpacity: 1,
    scale: iconScale
};

const check = {
    path: "M 0,0 m -8,0 a 8,8 0 1,0 16,0 a 8,8 0 1,0 -16,0 M -1,4 L -4,1 M 4,-3 L -1,4",
    strokeColor: "rgb(0, 158, 0)",
    strokeWeight: 4,
    strokeOpacity: 1,
    fillColor: "#ffffff",
    fillOpacity: 1,
    scale: iconScale
};

const clock = {
    path: "M 0,0 m -8,0 a 8,8 0 1,0 16,0 a 8,8 0 1,0 -16,0 M 0,0 L 0,-5 M 0,0 L 2,3",
    strokeColor: "rgb(100, 100, 255)",
    strokeWeight: 4,
    strokeOpacity: 1,
    fillColor: "#ffffff",
    fillOpacity: 1,
    scale: iconScale
};

const exclamation = {
    path: "M 0,0 m -8,0 a 8,8 0 1,0 16,0 a 8,8 0 1,0 -16,0 M 0,1 L 0,-4.5 M 0,4.5 L 0,4.6",
    strokeColor: "rgb(200, 100, 0)",
    strokeWeight: 4,
    strokeOpacity: 1,
    fillColor: "#ffffff",
    fillOpacity: 1,
    scale: iconScale
};

const multiple = {
    path: "M 0 0 m -8 0 a 8 8 0 1 0 16 0 a 8 8 0 1 0 -16 0 M -3.5 0.5 L -3.5 -3.5 M -3.5 3.5 L -3.5 3.6 M 0 0.5 L 0 -3.5 M 0 3.5 L 0 3.6 M 3.5 0.5 L 3.5 -3.5 M 3.5 3.5 L 3.5 3.6",
    strokeColor: "rgb(255, 75, 75)",
    strokeWeight: 4,
    strokeOpacity: 1,
    fillColor: "#ffffff",
    fillOpacity: 1,
    scale: iconScale
};

const snail = {
    path: "M 10 8 L -1 8 A 7 7 0 0 1 -8 1 L -8 -8 L -8 -5 A 2 2 0 0 0 -4 -5 L -4 -8 L -4 0 A 4 4 0 0 0 0 4 L 3 4 L 0 4 A 4 4 0 0 1 -4 0 L -4 -1 A 7 7 0 0 1 3 -8 A 6 6 0 0 1 9 -2 A 6 6 0 0 1 3 4 A 7 4 0 0 1 10 8 M 3 0 A 2 2 0 0 0 5 -2 A 2 2 0 0 0 3 -4 A 3 3 0 0 0 0 -1 L 0 1 A 3 3 0 0 0 3 4 A 3 3 0 0 1 0 1 L 0 -1 A 3 3 0 0 1 3 -4 A 2 2 0 0 1 5 -2 A 2 2 0 0 1 3 0",
    strokeColor: "rgb(200, 100, 0)",
    strokeWeight: 4,
    strokeOpacity: 1,
    fillColor: "#ffffff",
    fillOpacity: 1,
    scale: iconScale
}

const stopwatch = {
    path: "M 0,0 m -8,0 a 8,8 0 1,0 16,0 a 8,8 0 1,0 -16,0 M 0,0 L 0,-5 M 0,0 L 2,3 M 0,-8 L 0,-11 L -3,-11 L 3,-11 L 0,-11",
    strokeColor: "rgb(200, 100, 0)",
    strokeWeight: 4,
    strokeOpacity: 1,
    fillColor: "#ffffff",
    fillOpacity: 1,
    scale: iconScale
};

const accessibility = {
    path: "M -8 -6 L -8 6 A 2 2 0 0 0 -6 8 L 6 8 A 2 2 0 0 0 8 6 L 8 -6 A 2 2 0 0 0 6 -8 L -6 -8 A 2 2 0 0 0 -8 -6 M -1 -4 A 0.75 0.75 0 0 0 -1 -5.5 A 0.75 0.75 0 0 0 -1 -4 L 0 1 L 3 1 L 4 5 L 3 1 L 0 1 L -0.6 -2 L 3 -2 L -0.6 -2 L -1 -4 A 0.75 0.75 0 0 0 -1 -5.5 A 0.75 0.75 0 0 0 -1 -4 M -2.6 -1.3 A 3.5 3.5 0 0 0 1.6 4.3 A 3.5 3.5 0 0 1 -2.6 -1.3",
    strokeColor: "rgb(255, 75, 75)",
    strokeWeight: 4,
    strokeOpacity: 1,
    fillColor: "#ffffff",
    fillOpacity: 1,
    scale: iconScale
};

const forwardarrow = {
    path: "M 0 -11 L 3 -11 L 0 -14 L -3 -11 L 0 -11",
    strokeWeight: 4,
    strokeOpacity: 1,
    fillOpacity: 1,
    scale: iconScale
};

const reversearrow = {
    path: "M 0 11 L 3 11 L 0 14 L -3 11 L 0 11",
    strokeWeight: 4,
    strokeOpacity: 1,
    fillOpacity: 1,
    scale: iconScale
};

const bothwaysarrow = {
    path: "",
    strokeWeight: 4,
    strokeOpacity: 1,
    fillOpacity: 1,
    scale: iconScale
};