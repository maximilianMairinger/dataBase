import { Data, DataCollection, DataSubscription, DataBase } from "../../app/src/f-db"
import clone from "tiny-clone"


// class TestMatcher<Matcher extends 2> extends JSONMatcherClass<Matcher> {

//   ok() {
//     return this.data
//   }
// }

// let db = new DataBase({a: {b: 2}, c: "5"})



let db = new DataBase({a: "aa", b: "bb"})


let d = new Data<"a">("a")
console.log(db(d).get())
