//
// test, file-write
//
var fs = require('fs');
var monk = require('monk');
var db_setting = '192.168.10.104:27017/app1db'
var mdl_util = require('./include/mdl_util');

/******************************** 
*
*********************************/
function write_csvFile(){
    var utl = new mdl_util( )
    var db = monk(db_setting);
    var collection = db.get('mdats');
    var fnm = "dat/outout.csv";
    //
    var text = "date,H,L,\n";
    collection.find({}, {sort: { mdate: 1}} ,function(e,docs){
        docs.forEach( function (item) {
//console.log( item );
            var date = utl.convert_date2str(item.mdate)
            var hnum = item.hnum
            var lnum = item.lnum
            text += date +"," + hnum +"," + lnum + "\n"
        });
        db.close()
        try {
            fs.writeFileSync(fnm , text);
            console.log('write end');
        }catch(e){
            console.log(e);
        }
    });
}
/******************************** 
* main
*********************************/
var items = write_csvFile();
//console.log( "#end" )
return;

