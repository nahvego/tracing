import Line from "../line";
import Point from "../point";
import IElem2D from "../interfaces/ielem2d";

export default abstract class Geometry2D implements IElem2D {

    constructor() {}

    logic(delta: number) {};

    abstract draw(ctx: CanvasRenderingContext2D): void;
    abstract collidesWithLine(line: Line): Nullable<Point>;
}