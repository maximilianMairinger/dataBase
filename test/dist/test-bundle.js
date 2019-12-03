/******/ (function(modules) { // webpackBootstrap
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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./test/src/test.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./app/src/f-db.ts":
/*!*************************!*\
  !*** ./app/src/f-db.ts ***!
  \*************************/
/*! exports provided: InvalidKey, InvalidCast, default, DataBase, DataNumber, DataArray, Data */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InvalidKey", function() { return InvalidKey; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "InvalidCast", function() { return InvalidCast; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return setData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataBase", function() { return DataBase; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataNumber", function() { return DataNumber; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataArray", function() { return DataArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Data", function() { return Data; });
// This file basically contains a observable Class (called Data) and a
// DataBase which contains a komplex (not primitiv types = objects)
// map off Observables as is often given when requesting data (e.g. JSON).
let Xrray = __webpack_require__(/*! xrray */ "./node_modules/xrray/xrray.js");
Xrray(Array);
const { InvalidValueException } = Xrray;
class InvalidKey extends Error {
    constructor(key, data) {
        super("Invalid key \"" + key + "\" for the following data structure:\n" + data.toString());
    }
}
class InvalidCast extends Error {
    constructor(castAttempt) {
        super("Cannot cast to " + castAttempt.name);
    }
}
// Formats fetched ( = raw) data into an nested Data construct.
function formatData(fetched, formatLocation, deleteUnseenVals = false) {
    if (formatLocation === undefined)
        formatLocation = new Data(new fetched.constructor());
    let ls;
    let updatedFormatLocation = false;
    if (deleteUnseenVals)
        ls = [];
    if (typeof fetched === "object") {
        for (let d in fetched) {
            if (!fetched.hasOwnProperty(d))
                continue;
            if (deleteUnseenVals)
                ls.add(d);
            if (typeof fetched[d] === "object") {
                if (formatLocation.val[d] === undefined)
                    formatLocation.val[d] = new Data(new fetched[d].constructor());
                formatData(fetched[d], formatLocation.val[d], deleteUnseenVals);
                updatedFormatLocation = true;
            }
            else if (formatLocation.val[d] === undefined) {
                formatLocation.val[d] = new Data(fetched[d]);
                updatedFormatLocation = true;
            }
            else if (formatLocation.val[d] instanceof Data)
                formatLocation.val[d].val = fetched[d];
        }
        if (deleteUnseenVals) {
            for (let d in formatLocation.val) {
                if (!formatLocation.val.hasOwnProperty(d))
                    continue;
                if (!ls.includes(d))
                    if (formatLocation.val instanceof Array)
                        formatLocation.val.removeI(parseInt(d));
                    else
                        delete formatLocation.val[d];
                updatedFormatLocation = true;
            }
        }
        //@ts-ignore when something is added notify listeners
        if (updatedFormatLocation)
            formatLocation.notify(true);
    }
    else
        formatLocation.val = fetched;
    return formatLocation;
}
function setData(data, location, complete) {
    if (!(location instanceof Data) && location !== undefined)
        location = new Data(location);
    let dataLocation = formatData(data, location);
    if (complete !== undefined)
        complete();
    return new DataBase(dataLocation);
}
/*
 * Holds and handles access to an complex map of data. This data Consisits of in each other nexted Data intsances
 * (to init such an map, consult formatData.)
 */
class DataBase {
    constructor(data) {
        this.data = data;
    }
    toString() {
        return "DataBase: " + this.data.toString();
    }
    /**
     * Gets a reference to subData found under given key(s) / path
     * A reference is a new DataBase instance just containing the referenced Data
     *
     * This function resolves references via the "recursively anchored Data" (rad) procedure. For further
     * insights what this means please consult the documentation of the function rad
     */
    ref(...keys) {
        return new DataBase(this.rad(...keys));
    }
    peek(...keys) {
        return new DataBase(this.fds(...keys));
    }
    current(...keys) {
        return (this.fds(...keys)).val;
    }
    /**
     * Gets the underlying Data found under given key(s) / path
     * Similar to ref but not wrapped inside a DataBase instance
     *
     * This function resolves references via the "recursively anchored Data" (rad) procedure. For further
     * insights what this means please consult the documentation of the function rad
     */
    get(key, cb) {
        if (typeof key === "string" || typeof key === "number" || key instanceof Data) {
            let data = (key instanceof Data) ? key : this.rad(key);
            if (cb !== undefined) {
                data.subscribe(cb);
            }
            else {
                return data;
            }
        }
        else {
            let map = [];
            if (cb !== undefined) {
                for (let i = 0; i < key.length; i++) {
                    //@ts-ignore
                    let data = (key[i] instanceof Data) ? key[i] : this.rad(key[i]);
                    const subscribtion = (v) => {
                        map[i] = v;
                        if (key.length === map.length) {
                            if (cb !== undefined) {
                                cb(...map);
                            }
                            else
                                return map;
                        }
                    };
                    data.subscribe(subscribtion);
                }
            }
            else {
                for (let i = 0; i < key.length; i++) {
                    //@ts-ignore
                    map[i] = (key[i] instanceof Data) ? key[i] : this.rad(key[i]);
                }
                return map;
            }
        }
    }
    set(key, to) {
        let fds = this.fds(key);
        formatData(to, fds, true);
    }
    /**
     * Gets recursively anchored Data (rad)
     * Meaning for each nesting step there will be one listener attatched to enable objects to be observed
     * This is very resource (mem) expensive. Use only when necessary
     */
    rad(...keys) {
        let last = this.data;
        let organizedKeys = keys.join(".").split(".");
        organizedKeys.ea((k) => {
            if (k !== "") {
                let next = last.val[k];
                if (next === undefined)
                    throw new InvalidKey(k, last);
                //@ts-ignore
                last.subscribeInternally((any) => {
                    let a = any[k];
                    let dt = a instanceof Data;
                    if (!(typeof a === "object" && !dt))
                        next.val = (dt) ? a.val : a;
                });
                last = next;
            }
        });
        return last;
    }
    fds(...keys) {
        let last = this.data;
        let organizedKeys = keys.join(".").split(".");
        organizedKeys.ea((k) => {
            if (k !== "") {
                let next = last.val[k];
                if (next === undefined)
                    throw new InvalidKey(k, last);
                last = next;
            }
        });
        return last;
    }
    //TODO: make this available for DB as a whole and limit acces via interfaces (conditinal types)
    get asArray() {
        //@ts-ignore
        if (this.data.val instanceof Array)
            return new DataArray(this.data);
        else
            throw new InvalidCast(Array);
    }
    get asNumber() {
        //@ts-ignore
        if (typeof this.data.val === "number")
            return new DataNumber(this.data);
        else
            throw new InvalidCast(Number);
    }
    equals(that) {
        return (that === undefined) ? false : this.data.equals(that.data, true);
    }
    same(that) {
        return this.data.val === that.data.val;
    }
}
class DataNumber extends DataBase {
    constructor(data) {
        super(data);
    }
    inc(by = 1) {
        this.data.val += by;
        return this.data.val;
    }
    dec(by = 1) {
        this.data.val -= by;
        return this.data.val;
    }
}
class DataArray extends DataBase {
    constructor(data) {
        super(data);
    }
    list(loop, stepIntoPathAfterwards = "") {
        for (let i = 0; i < this.length(); i++) {
            let end = loop(new DataBase(this.fds(i, stepIntoPathAfterwards)), i);
            if (end !== undefined)
                return end;
        }
    }
    forEach(loop, beforeLoop, afterLoop, stepIntoPathAfterwards = "") {
        let proms = [];
        this.get("", () => {
            if (beforeLoop !== undefined)
                proms.add(beforeLoop());
            this.data.val.ea((e, i) => {
                proms.add(loop(new DataBase(this.fds(i, stepIntoPathAfterwards)), i));
            });
            proms = proms.filter((e) => {
                return e instanceof Promise;
            });
            if (afterLoop !== undefined) {
                if (proms.length === 0)
                    Promise.all(proms).then(afterLoop);
                else
                    afterLoop();
            }
        });
        if (proms.length !== 0)
            return Promise.all(proms);
    }
    length(cb) {
        if (cb === undefined)
            return this.data.val.length;
        else {
            this.get("", (a) => {
                cb(a.length);
            });
        }
    }
    realLength(cb) {
        if (cb === undefined)
            return this.data.val.realLength;
        else {
            this.get("", (a) => {
                cb(a.realLength);
            });
        }
    }
    alter(cb, initalizeLoop = false) {
        this.beforeLastChange = this.data.clone();
        if (initalizeLoop) {
            this.data.val.ea((e, i) => {
                cb(new DataBase(e), i);
            });
        }
        this.get("", (a) => {
            let indexesToBeCalled = [];
            a.ea((e, i) => {
                if (e !== undefined) {
                    indexesToBeCalled.add(i);
                    if (!e.equals(this.beforeLastChange.val[i], true))
                        cb(new DataBase(e), i);
                }
            });
            this.beforeLastChange.val.ea((e, i) => {
                if (!indexesToBeCalled.includes(i))
                    cb(null, i);
            });
            this.beforeLastChange = this.data.clone();
        });
    }
    morph(cb, initalizeLoop = false) {
        this.beforeLastChange = this.data.clone();
        if (initalizeLoop) {
            this.data.val.ea((e, i) => {
                cb(new DataBase(e), i);
            });
        }
        let cba = DataArray.morphMap.get(this.data);
        if (cba === undefined)
            DataArray.morphMap.set(this.data, [cb]);
        else
            cba.add(cb);
    }
    add(val, atIndex) {
        let length = this.length();
        let maxIndex = length - 1;
        if (atIndex === undefined)
            atIndex = length;
        this.data.val.Reverse().ea((e, i) => {
            i = maxIndex - i;
            if (i < atIndex)
                return;
            //THIS IF IS NECESSARY BECAUSE WHEN SETTING EMPTY ARRAY SOLOTS TO UNDEFINED THEY GET PICKED UP BY ITERATORS
            if (this.data.val[i] === undefined)
                delete this.data.val[i + 1];
            else
                this.data.val[i + 1] = this.data.val[i];
        });
        delete this.data.val[atIndex];
        let ob = {};
        ob[atIndex] = val;
        formatData(ob, this.data);
        let cba = DataArray.morphMap.get(this.data);
        if (cba !== undefined)
            cba.ea((f) => {
                f(new DataBase(this.data.val[atIndex]), atIndex);
            });
    }
    removeI(index, closeGap = true) {
        if (closeGap)
            this.data.val.removeI(index);
        else
            delete this.data.val[index];
        //@ts-ignore
        this.data.notify(true);
        let cba = DataArray.morphMap.get(this.data);
        if (cba !== undefined)
            cba.ea((f) => {
                f(null, index);
            });
    }
    removeV(val, closeGap = true) {
        let data = formatData(val);
        let index = this.data.val.ea((e, i) => {
            if (e.equals(data))
                return i;
        });
        if (index === undefined)
            throw new InvalidValueException(val, this.data.toString());
        if (closeGap)
            this.data.val.removeI(index);
        else
            delete this.data.val[index];
        //@ts-ignore
        this.data.notify(true);
        let cba = DataArray.morphMap.get(this.data);
        if (cba !== undefined)
            cba.ea((f) => {
                f(null, index);
            });
    }
}
DataArray.morphMap = new Map();
class Data {
    constructor(val) {
        this.cbs = [];
        this.internalCBs = [];
        this.val = val;
    }
    /**
     * Set the val
     */
    set val(to) {
        if (this.val === to)
            return;
        this._val = to;
        this.notify(false);
    }
    /**
     * Gets the current val
     */
    get val() {
        return this._val;
    }
    /**
     * Subscribe to val
     * @param cb callback which gets called whenever the val changes
     */
    subscribe(cb, init = true) {
        this.cbs.add(cb);
        if (init)
            cb(this.val);
    }
    subscribeInternally(cb) {
        this.internalCBs.add(cb);
        cb(this.val);
    }
    unsubscribe(cb) {
        if (cb !== null)
            this.cbs.remove(cb);
        else
            this.cbs.clear();
    }
    toString(tabIn = 0, insideObject = false) {
        tabIn++;
        let s = "";
        let v = this.val;
        if (typeof v === "object") {
            let hasProps = false;
            let ar = v instanceof Array;
            if (ar)
                s += "[";
            else
                s += "{";
            s += "\n";
            for (let k in v) {
                if (!v.hasOwnProperty(k))
                    continue;
                hasProps = true;
                //@ts-ignore
                s += "\t".repeat(tabIn) + k + ": " + v[k].toString(tabIn, true);
            }
            if (!hasProps)
                s = s.substring(0, s.length - 1);
            else {
                s = s.substring(0, s.length - 2) + "\n";
                s += "\t".repeat(tabIn - 1);
            }
            if (ar)
                s += "]";
            else
                s += "}";
        }
        else {
            let st = typeof v === "string";
            if (st)
                s += "\"";
            s += v;
            if (st)
                s += "\"";
        }
        s += insideObject ? "," : "";
        return s + "\n";
    }
    notify(wild = false) {
        let val = this.val;
        this.cbs.ea((f) => {
            f(val);
        });
        if (!wild) {
            this.internalCBs.ea((f) => {
                f(val);
            });
        }
    }
    /**
     * Compares if all keys in this are equal to the equivelent ones on data
     * Different Data Instances holding the same value are the equal
     * Data can have more keys than this and still be equal.
     * If you dont want this pass in true to the strict param. This will be more recource intensive
     */
    equals(data, strict = false) {
        let v = this.val;
        if (data === undefined || data === null)
            return false;
        let d = data.val;
        if (v == d)
            return true;
        let ls;
        if (strict)
            ls = [];
        for (let k in v) {
            if (!v.hasOwnProperty(k))
                continue;
            if (strict)
                ls.add(k);
            if (v[k] !== d[k]) {
                if (v[k] instanceof Data) {
                    if (d[k] instanceof Data) {
                        //@ts-ignore
                        if (!v[k].equals(d[k], strict))
                            return false;
                    }
                    else
                        return false;
                }
                else
                    return false;
            }
        }
        if (strict) {
            for (let k in d) {
                if (!v.hasOwnProperty(k))
                    continue;
                if (!ls.includes(k))
                    return false;
            }
        }
        return true;
    }
    clone() {
        let d;
        let v = this.val;
        if (typeof v === "object") {
            //@ts-ignore
            let data = new v.constructor();
            d = new Data(data);
            for (let k in v) {
                if (!v.hasOwnProperty(k))
                    continue;
                //@ts-ignore
                d.val[k] = v[k].clone();
            }
        }
        else
            d = new Data(v);
        d.internalCBs.add(...this.internalCBs);
        d.cbs.add(...this.cbs);
        return d;
    }
}


/***/ }),

/***/ "./node_modules/delay/index.js":
/*!*************************************!*\
  !*** ./node_modules/delay/index.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const createAbortError = () => {
	const error = new Error('Delay aborted');
	error.name = 'AbortError';
	return error;
};

const createDelay = ({clearTimeout: defaultClear, setTimeout: set, willResolve}) => (ms, {value, signal} = {}) => {
	if (signal && signal.aborted) {
		return Promise.reject(createAbortError());
	}

	let timeoutId;
	let settle;
	let rejectFn;
	const clear = defaultClear || clearTimeout;

	const signalListener = () => {
		clear(timeoutId);
		rejectFn(createAbortError());
	};

	const cleanup = () => {
		if (signal) {
			signal.removeEventListener('abort', signalListener);
		}
	};

	const delayPromise = new Promise((resolve, reject) => {
		settle = () => {
			cleanup();
			if (willResolve) {
				resolve(value);
			} else {
				reject(value);
			}
		};

		rejectFn = reject;
		timeoutId = (set || setTimeout)(settle, ms);
	});

	if (signal) {
		signal.addEventListener('abort', signalListener, {once: true});
	}

	delayPromise.clear = () => {
		clear(timeoutId);
		timeoutId = null;
		cleanup();
		settle();
	};

	return delayPromise;
};

const delay = createDelay({willResolve: true});
delay.reject = createDelay({willResolve: false});
delay.createWithTimers = ({clearTimeout, setTimeout}) => {
	const delay = createDelay({clearTimeout, setTimeout, willResolve: true});
	delay.reject = createDelay({clearTimeout, setTimeout, willResolve: false});
	return delay;
};

module.exports = delay;
// TODO: Remove this for the next major release
module.exports.default = delay;


/***/ }),

/***/ "./node_modules/xrray/xrray.js":
/*!*************************************!*\
  !*** ./node_modules/xrray/xrray.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = (function() {
  'use strict';
  class Exception extends Error {
    constructor(msg) {
      super();
      this.message = this.constructor.name;
      if (msg !== undefined) this.message += ": " + msg;
    }
  }
  class IndexOutOfBoundsException extends Exception {
    constructor(index, array) {
      super("Given value \"" + index + "\" must be in range 0-" + (array.length-1) + ".");
      this.index = index;
      this.array = array;
    }
  }
  class InvalidInputException extends Exception {
    constructor(msg) {
      super("Given input is invalid.\n" + msg);
    }
  }
  class InvalidConstructorException extends Exception{
    constructor(msg = "") {
      super("Given constructor must inherit form Array.\n" + msg);
    }
  }
  class InvalidValueException extends Exception {
    constructor(value, array) {
      super("Unable to find given value: " + value.constructor.name + " " + JSON.stringify(value) + "; within following array: " + array.toString());
      this.value = value;
      this.array = array;
    }
  }

  //Throws IndexOutOfBoundsException when given index is out of bounds of a
  function isIndex(i, a) {
    if(!a.hasOwnProperty(i)) throw new IndexOutOfBoundsException(i,a);
  }

  const ar = "xrray";

  function init(ArConstr = Array) {
    if(!(new ArConstr() instanceof Array)) throw new InvalidConstructorException();
    if (ArConstr.xrray === ar) return ArConstr;

    ArConstr.xrray = ar;

    let p = ArConstr.prototype;

    p.each = p.ea = function(f, t = this) {
      if (this.length > 0) {
        let e;
        let startI;
        for (startI = 0; startI < t.length; startI++) {
          if (t.hasOwnProperty(startI)) {
            e = f.call(t, t[startI], startI, this);
            break;
          }
        }
        startI++;
        if (e instanceof Promise) {
          return (async () => {
            let r = await e;
            if (r !== undefined) return r;

            for (let i = startI; i < t.length; i++) {
              if (!t.hasOwnProperty(i)) continue;
              let e = await f.call(t, t[i], i, this);
              if (e !== undefined) return e;
            }
          })();
        }
        else {
          if (e !== undefined) return e;
          for (let i = startI; i < t.length; i++) {
            if (!t.hasOwnProperty(i)) continue;
            let e = f.call(t, t[i], i, this);
            if (e !== undefined) return e;
          }
        }
      }
    }

    Object.defineProperty(p, "empty", {get() {
      return this.length === 0;
    }});

    Object.defineProperty(p, "last", {get() {
      if(this.length === 0) return undefined;
      return this[this.length-1];
    }});

    Object.defineProperty(p, "realLength", {get() {
      let l = 0;
      for (let i = 0; i < this.length; i++) {
        if (this.hasOwnProperty(i)) l++;
      }
      return l;
    }});

    Object.defineProperty(p, "first", {get() {
      return this[0];
    }});

    p.clear = function() {
      this.length = 0;
      return this;
    }
    p.Clear = function() {
      return new ArConstr();
    }

    p.add = function(...values) {
      this.push(...values);
      return this;
    }
    p.Add = function(...values) {
      return new ArConstr().add(...this).add(...values);
    }

    p.set = function(a = []) {
      if(this === a) return this;
      if(a instanceof Array) return this.clear().add(...a);
      return this.clear().add(a);
    }
    p.Set = function(a = []) {
      return new ArConstr().add(...a);
    }

    p.clone = function() {
      return this.Set(this);
    }

    p.Reverse = function() {
      return this.Set(this).reverse();
    }

    p.gather = function(...a) {
      a.ea((e) => {
        if (!this.includes(e)) this.add(e);
      })
      return this;
    }

    p.Gather = function(...a) {
      let t = this.clone();
      a.ea((e) => {
        if (!t.includes(e)) t.add(e);
      })
      return t;
    }

    let mark = {};

    //Throws InvalidValueException when the given value cannot be found withing this
    // TODO: differentate indexall and indexfirst
    p.index = function(...values) {
      let that = this.Set(this);
      let indexes = new ArConstr();
      values.ea((v) => {
        if(!this.includes(v)) throw new InvalidValueException(v,this);
        while (true) {
          let index = that.indexOf(v);
          if (indexes.last !== index && index !== -1){
            indexes.add(index);
            that[index] = mark;
          }
          else break;
        }
      });
      return indexes;
    }
    //Throws IndexOutOfBoundsException when given index is out of bounds of this
    p.removeI = function(...indices) {
      let rollback = this.Set(this);
      try {
        for (let i = 0; i < indices.length; i++) {
          isIndex(indices[i], this)
          this[indices[i]] = mark;
        }
        for (let i = 0; i < this.length; i++) {
          if (this[i] === mark) {
            this.splice(i, 1);
            i--;
          }
        }
      } catch (e) {
        if (e instanceof IndexOutOfBoundsException) this.set(rollback);
        throw e;
      }
      return this;
    }
    p.rmI = p.removeI;
    //Throws IndexOutOfBoundsException when given index is out of bounds of this
    p.RemoveI = function(...indices) {
      return this.Set(this).removeI(...indices);
    }
    p.RmI = p.RemoveI;

    //Throws InvalidValueException when the given value cannot be found withing this
    p.removeV = function(...values) {
      return this.removeI(...this.index(...values));
    }
    p.rmV = p.removeV;

    //Throws InvalidValueException when the given value cannot be found withing this
    p.RemoveV = function(...values) {
      return this.Set(this).removeV(...values);
    }
    p.RmV = p.RemoveV;

    //Throws InvalidValueException when the given param is detected as value but cannot be found withing this
    p.remove = function(...valueOrIndex) {
      try {
        this.removeI(...valueOrIndex);
      } catch (e) {
        if (e instanceof IndexOutOfBoundsException) this.removeV(...valueOrIndex);
        else throw e;
      }
      return this;
    }
    p.rm = p.remove;

    //Throws IndexOutOfBoundsException when given param is detected as index but out of bounds of this
    //Throws InvalidValueException when the given param is detected as value but cannot be found withing this
    p.Remove = function(...valueOrIndex) {
      return this.Set(this).remove(...valueOrIndex);
    }
    p.Rm = p.Remove;

    p.Get = function(...indexes) {
      let n = [];
      indexes.flat(Infinity).forEach((i) => {
        n.add(this[i]);
      });
      return n;
    }
    p.get = function(...indexes) {
      return this.set(this.Get(...indexes))
    }

    p.dda = function(...values) {
      return this.reverse().add(...values).reverse();
    }
    p.Dda = function(...values) {
      return this.Reverse().add(...values).reverse();
    }

    //Throws IndexOutOfBoundsException when given index is out of bounds of a
    p.rem = function(amount) {
      isIndex(amount,this);
      this.length -= amount;
      return this;
    }
    //Throws IndexOutOfBoundsException when given index is out of bounds of a
    p.Rem = function(amount) {
      return this.Set(this).rem(amount);
    }

    //Throws IndexOutOfBoundsException when given index is out of bounds of a
    p.mer = function(amount) {
      return this.reverse().rem(amount).reverse();
    }
    //Throws IndexOutOfBoundsException when given index is out of bounds of a
    p.Mer = function(amount) {
      return this.Reverse().rem(amount).reverese();
    }

    //Throws IndexOutOfBoundsException when given index(es) are out of bounds of this
    //Throws InvalidInputException when given parameters are not equal in length
    p.swapI = function(i1, i2) {
      i1 = [i1].flat(Infinity);
      i2 = [i2].flat(Infinity);
      if(i1.length === i2.length) {
        let rollback = this.Set(this);
        try {
          for (let i = 0; i < i1.length; i++) {
            isIndex(i1[i],this);
            isIndex(i2[i],this);
            [this[i1[i]],this[i2[i]]] = [this[i2[i]],this[i1[i]]];
          }
        } catch (e) {
          if(e instanceof IndexOutOfBoundsException) this.set(rollback);
          throw e;
        }
        return this;
      }
      throw new InvalidInputException("Parameter i1 and i2 must ether be two indexes, or two index-Arrays of the same length.");
    }
    //Throws IndexOutOfBoundsException when given index(es) are out of bounds of this
    //Throws InvalidInputException when given parameters are not equal in length
    p.SwapI = function(i1, i2) {
      return this.Set(this).swapI(i1, i2);
    }

    //Throws InvalidValueException when the given value cannot be found withing this
    //Throws InvalidInputException when given parameters are not equal in length
    p.swapV = function(v1, v2) {
      v1 = this.Set(v1).flat(2);
      v2 = this.Set(v2).flat(2);
      if (v1.length === v2.length) {
        for (var i = 0; i < v1.length; i++) {
          this.swapI(this.index(v1[i]),this.index(v2[i]));
        }
        return this;
      }
      throw new InvalidInputException("Parameter v1 and v2 must ether be two values, or two value-Arrays of the same length.");
    }
    //Throws InvalidValueException when the given value cannot be found withing this
    //Throws InvalidInputException when given parameters are not equal in length
    p.SwapV = function(v1, v2) {
      return this.Set(this).swapV(v1, v2);
    }

    //Throws IndexOutOfBoundsException when given param is detected as index but out of bounds of this
    //Throws InvalidValueException when the given param is detected as value but cannot be found withing this
    p.swap = function(vi1, vi2) {
      try {
        this.swapI(vi1, vi2);
      } catch (e) {
        if (e instanceof IndexOutOfBoundsException) this.swapV(vi1, vi2);
        else throw e;
      }
      return this;
    }
    //Throws IndexOutOfBoundsException when given param is detected as index but out of bounds of this
    //Throws InvalidValueException when the given param is detected as value but cannot be found withing this
    p.Swap = function(vi1, vi2) {
      return this.Set(this).swap(vi1, vi2)
    }

    p.prior = function(i, by = 1) {
      let r = i - by;
      if (r >= 0) return this[r];
      return this[this.length-(by-i)]
    }
    p.next = function(i, by = 1) {
      let r = i + by;
      if (r <= this.length-1) return this[r];
      return this[by-(i-this.length-1)]
    }

    p.inject = function(item, index) {
      this.splice(index, 0, item);
      return this
    }

    p.contains = function(...vals) {
      for (let v of vals) {
        if (!this.includes(v)) return false
      }
      return true
    }
    p.excludes = function(...vals) {
      for (let v of vals) {
        if (this.includes(v)) return false
      }
      return true
    }

    return ArConstr
  }
  init.Exception = Exception;
  init.IndexOutOfBoundsException = IndexOutOfBoundsException;
  init.InvalidInputException = InvalidInputException;
  init.InvalidConstructorException = InvalidConstructorException;
  init.InvalidValueException = InvalidValueException;
  //init.version = "unknown";
  return init;
}());


/***/ }),

/***/ "./test/src/test.ts":
/*!**************************!*\
  !*** ./test/src/test.ts ***!
  \**************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _app_src_f_db__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../../app/src/f-db */ "./app/src/f-db.ts");
/* harmony import */ var delay__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! delay */ "./node_modules/delay/index.js");
/* harmony import */ var delay__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(delay__WEBPACK_IMPORTED_MODULE_1__);


let data = {
    nested: {
        prop: "val"
    },
    num: 123
};
let db = Object(_app_src_f_db__WEBPACK_IMPORTED_MODULE_0__["default"])(data);
db.get("num", (num) => {
    console.log("num: " + num);
});
delay__WEBPACK_IMPORTED_MODULE_1___default()(1000).then(() => {
    db.set("num", 1);
});


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vYXBwL3NyYy9mLWRiLnRzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9kZWxheS9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMveHJyYXkveHJyYXkuanMiLCJ3ZWJwYWNrOi8vLy4vdGVzdC9zcmMvdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLG1CQUFPLENBQUMsNENBQU87QUFDM0I7QUFDQSxPQUFPLHdCQUF3QjtBQUN4QjtBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQixnQkFBZ0I7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsZ0JBQWdCO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsbUJBQW1CO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUI7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUMzZ0JhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsc0JBQXNCLHlEQUF5RCxXQUFXLGNBQWMsS0FBSztBQUM3RztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBLG9EQUFvRCxXQUFXO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLDJCQUEyQixrQkFBa0I7QUFDN0MsNEJBQTRCLG1CQUFtQjtBQUMvQywyQkFBMkIseUJBQXlCO0FBQ3BELDRCQUE0Qiw0Q0FBNEM7QUFDeEUsNkJBQTZCLDZDQUE2QztBQUMxRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0dBQXNHO0FBQ3RHO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixtQkFBbUI7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsZ0NBQWdDLGNBQWM7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsOEJBQThCLGNBQWM7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsdUNBQXVDO0FBQ3ZDO0FBQ0EsTUFBTTs7QUFFTixzQ0FBc0M7QUFDdEM7QUFDQTtBQUNBLE1BQU07O0FBRU4sNENBQTRDO0FBQzVDO0FBQ0EscUJBQXFCLGlCQUFpQjtBQUN0QztBQUNBO0FBQ0E7QUFDQSxNQUFNOztBQUVOLHVDQUF1QztBQUN2QztBQUNBLE1BQU07O0FBRU47QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixvQkFBb0I7QUFDM0M7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLGlCQUFpQjtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCLGVBQWU7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixlQUFlO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7Ozs7Ozs7Ozs7OztBQ2pYRDtBQUFBO0FBQUE7QUFBQTtBQUEyQztBQUNqQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFNBQVMsNkRBQU87QUFDaEI7QUFDQTtBQUNBLENBQUM7QUFDRCw0Q0FBSztBQUNMO0FBQ0EsQ0FBQyIsImZpbGUiOiJ0ZXN0L2Rpc3QvdGVzdC1idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi9cIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi90ZXN0L3NyYy90ZXN0LnRzXCIpO1xuIiwiLy8gVGhpcyBmaWxlIGJhc2ljYWxseSBjb250YWlucyBhIG9ic2VydmFibGUgQ2xhc3MgKGNhbGxlZCBEYXRhKSBhbmQgYVxyXG4vLyBEYXRhQmFzZSB3aGljaCBjb250YWlucyBhIGtvbXBsZXggKG5vdCBwcmltaXRpdiB0eXBlcyA9IG9iamVjdHMpXHJcbi8vIG1hcCBvZmYgT2JzZXJ2YWJsZXMgYXMgaXMgb2Z0ZW4gZ2l2ZW4gd2hlbiByZXF1ZXN0aW5nIGRhdGEgKGUuZy4gSlNPTikuXHJcbmxldCBYcnJheSA9IHJlcXVpcmUoXCJ4cnJheVwiKTtcclxuWHJyYXkoQXJyYXkpO1xyXG5jb25zdCB7IEludmFsaWRWYWx1ZUV4Y2VwdGlvbiB9ID0gWHJyYXk7XHJcbmV4cG9ydCBjbGFzcyBJbnZhbGlkS2V5IGV4dGVuZHMgRXJyb3Ige1xyXG4gICAgY29uc3RydWN0b3Ioa2V5LCBkYXRhKSB7XHJcbiAgICAgICAgc3VwZXIoXCJJbnZhbGlkIGtleSBcXFwiXCIgKyBrZXkgKyBcIlxcXCIgZm9yIHRoZSBmb2xsb3dpbmcgZGF0YSBzdHJ1Y3R1cmU6XFxuXCIgKyBkYXRhLnRvU3RyaW5nKCkpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBjbGFzcyBJbnZhbGlkQ2FzdCBleHRlbmRzIEVycm9yIHtcclxuICAgIGNvbnN0cnVjdG9yKGNhc3RBdHRlbXB0KSB7XHJcbiAgICAgICAgc3VwZXIoXCJDYW5ub3QgY2FzdCB0byBcIiArIGNhc3RBdHRlbXB0Lm5hbWUpO1xyXG4gICAgfVxyXG59XHJcbi8vIEZvcm1hdHMgZmV0Y2hlZCAoID0gcmF3KSBkYXRhIGludG8gYW4gbmVzdGVkIERhdGEgY29uc3RydWN0LlxyXG5mdW5jdGlvbiBmb3JtYXREYXRhKGZldGNoZWQsIGZvcm1hdExvY2F0aW9uLCBkZWxldGVVbnNlZW5WYWxzID0gZmFsc2UpIHtcclxuICAgIGlmIChmb3JtYXRMb2NhdGlvbiA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgIGZvcm1hdExvY2F0aW9uID0gbmV3IERhdGEobmV3IGZldGNoZWQuY29uc3RydWN0b3IoKSk7XHJcbiAgICBsZXQgbHM7XHJcbiAgICBsZXQgdXBkYXRlZEZvcm1hdExvY2F0aW9uID0gZmFsc2U7XHJcbiAgICBpZiAoZGVsZXRlVW5zZWVuVmFscylcclxuICAgICAgICBscyA9IFtdO1xyXG4gICAgaWYgKHR5cGVvZiBmZXRjaGVkID09PSBcIm9iamVjdFwiKSB7XHJcbiAgICAgICAgZm9yIChsZXQgZCBpbiBmZXRjaGVkKSB7XHJcbiAgICAgICAgICAgIGlmICghZmV0Y2hlZC5oYXNPd25Qcm9wZXJ0eShkKSlcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICBpZiAoZGVsZXRlVW5zZWVuVmFscylcclxuICAgICAgICAgICAgICAgIGxzLmFkZChkKTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBmZXRjaGVkW2RdID09PSBcIm9iamVjdFwiKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZm9ybWF0TG9jYXRpb24udmFsW2RdID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgZm9ybWF0TG9jYXRpb24udmFsW2RdID0gbmV3IERhdGEobmV3IGZldGNoZWRbZF0uY29uc3RydWN0b3IoKSk7XHJcbiAgICAgICAgICAgICAgICBmb3JtYXREYXRhKGZldGNoZWRbZF0sIGZvcm1hdExvY2F0aW9uLnZhbFtkXSwgZGVsZXRlVW5zZWVuVmFscyk7XHJcbiAgICAgICAgICAgICAgICB1cGRhdGVkRm9ybWF0TG9jYXRpb24gPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGZvcm1hdExvY2F0aW9uLnZhbFtkXSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBmb3JtYXRMb2NhdGlvbi52YWxbZF0gPSBuZXcgRGF0YShmZXRjaGVkW2RdKTtcclxuICAgICAgICAgICAgICAgIHVwZGF0ZWRGb3JtYXRMb2NhdGlvbiA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoZm9ybWF0TG9jYXRpb24udmFsW2RdIGluc3RhbmNlb2YgRGF0YSlcclxuICAgICAgICAgICAgICAgIGZvcm1hdExvY2F0aW9uLnZhbFtkXS52YWwgPSBmZXRjaGVkW2RdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZGVsZXRlVW5zZWVuVmFscykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBkIGluIGZvcm1hdExvY2F0aW9uLnZhbCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFmb3JtYXRMb2NhdGlvbi52YWwuaGFzT3duUHJvcGVydHkoZCkpXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWxzLmluY2x1ZGVzKGQpKVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChmb3JtYXRMb2NhdGlvbi52YWwgaW5zdGFuY2VvZiBBcnJheSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9ybWF0TG9jYXRpb24udmFsLnJlbW92ZUkocGFyc2VJbnQoZCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGZvcm1hdExvY2F0aW9uLnZhbFtkXTtcclxuICAgICAgICAgICAgICAgIHVwZGF0ZWRGb3JtYXRMb2NhdGlvbiA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy9AdHMtaWdub3JlIHdoZW4gc29tZXRoaW5nIGlzIGFkZGVkIG5vdGlmeSBsaXN0ZW5lcnNcclxuICAgICAgICBpZiAodXBkYXRlZEZvcm1hdExvY2F0aW9uKVxyXG4gICAgICAgICAgICBmb3JtYXRMb2NhdGlvbi5ub3RpZnkodHJ1ZSk7XHJcbiAgICB9XHJcbiAgICBlbHNlXHJcbiAgICAgICAgZm9ybWF0TG9jYXRpb24udmFsID0gZmV0Y2hlZDtcclxuICAgIHJldHVybiBmb3JtYXRMb2NhdGlvbjtcclxufVxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzZXREYXRhKGRhdGEsIGxvY2F0aW9uLCBjb21wbGV0ZSkge1xyXG4gICAgaWYgKCEobG9jYXRpb24gaW5zdGFuY2VvZiBEYXRhKSAmJiBsb2NhdGlvbiAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgIGxvY2F0aW9uID0gbmV3IERhdGEobG9jYXRpb24pO1xyXG4gICAgbGV0IGRhdGFMb2NhdGlvbiA9IGZvcm1hdERhdGEoZGF0YSwgbG9jYXRpb24pO1xyXG4gICAgaWYgKGNvbXBsZXRlICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgY29tcGxldGUoKTtcclxuICAgIHJldHVybiBuZXcgRGF0YUJhc2UoZGF0YUxvY2F0aW9uKTtcclxufVxyXG4vKlxyXG4gKiBIb2xkcyBhbmQgaGFuZGxlcyBhY2Nlc3MgdG8gYW4gY29tcGxleCBtYXAgb2YgZGF0YS4gVGhpcyBkYXRhIENvbnNpc2l0cyBvZiBpbiBlYWNoIG90aGVyIG5leHRlZCBEYXRhIGludHNhbmNlc1xyXG4gKiAodG8gaW5pdCBzdWNoIGFuIG1hcCwgY29uc3VsdCBmb3JtYXREYXRhLilcclxuICovXHJcbmV4cG9ydCBjbGFzcyBEYXRhQmFzZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihkYXRhKSB7XHJcbiAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcclxuICAgIH1cclxuICAgIHRvU3RyaW5nKCkge1xyXG4gICAgICAgIHJldHVybiBcIkRhdGFCYXNlOiBcIiArIHRoaXMuZGF0YS50b1N0cmluZygpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXRzIGEgcmVmZXJlbmNlIHRvIHN1YkRhdGEgZm91bmQgdW5kZXIgZ2l2ZW4ga2V5KHMpIC8gcGF0aFxyXG4gICAgICogQSByZWZlcmVuY2UgaXMgYSBuZXcgRGF0YUJhc2UgaW5zdGFuY2UganVzdCBjb250YWluaW5nIHRoZSByZWZlcmVuY2VkIERhdGFcclxuICAgICAqXHJcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIHJlc29sdmVzIHJlZmVyZW5jZXMgdmlhIHRoZSBcInJlY3Vyc2l2ZWx5IGFuY2hvcmVkIERhdGFcIiAocmFkKSBwcm9jZWR1cmUuIEZvciBmdXJ0aGVyXHJcbiAgICAgKiBpbnNpZ2h0cyB3aGF0IHRoaXMgbWVhbnMgcGxlYXNlIGNvbnN1bHQgdGhlIGRvY3VtZW50YXRpb24gb2YgdGhlIGZ1bmN0aW9uIHJhZFxyXG4gICAgICovXHJcbiAgICByZWYoLi4ua2V5cykge1xyXG4gICAgICAgIHJldHVybiBuZXcgRGF0YUJhc2UodGhpcy5yYWQoLi4ua2V5cykpO1xyXG4gICAgfVxyXG4gICAgcGVlayguLi5rZXlzKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRhQmFzZSh0aGlzLmZkcyguLi5rZXlzKSk7XHJcbiAgICB9XHJcbiAgICBjdXJyZW50KC4uLmtleXMpIHtcclxuICAgICAgICByZXR1cm4gKHRoaXMuZmRzKC4uLmtleXMpKS52YWw7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEdldHMgdGhlIHVuZGVybHlpbmcgRGF0YSBmb3VuZCB1bmRlciBnaXZlbiBrZXkocykgLyBwYXRoXHJcbiAgICAgKiBTaW1pbGFyIHRvIHJlZiBidXQgbm90IHdyYXBwZWQgaW5zaWRlIGEgRGF0YUJhc2UgaW5zdGFuY2VcclxuICAgICAqXHJcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIHJlc29sdmVzIHJlZmVyZW5jZXMgdmlhIHRoZSBcInJlY3Vyc2l2ZWx5IGFuY2hvcmVkIERhdGFcIiAocmFkKSBwcm9jZWR1cmUuIEZvciBmdXJ0aGVyXHJcbiAgICAgKiBpbnNpZ2h0cyB3aGF0IHRoaXMgbWVhbnMgcGxlYXNlIGNvbnN1bHQgdGhlIGRvY3VtZW50YXRpb24gb2YgdGhlIGZ1bmN0aW9uIHJhZFxyXG4gICAgICovXHJcbiAgICBnZXQoa2V5LCBjYikge1xyXG4gICAgICAgIGlmICh0eXBlb2Yga2V5ID09PSBcInN0cmluZ1wiIHx8IHR5cGVvZiBrZXkgPT09IFwibnVtYmVyXCIgfHwga2V5IGluc3RhbmNlb2YgRGF0YSkge1xyXG4gICAgICAgICAgICBsZXQgZGF0YSA9IChrZXkgaW5zdGFuY2VvZiBEYXRhKSA/IGtleSA6IHRoaXMucmFkKGtleSk7XHJcbiAgICAgICAgICAgIGlmIChjYiAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBkYXRhLnN1YnNjcmliZShjYik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IG1hcCA9IFtdO1xyXG4gICAgICAgICAgICBpZiAoY2IgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZGF0YSA9IChrZXlbaV0gaW5zdGFuY2VvZiBEYXRhKSA/IGtleVtpXSA6IHRoaXMucmFkKGtleVtpXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3Vic2NyaWJ0aW9uID0gKHYpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWFwW2ldID0gdjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGtleS5sZW5ndGggPT09IG1hcC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYiAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2IoLi4ubWFwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbWFwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhLnN1YnNjcmliZShzdWJzY3JpYnRpb24pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICAgICAgICAgICAgICBtYXBbaV0gPSAoa2V5W2ldIGluc3RhbmNlb2YgRGF0YSkgPyBrZXlbaV0gOiB0aGlzLnJhZChrZXlbaV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG1hcDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHNldChrZXksIHRvKSB7XHJcbiAgICAgICAgbGV0IGZkcyA9IHRoaXMuZmRzKGtleSk7XHJcbiAgICAgICAgZm9ybWF0RGF0YSh0bywgZmRzLCB0cnVlKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogR2V0cyByZWN1cnNpdmVseSBhbmNob3JlZCBEYXRhIChyYWQpXHJcbiAgICAgKiBNZWFuaW5nIGZvciBlYWNoIG5lc3Rpbmcgc3RlcCB0aGVyZSB3aWxsIGJlIG9uZSBsaXN0ZW5lciBhdHRhdGNoZWQgdG8gZW5hYmxlIG9iamVjdHMgdG8gYmUgb2JzZXJ2ZWRcclxuICAgICAqIFRoaXMgaXMgdmVyeSByZXNvdXJjZSAobWVtKSBleHBlbnNpdmUuIFVzZSBvbmx5IHdoZW4gbmVjZXNzYXJ5XHJcbiAgICAgKi9cclxuICAgIHJhZCguLi5rZXlzKSB7XHJcbiAgICAgICAgbGV0IGxhc3QgPSB0aGlzLmRhdGE7XHJcbiAgICAgICAgbGV0IG9yZ2FuaXplZEtleXMgPSBrZXlzLmpvaW4oXCIuXCIpLnNwbGl0KFwiLlwiKTtcclxuICAgICAgICBvcmdhbml6ZWRLZXlzLmVhKChrKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChrICE9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbmV4dCA9IGxhc3QudmFsW2tdO1xyXG4gICAgICAgICAgICAgICAgaWYgKG5leHQgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgSW52YWxpZEtleShrLCBsYXN0KTtcclxuICAgICAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICAgICAgbGFzdC5zdWJzY3JpYmVJbnRlcm5hbGx5KChhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgYSA9IGFueVtrXTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgZHQgPSBhIGluc3RhbmNlb2YgRGF0YTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0eXBlb2YgYSA9PT0gXCJvYmplY3RcIiAmJiAhZHQpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0LnZhbCA9IChkdCkgPyBhLnZhbCA6IGE7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGxhc3QgPSBuZXh0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGxhc3Q7XHJcbiAgICB9XHJcbiAgICBmZHMoLi4ua2V5cykge1xyXG4gICAgICAgIGxldCBsYXN0ID0gdGhpcy5kYXRhO1xyXG4gICAgICAgIGxldCBvcmdhbml6ZWRLZXlzID0ga2V5cy5qb2luKFwiLlwiKS5zcGxpdChcIi5cIik7XHJcbiAgICAgICAgb3JnYW5pemVkS2V5cy5lYSgoaykgPT4ge1xyXG4gICAgICAgICAgICBpZiAoayAhPT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgbGV0IG5leHQgPSBsYXN0LnZhbFtrXTtcclxuICAgICAgICAgICAgICAgIGlmIChuZXh0ID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEludmFsaWRLZXkoaywgbGFzdCk7XHJcbiAgICAgICAgICAgICAgICBsYXN0ID0gbmV4dDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBsYXN0O1xyXG4gICAgfVxyXG4gICAgLy9UT0RPOiBtYWtlIHRoaXMgYXZhaWxhYmxlIGZvciBEQiBhcyBhIHdob2xlIGFuZCBsaW1pdCBhY2NlcyB2aWEgaW50ZXJmYWNlcyAoY29uZGl0aW5hbCB0eXBlcylcclxuICAgIGdldCBhc0FycmF5KCkge1xyXG4gICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgIGlmICh0aGlzLmRhdGEudmFsIGluc3RhbmNlb2YgQXJyYXkpXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgRGF0YUFycmF5KHRoaXMuZGF0YSk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgSW52YWxpZENhc3QoQXJyYXkpO1xyXG4gICAgfVxyXG4gICAgZ2V0IGFzTnVtYmVyKCkge1xyXG4gICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5kYXRhLnZhbCA9PT0gXCJudW1iZXJcIilcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRhTnVtYmVyKHRoaXMuZGF0YSk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aHJvdyBuZXcgSW52YWxpZENhc3QoTnVtYmVyKTtcclxuICAgIH1cclxuICAgIGVxdWFscyh0aGF0KSB7XHJcbiAgICAgICAgcmV0dXJuICh0aGF0ID09PSB1bmRlZmluZWQpID8gZmFsc2UgOiB0aGlzLmRhdGEuZXF1YWxzKHRoYXQuZGF0YSwgdHJ1ZSk7XHJcbiAgICB9XHJcbiAgICBzYW1lKHRoYXQpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLnZhbCA9PT0gdGhhdC5kYXRhLnZhbDtcclxuICAgIH1cclxufVxyXG5leHBvcnQgY2xhc3MgRGF0YU51bWJlciBleHRlbmRzIERhdGFCYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKGRhdGEpIHtcclxuICAgICAgICBzdXBlcihkYXRhKTtcclxuICAgIH1cclxuICAgIGluYyhieSA9IDEpIHtcclxuICAgICAgICB0aGlzLmRhdGEudmFsICs9IGJ5O1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEudmFsO1xyXG4gICAgfVxyXG4gICAgZGVjKGJ5ID0gMSkge1xyXG4gICAgICAgIHRoaXMuZGF0YS52YWwgLT0gYnk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS52YWw7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGNsYXNzIERhdGFBcnJheSBleHRlbmRzIERhdGFCYXNlIHtcclxuICAgIGNvbnN0cnVjdG9yKGRhdGEpIHtcclxuICAgICAgICBzdXBlcihkYXRhKTtcclxuICAgIH1cclxuICAgIGxpc3QobG9vcCwgc3RlcEludG9QYXRoQWZ0ZXJ3YXJkcyA9IFwiXCIpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubGVuZ3RoKCk7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgZW5kID0gbG9vcChuZXcgRGF0YUJhc2UodGhpcy5mZHMoaSwgc3RlcEludG9QYXRoQWZ0ZXJ3YXJkcykpLCBpKTtcclxuICAgICAgICAgICAgaWYgKGVuZCAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGVuZDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBmb3JFYWNoKGxvb3AsIGJlZm9yZUxvb3AsIGFmdGVyTG9vcCwgc3RlcEludG9QYXRoQWZ0ZXJ3YXJkcyA9IFwiXCIpIHtcclxuICAgICAgICBsZXQgcHJvbXMgPSBbXTtcclxuICAgICAgICB0aGlzLmdldChcIlwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChiZWZvcmVMb29wICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICBwcm9tcy5hZGQoYmVmb3JlTG9vcCgpKTtcclxuICAgICAgICAgICAgdGhpcy5kYXRhLnZhbC5lYSgoZSwgaSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcHJvbXMuYWRkKGxvb3AobmV3IERhdGFCYXNlKHRoaXMuZmRzKGksIHN0ZXBJbnRvUGF0aEFmdGVyd2FyZHMpKSwgaSkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcHJvbXMgPSBwcm9tcy5maWx0ZXIoKGUpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBlIGluc3RhbmNlb2YgUHJvbWlzZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGlmIChhZnRlckxvb3AgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHByb21zLmxlbmd0aCA9PT0gMClcclxuICAgICAgICAgICAgICAgICAgICBQcm9taXNlLmFsbChwcm9tcykudGhlbihhZnRlckxvb3ApO1xyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIGFmdGVyTG9vcCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaWYgKHByb21zLmxlbmd0aCAhPT0gMClcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21zKTtcclxuICAgIH1cclxuICAgIGxlbmd0aChjYikge1xyXG4gICAgICAgIGlmIChjYiA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhLnZhbC5sZW5ndGg7XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2V0KFwiXCIsIChhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjYihhLmxlbmd0aCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJlYWxMZW5ndGgoY2IpIHtcclxuICAgICAgICBpZiAoY2IgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS52YWwucmVhbExlbmd0aDtcclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5nZXQoXCJcIiwgKGEpID0+IHtcclxuICAgICAgICAgICAgICAgIGNiKGEucmVhbExlbmd0aCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGFsdGVyKGNiLCBpbml0YWxpemVMb29wID0gZmFsc2UpIHtcclxuICAgICAgICB0aGlzLmJlZm9yZUxhc3RDaGFuZ2UgPSB0aGlzLmRhdGEuY2xvbmUoKTtcclxuICAgICAgICBpZiAoaW5pdGFsaXplTG9vcCkge1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEudmFsLmVhKChlLCBpKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjYihuZXcgRGF0YUJhc2UoZSksIGkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5nZXQoXCJcIiwgKGEpID0+IHtcclxuICAgICAgICAgICAgbGV0IGluZGV4ZXNUb0JlQ2FsbGVkID0gW107XHJcbiAgICAgICAgICAgIGEuZWEoKGUsIGkpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpbmRleGVzVG9CZUNhbGxlZC5hZGQoaSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFlLmVxdWFscyh0aGlzLmJlZm9yZUxhc3RDaGFuZ2UudmFsW2ldLCB0cnVlKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2IobmV3IERhdGFCYXNlKGUpLCBpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuYmVmb3JlTGFzdENoYW5nZS52YWwuZWEoKGUsIGkpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICghaW5kZXhlc1RvQmVDYWxsZWQuaW5jbHVkZXMoaSkpXHJcbiAgICAgICAgICAgICAgICAgICAgY2IobnVsbCwgaSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLmJlZm9yZUxhc3RDaGFuZ2UgPSB0aGlzLmRhdGEuY2xvbmUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIG1vcnBoKGNiLCBpbml0YWxpemVMb29wID0gZmFsc2UpIHtcclxuICAgICAgICB0aGlzLmJlZm9yZUxhc3RDaGFuZ2UgPSB0aGlzLmRhdGEuY2xvbmUoKTtcclxuICAgICAgICBpZiAoaW5pdGFsaXplTG9vcCkge1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEudmFsLmVhKChlLCBpKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjYihuZXcgRGF0YUJhc2UoZSksIGkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGNiYSA9IERhdGFBcnJheS5tb3JwaE1hcC5nZXQodGhpcy5kYXRhKTtcclxuICAgICAgICBpZiAoY2JhID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIERhdGFBcnJheS5tb3JwaE1hcC5zZXQodGhpcy5kYXRhLCBbY2JdKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIGNiYS5hZGQoY2IpO1xyXG4gICAgfVxyXG4gICAgYWRkKHZhbCwgYXRJbmRleCkge1xyXG4gICAgICAgIGxldCBsZW5ndGggPSB0aGlzLmxlbmd0aCgpO1xyXG4gICAgICAgIGxldCBtYXhJbmRleCA9IGxlbmd0aCAtIDE7XHJcbiAgICAgICAgaWYgKGF0SW5kZXggPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgYXRJbmRleCA9IGxlbmd0aDtcclxuICAgICAgICB0aGlzLmRhdGEudmFsLlJldmVyc2UoKS5lYSgoZSwgaSkgPT4ge1xyXG4gICAgICAgICAgICBpID0gbWF4SW5kZXggLSBpO1xyXG4gICAgICAgICAgICBpZiAoaSA8IGF0SW5kZXgpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIC8vVEhJUyBJRiBJUyBORUNFU1NBUlkgQkVDQVVTRSBXSEVOIFNFVFRJTkcgRU1QVFkgQVJSQVkgU09MT1RTIFRPIFVOREVGSU5FRCBUSEVZIEdFVCBQSUNLRUQgVVAgQlkgSVRFUkFUT1JTXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGEudmFsW2ldID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5kYXRhLnZhbFtpICsgMV07XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YS52YWxbaSArIDFdID0gdGhpcy5kYXRhLnZhbFtpXTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBkZWxldGUgdGhpcy5kYXRhLnZhbFthdEluZGV4XTtcclxuICAgICAgICBsZXQgb2IgPSB7fTtcclxuICAgICAgICBvYlthdEluZGV4XSA9IHZhbDtcclxuICAgICAgICBmb3JtYXREYXRhKG9iLCB0aGlzLmRhdGEpO1xyXG4gICAgICAgIGxldCBjYmEgPSBEYXRhQXJyYXkubW9ycGhNYXAuZ2V0KHRoaXMuZGF0YSk7XHJcbiAgICAgICAgaWYgKGNiYSAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICBjYmEuZWEoKGYpID0+IHtcclxuICAgICAgICAgICAgICAgIGYobmV3IERhdGFCYXNlKHRoaXMuZGF0YS52YWxbYXRJbmRleF0pLCBhdEluZGV4KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICByZW1vdmVJKGluZGV4LCBjbG9zZUdhcCA9IHRydWUpIHtcclxuICAgICAgICBpZiAoY2xvc2VHYXApXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YS52YWwucmVtb3ZlSShpbmRleCk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBkZWxldGUgdGhpcy5kYXRhLnZhbFtpbmRleF07XHJcbiAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgdGhpcy5kYXRhLm5vdGlmeSh0cnVlKTtcclxuICAgICAgICBsZXQgY2JhID0gRGF0YUFycmF5Lm1vcnBoTWFwLmdldCh0aGlzLmRhdGEpO1xyXG4gICAgICAgIGlmIChjYmEgIT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgY2JhLmVhKChmKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBmKG51bGwsIGluZGV4KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICByZW1vdmVWKHZhbCwgY2xvc2VHYXAgPSB0cnVlKSB7XHJcbiAgICAgICAgbGV0IGRhdGEgPSBmb3JtYXREYXRhKHZhbCk7XHJcbiAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5kYXRhLnZhbC5lYSgoZSwgaSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZS5lcXVhbHMoZGF0YSkpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpZiAoaW5kZXggPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEludmFsaWRWYWx1ZUV4Y2VwdGlvbih2YWwsIHRoaXMuZGF0YS50b1N0cmluZygpKTtcclxuICAgICAgICBpZiAoY2xvc2VHYXApXHJcbiAgICAgICAgICAgIHRoaXMuZGF0YS52YWwucmVtb3ZlSShpbmRleCk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBkZWxldGUgdGhpcy5kYXRhLnZhbFtpbmRleF07XHJcbiAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgdGhpcy5kYXRhLm5vdGlmeSh0cnVlKTtcclxuICAgICAgICBsZXQgY2JhID0gRGF0YUFycmF5Lm1vcnBoTWFwLmdldCh0aGlzLmRhdGEpO1xyXG4gICAgICAgIGlmIChjYmEgIT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgY2JhLmVhKChmKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBmKG51bGwsIGluZGV4KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuRGF0YUFycmF5Lm1vcnBoTWFwID0gbmV3IE1hcCgpO1xyXG5leHBvcnQgY2xhc3MgRGF0YSB7XHJcbiAgICBjb25zdHJ1Y3Rvcih2YWwpIHtcclxuICAgICAgICB0aGlzLmNicyA9IFtdO1xyXG4gICAgICAgIHRoaXMuaW50ZXJuYWxDQnMgPSBbXTtcclxuICAgICAgICB0aGlzLnZhbCA9IHZhbDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogU2V0IHRoZSB2YWxcclxuICAgICAqL1xyXG4gICAgc2V0IHZhbCh0bykge1xyXG4gICAgICAgIGlmICh0aGlzLnZhbCA9PT0gdG8pXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB0aGlzLl92YWwgPSB0bztcclxuICAgICAgICB0aGlzLm5vdGlmeShmYWxzZSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEdldHMgdGhlIGN1cnJlbnQgdmFsXHJcbiAgICAgKi9cclxuICAgIGdldCB2YWwoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogU3Vic2NyaWJlIHRvIHZhbFxyXG4gICAgICogQHBhcmFtIGNiIGNhbGxiYWNrIHdoaWNoIGdldHMgY2FsbGVkIHdoZW5ldmVyIHRoZSB2YWwgY2hhbmdlc1xyXG4gICAgICovXHJcbiAgICBzdWJzY3JpYmUoY2IsIGluaXQgPSB0cnVlKSB7XHJcbiAgICAgICAgdGhpcy5jYnMuYWRkKGNiKTtcclxuICAgICAgICBpZiAoaW5pdClcclxuICAgICAgICAgICAgY2IodGhpcy52YWwpO1xyXG4gICAgfVxyXG4gICAgc3Vic2NyaWJlSW50ZXJuYWxseShjYikge1xyXG4gICAgICAgIHRoaXMuaW50ZXJuYWxDQnMuYWRkKGNiKTtcclxuICAgICAgICBjYih0aGlzLnZhbCk7XHJcbiAgICB9XHJcbiAgICB1bnN1YnNjcmliZShjYikge1xyXG4gICAgICAgIGlmIChjYiAhPT0gbnVsbClcclxuICAgICAgICAgICAgdGhpcy5jYnMucmVtb3ZlKGNiKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHRoaXMuY2JzLmNsZWFyKCk7XHJcbiAgICB9XHJcbiAgICB0b1N0cmluZyh0YWJJbiA9IDAsIGluc2lkZU9iamVjdCA9IGZhbHNlKSB7XHJcbiAgICAgICAgdGFiSW4rKztcclxuICAgICAgICBsZXQgcyA9IFwiXCI7XHJcbiAgICAgICAgbGV0IHYgPSB0aGlzLnZhbDtcclxuICAgICAgICBpZiAodHlwZW9mIHYgPT09IFwib2JqZWN0XCIpIHtcclxuICAgICAgICAgICAgbGV0IGhhc1Byb3BzID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGxldCBhciA9IHYgaW5zdGFuY2VvZiBBcnJheTtcclxuICAgICAgICAgICAgaWYgKGFyKVxyXG4gICAgICAgICAgICAgICAgcyArPSBcIltcIjtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgcyArPSBcIntcIjtcclxuICAgICAgICAgICAgcyArPSBcIlxcblwiO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBrIGluIHYpIHtcclxuICAgICAgICAgICAgICAgIGlmICghdi5oYXNPd25Qcm9wZXJ0eShrKSlcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGhhc1Byb3BzID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICAgICAgcyArPSBcIlxcdFwiLnJlcGVhdCh0YWJJbikgKyBrICsgXCI6IFwiICsgdltrXS50b1N0cmluZyh0YWJJbiwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCFoYXNQcm9wcylcclxuICAgICAgICAgICAgICAgIHMgPSBzLnN1YnN0cmluZygwLCBzLmxlbmd0aCAtIDEpO1xyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHMgPSBzLnN1YnN0cmluZygwLCBzLmxlbmd0aCAtIDIpICsgXCJcXG5cIjtcclxuICAgICAgICAgICAgICAgIHMgKz0gXCJcXHRcIi5yZXBlYXQodGFiSW4gLSAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoYXIpXHJcbiAgICAgICAgICAgICAgICBzICs9IFwiXVwiO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICBzICs9IFwifVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IHN0ID0gdHlwZW9mIHYgPT09IFwic3RyaW5nXCI7XHJcbiAgICAgICAgICAgIGlmIChzdClcclxuICAgICAgICAgICAgICAgIHMgKz0gXCJcXFwiXCI7XHJcbiAgICAgICAgICAgIHMgKz0gdjtcclxuICAgICAgICAgICAgaWYgKHN0KVxyXG4gICAgICAgICAgICAgICAgcyArPSBcIlxcXCJcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcyArPSBpbnNpZGVPYmplY3QgPyBcIixcIiA6IFwiXCI7XHJcbiAgICAgICAgcmV0dXJuIHMgKyBcIlxcblwiO1xyXG4gICAgfVxyXG4gICAgbm90aWZ5KHdpbGQgPSBmYWxzZSkge1xyXG4gICAgICAgIGxldCB2YWwgPSB0aGlzLnZhbDtcclxuICAgICAgICB0aGlzLmNicy5lYSgoZikgPT4ge1xyXG4gICAgICAgICAgICBmKHZhbCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaWYgKCF3aWxkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW50ZXJuYWxDQnMuZWEoKGYpID0+IHtcclxuICAgICAgICAgICAgICAgIGYodmFsKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBDb21wYXJlcyBpZiBhbGwga2V5cyBpbiB0aGlzIGFyZSBlcXVhbCB0byB0aGUgZXF1aXZlbGVudCBvbmVzIG9uIGRhdGFcclxuICAgICAqIERpZmZlcmVudCBEYXRhIEluc3RhbmNlcyBob2xkaW5nIHRoZSBzYW1lIHZhbHVlIGFyZSB0aGUgZXF1YWxcclxuICAgICAqIERhdGEgY2FuIGhhdmUgbW9yZSBrZXlzIHRoYW4gdGhpcyBhbmQgc3RpbGwgYmUgZXF1YWwuXHJcbiAgICAgKiBJZiB5b3UgZG9udCB3YW50IHRoaXMgcGFzcyBpbiB0cnVlIHRvIHRoZSBzdHJpY3QgcGFyYW0uIFRoaXMgd2lsbCBiZSBtb3JlIHJlY291cmNlIGludGVuc2l2ZVxyXG4gICAgICovXHJcbiAgICBlcXVhbHMoZGF0YSwgc3RyaWN0ID0gZmFsc2UpIHtcclxuICAgICAgICBsZXQgdiA9IHRoaXMudmFsO1xyXG4gICAgICAgIGlmIChkYXRhID09PSB1bmRlZmluZWQgfHwgZGF0YSA9PT0gbnVsbClcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIGxldCBkID0gZGF0YS52YWw7XHJcbiAgICAgICAgaWYgKHYgPT0gZClcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgbGV0IGxzO1xyXG4gICAgICAgIGlmIChzdHJpY3QpXHJcbiAgICAgICAgICAgIGxzID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgayBpbiB2KSB7XHJcbiAgICAgICAgICAgIGlmICghdi5oYXNPd25Qcm9wZXJ0eShrKSlcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICBpZiAoc3RyaWN0KVxyXG4gICAgICAgICAgICAgICAgbHMuYWRkKGspO1xyXG4gICAgICAgICAgICBpZiAodltrXSAhPT0gZFtrXSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHZba10gaW5zdGFuY2VvZiBEYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRba10gaW5zdGFuY2VvZiBEYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXZba10uZXF1YWxzKGRba10sIHN0cmljdCkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoc3RyaWN0KSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGsgaW4gZCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF2Lmhhc093blByb3BlcnR5KGspKVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFscy5pbmNsdWRlcyhrKSlcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICBjbG9uZSgpIHtcclxuICAgICAgICBsZXQgZDtcclxuICAgICAgICBsZXQgdiA9IHRoaXMudmFsO1xyXG4gICAgICAgIGlmICh0eXBlb2YgdiA9PT0gXCJvYmplY3RcIikge1xyXG4gICAgICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICAgICAgbGV0IGRhdGEgPSBuZXcgdi5jb25zdHJ1Y3RvcigpO1xyXG4gICAgICAgICAgICBkID0gbmV3IERhdGEoZGF0YSk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGsgaW4gdikge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF2Lmhhc093blByb3BlcnR5KGspKVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgICAgICAgICBkLnZhbFtrXSA9IHZba10uY2xvbmUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIGQgPSBuZXcgRGF0YSh2KTtcclxuICAgICAgICBkLmludGVybmFsQ0JzLmFkZCguLi50aGlzLmludGVybmFsQ0JzKTtcclxuICAgICAgICBkLmNicy5hZGQoLi4udGhpcy5jYnMpO1xyXG4gICAgICAgIHJldHVybiBkO1xyXG4gICAgfVxyXG59XHJcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgY3JlYXRlQWJvcnRFcnJvciA9ICgpID0+IHtcblx0Y29uc3QgZXJyb3IgPSBuZXcgRXJyb3IoJ0RlbGF5IGFib3J0ZWQnKTtcblx0ZXJyb3IubmFtZSA9ICdBYm9ydEVycm9yJztcblx0cmV0dXJuIGVycm9yO1xufTtcblxuY29uc3QgY3JlYXRlRGVsYXkgPSAoe2NsZWFyVGltZW91dDogZGVmYXVsdENsZWFyLCBzZXRUaW1lb3V0OiBzZXQsIHdpbGxSZXNvbHZlfSkgPT4gKG1zLCB7dmFsdWUsIHNpZ25hbH0gPSB7fSkgPT4ge1xuXHRpZiAoc2lnbmFsICYmIHNpZ25hbC5hYm9ydGVkKSB7XG5cdFx0cmV0dXJuIFByb21pc2UucmVqZWN0KGNyZWF0ZUFib3J0RXJyb3IoKSk7XG5cdH1cblxuXHRsZXQgdGltZW91dElkO1xuXHRsZXQgc2V0dGxlO1xuXHRsZXQgcmVqZWN0Rm47XG5cdGNvbnN0IGNsZWFyID0gZGVmYXVsdENsZWFyIHx8IGNsZWFyVGltZW91dDtcblxuXHRjb25zdCBzaWduYWxMaXN0ZW5lciA9ICgpID0+IHtcblx0XHRjbGVhcih0aW1lb3V0SWQpO1xuXHRcdHJlamVjdEZuKGNyZWF0ZUFib3J0RXJyb3IoKSk7XG5cdH07XG5cblx0Y29uc3QgY2xlYW51cCA9ICgpID0+IHtcblx0XHRpZiAoc2lnbmFsKSB7XG5cdFx0XHRzaWduYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBzaWduYWxMaXN0ZW5lcik7XG5cdFx0fVxuXHR9O1xuXG5cdGNvbnN0IGRlbGF5UHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRzZXR0bGUgPSAoKSA9PiB7XG5cdFx0XHRjbGVhbnVwKCk7XG5cdFx0XHRpZiAod2lsbFJlc29sdmUpIHtcblx0XHRcdFx0cmVzb2x2ZSh2YWx1ZSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZWplY3QodmFsdWUpO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRyZWplY3RGbiA9IHJlamVjdDtcblx0XHR0aW1lb3V0SWQgPSAoc2V0IHx8IHNldFRpbWVvdXQpKHNldHRsZSwgbXMpO1xuXHR9KTtcblxuXHRpZiAoc2lnbmFsKSB7XG5cdFx0c2lnbmFsLmFkZEV2ZW50TGlzdGVuZXIoJ2Fib3J0Jywgc2lnbmFsTGlzdGVuZXIsIHtvbmNlOiB0cnVlfSk7XG5cdH1cblxuXHRkZWxheVByb21pc2UuY2xlYXIgPSAoKSA9PiB7XG5cdFx0Y2xlYXIodGltZW91dElkKTtcblx0XHR0aW1lb3V0SWQgPSBudWxsO1xuXHRcdGNsZWFudXAoKTtcblx0XHRzZXR0bGUoKTtcblx0fTtcblxuXHRyZXR1cm4gZGVsYXlQcm9taXNlO1xufTtcblxuY29uc3QgZGVsYXkgPSBjcmVhdGVEZWxheSh7d2lsbFJlc29sdmU6IHRydWV9KTtcbmRlbGF5LnJlamVjdCA9IGNyZWF0ZURlbGF5KHt3aWxsUmVzb2x2ZTogZmFsc2V9KTtcbmRlbGF5LmNyZWF0ZVdpdGhUaW1lcnMgPSAoe2NsZWFyVGltZW91dCwgc2V0VGltZW91dH0pID0+IHtcblx0Y29uc3QgZGVsYXkgPSBjcmVhdGVEZWxheSh7Y2xlYXJUaW1lb3V0LCBzZXRUaW1lb3V0LCB3aWxsUmVzb2x2ZTogdHJ1ZX0pO1xuXHRkZWxheS5yZWplY3QgPSBjcmVhdGVEZWxheSh7Y2xlYXJUaW1lb3V0LCBzZXRUaW1lb3V0LCB3aWxsUmVzb2x2ZTogZmFsc2V9KTtcblx0cmV0dXJuIGRlbGF5O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBkZWxheTtcbi8vIFRPRE86IFJlbW92ZSB0aGlzIGZvciB0aGUgbmV4dCBtYWpvciByZWxlYXNlXG5tb2R1bGUuZXhwb3J0cy5kZWZhdWx0ID0gZGVsYXk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICBjbGFzcyBFeGNlcHRpb24gZXh0ZW5kcyBFcnJvciB7XG4gICAgY29uc3RydWN0b3IobXNnKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgdGhpcy5tZXNzYWdlID0gdGhpcy5jb25zdHJ1Y3Rvci5uYW1lO1xuICAgICAgaWYgKG1zZyAhPT0gdW5kZWZpbmVkKSB0aGlzLm1lc3NhZ2UgKz0gXCI6IFwiICsgbXNnO1xuICAgIH1cbiAgfVxuICBjbGFzcyBJbmRleE91dE9mQm91bmRzRXhjZXB0aW9uIGV4dGVuZHMgRXhjZXB0aW9uIHtcbiAgICBjb25zdHJ1Y3RvcihpbmRleCwgYXJyYXkpIHtcbiAgICAgIHN1cGVyKFwiR2l2ZW4gdmFsdWUgXFxcIlwiICsgaW5kZXggKyBcIlxcXCIgbXVzdCBiZSBpbiByYW5nZSAwLVwiICsgKGFycmF5Lmxlbmd0aC0xKSArIFwiLlwiKTtcbiAgICAgIHRoaXMuaW5kZXggPSBpbmRleDtcbiAgICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbiAgICB9XG4gIH1cbiAgY2xhc3MgSW52YWxpZElucHV0RXhjZXB0aW9uIGV4dGVuZHMgRXhjZXB0aW9uIHtcbiAgICBjb25zdHJ1Y3Rvcihtc2cpIHtcbiAgICAgIHN1cGVyKFwiR2l2ZW4gaW5wdXQgaXMgaW52YWxpZC5cXG5cIiArIG1zZyk7XG4gICAgfVxuICB9XG4gIGNsYXNzIEludmFsaWRDb25zdHJ1Y3RvckV4Y2VwdGlvbiBleHRlbmRzIEV4Y2VwdGlvbntcbiAgICBjb25zdHJ1Y3Rvcihtc2cgPSBcIlwiKSB7XG4gICAgICBzdXBlcihcIkdpdmVuIGNvbnN0cnVjdG9yIG11c3QgaW5oZXJpdCBmb3JtIEFycmF5LlxcblwiICsgbXNnKTtcbiAgICB9XG4gIH1cbiAgY2xhc3MgSW52YWxpZFZhbHVlRXhjZXB0aW9uIGV4dGVuZHMgRXhjZXB0aW9uIHtcbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZSwgYXJyYXkpIHtcbiAgICAgIHN1cGVyKFwiVW5hYmxlIHRvIGZpbmQgZ2l2ZW4gdmFsdWU6IFwiICsgdmFsdWUuY29uc3RydWN0b3IubmFtZSArIFwiIFwiICsgSlNPTi5zdHJpbmdpZnkodmFsdWUpICsgXCI7IHdpdGhpbiBmb2xsb3dpbmcgYXJyYXk6IFwiICsgYXJyYXkudG9TdHJpbmcoKSk7XG4gICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG4gICAgfVxuICB9XG5cbiAgLy9UaHJvd3MgSW5kZXhPdXRPZkJvdW5kc0V4Y2VwdGlvbiB3aGVuIGdpdmVuIGluZGV4IGlzIG91dCBvZiBib3VuZHMgb2YgYVxuICBmdW5jdGlvbiBpc0luZGV4KGksIGEpIHtcbiAgICBpZighYS5oYXNPd25Qcm9wZXJ0eShpKSkgdGhyb3cgbmV3IEluZGV4T3V0T2ZCb3VuZHNFeGNlcHRpb24oaSxhKTtcbiAgfVxuXG4gIGNvbnN0IGFyID0gXCJ4cnJheVwiO1xuXG4gIGZ1bmN0aW9uIGluaXQoQXJDb25zdHIgPSBBcnJheSkge1xuICAgIGlmKCEobmV3IEFyQ29uc3RyKCkgaW5zdGFuY2VvZiBBcnJheSkpIHRocm93IG5ldyBJbnZhbGlkQ29uc3RydWN0b3JFeGNlcHRpb24oKTtcbiAgICBpZiAoQXJDb25zdHIueHJyYXkgPT09IGFyKSByZXR1cm4gQXJDb25zdHI7XG5cbiAgICBBckNvbnN0ci54cnJheSA9IGFyO1xuXG4gICAgbGV0IHAgPSBBckNvbnN0ci5wcm90b3R5cGU7XG5cbiAgICBwLmVhY2ggPSBwLmVhID0gZnVuY3Rpb24oZiwgdCA9IHRoaXMpIHtcbiAgICAgIGlmICh0aGlzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgbGV0IGU7XG4gICAgICAgIGxldCBzdGFydEk7XG4gICAgICAgIGZvciAoc3RhcnRJID0gMDsgc3RhcnRJIDwgdC5sZW5ndGg7IHN0YXJ0SSsrKSB7XG4gICAgICAgICAgaWYgKHQuaGFzT3duUHJvcGVydHkoc3RhcnRJKSkge1xuICAgICAgICAgICAgZSA9IGYuY2FsbCh0LCB0W3N0YXJ0SV0sIHN0YXJ0SSwgdGhpcyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc3RhcnRJKys7XG4gICAgICAgIGlmIChlIGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgICAgIHJldHVybiAoYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IHIgPSBhd2FpdCBlO1xuICAgICAgICAgICAgaWYgKHIgIT09IHVuZGVmaW5lZCkgcmV0dXJuIHI7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSBzdGFydEk7IGkgPCB0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIGlmICghdC5oYXNPd25Qcm9wZXJ0eShpKSkgY29udGludWU7XG4gICAgICAgICAgICAgIGxldCBlID0gYXdhaXQgZi5jYWxsKHQsIHRbaV0sIGksIHRoaXMpO1xuICAgICAgICAgICAgICBpZiAoZSAhPT0gdW5kZWZpbmVkKSByZXR1cm4gZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KSgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGlmIChlICE9PSB1bmRlZmluZWQpIHJldHVybiBlO1xuICAgICAgICAgIGZvciAobGV0IGkgPSBzdGFydEk7IGkgPCB0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoIXQuaGFzT3duUHJvcGVydHkoaSkpIGNvbnRpbnVlO1xuICAgICAgICAgICAgbGV0IGUgPSBmLmNhbGwodCwgdFtpXSwgaSwgdGhpcyk7XG4gICAgICAgICAgICBpZiAoZSAhPT0gdW5kZWZpbmVkKSByZXR1cm4gZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocCwgXCJlbXB0eVwiLCB7Z2V0KCkge1xuICAgICAgcmV0dXJuIHRoaXMubGVuZ3RoID09PSAwO1xuICAgIH19KTtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShwLCBcImxhc3RcIiwge2dldCgpIHtcbiAgICAgIGlmKHRoaXMubGVuZ3RoID09PSAwKSByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgcmV0dXJuIHRoaXNbdGhpcy5sZW5ndGgtMV07XG4gICAgfX0pO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHAsIFwicmVhbExlbmd0aFwiLCB7Z2V0KCkge1xuICAgICAgbGV0IGwgPSAwO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KGkpKSBsKys7XG4gICAgICB9XG4gICAgICByZXR1cm4gbDtcbiAgICB9fSk7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocCwgXCJmaXJzdFwiLCB7Z2V0KCkge1xuICAgICAgcmV0dXJuIHRoaXNbMF07XG4gICAgfX0pO1xuXG4gICAgcC5jbGVhciA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5sZW5ndGggPSAwO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHAuQ2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBuZXcgQXJDb25zdHIoKTtcbiAgICB9XG5cbiAgICBwLmFkZCA9IGZ1bmN0aW9uKC4uLnZhbHVlcykge1xuICAgICAgdGhpcy5wdXNoKC4uLnZhbHVlcyk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgcC5BZGQgPSBmdW5jdGlvbiguLi52YWx1ZXMpIHtcbiAgICAgIHJldHVybiBuZXcgQXJDb25zdHIoKS5hZGQoLi4udGhpcykuYWRkKC4uLnZhbHVlcyk7XG4gICAgfVxuXG4gICAgcC5zZXQgPSBmdW5jdGlvbihhID0gW10pIHtcbiAgICAgIGlmKHRoaXMgPT09IGEpIHJldHVybiB0aGlzO1xuICAgICAgaWYoYSBpbnN0YW5jZW9mIEFycmF5KSByZXR1cm4gdGhpcy5jbGVhcigpLmFkZCguLi5hKTtcbiAgICAgIHJldHVybiB0aGlzLmNsZWFyKCkuYWRkKGEpO1xuICAgIH1cbiAgICBwLlNldCA9IGZ1bmN0aW9uKGEgPSBbXSkge1xuICAgICAgcmV0dXJuIG5ldyBBckNvbnN0cigpLmFkZCguLi5hKTtcbiAgICB9XG5cbiAgICBwLmNsb25lID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5TZXQodGhpcyk7XG4gICAgfVxuXG4gICAgcC5SZXZlcnNlID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5TZXQodGhpcykucmV2ZXJzZSgpO1xuICAgIH1cblxuICAgIHAuZ2F0aGVyID0gZnVuY3Rpb24oLi4uYSkge1xuICAgICAgYS5lYSgoZSkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuaW5jbHVkZXMoZSkpIHRoaXMuYWRkKGUpO1xuICAgICAgfSlcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHAuR2F0aGVyID0gZnVuY3Rpb24oLi4uYSkge1xuICAgICAgbGV0IHQgPSB0aGlzLmNsb25lKCk7XG4gICAgICBhLmVhKChlKSA9PiB7XG4gICAgICAgIGlmICghdC5pbmNsdWRlcyhlKSkgdC5hZGQoZSk7XG4gICAgICB9KVxuICAgICAgcmV0dXJuIHQ7XG4gICAgfVxuXG4gICAgbGV0IG1hcmsgPSB7fTtcblxuICAgIC8vVGhyb3dzIEludmFsaWRWYWx1ZUV4Y2VwdGlvbiB3aGVuIHRoZSBnaXZlbiB2YWx1ZSBjYW5ub3QgYmUgZm91bmQgd2l0aGluZyB0aGlzXG4gICAgLy8gVE9ETzogZGlmZmVyZW50YXRlIGluZGV4YWxsIGFuZCBpbmRleGZpcnN0XG4gICAgcC5pbmRleCA9IGZ1bmN0aW9uKC4uLnZhbHVlcykge1xuICAgICAgbGV0IHRoYXQgPSB0aGlzLlNldCh0aGlzKTtcbiAgICAgIGxldCBpbmRleGVzID0gbmV3IEFyQ29uc3RyKCk7XG4gICAgICB2YWx1ZXMuZWEoKHYpID0+IHtcbiAgICAgICAgaWYoIXRoaXMuaW5jbHVkZXModikpIHRocm93IG5ldyBJbnZhbGlkVmFsdWVFeGNlcHRpb24odix0aGlzKTtcbiAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICBsZXQgaW5kZXggPSB0aGF0LmluZGV4T2Yodik7XG4gICAgICAgICAgaWYgKGluZGV4ZXMubGFzdCAhPT0gaW5kZXggJiYgaW5kZXggIT09IC0xKXtcbiAgICAgICAgICAgIGluZGV4ZXMuYWRkKGluZGV4KTtcbiAgICAgICAgICAgIHRoYXRbaW5kZXhdID0gbWFyaztcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSBicmVhaztcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gaW5kZXhlcztcbiAgICB9XG4gICAgLy9UaHJvd3MgSW5kZXhPdXRPZkJvdW5kc0V4Y2VwdGlvbiB3aGVuIGdpdmVuIGluZGV4IGlzIG91dCBvZiBib3VuZHMgb2YgdGhpc1xuICAgIHAucmVtb3ZlSSA9IGZ1bmN0aW9uKC4uLmluZGljZXMpIHtcbiAgICAgIGxldCByb2xsYmFjayA9IHRoaXMuU2V0KHRoaXMpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbmRpY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaXNJbmRleChpbmRpY2VzW2ldLCB0aGlzKVxuICAgICAgICAgIHRoaXNbaW5kaWNlc1tpXV0gPSBtYXJrO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmICh0aGlzW2ldID09PSBtYXJrKSB7XG4gICAgICAgICAgICB0aGlzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIGktLTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKGUgaW5zdGFuY2VvZiBJbmRleE91dE9mQm91bmRzRXhjZXB0aW9uKSB0aGlzLnNldChyb2xsYmFjayk7XG4gICAgICAgIHRocm93IGU7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgcC5ybUkgPSBwLnJlbW92ZUk7XG4gICAgLy9UaHJvd3MgSW5kZXhPdXRPZkJvdW5kc0V4Y2VwdGlvbiB3aGVuIGdpdmVuIGluZGV4IGlzIG91dCBvZiBib3VuZHMgb2YgdGhpc1xuICAgIHAuUmVtb3ZlSSA9IGZ1bmN0aW9uKC4uLmluZGljZXMpIHtcbiAgICAgIHJldHVybiB0aGlzLlNldCh0aGlzKS5yZW1vdmVJKC4uLmluZGljZXMpO1xuICAgIH1cbiAgICBwLlJtSSA9IHAuUmVtb3ZlSTtcblxuICAgIC8vVGhyb3dzIEludmFsaWRWYWx1ZUV4Y2VwdGlvbiB3aGVuIHRoZSBnaXZlbiB2YWx1ZSBjYW5ub3QgYmUgZm91bmQgd2l0aGluZyB0aGlzXG4gICAgcC5yZW1vdmVWID0gZnVuY3Rpb24oLi4udmFsdWVzKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZW1vdmVJKC4uLnRoaXMuaW5kZXgoLi4udmFsdWVzKSk7XG4gICAgfVxuICAgIHAucm1WID0gcC5yZW1vdmVWO1xuXG4gICAgLy9UaHJvd3MgSW52YWxpZFZhbHVlRXhjZXB0aW9uIHdoZW4gdGhlIGdpdmVuIHZhbHVlIGNhbm5vdCBiZSBmb3VuZCB3aXRoaW5nIHRoaXNcbiAgICBwLlJlbW92ZVYgPSBmdW5jdGlvbiguLi52YWx1ZXMpIHtcbiAgICAgIHJldHVybiB0aGlzLlNldCh0aGlzKS5yZW1vdmVWKC4uLnZhbHVlcyk7XG4gICAgfVxuICAgIHAuUm1WID0gcC5SZW1vdmVWO1xuXG4gICAgLy9UaHJvd3MgSW52YWxpZFZhbHVlRXhjZXB0aW9uIHdoZW4gdGhlIGdpdmVuIHBhcmFtIGlzIGRldGVjdGVkIGFzIHZhbHVlIGJ1dCBjYW5ub3QgYmUgZm91bmQgd2l0aGluZyB0aGlzXG4gICAgcC5yZW1vdmUgPSBmdW5jdGlvbiguLi52YWx1ZU9ySW5kZXgpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRoaXMucmVtb3ZlSSguLi52YWx1ZU9ySW5kZXgpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBpZiAoZSBpbnN0YW5jZW9mIEluZGV4T3V0T2ZCb3VuZHNFeGNlcHRpb24pIHRoaXMucmVtb3ZlViguLi52YWx1ZU9ySW5kZXgpO1xuICAgICAgICBlbHNlIHRocm93IGU7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgcC5ybSA9IHAucmVtb3ZlO1xuXG4gICAgLy9UaHJvd3MgSW5kZXhPdXRPZkJvdW5kc0V4Y2VwdGlvbiB3aGVuIGdpdmVuIHBhcmFtIGlzIGRldGVjdGVkIGFzIGluZGV4IGJ1dCBvdXQgb2YgYm91bmRzIG9mIHRoaXNcbiAgICAvL1Rocm93cyBJbnZhbGlkVmFsdWVFeGNlcHRpb24gd2hlbiB0aGUgZ2l2ZW4gcGFyYW0gaXMgZGV0ZWN0ZWQgYXMgdmFsdWUgYnV0IGNhbm5vdCBiZSBmb3VuZCB3aXRoaW5nIHRoaXNcbiAgICBwLlJlbW92ZSA9IGZ1bmN0aW9uKC4uLnZhbHVlT3JJbmRleCkge1xuICAgICAgcmV0dXJuIHRoaXMuU2V0KHRoaXMpLnJlbW92ZSguLi52YWx1ZU9ySW5kZXgpO1xuICAgIH1cbiAgICBwLlJtID0gcC5SZW1vdmU7XG5cbiAgICBwLkdldCA9IGZ1bmN0aW9uKC4uLmluZGV4ZXMpIHtcbiAgICAgIGxldCBuID0gW107XG4gICAgICBpbmRleGVzLmZsYXQoSW5maW5pdHkpLmZvckVhY2goKGkpID0+IHtcbiAgICAgICAgbi5hZGQodGhpc1tpXSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBuO1xuICAgIH1cbiAgICBwLmdldCA9IGZ1bmN0aW9uKC4uLmluZGV4ZXMpIHtcbiAgICAgIHJldHVybiB0aGlzLnNldCh0aGlzLkdldCguLi5pbmRleGVzKSlcbiAgICB9XG5cbiAgICBwLmRkYSA9IGZ1bmN0aW9uKC4uLnZhbHVlcykge1xuICAgICAgcmV0dXJuIHRoaXMucmV2ZXJzZSgpLmFkZCguLi52YWx1ZXMpLnJldmVyc2UoKTtcbiAgICB9XG4gICAgcC5EZGEgPSBmdW5jdGlvbiguLi52YWx1ZXMpIHtcbiAgICAgIHJldHVybiB0aGlzLlJldmVyc2UoKS5hZGQoLi4udmFsdWVzKS5yZXZlcnNlKCk7XG4gICAgfVxuXG4gICAgLy9UaHJvd3MgSW5kZXhPdXRPZkJvdW5kc0V4Y2VwdGlvbiB3aGVuIGdpdmVuIGluZGV4IGlzIG91dCBvZiBib3VuZHMgb2YgYVxuICAgIHAucmVtID0gZnVuY3Rpb24oYW1vdW50KSB7XG4gICAgICBpc0luZGV4KGFtb3VudCx0aGlzKTtcbiAgICAgIHRoaXMubGVuZ3RoIC09IGFtb3VudDtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvL1Rocm93cyBJbmRleE91dE9mQm91bmRzRXhjZXB0aW9uIHdoZW4gZ2l2ZW4gaW5kZXggaXMgb3V0IG9mIGJvdW5kcyBvZiBhXG4gICAgcC5SZW0gPSBmdW5jdGlvbihhbW91bnQpIHtcbiAgICAgIHJldHVybiB0aGlzLlNldCh0aGlzKS5yZW0oYW1vdW50KTtcbiAgICB9XG5cbiAgICAvL1Rocm93cyBJbmRleE91dE9mQm91bmRzRXhjZXB0aW9uIHdoZW4gZ2l2ZW4gaW5kZXggaXMgb3V0IG9mIGJvdW5kcyBvZiBhXG4gICAgcC5tZXIgPSBmdW5jdGlvbihhbW91bnQpIHtcbiAgICAgIHJldHVybiB0aGlzLnJldmVyc2UoKS5yZW0oYW1vdW50KS5yZXZlcnNlKCk7XG4gICAgfVxuICAgIC8vVGhyb3dzIEluZGV4T3V0T2ZCb3VuZHNFeGNlcHRpb24gd2hlbiBnaXZlbiBpbmRleCBpcyBvdXQgb2YgYm91bmRzIG9mIGFcbiAgICBwLk1lciA9IGZ1bmN0aW9uKGFtb3VudCkge1xuICAgICAgcmV0dXJuIHRoaXMuUmV2ZXJzZSgpLnJlbShhbW91bnQpLnJldmVyZXNlKCk7XG4gICAgfVxuXG4gICAgLy9UaHJvd3MgSW5kZXhPdXRPZkJvdW5kc0V4Y2VwdGlvbiB3aGVuIGdpdmVuIGluZGV4KGVzKSBhcmUgb3V0IG9mIGJvdW5kcyBvZiB0aGlzXG4gICAgLy9UaHJvd3MgSW52YWxpZElucHV0RXhjZXB0aW9uIHdoZW4gZ2l2ZW4gcGFyYW1ldGVycyBhcmUgbm90IGVxdWFsIGluIGxlbmd0aFxuICAgIHAuc3dhcEkgPSBmdW5jdGlvbihpMSwgaTIpIHtcbiAgICAgIGkxID0gW2kxXS5mbGF0KEluZmluaXR5KTtcbiAgICAgIGkyID0gW2kyXS5mbGF0KEluZmluaXR5KTtcbiAgICAgIGlmKGkxLmxlbmd0aCA9PT0gaTIubGVuZ3RoKSB7XG4gICAgICAgIGxldCByb2xsYmFjayA9IHRoaXMuU2V0KHRoaXMpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaTEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlzSW5kZXgoaTFbaV0sdGhpcyk7XG4gICAgICAgICAgICBpc0luZGV4KGkyW2ldLHRoaXMpO1xuICAgICAgICAgICAgW3RoaXNbaTFbaV1dLHRoaXNbaTJbaV1dXSA9IFt0aGlzW2kyW2ldXSx0aGlzW2kxW2ldXV07XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgaWYoZSBpbnN0YW5jZW9mIEluZGV4T3V0T2ZCb3VuZHNFeGNlcHRpb24pIHRoaXMuc2V0KHJvbGxiYWNrKTtcbiAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgdGhyb3cgbmV3IEludmFsaWRJbnB1dEV4Y2VwdGlvbihcIlBhcmFtZXRlciBpMSBhbmQgaTIgbXVzdCBldGhlciBiZSB0d28gaW5kZXhlcywgb3IgdHdvIGluZGV4LUFycmF5cyBvZiB0aGUgc2FtZSBsZW5ndGguXCIpO1xuICAgIH1cbiAgICAvL1Rocm93cyBJbmRleE91dE9mQm91bmRzRXhjZXB0aW9uIHdoZW4gZ2l2ZW4gaW5kZXgoZXMpIGFyZSBvdXQgb2YgYm91bmRzIG9mIHRoaXNcbiAgICAvL1Rocm93cyBJbnZhbGlkSW5wdXRFeGNlcHRpb24gd2hlbiBnaXZlbiBwYXJhbWV0ZXJzIGFyZSBub3QgZXF1YWwgaW4gbGVuZ3RoXG4gICAgcC5Td2FwSSA9IGZ1bmN0aW9uKGkxLCBpMikge1xuICAgICAgcmV0dXJuIHRoaXMuU2V0KHRoaXMpLnN3YXBJKGkxLCBpMik7XG4gICAgfVxuXG4gICAgLy9UaHJvd3MgSW52YWxpZFZhbHVlRXhjZXB0aW9uIHdoZW4gdGhlIGdpdmVuIHZhbHVlIGNhbm5vdCBiZSBmb3VuZCB3aXRoaW5nIHRoaXNcbiAgICAvL1Rocm93cyBJbnZhbGlkSW5wdXRFeGNlcHRpb24gd2hlbiBnaXZlbiBwYXJhbWV0ZXJzIGFyZSBub3QgZXF1YWwgaW4gbGVuZ3RoXG4gICAgcC5zd2FwViA9IGZ1bmN0aW9uKHYxLCB2Mikge1xuICAgICAgdjEgPSB0aGlzLlNldCh2MSkuZmxhdCgyKTtcbiAgICAgIHYyID0gdGhpcy5TZXQodjIpLmZsYXQoMik7XG4gICAgICBpZiAodjEubGVuZ3RoID09PSB2Mi5sZW5ndGgpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2MS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHRoaXMuc3dhcEkodGhpcy5pbmRleCh2MVtpXSksdGhpcy5pbmRleCh2MltpXSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgICAgdGhyb3cgbmV3IEludmFsaWRJbnB1dEV4Y2VwdGlvbihcIlBhcmFtZXRlciB2MSBhbmQgdjIgbXVzdCBldGhlciBiZSB0d28gdmFsdWVzLCBvciB0d28gdmFsdWUtQXJyYXlzIG9mIHRoZSBzYW1lIGxlbmd0aC5cIik7XG4gICAgfVxuICAgIC8vVGhyb3dzIEludmFsaWRWYWx1ZUV4Y2VwdGlvbiB3aGVuIHRoZSBnaXZlbiB2YWx1ZSBjYW5ub3QgYmUgZm91bmQgd2l0aGluZyB0aGlzXG4gICAgLy9UaHJvd3MgSW52YWxpZElucHV0RXhjZXB0aW9uIHdoZW4gZ2l2ZW4gcGFyYW1ldGVycyBhcmUgbm90IGVxdWFsIGluIGxlbmd0aFxuICAgIHAuU3dhcFYgPSBmdW5jdGlvbih2MSwgdjIpIHtcbiAgICAgIHJldHVybiB0aGlzLlNldCh0aGlzKS5zd2FwVih2MSwgdjIpO1xuICAgIH1cblxuICAgIC8vVGhyb3dzIEluZGV4T3V0T2ZCb3VuZHNFeGNlcHRpb24gd2hlbiBnaXZlbiBwYXJhbSBpcyBkZXRlY3RlZCBhcyBpbmRleCBidXQgb3V0IG9mIGJvdW5kcyBvZiB0aGlzXG4gICAgLy9UaHJvd3MgSW52YWxpZFZhbHVlRXhjZXB0aW9uIHdoZW4gdGhlIGdpdmVuIHBhcmFtIGlzIGRldGVjdGVkIGFzIHZhbHVlIGJ1dCBjYW5ub3QgYmUgZm91bmQgd2l0aGluZyB0aGlzXG4gICAgcC5zd2FwID0gZnVuY3Rpb24odmkxLCB2aTIpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRoaXMuc3dhcEkodmkxLCB2aTIpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBpZiAoZSBpbnN0YW5jZW9mIEluZGV4T3V0T2ZCb3VuZHNFeGNlcHRpb24pIHRoaXMuc3dhcFYodmkxLCB2aTIpO1xuICAgICAgICBlbHNlIHRocm93IGU7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLy9UaHJvd3MgSW5kZXhPdXRPZkJvdW5kc0V4Y2VwdGlvbiB3aGVuIGdpdmVuIHBhcmFtIGlzIGRldGVjdGVkIGFzIGluZGV4IGJ1dCBvdXQgb2YgYm91bmRzIG9mIHRoaXNcbiAgICAvL1Rocm93cyBJbnZhbGlkVmFsdWVFeGNlcHRpb24gd2hlbiB0aGUgZ2l2ZW4gcGFyYW0gaXMgZGV0ZWN0ZWQgYXMgdmFsdWUgYnV0IGNhbm5vdCBiZSBmb3VuZCB3aXRoaW5nIHRoaXNcbiAgICBwLlN3YXAgPSBmdW5jdGlvbih2aTEsIHZpMikge1xuICAgICAgcmV0dXJuIHRoaXMuU2V0KHRoaXMpLnN3YXAodmkxLCB2aTIpXG4gICAgfVxuXG4gICAgcC5wcmlvciA9IGZ1bmN0aW9uKGksIGJ5ID0gMSkge1xuICAgICAgbGV0IHIgPSBpIC0gYnk7XG4gICAgICBpZiAociA+PSAwKSByZXR1cm4gdGhpc1tyXTtcbiAgICAgIHJldHVybiB0aGlzW3RoaXMubGVuZ3RoLShieS1pKV1cbiAgICB9XG4gICAgcC5uZXh0ID0gZnVuY3Rpb24oaSwgYnkgPSAxKSB7XG4gICAgICBsZXQgciA9IGkgKyBieTtcbiAgICAgIGlmIChyIDw9IHRoaXMubGVuZ3RoLTEpIHJldHVybiB0aGlzW3JdO1xuICAgICAgcmV0dXJuIHRoaXNbYnktKGktdGhpcy5sZW5ndGgtMSldXG4gICAgfVxuXG4gICAgcC5pbmplY3QgPSBmdW5jdGlvbihpdGVtLCBpbmRleCkge1xuICAgICAgdGhpcy5zcGxpY2UoaW5kZXgsIDAsIGl0ZW0pO1xuICAgICAgcmV0dXJuIHRoaXNcbiAgICB9XG5cbiAgICBwLmNvbnRhaW5zID0gZnVuY3Rpb24oLi4udmFscykge1xuICAgICAgZm9yIChsZXQgdiBvZiB2YWxzKSB7XG4gICAgICAgIGlmICghdGhpcy5pbmNsdWRlcyh2KSkgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgICBwLmV4Y2x1ZGVzID0gZnVuY3Rpb24oLi4udmFscykge1xuICAgICAgZm9yIChsZXQgdiBvZiB2YWxzKSB7XG4gICAgICAgIGlmICh0aGlzLmluY2x1ZGVzKHYpKSByZXR1cm4gZmFsc2VcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgcmV0dXJuIEFyQ29uc3RyXG4gIH1cbiAgaW5pdC5FeGNlcHRpb24gPSBFeGNlcHRpb247XG4gIGluaXQuSW5kZXhPdXRPZkJvdW5kc0V4Y2VwdGlvbiA9IEluZGV4T3V0T2ZCb3VuZHNFeGNlcHRpb247XG4gIGluaXQuSW52YWxpZElucHV0RXhjZXB0aW9uID0gSW52YWxpZElucHV0RXhjZXB0aW9uO1xuICBpbml0LkludmFsaWRDb25zdHJ1Y3RvckV4Y2VwdGlvbiA9IEludmFsaWRDb25zdHJ1Y3RvckV4Y2VwdGlvbjtcbiAgaW5pdC5JbnZhbGlkVmFsdWVFeGNlcHRpb24gPSBJbnZhbGlkVmFsdWVFeGNlcHRpb247XG4gIC8vaW5pdC52ZXJzaW9uID0gXCJ1bmtub3duXCI7XG4gIHJldHVybiBpbml0O1xufSgpKTtcbiIsImltcG9ydCBzZXREYXRhIGZyb20gXCIuLy4uLy4uL2FwcC9zcmMvZi1kYlwiO1xyXG5pbXBvcnQgZGVsYXkgZnJvbSBcImRlbGF5XCI7XHJcbmxldCBkYXRhID0ge1xyXG4gICAgbmVzdGVkOiB7XHJcbiAgICAgICAgcHJvcDogXCJ2YWxcIlxyXG4gICAgfSxcclxuICAgIG51bTogMTIzXHJcbn07XHJcbmxldCBkYiA9IHNldERhdGEoZGF0YSk7XHJcbmRiLmdldChcIm51bVwiLCAobnVtKSA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhcIm51bTogXCIgKyBudW0pO1xyXG59KTtcclxuZGVsYXkoMTAwMCkudGhlbigoKSA9PiB7XHJcbiAgICBkYi5zZXQoXCJudW1cIiwgMSk7XHJcbn0pO1xyXG4iXSwic291cmNlUm9vdCI6IiJ9