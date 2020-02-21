import { Data, DataCollection, DataSubscription, DataBase } from "../../app/src/f-db"
import clone from "tiny-clone"


// class TestMatcher<Matcher extends 2> extends JSONMatcherClass<Matcher> {

//   ok() {
//     return this.data
//   }
// }

// let db = new DataBase({a: {b: 2}, c: "5"})



let db = new DataBase({nested: {inner: "www"}})


db((e) => {
  console.log(clone(e))
})


db.nested.inner.set("eee")