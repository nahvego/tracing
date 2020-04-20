import kb, { KeyboardKey } from "./keyboardController";
import IElem2D from "./interfaces/ielem2d";
import Point from "./point";
import Line from "./line";
import Vector from "./vector";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./constants";
const VECTOR_ZERO = new Vector(0, 0);
const VECTOR_UP = new Vector(0, -1);
const VECTOR_RIGHT = new Vector(1, 0);
const VECTOR_DOWN = new Vector(0, 1);
const VECTOR_LEFT = new Vector(-1, 0);

const CHAR_SIZE = 5; // must be odd
const CHAR_SIZE_OFFSET = (CHAR_SIZE - 1) / 2;
const SPEED = 10;


export default class Character implements IElem2D {

    position: Point;
    acceleration: Vector;
    speed: Vector;

    constructor(position: Point) {
        this.position = position;
        this.acceleration = VECTOR_ZERO;
        this.speed = VECTOR_ZERO;
    }

    logic(delta: number): void {

        let spd = VECTOR_ZERO;
        if (kb.isPressed(KeyboardKey.W)) {
            spd = spd.add(VECTOR_UP);
        }
        if (kb.isPressed(KeyboardKey.D)) {
            spd = spd.add(VECTOR_RIGHT);
        }
        if (kb.isPressed(KeyboardKey.S)) {
            spd = spd.add(VECTOR_DOWN);
        }
        if (kb.isPressed(KeyboardKey.A)) {
            spd = spd.add(VECTOR_LEFT);
        }
        this.speed = spd.unit().scale(SPEED);

        this.position = this.position
                            .translate(this.speed)
                            .clamp(
                                CHAR_SIZE_OFFSET,
                                CANVAS_WIDTH - CHAR_SIZE_OFFSET,
                                CHAR_SIZE_OFFSET,
                                CANVAS_HEIGHT - CHAR_SIZE_OFFSET
                            );
    }    
    
    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "#000";
        ctx.fillRect( this.position.x - CHAR_SIZE_OFFSET, this.position.y - CHAR_SIZE_OFFSET, CHAR_SIZE, CHAR_SIZE);
    
        ctx.fillStyle = "#0FF";
        ctx.fillRect(this.position.x, this.position.y, 1, 1);
    }

    collidesWithLine(line: Line) {
        return null;
    }


}