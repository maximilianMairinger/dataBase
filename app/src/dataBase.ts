import { Data, DataSubscription, DataCollection, DataSet } from "./data"

function nthIndex(str, pat, n){
  var L= str.length, i= -1;
  while(n-- && i++<L){
      i= str.indexOf(pat, i);
      if (i < 0) break;
  }
  return i;
}

const entireDataBaseFunction = DataBaseFunction.toString(); 
const paramsOfDataBaseFunction = entireDataBaseFunction.slice(entireDataBaseFunction.indexOf("(") + 1, nthIndex(entireDataBaseFunction, ")", 1));
const bodyOfDataBaseFunction = entireDataBaseFunction.slice(entireDataBaseFunction.indexOf("{") + 1, entireDataBaseFunction.lastIndexOf("}"));

const dataSymbol = Symbol("data")


class InternalDataBaseSelector<Type extends object> extends Function {
  constructor(data: Type) {
    super(paramsOfDataBaseFunction, bodyOfDataBaseFunction)

    this[dataSymbol] = data

    return this.bind(this)
  }
}

function DataBaseFunction() {
  console.log(this[dataSymbol])
}

// "apply" | "call" | "caller" | "bind" | "arguments" | "length" | "prototype" | "name" | "toString"

type OmitFunctionProperties<f extends Function> = Same<f>

type DataBaseSelector<Type extends object> = OmitFunctionProperties<InternalDataBaseSelector<Type>> & DataBaseify<Type>
type DataBaseSelectorType = { new<Type extends object>(data: Type): DataBaseSelector<Type> }
//@ts-ignore
export const DataBaseSelector: DataBaseSelectorType = InternalDataBaseSelector

let mw = new DataBaseSelector({w: [2, "w"], e: {ee: "eee"}})
mw.e()



type Same<Ob extends Function> = { 
  [Key in keyof Ob]: Ob[Key]
}

type DataBaseify<Ob extends object> = { 
  [Key in keyof Ob]: Ob[Key] extends object ? DataBaseSelector<Ob[Key]> : Data<[Ob[Key]]>
}

