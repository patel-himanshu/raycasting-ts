import { Vector2D } from "./models";

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

export function createRectangle(
	context: CanvasRenderingContext2D,
	startingPointX: number,
	startingPointY: number,
	width: number,
	height: number,
	fillColor: string
) {
	context.fillStyle = fillColor;
	context.fillRect(startingPointX, startingPointY, width, height);
}

export function getCanvasSize(context: CanvasRenderingContext2D): Vector2D {
	return new Vector2D(context.canvas.width, context.canvas.height);
}
