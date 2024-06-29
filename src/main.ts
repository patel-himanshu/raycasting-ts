import {
	createCircle,
	createLine,
	createRectangle,
	getCanvasSize,
} from "./canvas";
import {
	CANVAS_DIMENSIONS,
	CANVAS_BACKGROUND,
	POINT_RADIUS,
	LINE_WIDTH,
} from "./constants";
import { hittingCellCorner, rayStep } from "./helpers";
import { Scene, Vector2D } from "./models";

function sceneSize(scene: Scene): Vector2D {
	const rows = scene.length;
	const columns = scene.reduce((maxColumns, row) => {
		return Math.max(maxColumns, row.length);
	}, 0);
	return new Vector2D(columns, rows);
}

function renderGrid(
	context: CanvasRenderingContext2D,
	scene: Scene,
	point1: Vector2D,
	point2: Vector2D | undefined,
	position: Vector2D,
	minimapSize: Vector2D
) {
	context.reset();

	context.fillStyle = CANVAS_BACKGROUND;
	context.fillRect(0, 0, context.canvas.width, context.canvas.height);

	const gridSize = sceneSize(scene);
	const [gridColumns, gridRows] = [gridSize.x, gridSize.y];

	const cellSize = minimapSize.divide(gridSize);
	const [cellWidth, cellHeight] = [cellSize.x, cellSize.y];
	context.scale(cellWidth, cellHeight);
	context.translate(position.x, position.y);

	// Origin is the top-left corner of the grid
	// Left to right is the movement in the positive x-axis
	// Top to bottom is the movement in the positive y-axis
	for (let y = 0; y < gridRows; y++) {
		for (let x = 0; x < gridColumns; x++) {
			if (scene[y][x] !== 0) {
				createRectangle(context, x, y, 1, 1, "grey");
			}
		}
	}

	// Plotting the vertical grid lines
	for (let x = 0; x <= gridColumns; x++) {
		createLine(context, new Vector2D(x, 0), new Vector2D(x, gridRows));
	}

	// Plotting the horizontal grid lines
	for (let y = 0; y <= gridRows; y++) {
		createLine(context, new Vector2D(0, y), new Vector2D(gridColumns, y));
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
				cell.x >= gridSize.x ||
				cell.y < 0 ||
				cell.y >= gridSize.y ||
				scene[cell.y][cell.x] !== 0
			) {
				break;
			}

			const point3 = rayStep(point1, point2);

			point1 = point2;
			point2 = point3;
		}
	}
}

(() => {
	const gameCanvas = document.getElementById(
		"game"
	) as HTMLCanvasElement | null;

	if (gameCanvas === null)
		throw new Error("No canvas with id 'game' was found");

	gameCanvas.width = CANVAS_DIMENSIONS;
	gameCanvas.height = CANVAS_DIMENSIONS;

	const context = gameCanvas.getContext("2d");
	if (context === null) throw new Error("Browser doesn't support 2D context");

	const canvasSize = getCanvasSize(context);

	const scene: Scene = [
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 1, 1, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 1, 1, 0],
		[0, 0, 0, 0, 0, 0, 1, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 1, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
	];

	const point1 = new Vector2D(0.45, 0.5).multiply(sceneSize(scene));

	let point2: Vector2D | undefined = undefined;

	gameCanvas.addEventListener("mousemove", (event) => {
		point2 = new Vector2D(event.offsetX, event.offsetY)
			.divide(canvasSize)
			.multiply(sceneSize(scene));

		renderGrid(context, scene, point1, point2, new Vector2D(), canvasSize);
	});

	// Necessary for first render, when point2 is undefined
	renderGrid(context, scene, point1, point2, new Vector2D(), canvasSize);
})();
