import {
	createCircle,
	createLine,
	createRectangle,
	getCanvasSize,
} from "./canvas";
import {
	CANVAS_BACKGROUND,
	POINT_RADIUS,
	LINE_WIDTH,
	NEAR_CLIPPING_PLANE,
	FOV,
} from "./constants";
import { Player, Scene, Vector2D } from "./models";

function getSceneSize(scene: Scene): Vector2D {
	const rows = scene.length;
	const columns = scene.reduce((maxColumns, row) => {
		return Math.max(maxColumns, row.length);
	}, 0);
	return new Vector2D(columns, rows);
}

function renderMinimap(
	context: CanvasRenderingContext2D,
	scene: Scene,
	player: Player,
	offset: Vector2D,
	size: Vector2D
) {
	context.save();

	context.fillStyle = CANVAS_BACKGROUND;
	context.fillRect(0, 0, context.canvas.width, context.canvas.height);

	const gridSize = getSceneSize(scene);
	const [gridColumns, gridRows] = [gridSize.x, gridSize.y];

	const cellSize = size.divide(gridSize);
	const [cellWidth, cellHeight] = [cellSize.x, cellSize.y];
	context.translate(offset.x, offset.y);
	context.scale(cellWidth, cellHeight);

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

	createCircle(context, player.position, POINT_RADIUS, "orange");

	const perpendicularDistance = NEAR_CLIPPING_PLANE * Math.tan(FOV * 0.5);
	const p = player.position.add(
		Vector2D.angle(player.direction).scale(NEAR_CLIPPING_PLANE)
	);

	const p1 = p.add(
		p
			.subtract(player.position)
			.rotate90()
			.normalize()
			.scale(perpendicularDistance)
	);
	const p2 = p.subtract(
		p
			.subtract(player.position)
			.rotate90()
			.normalize()
			.scale(perpendicularDistance)
	);

	createLine(context, player.position, p, LINE_WIDTH, "blue");
	createLine(context, p, p1, LINE_WIDTH, "red");
	createLine(context, player.position, p1, LINE_WIDTH, "red");
	createLine(context, p, p2, LINE_WIDTH, "red");
	createLine(context, player.position, p2, LINE_WIDTH, "red");

	context.restore();
}

(() => {
	const gameCanvas = document.getElementById(
		"game"
	) as HTMLCanvasElement | null;

	if (gameCanvas === null) {
		throw new Error("No canvas with ID 'game' was found");
	}

	const CANVAS_SIZE_FACTOR = 120;
	gameCanvas.width = 4 * CANVAS_SIZE_FACTOR;
	gameCanvas.height = 3 * CANVAS_SIZE_FACTOR;

	const context = gameCanvas.getContext("2d");
	if (context === null) throw new Error("Browser doesn't support 2D context");

	const scene: Scene = [
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	];
	const sceneSize = getSceneSize(scene);

	const player = new Player(
		new Vector2D(0.45, 0.5).multiply(sceneSize),
		Math.PI * 1.25
	);

	const canvasSize = getCanvasSize(context);
	const minimapOffset = new Vector2D().add(canvasSize).scale(0.025);
	const minimapSize = sceneSize.scale(context.canvas.width * 0.09);

	renderMinimap(context, scene, player, minimapOffset, minimapSize);
})();
