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
	SCREEN_WIDTH,
	PLAYER_STEP_LENGTH,
} from "./constants";
import {
	castRay,
	getSceneSize,
	hittingCellCorner,
	isPointInsideScene,
} from "./helpers";
import { Player, Scene, Vector2D } from "./models";

function renderPlayerPerspective(
	context: CanvasRenderingContext2D,
	scene: Scene,
	player: Player
) {
	const stripWidth = Math.ceil(context.canvas.width / SCREEN_WIDTH);
	const [rangeStart, rangeEnd] = player.fovRange();

	for (let x = 0; x < SCREEN_WIDTH; x++) {
		const point = castRay(
			scene,
			player.position,
			rangeStart.lerp(rangeEnd, x / SCREEN_WIDTH)
		);
		const cell = hittingCellCorner(player.position, point);

		if (isPointInsideScene(scene, cell)) {
			const color = scene[cell.y][cell.x];

			if (color !== null) {
				const vector = point.subtract(player.position);
				const directionVector = Vector2D.angle(player.direction);
				const stripHeight =
					context.canvas.height / vector.dotProduct(directionVector);

				createRectangle(
					context,
					x * stripWidth,
					(context.canvas.height - stripHeight) * 0.5,
					stripWidth,
					stripHeight,
					color
				);
			}
		}
	}
}

function renderMinimap(
	context: CanvasRenderingContext2D,
	scene: Scene,
	player: Player,
	offset: Vector2D,
	size: Vector2D
) {
	context.save();

	const gridSize = getSceneSize(scene);
	const [gridColumns, gridRows] = [gridSize.x, gridSize.y];

	const cellSize = size.divide(gridSize);
	const [cellWidth, cellHeight] = [cellSize.x, cellSize.y];
	context.translate(offset.x, offset.y);
	context.scale(cellWidth, cellHeight);

	createRectangle(context, 0, 0, gridSize.x, gridSize.y, CANVAS_BACKGROUND);

	// Origin is the top-left corner of the grid
	// Left to right is the movement in the positive x-axis
	// Top to bottom is the movement in the positive y-axis
	for (let y = 0; y < gridRows; y++) {
		for (let x = 0; x < gridColumns; x++) {
			const color = scene[y][x];
			if (color !== null) {
				createRectangle(context, x, y, 1, 1, color);
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

	const [p1, p2] = player.fovRange();
	createLine(context, player.position, p1, LINE_WIDTH, "red");
	createLine(context, player.position, p2, LINE_WIDTH, "red");
	createLine(context, p1, p2, LINE_WIDTH, "red");

	context.restore();
}

function renderGame(
	context: CanvasRenderingContext2D,
	scene: Scene,
	player: Player,
	minimapOffset: Vector2D,
	minimapSize: Vector2D
): void {
	context.fillStyle = CANVAS_BACKGROUND;
	context.fillRect(0, 0, context.canvas.width, context.canvas.height);
	renderPlayerPerspective(context, scene, player);
	renderMinimap(context, scene, player, minimapOffset, minimapSize);
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
		[null, null, null, null, null, null, null, null, null, null],
		[null, "red", "red", null, null, null, null, null, null, null],
		[null, null, null, null, null, "orange", "white", null, null, null],
		[null, null, null, null, null, null, "blue", null, null, null],
		[null, null, null, null, null, null, null, null, null, null],
		[null, "yellow", null, null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, null, null, null],
		[null, null, null, null, null, null, null, null, null, null],
	];
	const sceneSize = getSceneSize(scene);

	const canvasSize = getCanvasSize(context);
	const minimapOffset = new Vector2D().add(canvasSize).scale(0.025);
	const minimapSize = sceneSize.scale(context.canvas.width * 0.04);

	const player = new Player(
		new Vector2D(0.45, 0.5).multiply(sceneSize),
		Math.PI * 1.25
	);

	window.addEventListener("keydown", (event) => {
		switch (event.code) {
			case "KeyW": {
				const movement = Vector2D.angle(player.direction).scale(
					PLAYER_STEP_LENGTH
				);
				player.position = player.position.add(movement);
				renderGame(context, scene, player, minimapOffset, minimapSize);
				break;
			}
			case "KeyS": {
				const movement = Vector2D.angle(player.direction).scale(
					PLAYER_STEP_LENGTH
				);
				player.position = player.position.subtract(movement);
				renderGame(context, scene, player, minimapOffset, minimapSize);
				break;
			}
			case "KeyA": {
				player.direction -= Math.PI * 0.05;
				renderGame(context, scene, player, minimapOffset, minimapSize);
				break;
			}
			case "KeyD": {
				player.direction += Math.PI * 0.05;
				renderGame(context, scene, player, minimapOffset, minimapSize);
				break;
			}
		}
	});

	// Necessary for the first render
	renderGame(context, scene, player, minimapOffset, minimapSize);
})();
