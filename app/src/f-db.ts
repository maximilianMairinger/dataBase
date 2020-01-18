type Subscription<T> = (value: T) => void | Promise<void>

export interface Observable<Value> {
  get(): Value
  get(observer?: Subscription<Value>): typeof observer
  get(cb?: Subscription<Value>): Value | typeof cb

  got(cb: Subscription<Value>): typeof cb
}

export class Data<Value> implements Observable<Value> {
  private value: Value
  private subsciptions: Subscription<Value>[]

  public constructor(value?: Value) {
    this.value = value
  }

  public get(): Value
  public get(cb: Subscription<Value>, initialize?: boolean): typeof cb
  public get(observer?: Subscription<Value>, initialize: boolean = false): Value | typeof observer {
    if (observer) {
      this.subsciptions.add(observer)
      if (initialize) observer(this.value)
      return observer
    }
    else return this.value
  }

  public got(observer: Subscription<Value>): typeof observer {
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




