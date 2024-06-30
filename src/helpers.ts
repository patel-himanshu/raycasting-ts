import { EPSILON } from "./constants";
import { Scene, Vector2D } from "./models";

export function getSceneSize(scene: Scene): Vector2D {
	const rows = scene.length;
	const columns = scene.reduce((maxColumns, row) => {
		return Math.max(maxColumns, row.length);
	}, 0);
	return new Vector2D(columns, rows);
}

export function isPointInsideScene(scene: Scene, point: Vector2D): boolean {
	const sceneSize = getSceneSize(scene);
	return (
		0 <= point.x &&
		point.x < sceneSize.x &&
		0 <= point.y &&
		point.y < sceneSize.y
	);
}

/**
 * Snaps the given component of the "Vector2D" object to the closest point on the grid's cell boundaries.
 * If the component is already on the grid, it is returned as it is.
 *
 * @param {number} component - The component of the "Vector2D" object to snap.
 * @param {number} deltaComponent - The direction of the component of the "Vector2D" object.
 * @return {number} The snapped component.
 */
function snap(component: number, deltaComponent: number): number {
	const smallDeviation = Math.sign(deltaComponent) * EPSILON;

	if (deltaComponent > 0) {
		return Math.ceil(component + smallDeviation);
	} else if (deltaComponent < 0) {
		return Math.floor(component + smallDeviation);
	} else {
		return component;
	}
}

/**
 * Calculates the coordinate of 1 of the cell's 4 corners, in which the ray currently resides.
 *
 * @param {Vector2D} point1 - The starting point of the line segment.
 * @param {Vector2D} point2 - The ending point of the line segment.
 * @return {Vector2D} 1 of the corner coordinate of the cell in which the ray resides or touches.
 */
export function hittingCellCorner(
	point1: Vector2D,
	point2: Vector2D
): Vector2D {
	const delta = point2.subtract(point1);
	const x = Math.floor(point2.x + Math.sign(delta.x) * EPSILON);
	const y = Math.floor(point2.y + Math.sign(delta.y) * EPSILON);
	return new Vector2D(x, y);
}

/**
 * Calculates the point on the grid's cell boundaries that is closest to the line connecting
 * the given points. The function uses linear algebra to find the slope and intercept of the line,
 * and then calculates the closest point on the vertical and horizontal cell boundaries.
 *
 * @param {Vector2D} point1 - The first point on the line.
 * @param {Vector2D} point2 - The second point on the line.
 * @return {Vector2D} The point on the grid's cell boundaries that is closest to the line.
 */
export function rayStep(point1: Vector2D, point2: Vector2D): Vector2D {
	let point3 = point2;

	// Linear equation: y = mx + c (where "m" = slope & "c" = intercept)
	const delta = point2.subtract(point1);

	if (delta.x === 0) {
		// delta.x = 0 means slope is undefined
		// Line is of the form: x = c (Line parallel to y-axis)
		const y3 = snap(point2.y, delta.y);
		const x3 = point2.x;
		point3 = new Vector2D(x3, y3);
	} else {
		const slope = delta.y / delta.x; // m = dy/dx
		const intercept = point1.y - slope * point1.x; // c = y - mx

		// Finding the closest point on the grid's vertical cell boundary,
		// which also lies on the line connecting "point1" and "point2"
		const x3 = snap(point2.x, delta.x);
		const y3 = slope * x3 + intercept;
		point3 = new Vector2D(x3, y3);

		// If slope != 0, then the line is not of the form: y = c (Line parallel to x-axis)
		if (slope !== 0) {
			// Finding the closest point on the grid's horizontal cell boundary,
			// which also lies on the line connecting "point1" and "point2"
			const y4 = snap(point2.y, delta.y);
			const x4 = (y4 - intercept) / slope;
			const point4 = new Vector2D(x4, y4);

			if (point2.distanceTo(point3) > point2.distanceTo(point4)) {
				point3 = point4;
			}
		}
	}

	return point3;
}

export function castRay(
	scene: Scene,
	point1: Vector2D,
	point2: Vector2D
): Vector2D {
	for (;;) {
		const cell = hittingCellCorner(point1, point2);
		if (!isPointInsideScene(scene, cell) || scene[cell.y][cell.x] !== null)
			break;

		const point3 = rayStep(point1, point2);
		point1 = point2;
		point2 = point3;
	}

	return point2;
}

export function distanceBetweenPointAndLine(
	point1: Vector2D,
	point2: Vector2D,
	point3: Vector2D
): number {
	const a = point2.y - point1.y;
	const b = point1.x - point2.x;
	const c = point2.x * point1.y - point1.x * point2.y;
	const distance =
		Math.abs(a * point3.x + b * point3.y + c) / Math.sqrt(a ** 2 + b ** 2);
	return distance;
}
