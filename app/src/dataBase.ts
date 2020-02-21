import { Data, DataSubscription, DataCollection, DataSet } from "./data"
import { nthIndex } from "./helper"





class InternalDataBase<Store extends object> extends Function {
  private t: any

  private rawStore: Store

  constructor(store: Store) {
    super(paramsOfDataBaseFunction, bodyOfDataBaseFunction)
    this.t = this.bind(this)

    this.rawStore = store

    
    this.attatchDataToFunction()
    

    
    return this.t
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
    this.DataBaseFunction(...a)
  }


  private DataBaseFunction(...paths: PathSegment[]): any
  private DataBaseFunction<NewStore extends ComplexData>(data: NewStore): DataBase<NewStore & Store>
  private DataBaseFunction(path_data?: PathSegment | ComplexData, ...paths: PathSegment[]): any {
    const t = this.t
    if (!(path_data instanceof Data || path_data instanceof DataCollection)) {
      let data = path_data as ComplexData
  
      for (const key in data) {
        const inner = t[key]
        const val = data[key]
        if (inner !== undefined) {
          if (inner instanceof Data) {
            if (typeof val !== "object") inner.set(val)
            else {
              (inner as any).destory()
              t[key] = new DataBase(val as any)
            }
          }
          else {
            if (typeof val === "object") inner(val)
            else {
              (inner as any).destory()
              t[key] = new Data(val)
            }
          }
        }
        else {
          if (typeof val === "object") t[key] = new DataBase(val)
          else t[key] = new Data(val)
        }
      }
      return this
    }
    else {
  
    }
    
  }

  private attatchDataToFunction() {
    const t = this.t
    const data = this.rawStore
    for (const key in data) {
      const val = data[key]
      if (!(val instanceof Data || val instanceof DataBase)) {
        if (typeof val === objectString) t[key] = new DataBase(val as any)
        else t[key] = new Data(val)
      }
    }
  }
}


//@ts-ignore
const entireDataBaseFunction = InternalDataBase.prototype.DataBaseFunctionWrapper.toString(); 
const paramsOfDataBaseFunction = entireDataBaseFunction.slice(entireDataBaseFunction.indexOf("(") + 1, nthIndex(entireDataBaseFunction, ")", 1));
const bodyOfDataBaseFunction = entireDataBaseFunction.slice(entireDataBaseFunction.indexOf("{") + 1, entireDataBaseFunction.lastIndexOf("}"));
console.log(entireDataBaseFunction)
console.log(paramsOfDataBaseFunction)
console.log(bodyOfDataBaseFunction)


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

