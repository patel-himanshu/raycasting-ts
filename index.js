"use strict";
const CANVAS_DIMENSIONS = 400;
const CANVAS_BACKGROUND = "#3b3b3b";
const CANVAS_LINES = "#ffffff";
const GRID_ROWS = 10;
const GRID_COLUMNS = 10;
const gameCanvas = document.getElementById("game");
if (gameCanvas === null) {
    throw new Error("No canvas with id 'game' was found");
}
gameCanvas.width = CANVAS_DIMENSIONS;
gameCanvas.height = CANVAS_DIMENSIONS;
// console.log({ gameCanvas });
const context = gameCanvas.getContext("2d");
if (context === null) {
    throw new Error("2D context is not supported in this browser");
}
context.fillStyle = CANVAS_BACKGROUND;
context.fillRect(0, 0, context.canvas.width, context.canvas.height);
context.strokeStyle = CANVAS_LINES;
// console.log({ context });
const cell_width = context.canvas.width / GRID_COLUMNS;
const cell_height = context.canvas.height / GRID_ROWS;
for (let x = 0; x <= GRID_COLUMNS; x++) {
    context.moveTo(x * cell_width, 0);
    context.lineTo(x * cell_width, context.canvas.height);
    // context.stroke();
}
for (let y = 0; y <= GRID_ROWS; y++) {
    context.moveTo(0, y * cell_height);
    context.lineTo(context.canvas.width, y * cell_height);
    // context.stroke();
}
context.stroke();
