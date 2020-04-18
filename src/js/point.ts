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

    clamp(x: number | undefined, y: number | undefined) {
        let nx = this.x;
        let ny = this.y;
        if (typeof(x) !== "undefined" && this.x > x) {
            nx = x;
        } 
        if (typeof(y) !== "undefined" && this.y > y) {
            ny = y;
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
}