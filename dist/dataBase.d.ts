export declare class InvalidKey extends Error {
    constructor(key: string, data: Data);
}
export declare class InvalidCast extends Error {
    constructor(castAttempt: typeof Array | typeof Number);
}
export default function setData(data: object, location?: any | Data<any>, complete?: Function): DataBase<any>;
export declare class DataBase<T> {
    protected data: Data<T>;
    constructor(data: Data<T>);
    toString(): string;
    /**
     * Gets a reference to subData found under given key(s) / path
     * A reference is a new DataBase instance just containing the referenced Data
     *
     * This function resolves references via the "recursively anchored Data" (rad) procedure. For further
     * insights what this means please consult the documentation of the function rad
     */
    ref<refT = any>(...keys: Array<string | number>): DataBase<refT>;
    peek<refT = any>(...keys: Array<string | number>): DataBase<refT>;
    current<refT = any>(...keys: Array<string | number>): any;
    get(key: string | number | Data<any>): Data<any>;
    get(key: Array<string | number | Data<any>>): Data<any>[];
    get(key: string | number | Data<any>, cb: (val: any) => any): void;
    /**
     *
     *
     *
     */
    get(key: Array<string | number | Data<any>>, cb?: (...val: any[]) => any): void;
    set(key: string | number, to: any): void;
    /**
     * Gets recursively anchored Data (rad)
     * Meaning for each nesting step there will be one listener attatched to enable objects to be observed
     * This is very resource (mem) expensive. Use only when necessary
     */
    protected rad(...keys: Array<string | number>): Data<any>;
    protected fds(...keys: Array<string | number>): Data<any>;
    readonly asArray: DataArray<T>;
    readonly asNumber: DataNumber<T>;
    equals(that: DataBase<any>): boolean;
    same(that: DataBase<any>): boolean;
}
export declare class DataNumber<T = any> extends DataBase<number> {
    constructor(data: Data<number>);
    inc(by?: number): number;
    dec(by?: number): number;
}
export declare class DataArray<T = any> extends DataBase<Array<Data<T>>> {
    constructor(data: Data<Array<Data<T>>>);
    list<refT = any, refR = void>(loop: (db?: DataBase<refT>, i?: number) => refR, stepIntoPathAfterwards?: string): refR;
    forEach<refT = any>(loop: (db?: DataBase<refT>, i?: number) => void, beforeLoop?: (() => void) | undefined, afterLoop?: (() => void) | undefined, stepIntoPathAfterwards?: string): Promise<any[]>;
    length(cb?: Function): number;
    realLength(cb?: Function): number;
    private beforeLastChange;
    alter(cb: (db?: DataBase<any> | null, i?: number) => void, initalizeLoop?: boolean): void;
    private static morphMap;
    morph(cb: (db?: DataBase<any> | null, i?: number) => void, initalizeLoop?: boolean): void;
    add(val: T, atIndex?: number): void;
    removeI(index: number, closeGap?: boolean): void;
    removeV(val: T, closeGap?: boolean): void;
}
export declare class Data<T = any> {
    private _val;
    private cbs;
    private internalCBs;
    constructor(val: T);
    /**
     * Set the val
     */
    /**
    * Gets the current val
    */
    val: T;
    /**
     * Subscribe to val
     * @param cb callback which gets called whenever the val changes
     */
    subscribe(cb: (val: T) => any, init?: boolean): void;
    private subscribeInternally;
    unsubscribe(cb: (val: T) => any | null): void;
    toString(tabIn?: number, insideObject?: boolean): string;
    private notify;
    /**
     * Compares if all keys in this are equal to the equivelent ones on data
     * Different Data Instances holding the same value are the equal
     * Data can have more keys than this and still be equal.
     * If you dont want this pass in true to the strict param. This will be more recource intensive
     */
    equals(data: Data<T>, strict?: boolean): boolean;
    clone(): Data<T>;
}
