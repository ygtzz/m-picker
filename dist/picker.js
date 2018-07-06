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
        con: '.pickerc',
        data: [],
        change: function change() {}
    }, opts);

    var self = this;
    this.opts = opts;
    //插入html
    this._build();
    //获取dom
    this.pickerc = document.querySelector(opts.con);
    this.con = this.pickerc.querySelector('.pickerwheelc');
    this.viewport = this.con.querySelector('.picker-viewport');
    //下一步思路
    //1.将滑动数据用数组保存
    //2.将位置尺寸数据用数组保存
    // this.startY = 0;
    // this.lastMoveY = 0; 
    // this.touching = true;
    // this.touchStart = 0;
    this.transTime = 700;
    this.touches = [];
    // this.movec = this.con.querySelector('.pickers');
    // this.pickerItems = this.movec.querySelectorAll('.picker-item');
    // this.itemLen = this.pickerItems.length;
    this.wheels = Array.prototype.slice.call(this.pickerc.querySelectorAll('.picker-wheel'));
    this.wheels.forEach(function (item, index) {
        self.touches[index] = {
            startY: 0,
            lastMoveY: 0,
            touching: true,
            touchStart: 0
        };
        item.addEventListener('touchstart', self._touchstart.bind(self, item, index));
        item.addEventListener('touchmove', self._touchmove.bind(self, item, index));
        item.addEventListener('touchend', self._touchend.bind(self, item, index));
    });
    //列表初始化为第一项在视口位置
    // self.viewportTop = self.viewport.getBoundingClientRect().top - self.con.getBoundingClientRect().top;
    // self._translate(self.movec, self.viewportTop);
    // self.movecHeight = self.movec.getBoundingClientRect().height;
    // self.itemHeight = self.movecHeight / self.itemLen;
    // self.viewport.style.height = self.itemHeight + 'px';

    // this.con.addEventListener('touchstart',this._touchstart.bind(this));
    // this.con.addEventListener('touchmove',this._touchmove.bind(this));
    // this.con.addEventListener('touchend',this._touchend.bind(this));
}

Picker.prototype._build = function () {
    var data = this.opts.data;
    if (!Array.isArray(data)) {
        throw new Error('picker data must be a array');
        return;
    }
    var len = data.length,
        width = 100 / len + '%';
    var wheelHtml = data.map(function (item) {
        if (!Array.isArray(item)) {
            throw new Error('picker data must be a 2d array');
        }
        var itemHtml;
        if (typeof item[0] == 'string') {
            itemHtml = item.map(function (item) {
                return '<li class="picker-item">' + item + '</li>';
            });
        } else {
            itemHtml = item.map(function (item) {
                return '<li data-id="' + item.id + '" class="picker-item">' + item.value + '</li>';
            });
        }
        itemHtml = itemHtml.join('');
        return '<div class="picker-wheel" style="width:' + width + '">\n                    <ul class="pickers">\n                        ' + itemHtml + '\n                    </ul>\n                </div>';
    }).join('');
    var pickerHtml = '<div class="pickerc">\n                        <div class="pickerwheelc">\n                            <div class="picker-wheels">\n                                ' + wheelHtml + '\n                            </div>\n                            <div class="picker-viewport"></div>\n                            <div class="picker-wheelmask"></div>\n                        </div>\n                        <div class="picker-pagemask"></div>\n                    </div>';

    document.body.insertAdjacentHTML('beforeend', pickerHtml);
};

Picker.prototype._touchstart = function (item, index, e) {
    console.log(item, index);
    var touch = e.touches[0];
    this.startY = touch.pageY;
    this.lastMoveY = touch.pageY;
    this.touching = true;
    this.touchStart = +new Date();
    //set active wheel
    this.movec = item.querySelector('.pickers');
    this.pickerItems = item.querySelectorAll('.picker-item');
    this.itemLen = this.pickerItems.length;

    var self = this;
    self.viewportTop = self.viewport.getBoundingClientRect().top - self.con.getBoundingClientRect().top;
    self._translate(self.movec, self.viewportTop);
    self.movecHeight = self.movec.getBoundingClientRect().height;
    self.itemHeight = self.movecHeight / self.itemLen;
    self.viewport.style.height = self.itemHeight + 'px';
};

Picker.prototype._touchmove = function (e) {
    if (this.touching) {
        e.preventDefault();
        var touch = e.touches[0];
        var moveY = touch.pageY,
            detlaY = moveY - this.lastMoveY;
        this._move(this.movec, detlaY);
        this.lastMoveY = moveY;
        this.detlaY = detlaY;
    }
};

Picker.prototype._touchend = function (e) {
    var self = this;
    this.touching = false;

    var touchEnd = +new Date();
    //小于300，快滑
    var interiaRatio = 7;
    if (touchEnd - this.touchStart < 300) {
        this._translateTime(this.movec, this.detlaY * interiaRatio, 700, function () {
            self._fixScroll();
        });
    }
    //慢滑
    else {
            self._fixScroll();
        }
};

Picker.prototype._fixScroll = function () {
    var currentY = this._getTranslate(this.movec, 'y');
    var viewportTop = this.viewportTop;
    var transTime = this.transTime;
    //向下超出
    var bottomBoundary = viewportTop;
    //向上超出
    var topBoundary = viewportTop - this.movecHeight + this.itemHeight;
    var activeIndex;
    if (currentY > bottomBoundary) {
        this._translateTime(this.movec, bottomBoundary - currentY, transTime);
        activeIndex = 0;
    } else if (currentY < topBoundary) {
        this._translateTime(this.movec, topBoundary - currentY, transTime);
        activeIndex = this.itemLen - 1;
    } else {
        //中间未对其
        for (var i = 0; i < this.itemLen; i++) {
            var bottom = viewportTop - i * this.itemHeight,
                top = viewportTop - (i + 1) * this.itemHeight;
            if (top < currentY && currentY <= bottom) {
                if (Math.abs(top - currentY) < Math.abs(currentY - bottom)) {
                    this._translateTime(this.movec, top - currentY, transTime);
                    activeIndex = i + 1;
                } else {
                    this._translateTime(this.movec, bottom - currentY, transTime);
                    activeIndex = i;
                }
            }
        }
    }
    this._changeActiveItem();
    // this._fixRotate(activeIndex);
};

Picker.prototype._changeActiveItem = function () {
    //active item激活
    for (var i = 0; i < this.itemLen; i++) {
        this._removeClass(this.pickerItems[i], 'active');
    }
    this._addClass(this.pickerItems[activeIndex], 'active');
    //todo 添加activeItem content
    this.change(activeIndex);
};

Picker.prototype._fixRotate = function (activeIndex) {
    var pickerItems = this.pickerItems,
        itemLen = this.itemLen;
    for (var i = 0; i < itemLen; i++) {
        pickerItems[i].style.transform = 'rotateX(' + (i - activeIndex) * 25 + 'deg)';
    }
};

Picker.prototype._move = function (dom, detlaY) {
    var originY = this._getTranslate(dom, 'y'),
        y = originY + detlaY;
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

Picker.prototype._transitionTime = function (dom, time) {
    dom.style.transitionDuration = time + 'ms';
    dom.style.webKitTransitionDuration = time + 'ms';
};

Picker.prototype._translateTime = function (dom, distance, time, callback) {
    var self = this;
    self._transitionTime(dom, time);
    self._move(dom, distance);
    addTransitionEndOnce(dom, function () {
        self._transitionTime(dom, 0);
        callback && callback();
    }, time);
};

Picker.prototype._translateTimeAbs = function (dom, distance, time, callback) {
    var self = this;
    self._transitionTime(dom, time);
    self._translate(dom, distance);
    addTransitionEndOnce(dom, function () {
        self._transitionTime(dom, 0);
        callback && callback();
    }, time);
};

Picker.prototype._addClass = function (dom, className) {
    dom.classList.add(className);
};

Picker.prototype._removeClass = function (dom, className) {
    dom.classList.remove(className);
};

var transitionEnd = function () {
    var body = document.body || document.documentElement,
        style = body.style;
    var transEndEventNames = {
        WebkitTransition: 'webkitTransitionEnd',
        MozTransition: 'transitionend',
        OTransition: 'oTransitionEnd otransitionend',
        transition: 'transitionend'
    };
    for (var name in transEndEventNames) {
        if (typeof style[name] === "string") {
            return transEndEventNames[name];
        }
    }
}();

function addTransitionEndOnce(elem, fn, duration) {
    var called = false;
    var callback = function callback() {
        if (!called) {
            fn();
            called = true;
        }
    };
    var callbackEnd = function callbackEnd() {
        callback();
        setTimeout(callback, duration);
        elem.removeEventListener(transitionEnd, callbackEnd);
    };
    elem.addEventListener(transitionEnd, callbackEnd);
}

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