import setData, { Data } from "./../../app/src/f-db"
import delay from "delay"

let data = {
  nested: {
    prop: "val"
  },
  num: 123
}


let db = setData(data)

db.get("num", (num: number) => {
  console.log("num: " + num)
})



delay(1000).then(() => {
  db.set("num", 1)
})
