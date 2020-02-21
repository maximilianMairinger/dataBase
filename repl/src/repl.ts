import { Data, DataCollection, DataSubscription, DataBase } from "../../app/src/f-db"


// class TestMatcher<Matcher extends 2> extends JSONMatcherClass<Matcher> {

//   ok() {
//     return this.data
//   }
// }

// let db = new DataBase({a: {b: 2}, c: "5"})



let db = new DataBase({ok: 2})

db({ok: 33})

db.ok.get((k) => {
  console.log(k)
})


db({ok: 34})
let db2 = db({ok: 35, ww: 2})



console.log(db2.ww.get())
