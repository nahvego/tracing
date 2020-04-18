import Line from "./line";
import Point from "./point";

// abstract
export default interface Elem2D {

    draw(ctx: CanvasRenderingContext2D): void;

    collidesWithLine(line: Line): Nullable<Point>;
}