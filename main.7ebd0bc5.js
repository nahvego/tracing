// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"js/keyboardController.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var KeyboardKey;

(function (KeyboardKey) {
  KeyboardKey[KeyboardKey["W"] = 0] = "W";
  KeyboardKey[KeyboardKey["A"] = 1] = "A";
  KeyboardKey[KeyboardKey["S"] = 2] = "S";
  KeyboardKey[KeyboardKey["D"] = 3] = "D";
})(KeyboardKey = exports.KeyboardKey || (exports.KeyboardKey = {}));

;
var keyMap = {
  "W": KeyboardKey.W,
  "A": KeyboardKey.A,
  "S": KeyboardKey.S,
  "D": KeyboardKey.D
}; // TODO: Update in batches
// Call a method update() on each frame and keep a copy of the arrays
// Provide a wasUpdated() method to reflect changes in eky presses

var KeyboardController =
/** @class */
function () {
  function KeyboardController() {
    this.isBind = false; //private pressMap: number = 0;

    this.pressedArray = [];
    console.debug("KeyboardController Ctor");
  }

  KeyboardController.prototype.bind = function () {
    if (this.isBind) throw new Error("Keyboard bind twice");
    console.debug("KeyboardController bind");
    this.isBind = true;
    document.addEventListener("keydown", this.onKeyDown.bind(this));
    document.addEventListener("keyup", this.onKeyUp.bind(this));
  };

  KeyboardController.prototype.isPressed = function (key) {
    return this.pressedArray.includes(key); //return (this.pressMap & key) > 0
  };

  KeyboardController.prototype.onKeyDown = function (event) {
    var key = event.key.toUpperCase();

    if (typeof keyMap[key] !== "undefined") {
      this.setPressed(keyMap[key]);
    }
  };

  KeyboardController.prototype.onKeyUp = function (event) {
    var key = event.key.toUpperCase();

    if (typeof keyMap[key] !== "undefined") {
      this.setNotPressed(keyMap[key]);
    }
  };

  KeyboardController.prototype.setPressed = function (key) {
    var idx = this.pressedArray.indexOf(key);
    if (idx >= 0) return;
    this.pressedArray.push(key); //this.pressMap |= key;
  };

  KeyboardController.prototype.setNotPressed = function (key) {
    var idx = this.pressedArray.indexOf(key);
    if (idx < 0) return;
    this.pressedArray.splice(idx, 1); //this.pressMap &= ~key;
  };

  return KeyboardController;
}();

var INSTANCE = new KeyboardController();
exports.default = INSTANCE;
},{}],"js/constants.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CANVAS_WIDTH = 500;
exports.CANVAS_HEIGHT = 500;
exports.MAX_ROUND_ERROR = 10e-5;
},{}],"js/vector.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Vector =
/** @class */
function () {
  function Vector(pv1, pv2) {
    if (typeof pv1 === "number") {
      // explicit
      this.v1 = pv1;
      this.v2 = pv2;
    } else {
      // point constructor
      this.p1 = pv1;
      this.p2 = pv2;
      this.v1 = pv2.x - pv1.x;
      this.v2 = pv2.y - pv1.y;
    } // return [ p2[0] - p1[0], p2[1] - p1[1] ];

  } // I don't know how to fit this into the constructor nicely


  Vector.fromRotation = function (size, rotation) {
    return new Vector(Math.cos(rotation), Math.sin(rotation)).scale(size);
  };

  Object.defineProperty(Vector.prototype, "magnitude", {
    get: function get() {
      if (!this._magnitude) {
        this._magnitude = Math.sqrt(this.v1 * this.v1 + this.v2 * this.v2);
      }

      return this._magnitude;
    },
    enumerable: true,
    configurable: true
  });

  Vector.prototype.equals = function (v) {
    //return this.p1.equals(v.p1) && this.p2.equals(v.p2);
    return this.v1 === v.v1 && this.v2 === v.v2;
  };

  Vector.prototype.dot = function (v) {
    return this.v1 * v.v1 + this.v2 * v.v2;
  };

  Vector.prototype.rotate = function (angle) {
    // Angle negative because of canvas coordinate origin...
    var c = Math.cos(-angle);
    var s = Math.sin(-angle);
    return new Vector(c * this.v1 - s * this.v2, s * this.v1 + c * this.v2); // x2 = cos(β)·x1 − sin(β)·y1
    // y2 = sin(β)·x1 + cos(β)·y1
  };

  Vector.prototype.invert = function () {
    return new Vector(-this.v1, -this.v2);
  };

  Vector.prototype.scale = function (scalar) {
    return new Vector(this.v1 * scalar, this.v2 * scalar);
  };

  Vector.prototype.unit = function () {
    if (this.magnitude === 0) return NULL_VECTOR;
    return new Vector(this.v1 / this.magnitude, this.v2 / this.magnitude);
  };

  Vector.prototype.clamp = function (min, max) {
    var lMin = min;
    var lMax = max || null;

    if (typeof max === "undefined") {
      lMin = null;
      lMax = min;
    }

    if (lMax !== null && this.magnitude > lMax) {
      return this.unit().scale(lMax);
    } else if (lMin !== null && this.magnitude < lMin) {
      return this.unit().scale(lMin);
    } else {
      return this;
    }
  };

  Vector.prototype.add = function (vector) {
    return new Vector(this.v1 + vector.v1, this.v2 + vector.v2);
  }; // TODO: use
  // Projection of this over otherVector


  Vector.prototype.projection = function (otherVector) {
    return this.dot(otherVector) / otherVector.magnitude;
  };

  Vector.prototype.xComponent = function () {
    return this.projection(X_VECTOR);
  };

  Vector.prototype.yComponent = function () {
    return this.projection(Y_VECTOR);
  };

  Vector.prototype.toString = function () {
    return "(" + this.v1 + ", " + this.v2 + ")";
  };

  return Vector;
}();

exports.default = Vector;
var NULL_VECTOR = new Vector(0, 0);
var X_VECTOR = new Vector(1, 0);
var Y_VECTOR = new Vector(0, 1);
},{}],"js/point.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var vector_1 = __importDefault(require("./vector")); // Inmutable!


var Point =
/** @class */
function () {
  function Point(x, y) {
    this.x = x;
    this.y = y;
  }

  Point.prototype.equals = function (p) {
    return this.x === p.x && this.y === p.y;
  };

  Point.prototype.distanceTo = function (p) {
    var a = p.x - this.x;
    var b = p.y - this.y;
    return Math.sqrt(a * a + b * b);
  };

  Point.prototype.translate = function (xv, y) {
    if (xv instanceof vector_1.default) {
      return new Point(this.x + xv.v1, this.y + xv.v2);
    } else {
      return new Point(this.x + xv, this.y + y);
    }
  };

  Point.prototype.clampX = function (min, max) {
    var mn = min;

    if (typeof max === "undefined") {
      mn = null;
      max = min;
    }

    return this.clamp(mn, max, null, null);
  };

  Point.prototype.clampY = function (min, max) {
    var mn = min;

    if (typeof max === "undefined") {
      mn = null;
      max = min;
    }

    return this.clamp(null, null, mn, max);
  };

  Point.prototype.clamp = function (minX, maxX, minY, maxY) {
    var mnX = minX;
    var mxX = maxX;
    var mnY = minY;
    var mxY = maxY;
    var nx = this.x;
    var ny = this.y;

    if (typeof minY === "undefined" && typeof maxY === "undefined") {
      // if just minX and maxX are present, this is a just max clamp
      mnX = null;
      mnY = null;
      mxX = minX;
      mxY = maxX;
    }

    if (mnX !== null && nx < mnX) {
      nx = mnX;
    } else if (mxX !== null && nx > mxX) {
      nx = mxX;
    }

    if (mnY !== null && ny < mnY) {
      ny = mnY;
    } else if (mxY !== null && ny > mxY) {
      ny = mxY;
    }

    return new Point(nx, ny);
  }; // find closest point to this one from an array


  Point.prototype.findClosest = function (points) {
    var _this = this;

    if (points.length === 0) return null;
    if (points.length === 1) return points[0];
    var indexOfLowest = -1;
    points.map(function (p) {
      return _this.distanceTo(p);
    }).reduce(function (acc, v, i) {
      if (v < acc) {
        indexOfLowest = i;
        return v;
      } else {
        return acc;
      }
    }, Infinity);
    return points[indexOfLowest]; // point or null
  };

  Point.prototype.toString = function () {
    return "(" + this.x + ", " + this.y + ")";
  };

  return Point;
}();

exports.default = Point;
},{"./vector":"js/vector.ts"}],"js/line.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var point_1 = __importDefault(require("./point"));

var vector_1 = __importDefault(require("./vector"));

var constants_1 = require("./constants");

var POINT_DELTA = 1; // Should be segment?

var Line =
/** @class */
function () {
  function Line(p1, p2) {
    this.p1 = p1;
    this.p2 = p2;

    if (Math.abs(p2.x - p1.x) < constants_1.MAX_ROUND_ERROR) {
      // line is x = N
      this.m = null;
      this.n = p1.x;
    } else {
      this.m = (p2.y - p1.y) / (p2.x - p1.x);
      this.n = p1.y - this.m * p1.x;
    }
  } // Checks if lines collide without checking segment boundaries


  Line.prototype.collisionWithUnlimited = function (line) {
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
    if (this.m === line.m) {
      return null; // nunca se cruzan 
      // TODO: o son la misma!!!!!
    } else if (this.m === null || line.m === null) {
      // any x = n???
      // we treat line as x = n
      var line1 = this;
      var line2 = line;

      if (line1.m === null) {
        // so we swap if necessary
        var l = line2;
        line2 = this;
        line1 = l;
      }

      var x = line2.n; // okay...

      var y = x * line1.m + line1.n; // okay!

      return new point_1.default(x, y);
    } else {
      var x = (line.n - this.n) / (this.m - line.m);
      var y = x * this.m + this.n;
      return new point_1.default(x, y);
      ;
    }
  }; // line1 = { p1, p2 } -- line2 = { p3, p4}
  // p1 = this.p1; p2 = this.p2; p3 = line.p1; p4 = line.p2


  Line.prototype.collidesWithLine = function (line) {
    var coll = this.collisionWithUnlimited(line);
    if (!coll) return null; // CHECK:
    // what if dotPoint = 0 || dotPoint1 = dotSegment1
    // but not in the other segment...?
    // i think this wrong somehow
    // is coll in segment1 and segment2?

    var v1 = new vector_1.default(this.p1, this.p2);
    var dotSegment1 = v1.dot(v1);
    var dotPoint1 = v1.dot(new vector_1.default(this.p1, coll)); // if (dotPoint1 === 0) {
    //     // coll = p1
    //     // Because of JS float aproximations (and vectorEquals not including a delta for float aproximation)
    //     // we check here and just return p1 as the coll point
    //     return this.p1;
    // } else if (dotPoint1 === dotSegment1) { // what if dotPoint1 ≈ dogSegment1? May return false negatives
    //     return this.p2;
    // }

    if (dotPoint1 < 0) return null; // does not belong to segment1, so can't be valid

    if (dotPoint1 > dotSegment1) return null; // does not belong to segment1, so coll is not valid

    var v2 = new vector_1.default(line.p1, line.p2);
    var dotSegment2 = v2.dot(v2);
    var dotPoint2 = v2.dot(new vector_1.default(line.p1, coll));

    if (dotPoint2 === 0) {
      return line.p1;
    } else if (dotSegment2 === dotPoint2) {
      return line.p2;
    }

    if (dotPoint2 < 0) return null; // does not belong to segment2, so can't be valid

    if (dotPoint2 < dotSegment2) return coll; // belongs segment2 (and belongs to segment1 because of dotPoint < dotSegment1)

    return null;
  }; // Makes sure point is WITHIN the segment defined between p1 and p2
  // check /collidesWithLine/


  Line.prototype.containsPoint = function (point) {
    // is coll in segment1 and segment2?
    var vec = new vector_1.default(this.p1, this.p2);
    var dotSegment = vec.dot(vec);
    var dotPoint = vec.dot(new vector_1.default(this.p1, point));
    if (dotPoint === 0 || dotPoint === dotSegment) return true; //if (Math.abs(dotPoint) <= POINT_DELTA || Math.abs(dotPoint - dotSegment) <= POINT_DELTA) return true;

    if (dotPoint < 0) return false; // does not belong to segment1, so can't be valid

    if (dotPoint < dotSegment) return true; // does not belong to segment1, so coll is not valid

    return false;
  };

  return Line;
}();

exports.default = Line;
},{"./point":"js/point.ts","./vector":"js/vector.ts","./constants":"js/constants.ts"}],"js/geometry/geometry2d.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Geometry2D =
/** @class */
function () {
  function Geometry2D() {}

  Geometry2D.prototype.logic = function (delta) {};

  ;
  return Geometry2D;
}();

exports.default = Geometry2D;
},{}],"js/geometry/square.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var line_1 = __importDefault(require("../line"));

var geometry2d_1 = __importDefault(require("./geometry2d"));

var Square =
/** @class */
function (_super) {
  __extends(Square, _super);

  function Square(origin, width, height) {
    var _this = _super.call(this) || this;

    _this.origin = origin;
    _this.width = width;
    _this.height = height;
    var ptl = _this.origin;

    var ptr = _this.origin.translate(_this.width, 0);

    var pbl = _this.origin.translate(0, _this.height);

    var pbr = _this.origin.translate(_this.width, _this.height);

    _this.tl = new line_1.default(ptl, ptr);
    _this.rl = new line_1.default(ptr, pbr);
    _this.bl = new line_1.default(pbl, pbr);
    _this.ll = new line_1.default(ptl, pbl);
    return _this;
  }

  Square.prototype.draw = function (ctx) {
    ctx.save();
    ctx.strokeStyle = "#0FF";
    ctx.strokeRect(this.origin.x, this.origin.y, this.width, this.height);
    ctx.restore();
  };

  Square.prototype.collidesWithLine = function (line) {
    // p1 y p2 es un timo!
    // hits any line hitting the square?
    var hp = [null, null, null, null];
    hp[0] = line.collidesWithLine(this.tl);
    hp[1] = line.collidesWithLine(this.rl);
    hp[2] = line.collidesWithLine(this.bl);
    hp[3] = line.collidesWithLine(this.ll); // Hay que devolver uno de los puntos de colisión...
    // Vamos a devolver el más cercano a line.p1... por si acaso (uwu)

    return line.p1.findClosest(hp.filter(function (p) {
      return p !== null;
    }));
  };

  return Square;
}(geometry2d_1.default);

exports.default = Square;
},{"../line":"js/line.ts","./geometry2d":"js/geometry/geometry2d.ts"}],"js/geometry/circle.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var vector_1 = __importDefault(require("../vector"));

var geometry2d_1 = __importDefault(require("./geometry2d"));

var Circle =
/** @class */
function (_super) {
  __extends(Circle, _super);

  function Circle(center, r) {
    var _this = _super.call(this) || this;

    _this.center = center;
    _this.r = r;
    return _this;
  }

  Circle.prototype.draw = function (ctx) {
    ctx.save();
    ctx.strokeStyle = "#00F";
    ctx.beginPath();
    ctx.arc(this.center.x, this.center.y, this.r, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.restore();
  };

  Circle.prototype.collidesWithLine = function (line) {
    // Line goes from A to B
    // Circle centers at C
    // We calculate AC projection onto AB and then translate A over AB for the projection amount
    // Then we take C and that point and measure the distance
    // θ = angle(AB, AC) - L = A·cosθ and since AB.AC = |AB||AC|cosθ => L = AB.AC / |AC|
    var vec_ab = new vector_1.default(line.p1, line.p2);
    var line_unit = vec_ab.unit();
    var vec_ac = new vector_1.default(line.p1, this.center);
    var proj = vec_ab.dot(vec_ac) / vec_ab.magnitude;
    var point = line.p1.translate(line_unit.scale(proj));
    var d = this.center.distanceTo(point);
    if (d > this.r) return null; // if d = this.r then line is tangent
    // will use a differential for aprox issues

    if (Math.abs(d - this.r) < 3 && line.containsPoint(point)) return point; // d ≈ this.r so return point
    // here d < this.r so there's two cross points
    // So we pythagoras to calculate translation of the orthogonal point
    // and translate both ways thorough \line\
    // r2 = d2 + t2

    var translation = Math.sqrt(this.r * this.r - d * d);
    var candidate1 = point.translate(line_unit.scale(translation));
    var candidate2 = point.translate(line_unit.scale(-translation));
    return line.p1.findClosest([candidate1, candidate2].filter(function (p) {
      return line.containsPoint(p);
    }));
  };

  return Circle;
}(geometry2d_1.default);

exports.default = Circle;
},{"../vector":"js/vector.ts","./geometry2d":"js/geometry/geometry2d.ts"}],"js/character.ts":[function(require,module,exports) {
"use strict";

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) {
    if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
  }
  result["default"] = mod;
  return result;
};

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var keyboardController_1 = __importStar(require("./keyboardController"));

var vector_1 = __importDefault(require("./vector"));

var constants_1 = require("./constants");

var VECTOR_ZERO = new vector_1.default(0, 0);
var VECTOR_UP = new vector_1.default(0, -1);
var VECTOR_RIGHT = new vector_1.default(1, 0);
var VECTOR_DOWN = new vector_1.default(0, 1);
var VECTOR_LEFT = new vector_1.default(-1, 0);
var CHAR_SIZE = 5; // must be odd

var CHAR_SIZE_OFFSET = (CHAR_SIZE - 1) / 2;
var SPEED = 10;

var Character =
/** @class */
function () {
  function Character(position) {
    this.position = position;
    this.acceleration = VECTOR_ZERO;
    this.speed = VECTOR_ZERO;
  }

  Character.prototype.logic = function (delta) {
    var spd = VECTOR_ZERO;

    if (keyboardController_1.default.isPressed(keyboardController_1.KeyboardKey.W)) {
      spd = spd.add(VECTOR_UP);
    }

    if (keyboardController_1.default.isPressed(keyboardController_1.KeyboardKey.D)) {
      spd = spd.add(VECTOR_RIGHT);
    }

    if (keyboardController_1.default.isPressed(keyboardController_1.KeyboardKey.S)) {
      spd = spd.add(VECTOR_DOWN);
    }

    if (keyboardController_1.default.isPressed(keyboardController_1.KeyboardKey.A)) {
      spd = spd.add(VECTOR_LEFT);
    }

    this.speed = spd.unit().scale(SPEED);
    this.position = this.position.translate(this.speed).clamp(CHAR_SIZE_OFFSET, constants_1.CANVAS_WIDTH - CHAR_SIZE_OFFSET, CHAR_SIZE_OFFSET, constants_1.CANVAS_HEIGHT - CHAR_SIZE_OFFSET);
  };

  Character.prototype.draw = function (ctx) {
    ctx.fillStyle = "#000";
    ctx.fillRect(this.position.x - CHAR_SIZE_OFFSET, this.position.y - CHAR_SIZE_OFFSET, CHAR_SIZE, CHAR_SIZE);
    ctx.fillStyle = "#0FF";
    ctx.fillRect(this.position.x, this.position.y, 1, 1);
  };

  Character.prototype.collidesWithLine = function (line) {
    return null;
  };

  return Character;
}();

exports.default = Character;
},{"./keyboardController":"js/keyboardController.ts","./vector":"js/vector.ts","./constants":"js/constants.ts"}],"js/geometry/regularPolygon.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var geometry2d_1 = __importDefault(require("./geometry2d"));

var line_1 = __importDefault(require("~js/line"));

var vector_1 = __importDefault(require("~js/vector"));

var RegularPolygon =
/** @class */
function (_super) {
  __extends(RegularPolygon, _super);

  function RegularPolygon(center, sides, sideLength, rotation) {
    var _this = _super.call(this) || this;

    if (sides < 3) {
      throw new Error("Polygons must have at least 3 sides");
    }

    _this.center = center;
    _this.sides = sides;
    _this.sideLength = sideLength;
    _this.rotation = rotation;
    _this.lines = []; // we find the points that make the polygon and join them by lines
    // start from center and calculate half height and displace center that amount
    // plus half a side in the other axis

    var sideAngle = Math.PI * (_this.sides - 2) / _this.sides;

    var point = _this.center.translate(-_this.sideLength / 2, -_this.sideLength / (2 * Math.tan(Math.PI / _this.sides)));

    var vector = new vector_1.default(_this.sideLength, 0);
    var rotationAngle = Math.PI - sideAngle; // The rotation happens on the angle OUTSIDE of the figure
    // then we get the next by creating a vector of length sideLength and angle sideAngle*N

    while (_this.lines.length < _this.sides) {
      var nextPoint = point.translate(vector);

      _this.lines.push(new line_1.default(point, nextPoint)); // Update values


      point = nextPoint;
      vector = vector.rotate(-rotationAngle); // Negative because coordinate origin of canvas (this should be abstracted away :])
    }

    return _this;
  }

  RegularPolygon.prototype.draw = function (ctx) {
    ctx.save();
    ctx.strokeStyle = "#ce033a";
    ctx.beginPath();
    ctx.moveTo(this.lines[0].p1.x, this.lines[0].p1.y);

    for (var i = 1; i < this.lines.length; i++) {
      ctx.lineTo(this.lines[i].p1.x, this.lines[i].p1.y);
    }

    ctx.lineTo(this.lines[0].p1.x, this.lines[0].p1.y);
    ctx.stroke();
    ctx.restore();
  };

  RegularPolygon.prototype.collidesWithLine = function (line) {
    // p1 y p2 es un timo!
    // hits any line hitting the square?
    var hp = this.lines.map(function (l) {
      return line.collidesWithLine(l);
    }); // Hay que devolver uno de los puntos de colisión...
    // Vamos a devolver el más cercano a line.p1... por si acaso (uwu)

    return line.p1.findClosest(hp.filter(function (p) {
      return p !== null;
    }));
  };

  return RegularPolygon;
}(geometry2d_1.default);

exports.default = RegularPolygon;
},{"./geometry2d":"js/geometry/geometry2d.ts","~js/line":"js/line.ts","~js/vector":"js/vector.ts"}],"js/main.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var keyboardController_1 = __importDefault(require("./keyboardController"));

var constants_1 = require("./constants");

var square_1 = __importDefault(require("./geometry/square")); // import Circle from "./circle";


var point_1 = __importDefault(require("./point"));

var vector_1 = __importDefault(require("./vector"));

var line_1 = __importDefault(require("./line"));

var circle_1 = __importDefault(require("./geometry/circle"));

var character_1 = __importDefault(require("./character"));

var regularPolygon_1 = __importDefault(require("./geometry/regularPolygon"));

var ANIM = true;
window.addEventListener("load", function () {
  console.debug("Init main");
  keyboardController_1.default.bind();
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var prevTime = -1;
  var CHAR = new character_1.default(new point_1.default(150, 150));
  var MAP = [new square_1.default(new point_1.default(200, 200), 100, 100), new circle_1.default(new point_1.default(100, 100), 50), new regularPolygon_1.default(new point_1.default(300, 100), 6, 20, 0), CHAR];

  function init() {
    window.requestAnimationFrame(draw);
  }

  function draw(time) {
    var delta = 0;

    if (prevTime > 0) {
      delta = time - prevTime;
    }

    prevTime = time;

    for (var _i = 0, MAP_1 = MAP; _i < MAP_1.length; _i++) {
      var object = MAP_1[_i];
      object.logic(delta);
    }

    ctx.clearRect(0, 0, constants_1.CANVAS_WIDTH, constants_1.CANVAS_HEIGHT);
    ctx.save(); // background
    // ctx.fillStyle = "#DDD";
    // ctx.strokeStyle = "#000";
    // ctx.lineWidth = 10;
    // ctx.strokeRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    // ctx.restore();

    for (var _a = 0, MAP_2 = MAP; _a < MAP_2.length; _a++) {
      var figure = MAP_2[_a];
      figure.draw(ctx);
    } // raycast


    raycast(CHAR.position, 360, 200);
    if (ANIM) window.requestAnimationFrame(draw);
  } // 3 <= rayCount <= 360;


  function raycast(origin, rayCount, raySize, firstVector) {
    if (!firstVector) {
      firstVector = new vector_1.default(1, 0);
    } // firstvector must be unitvector


    ctx.save();
    ctx.strokeStyle = "#0F05";
    ctx.lineWidth = 1;
    ctx.fillStyle = "rgba(100, 100, 100, 0.5)";
    var angle = 2 * Math.PI / rayCount;
    var firstEnd = null;
    var rayEnd = null;

    for (var i = 0; i < rayCount; i++) {
      var thisAngle = i * angle; // TODO: No recalcular cos/sin... dado que es el mismo angulo se puede calcular 1 vez

      var vector = firstVector.rotate(thisAngle);
      var dest = origin.translate(vector.scale(raySize)).clamp(constants_1.CANVAS_WIDTH, constants_1.CANVAS_HEIGHT); // collisions?

      var collidedDest = null;
      var collidedDistance = Infinity;

      for (var _i = 0, MAP_3 = MAP; _i < MAP_3.length; _i++) {
        var object = MAP_3[_i];
        if (object === CHAR) continue;
        var coll = object.collidesWithLine(new line_1.default(origin, dest));

        if (coll) {
          // ¿Is the closest collision?
          var newCollDist = origin.distanceTo(coll);

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
      } // draw correct ray
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
    } // another one to fill from first to last


    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(rayEnd.x, rayEnd.y);
    ctx.lineTo(firstEnd.x, firstEnd.y);
    ctx.lineTo(origin.x, origin.y);
    ctx.fill();
    ctx.restore();
  }

  init();
}); // window load
},{"./keyboardController":"js/keyboardController.ts","./constants":"js/constants.ts","./geometry/square":"js/geometry/square.ts","./point":"js/point.ts","./vector":"js/vector.ts","./line":"js/line.ts","./geometry/circle":"js/geometry/circle.ts","./character":"js/character.ts","./geometry/regularPolygon":"js/geometry/regularPolygon.ts"}],"../../../../Programs/nvm/nvm/v12.16.1/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "64455" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../Programs/nvm/nvm/v12.16.1/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/main.ts"], null)
//# sourceMappingURL=/main.7ebd0bc5.js.map