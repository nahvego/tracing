export function lineFromTwoPoints(p1, p2) {
    if (p2[0] === p1[0]) {
        // line is x = N
        return [ null, p1[0] ];
    } else {
        let m = (p2[1] - p1[1]) / (p2[0] - p1[0]);
        let n = p1[1] - (m * p1[0]);
        return [ m, n ];
    }
}

export function vectorFromTwoPoints(p1, p2) {
    return [ p2[0] - p1[0], p2[1] - p1[1] ];
}

export function dot(v1, v2) {
    return v1.reduce((acc, v, i) => {
        return acc + v * v2[i];
    }, 0);
}

export function distanceBetweenTwoPoints(p1, p2) {
    let w = p2[0] - p1[0];
    let h = p2[1] - p1[0];
    return Math.sqrt(w * w + h * h);
}

export function calcLinesCollision(line1, line2) {
    /* cases:
        normal: m != null && m != 0
        2 of x = n (m === null)
        2 of y = n (m === 0)
        1 normal, 1 of x = n
        1 normal, 1 of y = n
        1 of x = n, 1 of y = n => point is [x,y]
        cases of y = n can be treated as normal so we got special cases for:
        2 of x = n => since m1 = null & m2 = null they go through "same line" branch (todo pending)
        1 of x = n and 1 normal => we check!

    */
    if (line1[0] === line2[0]) {
        return false; // nunca se cruzan 
        // TODO: o son la misma!!!!!
    } else if (line1[0] === null || line2[0] === null) { // any x = n???
        // we treat line2 as x = n
        if (line1[0] === null) { // so we swap if necessary
            let l = line2;
            line2 = line1;
            line1 = l;
        }
        let x = line2[1]; // okay...
        let y = x * line1[0] + line1[1]; // okay!
        return [ x, y ];
    } else {
        let x = (line2[1] - line1[1]) / line1[0] - line2[0];
        let y = x * line1[0] + line1[1];
        return [ x, y ];
    }
}

export function vectorEquals(p1, p2) {
    return p1[0] === p2[0] && p1[1] === p2[2];
}

// line1 = { p1, p2 } -- line2 = { p3, p4}
export function calcSegmentsCollision(p1, p2, p3, p4) {
    let segment1 = lineFromTwoPoints(p1, p2);
    let segment2 = lineFromTwoPoints(p3, p4);

    let coll = calcLinesCollision(segment1, segment2);
    if (!coll) return null;
    // This next line is redundant with checks done below
    // however it's like this due to JS round errors.
    // TODO: Implement a better vector comparison method
    if (vectorEquals(p1, coll) || vectorEquals(p2, coll) || vectorEquals(p3, coll) || vectorEquals(p4, coll)) {
        return coll;
    }

    // is coll in segment1 and segment2?
    let v1 = vectorFromTwoPoints(p1, p2);
    let dotSegment1 = dot(v1, v1);
    let dotPoint1 = dot(v1, vectorFromTwoPoints(p1, coll));
    if (dotPoint1 === 0) {
        // coll = p1
        // Because of JS float aproximations (and vectorEquals not including a delta for float aproximation)
        // we check here and just return p1 as the coll point
        return p1;
    } else if (dotPoint1 === dotSegment1) { // what if dotPoint1 ≈ dogSegment1? May return false negatives
        return p2;
    }
    if (dotPoint1 < 0) return null; // does not belong to segment1, so can't be valid
    if (dotPoint1 > dotSegment1) return null; // does not belong to segment1, so coll is not valid

    let v2 = vectorFromTwoPoints(p3, p4);
    let dotSegment2 = dot(v2, v2);
    let dotPoint2 = dot(v2, vectorFromTwoPoints(p3, coll));
    if (dotPoint2 === 0) {
        return p3;
    } else if (dotSegment2 === dotPoint2) {
        return p4;
    }
    if (dotPoint2 < 0) return null; // does not belong to segment2, so can't be valid
    if (dotPoint2 < dotSegment2) return coll; // belongs segment2 (and belongs to segment1 because of dotPoint < dotSegment1)

    return null;
}