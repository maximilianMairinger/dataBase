import { Data, DataCollection } from "../../app/src/f-db"
import delay from "delay"


let e = new Data("hello")
let w = new Data(2)

let col = new DataCollection(e,w)

col.get((e, w) => {
  console.log(e, w)
})

let r = {
  a: 2
}

