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
})({"js/elem2d.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// abstract
var Elem2D = /*#__PURE__*/function () {
  function Elem2D() {
    _classCallCheck(this, Elem2D);
  }

  _createClass(Elem2D, [{
    key: "draw",
    value: function draw(ctx) {
      throw new Error("Not implemented");
    }
  }, {
    key: "collidesWithLine",
    value: function collidesWithLine(p1, p2) {
      throw new Error("Not implemented");
    }
  }]);

  return Elem2D;
}();

exports.default = Elem2D;
},{}],"js/utils.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lineFromTwoPoints = lineFromTwoPoints;
exports.vectorFromTwoPoints = vectorFromTwoPoints;
exports.dot = dot;
exports.distanceBetweenTwoPoints = distanceBetweenTwoPoints;
exports.calcLinesCollision = calcLinesCollision;
exports.vectorEquals = vectorEquals;
exports.calcSegmentsCollision = calcSegmentsCollision;

function lineFromTwoPoints(p1, p2) {
  if (p2[0] === p1[0]) {
    // line is x = N
    return [null, p1[0]];
  } else {
    var m = (p2[1] - p1[1]) / (p2[0] - p1[0]);
    var n = p1[1] - m * p1[0];
    return [m, n];
  }
}

function vectorFromTwoPoints(p1, p2) {
  return [p2[0] - p1[0], p2[1] - p1[1]];
}

function dot(v1, v2) {
  return v1.reduce(function (acc, v, i) {
    return acc + v * v2[i];
  }, 0);
}

function distanceBetweenTwoPoints(p1, p2) {
  var w = p2[0] - p1[0];
  var h = p2[1] - p1[0];
  return Math.sqrt(w * w + h * h);
}

function calcLinesCollision(line1, line2) {
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
  } else if (line1[0] === null || line2[0] === null) {
    // any x = n???
    // we treat line2 as x = n
    if (line1[0] === null) {
      // so we swap if necessary
      var l = line2;
      line2 = line1;
      line1 = l;
    }

    var x = line2[1]; // okay...

    var y = x * line1[0] + line1[1]; // okay!

    return [x, y];
  } else {
    var _x = (line2[1] - line1[1]) / line1[0] - line2[0];

    var _y = _x * line1[0] + line1[1];

    return [_x, _y];
  }
}

function vectorEquals(p1, p2) {
  return p1[0] === p2[0] && p1[1] === p2[2];
} // line1 = { p1, p2 } -- line2 = { p3, p4}


function calcSegmentsCollision(p1, p2, p3, p4) {
  var segment1 = lineFromTwoPoints(p1, p2);
  var segment2 = lineFromTwoPoints(p3, p4);
  var coll = calcLinesCollision(segment1, segment2);
  if (!coll) return null; // This next line is redundant with checks done below
  // however it's like this due to JS round errors.
  // TODO: Implement a better vector comparison method

  if (vectorEquals(p1, coll) || vectorEquals(p2, coll) || vectorEquals(p3, coll) || vectorEquals(p4, coll)) {
    return coll;
  } // is coll in segment1 and segment2?


  var v1 = vectorFromTwoPoints(p1, p2);
  var dotSegment1 = dot(v1, v1);
  var dotPoint1 = dot(v1, vectorFromTwoPoints(p1, coll));

  if (dotPoint1 === 0) {
    // coll = p1
    // Because of JS float aproximations (and vectorEquals not including a delta for float aproximation)
    // we check here and just return p1 as the coll point
    return p1;
  } else if (dotPoint1 === dotSegment1) {
    // what if dotPoint1 ≈ dogSegment1? May return false negatives
    return p2;
  }

  if (dotPoint1 < 0) return null; // does not belong to segment1, so can't be valid

  if (dotPoint1 > dotSegment1) return null; // does not belong to segment1, so coll is not valid

  var v2 = vectorFromTwoPoints(p3, p4);
  var dotSegment2 = dot(v2, v2);
  var dotPoint2 = dot(v2, vectorFromTwoPoints(p3, coll));

  if (dotPoint2 === 0) {
    return p3;
  } else if (dotSegment2 === dotPoint2) {
    return p4;
  }

  if (dotPoint2 < 0) return null; // does not belong to segment2, so can't be valid

  if (dotPoint2 < dotSegment2) return coll; // belongs segment2 (and belongs to segment1 because of dotPoint < dotSegment1)

  return null;
}
},{}],"js/square.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _elem2d = _interopRequireDefault(require("./elem2d"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Square = /*#__PURE__*/function (_Elem2D) {
  _inherits(Square, _Elem2D);

  var _super = _createSuper(Square);

  function Square(x, y, w, h) {
    var _this;

    _classCallCheck(this, Square);

    _this = _super.call(this);
    _this.x = x;
    _this.y = y;
    _this.w = w;
    _this.h = h;
    return _this;
  }

  _createClass(Square, [{
    key: "draw",
    value: function draw(ctx) {
      ctx.save();
      ctx.strokeStyle = "#F00";
      ctx.strokeRect(this.x, this.y, this.w, this.h);
      ctx.restore();
    }
  }, {
    key: "collidesWithLine",
    value: function collidesWithLine(p1, p2) {
      // p1 y p2 es un timo!
      // hits any line hitting the square?
      var hp = [0, 0, 0, 0];
      hp[0] = (0, _utils.calcSegmentsCollision)(p1, p2, [this.x, this.y], [this.x + this.w, this.y]);
      /* top */

      hp[1] = (0, _utils.calcSegmentsCollision)(p1, p2, [this.x + this.w, this.y], [this.x + this.w, this.y + this.h]);
      /* right */

      hp[2] = (0, _utils.calcSegmentsCollision)(p1, p2, [this.x, this.y + this.h], [this.x + this.w, this.y + this.h]);
      /* bottom */

      hp[3] = (0, _utils.calcSegmentsCollision)(p1, p2, [this.x, this.y], [this.x, this.y + this.h]);
      /* left */

      hp = hp.filter(function (v) {
        return v != null;
      });
      if (hp.length === 0) return null; // Hay que devolver uno de los puntos de colisión...
      // Vamos a devolver el más cercano a p1... por si acaso (uwu)

      var indexOfLowest = -1;
      hp.map(function (coll) {
        return (0, _utils.distanceBetweenTwoPoints)(p1, coll);
      }).reduce(function (acc, v, i) {
        if (v < acc) {
          indexOfLowest = i;
          return v;
        } else {
          return acc;
        }
      }, Infinity);
      return hp[indexOfLowest]; // point or null
    }
  }]);

  return Square;
}(_elem2d.default);

exports.default = Square;
},{"./elem2d":"js/elem2d.js","./utils":"js/utils.js"}],"js/circle.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _elem2d = _interopRequireDefault(require("./elem2d"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Circle = /*#__PURE__*/function (_Elem2D) {
  _inherits(Circle, _Elem2D);

  var _super = _createSuper(Circle);

  function Circle(x, y, r) {
    var _this;

    _classCallCheck(this, Circle);

    _this = _super.call(this);
    _this.x = x;
    _this.y = y;
    _this.r = r;
    return _this;
  }

  _createClass(Circle, [{
    key: "draw",
    value: function draw(ctx) {
      ctx.save();
      ctx.strokeStyle = "#F00";
      ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.restore();
    }
  }, {
    key: "collidesWithLine",
    value: function collidesWithLine(p1, p2) {
      return null;
    }
  }]);

  return Circle;
}(_elem2d.default);

exports.default = Circle;
},{"./elem2d":"js/elem2d.js","./utils":"js/utils.js"}],"js/main.js":[function(require,module,exports) {
"use strict";

var _square = _interopRequireDefault(require("./square"));

var _circle = _interopRequireDefault(require("./circle"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var ANIM = false;
window.addEventListener("load", function () {
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var CANVAS_WIDTH = 500;
  var CANVAS_HEIGHT = 500;
  var PI = Math.PI;
  var HALF_PI = Math.PI / 2; // xd

  var CHAR_SIZE = 5; // must be odd

  var char_position = [150, 150];
  var MAP = [new _square.default(200, 200, 100, 100), new _circle.default(100, 100, 50, 50)];

  function init() {
    window.requestAnimationFrame(draw);
  }

  function draw() {
    ctx.save(); // background

    ctx.fillStyle = "#DDD";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 10;
    ctx.strokeRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.restore();

    var _iterator = _createForOfIteratorHelper(MAP),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var figure = _step.value;
        figure.draw(ctx);
      } // draw "character"

    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    ctx.fillStyle = "#000";
    ctx.fillRect(char_position[0] - (CHAR_SIZE - 1) / 2, char_position[0] - (CHAR_SIZE - 1) / 2, CHAR_SIZE, CHAR_SIZE);
    ctx.fillStyle = "#0FF";
    ctx.fillRect(char_position[0], char_position[1], 1, 1); // raycast

    raycast(char_position, 360, 200);
    if (ANIM) window.requestAnimationFrame(draw);
  } // 3 <= rayCount <= 360;


  function raycast(origin, rayCount, raySize) {
    var firstVector = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [1, 0];
    // firstvector must be unitvector
    ctx.save();
    ctx.strokeStyle = "#0F05";
    ctx.lineWidth = 1;
    ctx.fillStyle = "rgba(100, 100, 100, 0.5)";
    var angle = 2 * PI / rayCount;
    var firstEnd;
    var rayEnd;

    for (var i = 0; i < rayCount; i++) {
      var thisAngle = i * angle; // TODO: No recalcular cos/sin... dado que es el mismo angulo se puede calcular 1 vez

      var vector = rotateVector(firstVector, thisAngle);
      var dest = clampY(clampX(vecAdd(origin, vecMulScalar(vector, raySize)), CANVAS_WIDTH), CANVAS_HEIGHT); // collisions?

      var collidedDest = null;

      var _iterator2 = _createForOfIteratorHelper(MAP),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var object = _step2.value;
          var collidedDistance = Infinity;
          var coll = object.collidesWithLine(origin, dest);

          if (coll) {
            // ¿Is the closest collision?
            var newCollDist = (0, _utils.distanceBetweenTwoPoints)(origin, coll);

            if (newCollDist < collidedDistance) {
              collidedDest = coll;
              collidedDistance = newCollDist;
            }
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
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
      ctx.stroke(); // draw zones in ray

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
    } // another one to fill from first to last


    ctx.beginPath();
    ctx.moveTo(origin[0], origin[1]);
    ctx.lineTo(rayEnd[0], rayEnd[1]);
    ctx.lineTo(firstEnd[0], firstEnd[1]);
    ctx.lineTo(origin[0], origin[1]);
    ctx.fill();
    ctx.restore();
  }

  function vecMulScalar(vector, scalar) {
    return vector.map(function (a) {
      return a * scalar;
    });
  }

  function vecAdd() {
    var start = [];

    for (var _len = arguments.length, vectors = new Array(_len), _key = 0; _key < _len; _key++) {
      vectors[_key] = arguments[_key];
    }

    for (var i = 0; i < vectors[0].length; i++) {
      start.push(0);
    }

    return vectors.reduce(function (acc, vec) {
      vec.forEach(function (v, i) {
        acc[i] += v;
      });
      return acc;
    }, start);
  }

  function clampX(vector, max) {
    var min = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var v = [vector[0], vector[1]];

    if (v[0] > max) {
      v[0] = max;
    } else if (v[0] < min) {
      v[0] = min;
    }

    return v;
  }

  function clampY(vector, max) {
    var min = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var v = [vector[0], vector[1]];

    if (v[1] > max) {
      v[1] = max;
    } else if (v[1] < min) {
      v[1] = min;
    }

    return v;
  } // anti-clockwise


  function rotateVector(vector, angle) {
    var c = Math.cos(-angle);
    var s = Math.sin(-angle);
    return [c * vector[0] - s * vector[1], s * vector[0] + c * vector[1]]; // x2 = cos(β)·x1 − sin(β)·y1
    // y2 = sin(β)·x1 + cos(β)·y1
  }

  init();
}); // window load
},{"./square":"js/square.js","./circle":"js/circle.js","./utils":"js/utils.js"}],"../../../../Programs/nvm/nvm/v12.16.1/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "58869" + '/');

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
},{}]},{},["../../../../Programs/nvm/nvm/v12.16.1/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/main.js"], null)
//# sourceMappingURL=/main.fb6bbcaf.js.map