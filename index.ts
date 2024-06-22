const CANVAS_DIMENSIONS = 400;
const CANVAS_BACKGROUND = "#3b3b3b";
const CANVAS_LINES = "#ffffff";

const GRID_ROWS = 10;
const GRID_COLUMNS = 10;

const gameCanvas = document.getElementById("game") as HTMLCanvasElement | null;

if (gameCanvas === null) {
	throw new Error("No canvas with id 'game' was found");
}

gameCanvas.width = CANVAS_DIMENSIONS;
gameCanvas.height = CANVAS_DIMENSIONS;

const context = gameCanvas.getContext("2d");
if (context === null) {
	throw new Error("2D context is not supported in this browser");
}

context.fillStyle = CANVAS_BACKGROUND;
context.fillRect(0, 0, context.canvas.width, context.canvas.height);
context.strokeStyle = CANVAS_LINES;
context.lineWidth = 0.02;

const cell_width = context.canvas.width / GRID_COLUMNS;
const cell_height = context.canvas.height / GRID_ROWS;
context.scale(cell_width, cell_height);

// Plotting the vertical grid lines
for (let x = 0; x <= GRID_COLUMNS; x++) {
	context.moveTo(x, 0);
	context.lineTo(x, GRID_ROWS);
}

// Plotting the horizontal grid lines
for (let y = 0; y <= GRID_ROWS; y++) {
	context.moveTo(0, y);
	context.lineTo(GRID_COLUMNS, y);
}

context.stroke();
