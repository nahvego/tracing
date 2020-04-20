import Geometry2D from "./geometry2d";
import IElem2D from "~js/interfaces/ielem2d";
import Line from "~js/line";
import Point from "~js/point";
import Vector from "~js/vector";

export default class RegularPolygon extends Geometry2D implements IElem2D {

    center: Point;
    sides: number;
    sideLength: number;
    rotation: number;

    lines: Line[];

    constructor(center: Point, sides: number, sideLength: number, rotation: number) {
        super();

        if (sides < 3) {
            throw new Error("Polygons must have at least 3 sides");
        }

        this.center     = center;
        this.sides      = sides;
        this.sideLength = sideLength;
        this.rotation   = rotation;
        this.lines = [];

        // we find the points that make the polygon and join them by lines
        // start from center and calculate half height and displace center that amount
        // plus half a side in the other axis
        let sideAngle = Math.PI * (this.sides - 2) / this.sides;

        let point = this.center
            .translate(
                -this.sideLength / 2,
                -this.sideLength / ( 2 * Math.tan(Math.PI / this.sides) )
            );

        let vector = new Vector(this.sideLength, 0);
        let rotationAngle = Math.PI - sideAngle; // The rotation happens on the angle OUTSIDE of the figure
        
        // then we get the next by creating a vector of length sideLength and angle sideAngle*N
        while (this.lines.length < this.sides) {
            let nextPoint = point.translate(vector);
            this.lines.push(new Line(point, nextPoint));

            // Update values
            point = nextPoint;
            vector = vector.rotate(-rotationAngle); // Negative because coordinate origin of canvas (this should be abstracted away :])
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();

        ctx.strokeStyle = "#ce033a";

        ctx.beginPath();
        ctx.moveTo(this.lines[0].p1.x, this.lines[0].p1.y);
        for (let i = 1; i < this.lines.length; i++) {
            ctx.lineTo(this.lines[i].p1.x, this.lines[i].p1.y);
        }
        ctx.lineTo(this.lines[0].p1.x, this.lines[0].p1.y);
        ctx.stroke();

        ctx.restore();
    }
    
    collidesWithLine(line: Line) {
        // p1 y p2 es un timo!
        // hits any line hitting the square?
        let hp: Nullable<Point>[] = this.lines.map(l => line.collidesWithLine(l));
        // Hay que devolver uno de los puntos de colisión...
        // Vamos a devolver el más cercano a line.p1... por si acaso (uwu)
        return line.p1.findClosest(hp.filter((p: Nullable<Point>): p is Point => {
            return p !== null;
        }));
    }
}