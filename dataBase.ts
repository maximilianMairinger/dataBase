// This file basically contains a observable Class (called Data) and a
// DataBase which contains a komplex (not primitiv types = objects)
// map off Observables as is often given when requesting data (e.g. JSON).

let xrray = require("xrray")
xrray()
const {InvalidValueException} = xrray;


export class InvalidKey extends Error {
  constructor(key: string, data: Data) {
    super("Invalid key \"" + key + "\" for the following data structure:\n" + data.toString());
  }
}

export class InvalidCast extends Error {
  constructor(castAttempt: typeof Array | typeof Number) {
    super("Cannot cast to " + castAttempt.name);
  }
}

// Formats fetched ( = raw) data into an nested Data construct.
function formatData(fetched: any, formatLocation?: Data, deleteUnseenVals = false) {
  if (formatLocation === undefined) formatLocation = new Data(new fetched.constructor())
  let ls: any[];
  let updatedFormatLocation = false;
  if (deleteUnseenVals) ls = [];
  if (typeof fetched === "object") {
    for (let d in fetched) {
      if (!fetched.hasOwnProperty(d)) continue;
      if (deleteUnseenVals) ls.add(d);
      if (typeof fetched[d] === "object") {
        if (formatLocation.val[d] === undefined) formatLocation.val[d] = new Data(new fetched[d].constructor());
        formatData(fetched[d], formatLocation.val[d], deleteUnseenVals);
        updatedFormatLocation = true;
      } else if (formatLocation.val[d] === undefined) {
        formatLocation.val[d] = new Data(fetched[d]);
        updatedFormatLocation = true;
      }
      else if (formatLocation.val[d] instanceof Data) formatLocation.val[d].val = fetched[d];
    }
    if (deleteUnseenVals) {
      for (let d in formatLocation.val) {
        if (!formatLocation.val.hasOwnProperty(d)) continue;
        if (!ls.includes(d)) if (formatLocation.val instanceof Array) formatLocation.val.removeI(parseInt(d))
        else delete formatLocation.val[d];
        updatedFormatLocation = true;
      }
    }

    //@ts-ignore when something is added notify listeners
    if (updatedFormatLocation) formatLocation.notify(true);

  }
  else formatLocation.val = fetched

  return formatLocation;
}

export default function setData (data: object, location?: any | Data<any>, complete?: Function) {
  if (!(location instanceof Data) && location !== undefined) location = new Data(location);
  let dataLocation = formatData(data, location);
  if (complete !== undefined) complete();
  return new DataBase(dataLocation);
}

/*
 * Holds and handles access to an complex map of data. This data Consisits of in each other nexted Data intsances
 * (to init such an map, consult formatData.)
 */
export class DataBase<T> {
  constructor(protected data: Data<T>) {

  }
  public toString() {
    return "DataBase: " + this.data.toString()
  }
  /**
   * Gets a reference to subData found under given key(s) / path
   * A reference is a new DataBase instance just containing the referenced Data
   *
   * This function resolves references via the "recursively anchored Data" (rad) procedure. For further
   * insights what this means please consult the documentation of the function rad
   */
  public ref<refT = any>(...keys: Array<string | number>): DataBase<refT> {
    return new DataBase<refT>(this.rad(...keys));
  }

  public peek<refT = any>(...keys: Array<string | number>): DataBase<refT> {
    return new DataBase<refT>(this.fds(...keys));
  }

  public current<refT = any>(...keys: Array<string | number>) {
    return (this.fds(...keys)).val;
  }


  public get(key: string | number | Data<any>): Data<any>
  public get(key: Array<string | number | Data<any>>): Data<any>[]
  public get(key: string | number | Data<any>, cb: (val: any) => any): void
  /**
   *
   *
   *
   */
  public get(key: Array<string | number | Data<any>>, cb?: (...val: any[]) => any): void
  /**
   * Gets the underlying Data found under given key(s) / path
   * Similar to ref but not wrapped inside a DataBase instance
   *
   * This function resolves references via the "recursively anchored Data" (rad) procedure. For further
   * insights what this means please consult the documentation of the function rad
   */
  public get(key: string | number | Data<any> | Array<string | number | Data<any>>, cb?: (...val: T[]) => any): any {
    if (typeof key === "string" || typeof key === "number" || key instanceof Data) {
      let data = (key instanceof Data) ? key : this.rad(key);
      if (cb !== undefined) {
        data.subscribe(cb)
      }
      else {
        return data;
      }
    }
    else {
      let map: any[] = [];
      if (cb !== undefined) {
        for (let i = 0; i < key.length; i++) {
          //@ts-ignore
          let data = (key[i] instanceof Data) ? key[i] : this.rad(key[i]);
          const subscribtion = (v: any) => {
            map[i] = v;
            if (key.length === map.length) {
              if (cb !== undefined) {
                cb(...map);
              }
              else return map
            }
          }
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

  public set(key: string | number, to: any) {
    let fds = this.fds(key);
    formatData(to, fds, true);
  }
  /**
   * Gets recursively anchored Data (rad)
   * Meaning for each nesting step there will be one listener attatched to enable objects to be observed
   * This is very resource (mem) expensive. Use only when necessary
   */
  protected rad(...keys: Array<string | number>): Data<any> {
    let last: Data<any> = this.data;

    let organizedKeys = keys.join(".").split(".");

    organizedKeys.ea((k) => {
      if (k !== "") {
        let next = last.val[k];
        if (next === undefined) throw new InvalidKey(k, last)
        //@ts-ignore
        last.subscribeInternally((any: Data | any) => {
          let a = any[k];
          let dt = a instanceof Data;
          if (!(typeof a === "object" && !dt)) next.val = (dt) ? a.val : a;
        });
        last = next;
      }
    });


    return last;
  }

  protected fds(...keys: Array<string | number>) {
    let last: Data<any> = this.data;

    let organizedKeys = keys.join(".").split(".");

    organizedKeys.ea((k) => {
      if (k !== "") {
        let next = last.val[k];
        if (next === undefined) throw new InvalidKey(k, last)
        last = next;
      }
    });

    return last
  }
  public get asArray() {
    //@ts-ignore
    if (this.data.val instanceof Array) return new DataArray(this.data)
    else throw new InvalidCast(Array);
  }
  public get asNumber() {
    //@ts-ignore
    if (typeof this.data.val === "number") return new DataNumber(this.data)
    else throw new InvalidCast(Number);
  }
  public equals(that: DataBase<any>) {
    return this.data.equals(that.data, true)
  }
  public same(that: DataBase<any>) {
    return this.data.val === that.data.val;
  }
}

export class DataNumber<T = any> extends DataBase<number> {
  constructor(data: Data<number>) {
    super(data)
  }
  inc(by: number = 1) {
    this.data.val += by;
    return this.data.val
  }
  dec(by: number = 1) {
    this.data.val -= by;
    return this.data.val
  }
}

export class DataArray<T = any> extends DataBase<Array<Data<T>>> {
  constructor(data: Data<Array<Data<T>>>) {
    super(data)
  }

  public list<refT = any, refR = void>(loop: (db?: DataBase<refT>, i?: number) => refR, stepIntoPathAfterwards: string = ""): refR {

    for (let i = 0; i < this.length(); i++) {
      let end = loop(new DataBase(this.fds(i, stepIntoPathAfterwards)), i);
      if (end !== undefined) return end;
    }
  }

  public forEach<refT = any>(loop: (db?: DataBase<refT>, i?: number) => void, beforeLoop?: (() => void) | undefined, afterLoop?: (() => void) | undefined, stepIntoPathAfterwards: string = "") {
    let proms = [];
    this.get("", () => {
      if (beforeLoop !== undefined) proms.add(beforeLoop());
      this.data.val.ea((e, i) => {
        proms.add(loop(new DataBase(this.fds(i, stepIntoPathAfterwards)), i));
      })
      proms = proms.filter((e) => {
        return e instanceof Promise;
      })
      if (afterLoop !== undefined) {
        if (proms.length === 0) Promise.all(proms).then(afterLoop)
        else afterLoop();
      }
    })
    if (proms.length !== 0) return Promise.all(proms)
  }
  public length(cb?: Function) {
    if (cb === undefined) return this.data.val.length;
    else {
      this.get("", (a) => {
        cb(a.length)
      })
    }
  }
  public realLength(cb?: Function) {
    if (cb === undefined) return this.data.val.realLength;
    else {
      this.get("", (a) => {
        cb(a.realLength)
      })
    }
  }
  private beforeLastChange: Data<Array<any>>;
  public alter(cb: (db?: DataBase<any> | null, i?: number) => void, initalizeLoop = false) {
    this.beforeLastChange = this.data.clone();
    if (initalizeLoop) {
      this.data.val.ea((e, i) => {
        cb(new DataBase<T>(e), i)
      })
    }
    this.get("", (a) => {
      let indexesToBeCalled: number[] = [];
      a.ea((e, i) => {
        if (e !== undefined) {
          indexesToBeCalled.add(i);
          if (!e.equals(this.beforeLastChange.val[i], true)) cb(new DataBase<T>(e), i);
        }
      })
      this.beforeLastChange.val.ea((e, i) => {
        if (!indexesToBeCalled.includes(i)) cb(null, i);
      })
      this.beforeLastChange = this.data.clone();
    })
  }
  private static morphMap: Map<Data<Array<any>>, ((db?: DataBase<any> | null, i?: number) => void)[]> = new Map();
  public morph(cb: (db?: DataBase<any> | null, i?: number) => void, initalizeLoop = false) {
    this.beforeLastChange = this.data.clone();
    if (initalizeLoop) {
      this.data.val.ea((e, i) => {
        cb(new DataBase<T>(e), i)
      })
    }

    let cba = DataArray.morphMap.get(this.data);
    if (cba === undefined) DataArray.morphMap.set(this.data, [cb]);
    else cba.add(cb);
  }
  public add(val: T, atIndex?: number) {
    let length = this.length()
    let maxIndex = length -1;
    if (atIndex === undefined) atIndex = length;
    this.data.val.Reverse().ea((e, i) => {
      i = maxIndex - i;
      if (i < atIndex) return;
      //THIS IF IS NECESSARY BECAUSE WHEN SETTING EMPTY ARRAY SOLOTS TO UNDEFINED THEY GET PICKED UP BY ITERATORS
      if (this.data.val[i] === undefined) delete this.data.val[i + 1];
      else this.data.val[i + 1] = this.data.val[i]
    })
    delete this.data.val[atIndex];
    let ob = {};
    ob[atIndex] = val;

    formatData(ob, this.data)

    let cba = DataArray.morphMap.get(this.data);
    if (cba !== undefined) cba.ea((f) => {
      f(new DataBase(this.data.val[atIndex]), atIndex)
    })
  }
  public removeI(index: number, closeGap: boolean = true) {
    if (closeGap) this.data.val.removeI(index)
    else delete this.data.val[index];
    //@ts-ignore
    this.data.notify(true);

    let cba = DataArray.morphMap.get(this.data);
    if (cba !== undefined) cba.ea((f) => {
      f(null, index)
    })
  }
  public removeV(val: T, closeGap: boolean = true) {
    let data = formatData(val);
    let index = this.data.val.ea((e, i) => {
      if (e.equals(data)) return i;
    })
    if (index === undefined) throw new InvalidValueException(val, this.data.toString())
    if (closeGap) this.data.val.removeI(index);
    else delete this.data.val[index];
    //@ts-ignore
    this.data.notify(true);
    let cba = DataArray.morphMap.get(this.data);
    if (cba !== undefined) cba.ea((f) => {
      f(null, index)
    })
  }
}


export class Data<T = any> {
  private _val: T;
  private cbs: ((val: T) => any)[] = [];
  private internalCBs: ((val: T) => any)[] = [];

  constructor(val: T) {
    this.val = val;
  }
  /**
   * Set the val
   */
  public set val(to: T) {
    if (this.val === to) return;
    this._val = to;
    this.notify(false);
  }

  /**
   * Gets the current val
   */
  public get val(): T {
    return this._val;
  }

  /**
   * Subscribe to val
   * @param cb callback which gets called whenever the val changes
   */
  public subscribe(cb: (val: T) => any, init: boolean = true) {
    this.cbs.add(cb);
    if (init) cb(this.val);
  }

  private subscribeInternally(cb: (val: T) => any): void {
    this.internalCBs.add(cb);
    cb(this.val);
  }

  public unsubscribe(cb: (val: T) => any | null) {
    if (cb !== null) this.cbs.remove(cb);
    else this.cbs.clear();
  }

  public toString(tabIn: number = 0, insideObject = false) {
    tabIn++;
    let s = "";
    let v = this.val;
    if (typeof v === "object") {
      let hasProps = false;
      let ar = v instanceof Array;
      if (ar) s += "[";
      else s += "{";
      s += "\n"
      for (let k in v) {
        if (!v.hasOwnProperty(k)) continue;
        hasProps = true;
        //@ts-ignore
        s += "\t".repeat(tabIn) + k + ": " + v[k].toString(tabIn, true)
      }
      if (!hasProps) s = s.substring(0, s.length-1)
      else {
        s = s.substring(0, s.length-2) + "\n"
        s += "\t".repeat(tabIn-1)
      }

      if (ar) s += "]";
      else s += "}";
    }
    else {
      let st = typeof v === "string"
      if (st) s += "\"";
      s += v;
      if (st) s += "\"";
    }
    s += insideObject ? "," : ""
    return s + "\n";
  }

  private notify(wild: boolean = false) {
    let val = this.val;
    this.cbs.ea((f) => {
      f(val);
    });
    if (!wild) {
      this.internalCBs.ea((f) => {
        f(val);
      })
    }
  }
  /**
   * Compares if all keys in this are equal to the equivelent ones on data
   * Different Data Instances holding the same value are the equal
   * Data can have more keys than this and still be equal.
   * If you dont want this pass in true to the strict param. This will be more recource intensive
   */
  public equals(data: Data<T>, strict = false) {
    let v = this.val;
    if (data === undefined || data === null) return false
    let d = data.val;
    if (v == d) return true
    let ls: any[];
    if (strict) ls = [];
    for (let k in v) {
      if (!v.hasOwnProperty(k)) continue;
      if (strict) ls.add(k);
      if (v[k] !== d[k]) {
        if (v[k] instanceof Data) {
          if (d[k] instanceof Data) {
            //@ts-ignore
            if (!v[k].equals(d[k], strict)) return false;
          }
          else return false;
        }
        else return false
      }
    }

    if (strict) {
      for (let k in d) {
        if (!v.hasOwnProperty(k)) continue;
        if (!ls.includes(k)) return false
      }
    }

    return true;
  }

  public clone(): Data<T> {
    let d: Data<T>;
    let v = this.val;
    if (typeof v === "object") {
      //@ts-ignore
      let data = new v.constructor();
      d = new Data(data);
      for (let k in v) {
        if (!v.hasOwnProperty(k)) continue;
        //@ts-ignore
        d.val[k] = v[k].clone()
      }
    }
    else d = new Data(v);
    d.internalCBs.add(...this.internalCBs)
    d.cbs.add(...this.cbs)
    return d;
  }
}
