import Elem2D from "./elem2d";
import { calcSegmentsCollision, distanceBetweenTwoPoints } from "./utils";

export default class Square extends Elem2D {
    constructor(x, y, w, h) {
        super();
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    draw(ctx) {
        ctx.save();

        ctx.strokeStyle = "#F00";
        ctx.strokeRect(this.x, this.y, this.w, this.h);

        ctx.restore();
    }

    collidesWithLine(p1, p2) {
        // p1 y p2 es un timo!
        // hits any line hitting the square?
        let hp = [0, 0, 0, 0];
        hp[0] = calcSegmentsCollision(p1, p2, [ this.x, this.y ],          [ this.x + this.w, this.y ])          ; /* top */
        hp[1] = calcSegmentsCollision(p1, p2, [ this.x + this.w, this.y ], [ this.x + this.w, this.y + this.h ]) ; /* right */
        hp[2] = calcSegmentsCollision(p1, p2, [ this.x, this.y + this.h ], [ this.x + this.w, this.y + this.h ]) ; /* bottom */
        hp[3] = calcSegmentsCollision(p1, p2, [ this.x, this.y ],          [ this.x, this.y + this.h ])          ;  /* left */

        hp = hp.filter(v => v != null);
        if (hp.length === 0) return null;
        // Hay que devolver uno de los puntos de colisión...
        // Vamos a devolver el más cercano a p1... por si acaso (uwu)

        let indexOfLowest = -1;
        hp.map(coll => distanceBetweenTwoPoints(p1, coll)).reduce((acc, v, i) => {
            if (v < acc) {
                indexOfLowest = i;
                return v;
            } else {
                return acc;
            }
        }, Infinity)

        return hp[indexOfLowest]; // point or null
    }
}