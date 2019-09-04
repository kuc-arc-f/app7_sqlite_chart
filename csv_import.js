//
//
// import csv, to mongo
//
var fs = require('fs');
var logger = require('morgan');
var mdl_util = require('./include/mdl_util');
var sqlite3 = require('sqlite3').verbose()
var dbfileName = "./app1.sqlite"

/******************************** 
*
*********************************/
function insert_db(db ,item ){
    var sql = "INSERT INTO mdats (mdate, hnum, lnum, up_date) VALUES "
    sql += " (date('"+ item.date +"'), ?, ?, CURRENT_TIMESTAMP)"
//console.log( sql );
    var stmt = db.prepare(sql )
    stmt.run(
        item.hnum,
        item.lnum
    )
    stmt.finalize()
    db.close()
}
/******************************** 
*
*********************************/
function proc_arr_check(items){
    var utl = new mdl_util( )
    items.forEach(function (item) {
        var date = item[0]
//console.log( date.length );
        if(date.length > 0){
            date = utl.convert_str2date( date )
            date = utl.convert_date2yymmdd( date )
//console.log( date );
            var hnum = item[1]
            var lnum = item[2]
            var arr ={
                "date" : date,
                "hnum" : hnum,
                "lnum" : lnum,
            }
            var db = new sqlite3.Database( dbfileName )
            insert_db(db, arr)
        }
    });
}
/******************************** 
*
*********************************/
function read_csvFile(input_file ){
    var rs = fs.createReadStream( input_file );
    var readline = require('readline');   
    var rl = readline.createInterface(rs, {});
   
    var items = []
    var i = 0;
    rl.on('line', function(line) {
        if(i > 0){
            if(line.length > 0){
               col = line.split(",")
//console.log( col.length );
                if(col.length >= 3){
                    items.push( col )
                }
            }
        }
        i += 1;
    })    
    .on('close', function() {
//        console.log( items );
        proc_arr_check(items)
    });            
}
/******************************** 
* main
*********************************/
var items = read_csvFile("dat/import.csv");
//console.log( "#end" )
return;
