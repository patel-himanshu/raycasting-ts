import {
	CANVAS_DIMENSIONS,
	CANVAS_BACKGROUND,
	GRID_ROWS,
	GRID_COLUMNS,
	POINT_RADIUS,
	LINE_WIDTH,
} from "./constants";
import {
	createCircle,
	createLine,
	getCanvasSize,
	hittingCellCorner,
	rayStep,
	Vector2D,
} from "./helpers";

function renderGrid(
	context: CanvasRenderingContext2D,
	point1: Vector2D,
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
		for (;;) {
			createCircle(context, point2, POINT_RADIUS, "orange");
			createLine(context, point1, point2, LINE_WIDTH, "orange");

			const cell = hittingCellCorner(point1, point2);

			// Check if the cell hitting the ray is out of the grid
			if (
				cell.x < 0 ||
				cell.x >= GRID_SIZE.x ||
				cell.y < 0 ||
				cell.y >= GRID_SIZE.y
			) {
				break;
			}

			const point3 = rayStep(point1, point2);

			point1 = point2;
			point2 = point3;
		}
	}
}

const gameCanvas = document.getElementById("game") as HTMLCanvasElement | null;

if (gameCanvas === null) throw new Error("No canvas with id 'game' was found");

gameCanvas.width = CANVAS_DIMENSIONS;
gameCanvas.height = CANVAS_DIMENSIONS;

const context = gameCanvas.getContext("2d");
if (context === null) throw new Error("Browser doesn't support 2D context");

const GRID_SIZE = getCanvasSize(context);

// const point1 = new Vector2D(4.5, 5);
const point1 = new Vector2D(GRID_COLUMNS * 0.45, GRID_ROWS * 0.5);
let point2: Vector2D | undefined = undefined;

gameCanvas.addEventListener("mousemove", (event) => {
	point2 = new Vector2D(event.offsetX, event.offsetY)
		.divide(GRID_SIZE)
		.multiply(new Vector2D(GRID_COLUMNS, GRID_ROWS));

	renderGrid(context, point1, point2);
});

renderGrid(context, point1, point2); // Necessary for first render, when point2 is undefined
