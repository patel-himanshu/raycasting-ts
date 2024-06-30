import { FOV, NEAR_CLIPPING_PLANE } from "./constants";

export type Scene = Array<Array<string | null>>;

export class Vector2D {
	x: number;
	y: number;

	constructor(x: number = 0, y: number = 0) {
		this.x = x;
		this.y = y;
	}

	static angle(angle: number): Vector2D {
		return new Vector2D(Math.cos(angle), Math.sin(angle));
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

	rotate90(): Vector2D {
		return new Vector2D(-this.y, this.x);
	}

	// Linear Interpolation (lerp)
	lerp(that: Vector2D, t: number): Vector2D {
		return that.subtract(this).scale(t).add(this);
	}

	dotProduct(that: Vector2D): number {
		return this.x * that.x + this.y * that.y;
	}
}

export class Player {
	position: Vector2D;
	direction: number;

	constructor(position: Vector2D, direction: number) {
		this.position = position;
		this.direction = direction;
	}

	fovRange(): [Vector2D, Vector2D] {
		const perpendicularDistance = NEAR_CLIPPING_PLANE * Math.tan(FOV * 0.5);
		const p = this.position.add(
			Vector2D.angle(this.direction).scale(NEAR_CLIPPING_PLANE)
		);

		const p1 = p.subtract(
			p
				.subtract(this.position)
				.rotate90()
				.normalize()
				.scale(perpendicularDistance)
		);
		const p2 = p.add(
			p
				.subtract(this.position)
				.rotate90()
				.normalize()
				.scale(perpendicularDistance)
		);
		return [p1, p2];
	}
}
