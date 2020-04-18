import Elem2D from "./elem2d";
import Point from "./point";
import Line from "./line";
import Vector from "./vector";

export default class Circle implements Elem2D {

    center: Point;
    r: number;

    constructor(center: Point, r: number) {

        this.center = center;
        this.r = r;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();

        ctx.strokeStyle = "#00F";
        ctx.beginPath();
        ctx.arc(this.center.x, this.center.y, this.r, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.restore();
    }

    collidesWithLine(line: Line) {
        // Line goes from A to B
        // Circle centers at C
        // We calculate AC projection onto AB and then translate A over AB for the projection amount
        // Then we take C and that point and measure the distance

        // θ = angle(AB, AC) - L = A·cosθ and since AB.AC = |AB||AC|cosθ => L = AB.AC / |AC|
        let vec_ab = new Vector(line.p1, line.p2);
        let line_unit = vec_ab.unit();
        let vec_ac = new Vector(line.p1, this.center);
        let proj = vec_ab.dot(vec_ac) / vec_ab.magnitude;

        let point = line.p1.translate(line_unit.scale(proj));

        let d = this.center.distanceTo(point);

        if (d > this.r) return null;

        // if d = this.r then line is tangent
        // will use a differential for aprox issues
        if (Math.abs(d - this.r) < 3 && line.containsPoint(point)) return point; // d ≈ this.r so return point

        // here d < this.r so there's two cross points

        // So we pythagoras to calculate translation of the orthogonal point
        // and translate both ways thorough \line\
        // r2 = d2 + t2
        let translation = Math.sqrt(this.r * this.r - d * d);
        let candidate1 = point.translate(line_unit.scale(translation));
        let candidate2 = point.translate(line_unit.scale(-translation));

        return line.p1.findClosest([ candidate1, candidate2 ].filter(p => line.containsPoint(p)));
    }
}