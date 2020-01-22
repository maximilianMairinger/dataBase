import { Data } from "./../../app/src/f-db"
import delay from "delay"


let me = new Data("hello")

console.log(me)

let s = (e) => {
  console.log(e)
}

let e = me.get(s)

me.set("4")
me.set("4")

me.got(s)


me.set("4")



