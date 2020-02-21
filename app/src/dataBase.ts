import { Data, DataSubscription, DataCollection, DataSet } from "./data"
import { nthIndex } from "./helper"
import clone from "tiny-clone"





class InternalDataBase<Store extends ComplexData> extends Function {
  private t: any

  private store: Store
  private hasNotifyParentOfChange: boolean

  constructor(store: Store, private notifyParentOfChange?: () => void) {
    super(paramsOfDataBaseFunction, bodyOfDataBaseFunction)
    this.t = this.bind(this)

    this.store = store
    this.hasNotifyParentOfChange = notifyParentOfChange !== undefined
    this.notify = this.notify.bind(this)
    this.subscriptions = []

    
    this.attatchDataToFunction()
    

    
    return this.t
  }
  private subscriptions: ((store: Store) => void)[]
  private notify() {
    if (this.hasNotifyParentOfChange) this.notifyParentOfChange()
    this.subscriptions.Call(this.store)
  }

  private destroy() {
    for (const key in this.t) {
      this.t[key].destory()
      delete this.t[key]
    }
    for (const key in this) {
      //@ts-ignore
      delete this[key]
    }
  }

  private DataBaseFunctionWrapper(...a) {
    return this.DataBaseFunction(...a)
  }


  private DataBaseFunction(...paths: PathSegment[]): any
  private DataBaseFunction<NewStore extends ComplexData>(data: NewStore): DataBase<NewStore & Store>
  private DataBaseFunction(): Store
  private DataBaseFunction(subscription: (store: Store) => void, init: boolean): any
  private DataBaseFunction(path_data_subscription?: PathSegment | ComplexData | ((store: Store) => void), init_path?: PathSegment | boolean, ...paths: PathSegment[]): any {
    const t = this.t
    if (path_data_subscription instanceof Data || path_data_subscription instanceof DataCollection) {
      let data = path_data_subscription as ComplexData
      
      

      for (const key in data) {
        const inner = t[key]
        const val = data[key]
        if (inner !== undefined) {
          if (inner instanceof Data) {
            if (typeof val !== "object") {
              //@ts-ignore
              this.store[key] = val
              inner.set(val)
            }
            else {
              //@ts-ignore
              this.store[key] = clone(val)
              (inner as any).destory()
              t[key] = new InternalDataBase(val, this.notify)
            }
          }
          else {
            if (typeof val === "object") inner(val)
            else {
              //@ts-ignore
              this.store[key] = clone(val)
              (inner as any).destory()
              t[key] = new Data(val)
              t[key].get((e) => {
                //@ts-ignore
                this.store[key] = e
                this.notify()
              })
            }
          }
        }
        else {
          if (typeof val === "object") {
            t[key] = new InternalDataBase(val, this.notify)
            //@ts-ignore
            this.store[key] = clone(val)
          }
          else {
            //@ts-ignore
            this.store[key] = val
            t[key] = new Data(val)
            t[key].get((e) => {
              //@ts-ignore
              this.store[key] = e
              this.notify()
            })
          }
        }
      }
      return t
    }
    else if (path_data_subscription instanceof Array) {
      
    }
    else if (typeof path_data_subscription === "function") {
      let subscription = path_data_subscription as (store: Store) => void

      if (init_path === undefined || init_path) subscription(this.store)
      this.subscriptions.add(subscription)

    }
    else if (path_data_subscription === undefined) {
      return this.store
    }
    
  }

  private attatchDataToFunction() {
    const t = this.t
    const data = this.store
    for (const key in data) {
      const val = data[key]
      if (!(val instanceof Data || val instanceof InternalDataBase)) {
        if (typeof val === objectString) t[key] = new InternalDataBase(val, this.notify)
        else {
          t[key] = new Data(val)
          t[key].get((e) => {
            this.store[key] = e
            this.notify()
          })

        }
      }
    }
  }
}


//@ts-ignore
const entireDataBaseFunction = InternalDataBase.prototype.DataBaseFunctionWrapper.toString(); 
const paramsOfDataBaseFunction = entireDataBaseFunction.slice(entireDataBaseFunction.indexOf("(") + 1, nthIndex(entireDataBaseFunction, ")", 1));
const bodyOfDataBaseFunction = entireDataBaseFunction.slice(entireDataBaseFunction.indexOf("{") + 1, entireDataBaseFunction.lastIndexOf("}"));


const objectString: "object" = "object"


type PrimitivePathSegment = string | number
type PathSegment = PrimitivePathSegment | DataSet<[PrimitivePathSegment]>
type ComplexData = {[key: string]: any}




type FunctionProperties = "apply" | "call" | "caller" | "bind" | "arguments" | "length" | "prototype" | "name" | "toString"
type OmitFunctionProperties<Func extends Function> = Func & Record<FunctionProperties, never>
type DataBaseify<Type extends object> = { 
  [Key in keyof Type]: Type[Key] extends object ? DataBase<Type[Key]> : Data<Type[Key]>
}

type DataBase<Store extends object> = OmitFunctionProperties<InternalDataBase<Store>["DataBaseFunction"]> & DataBaseify<Store>

//@ts-ignore
export const DataBase = InternalDataBase as ({ new<Store extends object>(store: Store): DataBase<Store> } )

