import Vector from "./vector";

// Inmutable!
export default class Point {

    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    equals(p: Point) {
        return this.x === p.x && this.y === p.y;
    }

    distanceTo(p: Point) {
        let a = p.x - this.x;
        let b = p.y - this.y;
        return Math.sqrt(a * a + b * b);
    }

    public translate(x: number, y: number): Point;
    public translate(v: Vector): Point;
    translate(xv: number | Vector, y?: number) {
        if (xv instanceof Vector) {
            return new Point(this.x + xv.v1, this.y + xv.v2);
        } else {
            return new Point(this.x + xv, this.y + y!);
        }
    }

    clampX(max: number): Point;
    clampX(min: number, max: number): Point;
    clampX(min: number, max?: number) {
        let mn: number | null = min;
        if (typeof(max) === "undefined") {
            mn = null;
            max = min;
        }
        return this.clamp(mn, max, null, null);
    }

    clampY(max: number): Point;
    clampY(min: number, max: number): Point;
    clampY(min: number, max?: number) {
        let mn: number | null = min;
        if (typeof(max) === "undefined") {
            mn = null;
            max = min;
        }
        return this.clamp(null, null, mn, max);
    }

    clamp(maxX: number | null, maxY: number | null): Point;
    clamp(minX: number | null, maxX: number | null, minY: number | null, maxY: number | null): Point;
    clamp(minX: number | null, maxX: number | null, minY?: number | null, maxY?: number | null) {
        let mnX = minX;
        let mxX = maxX;
        let mnY = minY;
        let mxY = maxY;

        let nx = this.x;
        let ny = this.y;

        if (typeof(minY) === "undefined" && typeof(maxY) === "undefined") {
            // if just minX and maxX are present, this is a just max clamp
            mnX = null;
            mnY = null;
            mxX = minX;
            mxY = maxX;
        }
        if (mnX !== null && nx < mnX) {
            nx = mnX;
        } else if (mxX !== null && nx > mxX) {
            nx = mxX;
        }
        if (mnY !== null && ny < mnY!) {
            ny = mnY!;
        } else if (mxY !== null && ny > mxY!) {
            ny = mxY!;
        }
        return new Point(nx, ny);
    }

    // find closest point to this one from an array
    findClosest(points: Point[]): Nullable<Point> {
        if (points.length === 0) return null;
        if (points.length === 1) return points[0];

        let indexOfLowest = -1;
        points.map(p => this.distanceTo(p)).reduce((acc, v, i) => {
            if (v < acc) {
                indexOfLowest = i;
                return v;
            } else {
                return acc;
            }
        }, Infinity);

        return points[indexOfLowest]; // point or null
    }

    toString() {
        return `(${this.x}, ${this.y})`;
    }
}