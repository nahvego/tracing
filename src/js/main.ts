import Square from "./square";
// import Circle from "./circle";
import Point from "./point";
import Vector from "./vector";
import Line from "./line";
import Circle from "./circle";

const ANIM = false;

window.addEventListener("load", function() {

let canvas = document.getElementById("canvas") as HTMLCanvasElement;
let ctx = canvas.getContext("2d")!;
const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;
const PI = Math.PI;
const HALF_PI = Math.PI / 2; // xd

const CHAR_SIZE = 5; // must be odd

let char_position = new Point(150, 150);
let char_speed = new Vector(5, 0); // speed is pixels/sec

let prevTime = -1;

const MAP = [
    new Square(new Point(200, 200), 100, 100),
    new Circle(new Point(100, 100), 50),
];

function init() {
    window.requestAnimationFrame(draw);
}

function draw(time: number) {
    let delta = 0;
    let deltaS = 0; // delta seconds
    if (prevTime > 0) {
        delta = time - prevTime;
        deltaS = delta / 1000;
    }
    prevTime = time;

    // char_position = char_position.translate(char_speed.scale(deltaS));


    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.save();

    // background
    // ctx.fillStyle = "#DDD";
    // ctx.strokeStyle = "#000";
    // ctx.lineWidth = 10;
    // ctx.strokeRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    // ctx.restore();

    for (let figure of MAP) {
        figure.draw(ctx);
    }

    // draw "character"
    ctx.fillStyle = "#000";
    ctx.fillRect( char_position.x - (CHAR_SIZE - 1) / 2, char_position.y - (CHAR_SIZE - 1) / 2, CHAR_SIZE, CHAR_SIZE);

    ctx.fillStyle = "#0FF";
    ctx.fillRect(char_position.x, char_position.y, 1, 1);
    // raycast
    raycast(char_position, 360, 200);

    if (ANIM) window.requestAnimationFrame(draw);
}

// 3 <= rayCount <= 360;
function raycast(origin: Point, rayCount: number, raySize: number, firstVector?: Vector) {
    if (!firstVector) {
        firstVector = new Vector(1, 0);
    }
    // firstvector must be unitvector
    ctx.save();
    ctx.strokeStyle = "#0F05";
    ctx.lineWidth = 1;
    ctx.fillStyle = "rgba(100, 100, 100, 0.5)";

    let angle = 2 * PI / rayCount;

    let firstEnd = null;
    let rayEnd = null;
    for (let i = 0; i < rayCount; i++) {
        let thisAngle = i * angle;
        // TODO: No recalcular cos/sin... dado que es el mismo angulo se puede calcular 1 vez
        let vector = firstVector.rotate(thisAngle);
        let dest = origin.translate(vector.scale(raySize)).clamp(CANVAS_WIDTH, CANVAS_HEIGHT);

        // collisions?
        let collidedDest: Nullable<Point> = null;
        for (let object of MAP) {
            let collidedDistance = Infinity;
            let coll = object.collidesWithLine(new Line(origin, dest));
            if (coll) {
                // ¿Is the closest collision?
                let newCollDist = origin.distanceTo(coll);
                if (newCollDist < collidedDistance) {
                    collidedDest = coll;
                    collidedDistance = newCollDist;
                }
            }
        }
        if (collidedDest) {
            // draw failed ray
            // ctx.save();
            // ctx.beginPath();
            // ctx.strokeStyle = "#F00";
            // ctx.moveTo(collidedDest.x, collidedDest.y);
            // ctx.lineTo(dest.x, dest.y);
            // ctx.stroke();
            // ctx.restore();
            dest = collidedDest;
        }
        // draw correct ray
        // ctx.beginPath();
        // ctx.moveTo(origin.x, origin.y);
        // ctx.lineTo(dest.x, dest.y);
        // ctx.stroke();
        // draw zones in ray
        if (rayEnd) {
            // draw vision zone
            ctx.beginPath();
            ctx.moveTo(origin.x, origin.y);
            ctx.lineTo(rayEnd.x, rayEnd.y);
            ctx.lineTo(dest.x, dest.y);
            ctx.lineTo(origin.x, origin.y);
            ctx.fill();
        } else {
            firstEnd = dest;
        }
        rayEnd = dest;
    }
    // another one to fill from first to last
    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(rayEnd!.x, rayEnd!.y);
    ctx.lineTo(firstEnd!.x, firstEnd!.y);
    ctx.lineTo(origin.x, origin.y);
    ctx.fill();

    ctx.restore();
}

init();
    
}); // window load