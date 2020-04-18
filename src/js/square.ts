import Elem2D from "./elem2d";
import Point from "./point";
import Line from "./line";

export default class Square implements Elem2D {

    origin: Point;
    width: number;
    height: number;

    // cached segment lines
    tl: Line; // top 
    rl: Line; // right
    bl: Line; // bottom
    ll: Line; // left

    constructor(origin: Point, width: number, height: number) {
        this.origin = origin
        this.width = width;
        this.height = height;

        let ptl = this.origin;
        let ptr = this.origin.translate(this.width, 0);
        let pbl = this.origin.translate(0,          this.height);
        let pbr = this.origin.translate(this.width, this.height);

        this.tl = new Line(ptl, ptr);
        this.rl = new Line(ptr, pbr);
        this.bl = new Line(pbl, pbr);
        this.ll = new Line(ptl, pbl);
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();

        ctx.strokeStyle = "#F00";
        ctx.strokeRect(this.origin.x, this.origin.y, this.width, this.height);

        ctx.restore();
    }

    collidesWithLine(line: Line) {
        // p1 y p2 es un timo!
        // hits any line hitting the square?
        let hp: Nullable<Point>[] = [null, null, null, null];
        hp[0] = line.collidesWithLine(this.tl);
        hp[1] = line.collidesWithLine(this.rl);
        hp[2] = line.collidesWithLine(this.bl);
        hp[3] = line.collidesWithLine(this.ll);
        // Hay que devolver uno de los puntos de colisión...
        // Vamos a devolver el más cercano a line.p1... por si acaso (uwu)
        return line.p1.findClosest(hp.filter((p: Nullable<Point>): p is Point => {
            return p !== null;
        }));
    }
}