import Line from "../line";
import Point from "../point";

// abstract
export default interface IElem2D {

    logic(delta: number): void;

    draw(ctx: CanvasRenderingContext2D): void;

    collidesWithLine(line: Line): Nullable<Point>;
}