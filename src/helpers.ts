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
