import { Data, DataCollection, DataSubscription, DataBase } from "../../app/src/f-db"


let db = new DataBase({a: {b: 2}, c: "5"})

db.a.b.get()

console.log(db.a.b.get(), db instanceof DataBase)




