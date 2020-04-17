import Elem2D from "./elem2d";
import { calcSegmentsCollision, distanceBetweenTwoPoints } from "./utils";

export default class Circle extends Elem2D {
    constructor(x, y, r) {
        super();
        this.x = x;
        this.y = y;
        this.r = r;
    }

    draw(ctx) {
        ctx.save();

        ctx.strokeStyle = "#F00";
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.restore();
    }

    collidesWithLine(p1, p2) {
        return null;
    }
}