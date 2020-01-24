import { Data, DataCollection, DataSubscription } from "../../app/src/f-db"
import delay from "delay"


let e = new Data("hello")
let w = new Data(2)

let col = new DataCollection(e,w)

col.get((e, w) => {
  console.log(e, w)
})

e.set("world")
w.set(3)

let subs = (e: number) => {

}

let s = new DataSubscription(w, subs)

