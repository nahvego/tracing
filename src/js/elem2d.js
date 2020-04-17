// abstract
export default class Elem2D {
    constructor() {

    }

    draw(ctx) {
        throw new Error("Not implemented");
    }

    collidesWithLine(p1, p2) {
        throw new Error("Not implemented");
    }
}