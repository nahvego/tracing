import Square from "./square";
import Circle from "./circle";
import { distanceBetweenTwoPoints } from "./utils";

const ANIM = false;

window.addEventListener("load", function() {

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;
const PI = Math.PI;
const HALF_PI = Math.PI / 2; // xd

const CHAR_SIZE = 5; // must be odd

let char_position = [ 150, 150 ];

const MAP = [
    new Square(200, 200, 100, 100),
    new Circle(100, 100, 50, 50),
];

function init() {
    window.requestAnimationFrame(draw);
}

function draw() {

    ctx.save();

    // background
    ctx.fillStyle = "#DDD";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 10;
    ctx.strokeRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.restore();

    for (let figure of MAP) {
        figure.draw(ctx);
    }

    // draw "character"
    ctx.fillStyle = "#000";
    ctx.fillRect( char_position[0] - (CHAR_SIZE - 1) / 2, char_position[0] - (CHAR_SIZE - 1) / 2, CHAR_SIZE, CHAR_SIZE);

    ctx.fillStyle = "#0FF";
    ctx.fillRect(char_position[0], char_position[1], 1, 1);
    // raycast
    raycast(char_position, 360, 200);

    if (ANIM) window.requestAnimationFrame(draw);
}

// 3 <= rayCount <= 360;
function raycast(origin, rayCount, raySize, firstVector = [ 1, 0 ]) {
    // firstvector must be unitvector
    ctx.save();
    ctx.strokeStyle = "#0F05";
    ctx.lineWidth = 1;
    ctx.fillStyle = "rgba(100, 100, 100, 0.5)";

    let angle = 2 * PI / rayCount;

    let firstEnd;
    let rayEnd;
    for (let i = 0; i < rayCount; i++) {
        let thisAngle = i * angle;
        // TODO: No recalcular cos/sin... dado que es el mismo angulo se puede calcular 1 vez
        let vector = rotateVector(firstVector, thisAngle);
        let dest = clampY(clampX(vecAdd(origin, vecMulScalar(vector, raySize)), CANVAS_WIDTH), CANVAS_HEIGHT);

        // collisions?
        let collidedDest = null;
        for (let object of MAP) {
            let collidedDistance = Infinity;
            let coll = object.collidesWithLine(origin, dest);
            if (coll) {
                // ¿Is the closest collision?
                let newCollDist = distanceBetweenTwoPoints(origin, coll);
                if (newCollDist < collidedDistance) {
                    collidedDest = coll;
                    collidedDistance = newCollDist;
                }
            }
        }
        if (collidedDest) {
            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = "#F00";
            ctx.moveTo(collidedDest[0], collidedDest[1]);
            ctx.lineTo(dest[0], dest[1]);
            ctx.stroke();
            ctx.restore();
            dest = collidedDest;
        }

        ctx.beginPath();
        ctx.moveTo(origin[0], origin[1]);
        ctx.lineTo(dest[0], dest[1]);
        ctx.stroke();
        // draw zones in ray
        if (rayEnd) {
            ctx.beginPath();
            ctx.moveTo(origin[0], origin[1]);
            ctx.lineTo(rayEnd[0], rayEnd[1]);
            ctx.lineTo(dest[0], dest[1]);
            ctx.lineTo(origin[0], origin[1]);
            ctx.fill();
        } else {
            firstEnd = dest;
        }
        rayEnd = dest;
    }
    // another one to fill from first to last
    ctx.beginPath();
    ctx.moveTo(origin[0], origin[1]);
    ctx.lineTo(rayEnd[0], rayEnd[1]);
    ctx.lineTo(firstEnd[0], firstEnd[1]);
    ctx.lineTo(origin[0], origin[1]);
    ctx.fill();

    ctx.restore();
}

function vecMulScalar(vector, scalar) {
    return vector.map(a => a * scalar);
}

function vecAdd(...vectors) {
    let start = [];
    for (let i = 0; i < vectors[0].length; i++) start.push(0);
    return vectors.reduce((acc, vec) => {
        vec.forEach((v, i) => { acc[i] += v; });
        return acc;
    }, start);
}

function clampX(vector, max, min = 0) {
    let v = [ vector[0], vector[1] ];
    if (v[0] > max) {
        v[0] = max;
    } else if(v[0] < min) {
        v[0] = min;
    }
    return v;
}

function clampY(vector, max, min = 0) {
    let v = [ vector[0], vector[1] ];
    if (v[1] > max) {
        v[1] = max;
    } else if(v[1] < min) {
        v[1] = min;
    }
    return v;
}

// anti-clockwise
function rotateVector(vector, angle) {
    let c = Math.cos(-angle);
    let s = Math.sin(-angle);
    return [ c * vector[0] - s * vector[1], s * vector[0] + c * vector[1] ];
    // x2 = cos(β)·x1 − sin(β)·y1
    // y2 = sin(β)·x1 + cos(β)·y1
}

init();
    
}); // window load