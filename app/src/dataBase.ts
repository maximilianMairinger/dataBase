import { Data, DataSubscription, DataCollection, DataSet } from "./data"
import { nthIndex } from "./helper"

const entireDataBaseFunction = DataBaseFunction.toString(); 
const paramsOfDataBaseFunction = entireDataBaseFunction.slice(entireDataBaseFunction.indexOf("(") + 1, nthIndex(entireDataBaseFunction, ")", 1));
const bodyOfDataBaseFunction = entireDataBaseFunction.slice(entireDataBaseFunction.indexOf("{") + 1, entireDataBaseFunction.lastIndexOf("}"));



class InternalDataBase<Store extends object> extends Function {
  private t: any

  private rawStore: Store

  constructor(store: Store) {
    super(paramsOfDataBaseFunction, bodyOfDataBaseFunction)
    this.t = this.bind(this)

    
    this.attatchDataToFunction()
    this.buildExtenedStore()

    
    return this.t
  }

  private buildExtenedStore() {
    
  }

  private buildExtentionRec() {

  }

  public change() {
    const t = this.t
    for (let key in t) {
      t[key]
    }
  }

  private attatchDataToFunction() {
    const t = this.t
    const data = this.rawStore
    for (const key in data) {
      const val = data[key]
      if (typeof val === objectString) t[key] = new InternalDataBase(val as any)
      else t[key] = new Data(val)
    }
  }
}


const objectString: "object" = "object"


type PrimitivePathSegment = string | number
type PathSegment = PrimitivePathSegment | Data<[PrimitivePathSegment]>
type ComplexData = {[key: string]: any} | any[]

function DataBaseFunction(...paths: PathSegment[])
function DataBaseFunction(data: ComplexData)
function DataBaseFunction(path_data?: PathSegment | ComplexData, ...paths: PathSegment[]) {


  console.log(this.t.data)
}



type FunctionProperties = "apply" | "call" | "caller" | "bind" | "arguments" | "length" | "prototype" | "name" | "toString"
type OmitFunctionProperties<Func extends Function> = Func & Record<FunctionProperties, never>
type DataBaseify<Type extends object> = { 
  [Key in keyof Type]: Type[Key] extends object ? DataBase<Type[Key]> : Data<Type[Key]>
}

type DataBase<Type extends object> = OmitFunctionProperties<Function> & DataBaseify<Type>

//@ts-ignore
export const DataBase = InternalDataBase as ({ new<Store extends object>(store: Store): DataBase<Store> } )

