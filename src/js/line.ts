import Point from "./point";
import Vector from "./vector";

const POINT_DELTA = 1;

// Should be segment?
export default class Line {

    p1: Point;
    p2: Point;
    m: number | null;
    n: number;

    constructor(p1: Point, p2: Point) {
        this.p1 = p1;
        this.p2 = p2;
        if (p2.x === p1.x) {
            // line is x = N
            this.m = null;
            this.n = p1.x;
        } else {
            this.m = (p2.y - p1.y) / (p2.x - p1.x);
            this.n = p1.y - (this.m * p1.x);
        }
    }

    // Checks if lines collide without checking segment boundaries
    private collisionWithUnlimited(line: Line): Nullable<Point> {
        /* cases:
            normal: m != null && m != 0
            2 of x = n (m === null)
            2 of y = n (m === 0)
            1 normal, 1 of x = n
            1 normal, 1 of y = n
            1 of x = n, 1 of y = n => point is [x,y]
            cases of y = n can be treated as normal so we got special cases for:
            2 of x = n => since m1 = null & m2 = null they go through "same line" branch (todo pending)
            1 of x = n and 1 normal => we check!
    
        */
        if (this.m === line.m) {
            return null; // nunca se cruzan 
            // TODO: o son la misma!!!!!
        } else if (this.m === null || line.m === null) { // any x = n???
            // we treat line as x = n
            let line1: Line = this;
            let line2 = line;
            if (line1.m === null) { // so we swap if necessary
                let l = line2;
                line2 = this;
                line1 = l;
            }
            let x = line2.n; // okay...
            let y = x * line1.m! + line1.n; // okay!
            return new Point(x, y);
        } else {
            let x = (line.n - this.n) / this.m - line.m;
            let y = x * this.m + this.n;
            return new Point(x, y);;
        }
    }

    // line1 = { p1, p2 } -- line2 = { p3, p4}
    // p1 = this.p1; p2 = this.p2; p3 = line.p1; p4 = line.p2
    collidesWithLine(line: Line): Nullable<Point> {

        let coll = this.collisionWithUnlimited(line);
        if (!coll) return null;

        // CHECK:
        // what if dotPoint = 0 || dotPoint1 = dotSegment1
        // but not in the other segment...?
        // i think this wrong somehow

        // is coll in segment1 and segment2?
        let v1 = new Vector(this.p1, this.p2);
        let dotSegment1 = v1.dot(v1);
        let dotPoint1 = v1.dot(new Vector(this.p1, coll));
        if (dotPoint1 === 0) {
            // coll = p1
            // Because of JS float aproximations (and vectorEquals not including a delta for float aproximation)
            // we check here and just return p1 as the coll point
            return this.p1;
        } else if (dotPoint1 === dotSegment1) { // what if dotPoint1 ≈ dogSegment1? May return false negatives
            return this.p2;
        }
        if (dotPoint1 < 0) return null; // does not belong to segment1, so can't be valid
        if (dotPoint1 > dotSegment1) return null; // does not belong to segment1, so coll is not valid

        let v2 = new Vector(line.p1, line.p2);
        let dotSegment2 = v2.dot(v2);
        let dotPoint2 = v2.dot(new Vector(line.p1, coll));
        if (dotPoint2 === 0) {
            return line.p1;
        } else if (dotSegment2 === dotPoint2) {
            return line.p2;
        }
        if (dotPoint2 < 0) return null; // does not belong to segment2, so can't be valid
        if (dotPoint2 < dotSegment2) return coll; // belongs segment2 (and belongs to segment1 because of dotPoint < dotSegment1)

        return null;
    }

    // Makes sure point is WITHIN the segment defined between p1 and p2
    // check /collidesWithLine/
    containsPoint(point: Point): boolean {
        // is coll in segment1 and segment2?
        let vec = new Vector(this.p1, this.p2);
        let dotSegment = vec.dot(vec);
        let dotPoint = vec.dot(new Vector(this.p1, point));
        if (dotPoint === 0 || dotPoint === dotSegment) return true;
        //if (Math.abs(dotPoint) <= POINT_DELTA || Math.abs(dotPoint - dotSegment) <= POINT_DELTA) return true;
        if (dotPoint < 0) return false; // does not belong to segment1, so can't be valid
        if (dotPoint < dotSegment) return true; // does not belong to segment1, so coll is not valid
        return false;
    }
}