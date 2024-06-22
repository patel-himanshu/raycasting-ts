const CANVAS_DIMENSIONS = 400;
const CANVAS_BACKGROUND = "#3b3b3b";

const GRID_ROWS = 10;
const GRID_COLUMNS = 10;

const gameCanvas = document.getElementById("game") as HTMLCanvasElement | null;

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
// console.log({ context });
