import { Data, DataCollection, DataSubscription, DataBase } from "../../app/src/f-db"


let data1 = new Data(4)
let subscription1 = (e) => {
  fail()
  
} 
let d = new DataSubscription(data1, subscription1, true, false)

data1.set(3)