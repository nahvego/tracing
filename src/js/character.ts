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
const MAX_SPEED = 20;
const ACC_VECTOR = VECTOR_ZERO;


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
        let deltaSeconds = delta / 1000;

        let teclas = "wasd";
        let acc = VECTOR_ZERO;
        if (teclas.includes("w")) {
            acc.add(VECTOR_UP);
        }
        if (teclas.includes("d")) {
            acc.add(VECTOR_RIGHT);
        }
        if (teclas.includes("s")) {
            acc.add(VECTOR_DOWN);
        }
        if (teclas.includes("a")) {
            acc.add(VECTOR_LEFT);
        }
        acc = acc.unit();
        
        // speed is currentSpeed + acc
        this.speed = this.speed.add(this.acceleration.scale(deltaSeconds)).clamp(MAX_SPEED);

        this.position = this.position.translate(this.speed).clamp(0, CANVAS_WIDTH, 0, CANVAS_HEIGHT);
    }    
    
    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "#000";
        ctx.fillRect( this.position.x - (CHAR_SIZE - 1) / 2, this.position.y - (CHAR_SIZE - 1) / 2, CHAR_SIZE, CHAR_SIZE);
    
        ctx.fillStyle = "#0FF";
        ctx.fillRect(this.position.x, this.position.y, 1, 1);
    }

    collidesWithLine(line: Line) {
        return null;
    }


}