import {
	createCircle,
	createLine,
	getCanvasSize,
	rayStep,
	Vector2D,
} from "./helpers";

const CANVAS_DIMENSIONS = 400;
const CANVAS_BACKGROUND = "#3b3b3b";
const GRID_ROWS = 10;
const GRID_COLUMNS = 10;
const POINT_RADIUS = 0.2;

function renderGrid(
	context: CanvasRenderingContext2D,
	point2: Vector2D | undefined
) {
	context.reset();

	context.fillStyle = CANVAS_BACKGROUND;
	context.fillRect(0, 0, context.canvas.width, context.canvas.height);

	const cell_width = context.canvas.width / GRID_COLUMNS;
	const cell_height = context.canvas.height / GRID_ROWS;
	context.scale(cell_width, cell_height);

	// Plotting the vertical grid lines
	for (let x = 0; x <= GRID_COLUMNS; x++) {
		createLine(context, new Vector2D(x, 0), new Vector2D(x, GRID_ROWS));
	}

	// Plotting the horizontal grid lines
	for (let y = 0; y <= GRID_ROWS; y++) {
		createLine(context, new Vector2D(0, y), new Vector2D(GRID_COLUMNS, y));
	}

	createCircle(context, point1, POINT_RADIUS, "orange");

	if (point2 !== undefined) {
		createCircle(context, point2, POINT_RADIUS, "orange");
		createLine(context, point1, point2, 0.1, "orange");

		const point3 = rayStep(point1, point2);
		createCircle(context, point3, POINT_RADIUS, "lightgreen");
		createLine(context, point2, point3, 0.1, "lightgreen");
	}
}

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

const point1 = new Vector2D(4.5, 1.5);
// const point1 = new Vector2D(GRID_COLUMNS * 0.93, GRID_ROWS * 0.55);
let point2: Vector2D | undefined = undefined;

gameCanvas.addEventListener("mousemove", (event) => {
	point2 = new Vector2D(event.offsetX, event.offsetY)
		.divide(getCanvasSize(context))
		.multiply(new Vector2D(GRID_COLUMNS, GRID_ROWS));

	renderGrid(context, point2);
});

renderGrid(context, point2); // Necessary for first render, when point2 is undefined
