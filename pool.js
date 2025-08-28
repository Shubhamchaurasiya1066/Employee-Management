var mysql=require('mysql')
var pool=mysql.createPool({
host:'localhost',
user:'root',
password:'1234',
database:'projectemployee',
multipleStatements:'true',
connectionLimit:100,
})
module.exports=pool