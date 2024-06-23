import { LINE_WIDTH, POINT_RADIUS } from "./constants";

export class Vector2D {
	x: number;
	y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	add(that: Vector2D): Vector2D {
		return new Vector2D(this.x + that.x, this.y + that.y);
	}

	subtract(that: Vector2D): Vector2D {
		return new Vector2D(this.x - that.x, this.y - that.y);
	}

	multiply(that: Vector2D): Vector2D {
		return new Vector2D(this.x * that.x, this.y * that.y);
	}

	divide(that: Vector2D): Vector2D {
		return new Vector2D(this.x / that.x, this.y / that.y);
	}

	length(): number {
		return Math.sqrt(this.x ** 2 + this.y ** 2);
	}

	normalize(): Vector2D {
		const length = this.length();
		if (this.length() === 0) return new Vector2D(0, 0);
		return new Vector2D(this.x / length, this.y / length);
	}

	scale(factor: number): Vector2D {
		return new Vector2D(this.x * factor, this.y * factor);
	}

	distanceTo(that: Vector2D): number {
		// return Math.sqrt((this.x - that.x) ** 2 + (this.y - that.y) ** 2);
		return this.subtract(that).length();
	}
}

export function getCanvasSize(context: CanvasRenderingContext2D): Vector2D {
	return new Vector2D(context.canvas.width, context.canvas.height);
}

export function createLine(
	context: CanvasRenderingContext2D,
	startPoint: Vector2D,
	endPoint: Vector2D,
	lineWidth: number = 0.02,
	strokeStyle: string = "#ffffff"
) {
	context.lineWidth = lineWidth;
	context.strokeStyle = strokeStyle;

	context.beginPath();
	context.moveTo(startPoint.x, startPoint.y);
	context.lineTo(endPoint.x, endPoint.y);
	context.stroke();
}

export function createCircle(
	context: CanvasRenderingContext2D,
	point: Vector2D,
	radius: number,
	fillColor: string
) {
	context.fillStyle = fillColor;
	context.beginPath();
	context.arc(point.x, point.y, radius, 0, 2 * Math.PI);
	context.fill();
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
	if (deltaComponent > 0) return Math.ceil(component);
	else if (deltaComponent < 0) return Math.floor(component);
	else return component;
}

export function rayStep(
	context: CanvasRenderingContext2D,
	point1: Vector2D,
	point2: Vector2D
): Vector2D {
	let point3 = point2;

	// Linear equation: y = mx + c (where "m" = slope & "c" = intercept)
	const delta = point2.subtract(point1);

	if (delta.x !== 0) {
		const slope = delta.y / delta.x; // m = dy/dx
		const intercept = point1.y - slope * point1.x; // c = y - mx

		// Finding the closest point on the grid's vertical cell boundary,
		// which also lies on the line connecting "point1" and "point2"
		const x3 = snap(point2.x, delta.x);
		const y3 = slope * x3 + intercept;
		point3 = new Vector2D(x3, y3);

		createCircle(context, point3, POINT_RADIUS, "lightgreen");
		createLine(context, point2, point3, LINE_WIDTH / 2, "lightgreen");

		// Finding the closest point on the grid's horizontal cell boundary,
		// which also lies on the line connecting "point1" and "point2"
		if (slope !== 0) {
			const y4 = snap(point2.y, delta.y);
			const x4 = (y4 - intercept) / slope;
			const point4 = new Vector2D(x4, y4);

			createCircle(context, point4, POINT_RADIUS, "violet");
			createLine(context, point2, point4, LINE_WIDTH / 2, "violet");
		}
	}

	return point2;
}
