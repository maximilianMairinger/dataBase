require("xrray")(Array)

type Subscription<Values extends any[]> = (...value: Values) => void | Promise<void>




export class Data<Values extends [Value], Value = Values[0]> {
  private value: Value
  private subscriptions: Subscription<[Value]>[] = []

  public constructor(value?: Value) {
    this.value = value
  }

  public get(): Value
  public get(subscription: Subscription<Values>, initialize?: boolean): Subscription<Values>
  public get(subscription?: Subscription<Values>, initialize: boolean = true): Value | Subscription<Values> {
    if (subscription) {
      this.subscribe(subscription, initialize)
    }
    else return this.value
  }
  private subscribe(subscription: Subscription<[Value]>, initialize: boolean): void | Promise<void> {
    this.subscriptions.add(subscription)
    if (initialize) return subscription(this.value)
  }
  // TODO return true when successfull
  public got(subscription: Subscription<Values>): Subscription<Values> {
    this.subscriptions.rmV(subscription)
    return subscription
  }

  public set(value: Value): Value
  public set(value: Value, wait: false): Value
  public set(value: Value, wait: true): Promise<Value>
  public set(value: Value, wait: boolean = false): Value | Promise<Value> {
    if (value === this.value) return value
    this.value = value
    if (wait) {
      for (let subscription of this.subscriptions) {
        subscription(value)
      }
      return value
    }
    else {
      return (async () => {
        for (let subscription of this.subscriptions) {
          await subscription(value)
        }
        return value
      })()
    }
  }
}


type DataSet<Values extends any[]> = Data<[Values[0]]> | DataCollection<Values>

type DataSetify<T extends any[]> = { 
  [P in keyof T]: DataSet<[T[P]]>
}




export class DataCollection<Values extends any[], Value extends Values[number] = Values[number]> {
  private subscriptions: Subscription<Values>[] = []
  //@ts-ignore
  private datas: DataSetify<Values> = []
  private store: Values

  private observers: Subscription<[Value]>[] = []

  constructor(...datas: DataSetify<Values>) {
    //@ts-ignore
    this.set(...datas)
  }

  public set(...datas: DataSetify<Values>) {
    this.datas.ea((data, i) => {
      data.got(this.observers[i])
    })
    this.observers.clear()

    this.datas = datas
    //@ts-ignore
    this.store = [...this.get()]


    this.datas.ea((data, i) => {
      const observer = (val: Value) => {
        this.store[i] = val
        this.subscriptions.Call(...this.store)
      }
      this.observers[i] = observer
      //@ts-ignore
      data.subscribe(observer, false)
    })
  }


  private subscribe(subscription: Subscription<Values>, initialize: boolean): Subscription<Values> {
    this.subscriptions.add(subscription)
    if (initialize) subscription(...this.store)
    return subscription
  }

  public get(): Values
  public get(subscription: Subscription<Values>, initialize?: boolean): DataSubscription<Values>
  public get(subscription?: Subscription<Values>, initialize: boolean = true): DataSubscription<Values> | Values {
    //@ts-ignore
    if (subscription === undefined) return this.datas.Inner("get", [])
    else return new DataSubscription(this, subscription, true, initialize)
  }
  public got(subscription: Subscription<Values>): Subscription<Values> {
    this.subscriptions.rmV(subscription)
    return subscription
  }

} 



export class DataSubscription<Values extends Value[], TupleValue extends [Value] = [Values[number]], Value = TupleValue[0], ConcreteData extends DataSet<Values> = DataSet<Values>, ConcreteSubscription extends ConcreteData extends Data<TupleValue> ? Subscription<TupleValue> : Subscription<Values> = ConcreteData extends Data<TupleValue> ? Subscription<TupleValue> : Subscription<Values>> {
  private _active: boolean = false

  private _subscription: ConcreteSubscription
  private _data: ConcreteData

  constructor(data: DataCollection<Values>, subscription: Subscription<Values>, activate?: false)
  constructor(data: DataCollection<Values>, subscription: Subscription<Values>, activate?: true, inititalize?: boolean)
  constructor(data: Data<TupleValue>, subscription: Subscription<TupleValue>, activate?: false)
  constructor(data: Data<TupleValue>, subscription: Subscription<TupleValue>, activate?: true, inititalize?: boolean)
  constructor(data: Data<TupleValue> | DataCollection<Values>, _subscription: Subscription<Values> | Subscription<TupleValue>, activate: boolean = true, inititalize: boolean = true) {
    //@ts-ignore
    this._data = data
    //@ts-ignore
    this._subscription = _subscription
    //@ts-ignore
    this.active(activate, inititalize)
  }

  public acivate(initialize: boolean = true): this {
    if (this._active) return
    this._active = true
    //@ts-ignore
    this._data.subscribe(this._subscription, initialize)
    return this
  }

  public deacivate(): this {
    if (!this._active) return
    this._active = false
    //@ts-ignore
    this._data.got(this._subscription)
    return this
  }

  public active(activate: false): this
  public active(activate: true, initialize?: boolean): this
  public active(activate: boolean, initialize?: boolean): this {
    if (activate) this.acivate(initialize)
    else this.deacivate()
    return this
  }

  
  public data(): ConcreteData
  public data(data: ConcreteData): this
  public data(data?: ConcreteData): ConcreteData | this {
    if (data == undefined) return this._data
    else {
      let isActive = this.active
      this.deacivate()
      this._data = data
      if (isActive) this.acivate()
      return this
    }
  }
  
  public subscription(): ConcreteSubscription
  public subscription(subscription: ConcreteSubscription, initialize?: boolean): this
  public subscription(subscription?: ConcreteSubscription, initialize?: boolean): ConcreteSubscription | this {
    if (subscription === undefined) return this._subscription
    else {
      let isActive = this.active
      this.deacivate()
      this._subscription = subscription
      if (isActive) this.acivate()
      return this
    }
  }
}

