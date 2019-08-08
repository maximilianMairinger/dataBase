const {Data} = require('./dist/dataBase.js');

let d = new Data({ok: new Data([new Data("a"), new Data("b")]),ok2: new Data(2), ok3: new Data(false), ok4: new Data({})})

console.log(d.toString());
