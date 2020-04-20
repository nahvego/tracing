import Point from "./point";

export default class Vector {
    p1?: Point;
    p2?: Nullable<Point>;

    private _magnitude?: number;

    // The vector is (v1, v2)
    v1: number;
    v2: number;
    constructor(p1: Point, p2: Point);
    constructor(v1: number, v2: number);
    constructor(pv1: Point | number, pv2: Point | number) {
        if (typeof(pv1) === "number") { // explicit
            this.v1 = pv1 as number;
            this.v2 = pv2 as number;
        } else { // point constructor
            this.p1 = pv1;
            this.p2 = pv2 as Point;
    
            this.v1 = (pv2 as Point).x - (pv1 as Point).x;
            this.v2 = (pv2 as Point).y - (pv1 as Point).y;
        }
        // return [ p2[0] - p1[0], p2[1] - p1[1] ];
    }

    get magnitude() {
        if (!this._magnitude) {
            this._magnitude = Math.sqrt(this.v1 * this.v1 + this.v2 * this.v2);
        }
        return this._magnitude;
    }

    equals(v: Vector) {
        //return this.p1.equals(v.p1) && this.p2.equals(v.p2);
        return this.v1 === v.v1 && this.v2 === v.v2;
    }

    dot(v: Vector) {
        return this.v1 * v.v1 + this.v2 * v.v2;
    }

    rotate(angle: number) {
        // Angle negative because of canvas coordinate origin...
        let c = Math.cos(-angle);
        let s = Math.sin(-angle);
        return new Vector(c * this.v1 - s * this.v2, s * this.v1 + c * this.v2);
        // x2 = cos(β)·x1 − sin(β)·y1
        // y2 = sin(β)·x1 + cos(β)·y1
    }

    invert() {
        return new Vector(-this.v1, -this.v2);
    }

    scale(scalar: number) {
        return new Vector(this.v1 * scalar, this.v2 * scalar);
    }

    unit() {
        if (this.magnitude === 0) return NULL_VECTOR;
        return new Vector(this.v1 / this.magnitude, this.v2 / this.magnitude);
    }

    // clamps given a magnitude
    clamp(min: number, max: number | null): Vector;
    clamp(max: number): Vector;
    clamp(min: number, max?: number | null) {
        let lMin: number | null = min;
        let lMax: number | null = max || null;
        if (typeof(max) === "undefined") {
            lMin = null;
            lMax = min;
        }
        if (lMax !== null && this.magnitude > lMax) {
            return this.unit().scale(lMax);
        } else if (lMin !== null && this.magnitude < lMin) {
            return this.unit().scale(lMin);
        } else {
            return this;
        }
    }

    add(vector: Vector) {
        return new Vector(this.v1 + vector.v1, this.v2 + vector.v2);
    }

    // TODO: use
    // Projection of this over otherVector
    projection(otherVector: Vector) {
        return this.dot(otherVector) / otherVector.magnitude;
    }

    xComponent() {
        return this.projection(X_VECTOR);
    }

    yComponent() {
        return this.projection(Y_VECTOR);
    }

    toString() {
        return `(${this.v1}, ${this.v2})`;
    }
}

const NULL_VECTOR = new Vector(0, 0);
const X_VECTOR = new Vector(1, 0);
const Y_VECTOR = new Vector(0, 1);