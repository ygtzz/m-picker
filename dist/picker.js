(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Picker = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _objectAssign = __webpack_require__(1);

var _objectAssign2 = _interopRequireDefault(_objectAssign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Picker(opts) {
    opts = (0, _objectAssign2.default)({
        con: '.pickerc'
    }, opts);

    this.con = document.querySelector(opts.con);
    this.movec = this.con.querySelector('.pickers');
    this.pickerItems = this.movec.querySelectorAll('.picker-item');
    this.itemLen = this.pickerItems.length;
    this.viewport = this.con.querySelector('.picker-viewport');
    this.startY = 0;
    this.lastMoveY = 0;
    this.touching = true;

    //列表初始化为第一项在视口位置
    this.viewportTop = this.viewport.getBoundingClientRect().top - this.con.getBoundingClientRect().top;
    this._translate(this.movec, this.viewportTop);
    this.movecHeight = this.movec.getBoundingClientRect().height;
    this.itemHeight = this.movecHeight / this.itemLen;
    this.viewport.style.height = this.itemHeight + 'px';

    this.con.addEventListener('touchstart', this._touchstart.bind(this));
    this.con.addEventListener('touchmove', this._touchmove.bind(this));
    this.con.addEventListener('touchend', this._touchend.bind(this));
}

Picker.prototype._touchstart = function (e) {
    var touch = e.touches[0];
    this.startY = touch.pageY;
    this.lastMoveY = touch.pageY;
    this.touching = true;
};

Picker.prototype._touchmove = function (e) {
    if (this.touching) {
        e.preventDefault();
        var touch = e.touches[0];
        var moveY = touch.pageY,
            detlaY = moveY - this.lastMoveY;
        this._move(this.movec, detlaY);
        this.lastMoveY = moveY;
    }
};

Picker.prototype._touchend = function (e) {
    this.touching = false;
    var currentY = this._getTranslate(this.movec, 'y');
    var viewportTop = this.viewportTop;
    //向下超出
    var bottomBoundary = viewportTop;
    if (currentY > bottomBoundary) {
        this._translate(this.movec, bottomBoundary);
    }
    //向上超出
    var topBoundary = viewportTop - this.movecHeight + this.itemHeight;
    if (currentY < topBoundary) {
        this._translate(this.movec, topBoundary);
    }
    //中间未对其
};

Picker.prototype._move = function (dom, detlaY) {
    // var self = this,
    //     leftBoundary = self.leftBoundary,
    //     rightBoundary = self.rightBoundary;
    //     oPlayer = self.oPlayer,
    var originY = this._getTranslate(dom, 'y'),
        y = originY + detlaY;
    // x = mid(x,leftBoundary,rightBoundary);
    this._translate(dom, y);
};

Picker.prototype._translate = function (dom, y) {
    dom.style.transform = 'translate3d(0,' + y + 'px,0)';
    dom.style.webkitTransform = 'translate3d(0,' + y + 'px,0)';
};

Picker.prototype._getTranslate = function (dom, type) {
    var transform = dom.style.webkitTransform || dom.style.transform,
        reg = /translate3d\(([\w,-\s.]+)\)/,
        match = transform.match(reg),
        transRes = 0;
    if (match) {
        var sTrans = match[1],
            aTrans = sTrans.split(','),
            map = { x: 0, y: 1, z: 2 };
        if (typeof map[type] == 'undefined') {
            throw new Error('invalid translate type');
            return;
        }
        transRes = parseInt(aTrans[map[type]]);
    }
    return transRes;
};

function mid(mid, min, max) {
    if ((typeof min === 'undefined' ? 'undefined' : _typeof(min)) === undefined || min == null) {
        min = Number.NEGATIVE_INFINITY;
    }
    if ((typeof max === 'undefined' ? 'undefined' : _typeof(max)) == undefined || max == null) {
        max = Number.POSITIVE_INFINITY;
    }
    return Math.min(Math.max(min, mid), max);
}

exports.Picker = Picker;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};


/***/ })
/******/ ]);
});