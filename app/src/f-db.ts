type Subscription<Values extends any[]> = (...value: Values) => void | Promise<void>




export class Data<Values extends [Value], Value = Values[0]> {
  private value: Value
  private subsciptions: Subscription<[Value]>[]

  public constructor(value: Value) {
    this.value = value
  }

  public get(): Value
  public get(observer: Subscription<Values>, initialize?: boolean): typeof observer
  public get(observer?: Subscription<Values>, initialize: boolean = false): Value | typeof observer {
    if (observer) {
      this.subscribe(observer, initialize)
    }
    else return this.value
  }
  private subscribe(observer: Subscription<[Value]>, initialize: boolean): void | Promise<void> {
    this.subsciptions.add(observer)
    if (initialize) return observer(this.value)
  }

  public got(observer: Subscription<Values>): typeof observer {
    this.subsciptions.rmV(observer)
    return observer
  }

  public set(value: Value): Value
  public set(value: Value, wait: false): Value
  public set(value: Value, wait: true): Promise<Value>
  public set(value: Value, wait: boolean = false): Value | Promise<Value> {
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
  //@ts-ignore
  [P in keyof T]: DataSet<T[P]>
}





class DataCollection<Values extends any[]> {
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



type DataSet<Values extends any[]> = Data<[Values[0]]> | DataCollection<Values>


let ssssssssss: DataSet<[true, "false"]> = new DataCollection(new Data(true), new Data("false"))
ssssssssss.get((s, w) => {
  s
})

type C = number

type A<T extends Array<any>> = T extends Array<infer U> ? U extends number ? true : false : false

type B = A<C[]>


class DataSubscription<Values extends any[], ConcreteData extends DataSet<Values> = DataSet<Values>, ConcreteSubscription extends ConcreteData extends Data<[Values[0]]> ? Subscription<[Values[0]]> : Subscription<Values> = ConcreteData extends Data<[Values[0]]> ? Subscription<[Values[0]]> : Subscription<Values>> {
  private _active: boolean = false

  private _subscription: ConcreteSubscription
  private _data: ConcreteData

  constructor(data: DataCollection<Values>, subscription: Subscription<Values>, activate?: false)
  constructor(data: DataCollection<Values>, subscription: Subscription<Values>, activate?: true, inititalize?: boolean)
  constructor(data: Data<[Values[0]]>, subscription: Subscription<[Values[0]]>, activate?: false)
  constructor(data: Data<[Values[0]]>, subscription: Subscription<[Values[0]]>, activate?: true, inititalize?: boolean)
  constructor(data: ConcreteData, _subscription: Subscription<Values> | Subscription<[Values[0]]>, activate?: boolean, inititalize?: boolean) {
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

  
  public data()
  public data(data: ConcreteData)
  public data() {

  }
  
}

