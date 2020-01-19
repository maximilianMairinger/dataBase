type Subscription<Values extends any[]> = (...value: Values) => void | Promise<void>


export class Data<Value> {
  private value: Value
  private subsciptions: Subscription<[Value]>[]

  public constructor(value?: Value) {
    this.value = value
  }

  public get(): Value
  public get(observer: Subscription<[Value]>, initialize?: boolean): typeof observer
  public get(observer?: Subscription<[Value]>, initialize: boolean = false): Value | typeof observer {
    if (observer) {
      this.subsciptions.add(observer)
      if (initialize) observer(this.value)
      return observer
    }
    else return this.value
  }

  public got(observer: Subscription<[Value]>): typeof observer {
    this.subsciptions.rmV(observer)
    return observer
  }

  public set(value: Value): typeof value
  public set(value: Value, wait: false): typeof value
  public set(value: Value, wait: true): Promise<typeof value>
  public set(value: Value, wait: boolean = false): typeof value | Promise<typeof value> {
    this.value = value
    if (wait) {
      for (let subscription of this.subsciptions) {
        subscription(value)
      }
      return value
    }
    else {
      return (async () => {
        for (let subscription of this.subsciptions) {
          await subscription(value)
        }
        return value
      })()
    }
  }
}


type DataSetify<T> = { 
  [P in keyof T]: DataSet<T[P]>
}



type Tupleify<TupleOrNot> = TupleOrNot extends any[] ? TupleOrNot : [TupleOrNot]
type Tuple = [...any[]]



class DataCollection<Value_Values, Values extends Tupleify<Value_Values> = Tupleify<Value_Values>> {
  private observers: Subscription<Values>[] = []
  private datas: DataSetify<Values>
  constructor(...datas: DataSetify<Values>) {
    this.datas = datas
  }


  private subscribe(observer: Subscription<Values>, initialize: boolean) {
    this.observers.add(observer)
    if (initialize) observer(...this.get())
  }

  public get(): Values
  public get(observer: Subscription<Values>, initialize?: boolean): DataSubscription<Values>
  public get(observer?: Subscription<Values>, initialize: boolean = true): DataSubscription<Values> | Values[] {
    //@ts-ignore
    if (observer === undefined) return this.datas.Inner("get", [])
    else return new DataSubscription(this, observer, true, initialize)
  }
  public got(observer: Subscription<Values>): Subscription<Values> {
    throw new Error("Method not implemented.")
  }

} 



type DataSet<Value> = Data<Value> | DataCollection<Value>


let ssssssssss: DataSet<[true, "false"]> = new DataCollection(new Data(true), new Data("false"))
ssssssssss.get((s, w) => {
  s
})

class DataSubscription<Value_Values, Values extends Tupleify<Value_Values> = Tupleify<Value_Values>> {
  private _active: boolean = false

  constructor(data: DataSet<Value_Values>, subscription: Subscription<Values>, activate?: false)
  constructor(data: DataSet<Value_Values>, subscription: Subscription<Values>, activate?: true, inititalize?: boolean)
  constructor(private _data: DataSet<Value_Values>, private _subscription: Subscription<Values>, activate?: boolean, inititalize?: boolean) {
    //@ts-ignore
    this.active(activate, inititalize)
  }

  public acivate(initialize: boolean = true): this {
    if (this._active) return
    this._active = true

    this._data.get(this._subscription, initialize)



    return this
  }

  public deacivate(): this {
    if (!this._active) return
    this._active = false
    
    return this
  }

  public active(activate: false): this
  public active(activate: true, initialize?: boolean): this
  public active(activate: boolean, initialize?: boolean): this {
    if (activate) this.acivate(initialize)
    else this.deacivate()
    return this
  }
  
}

