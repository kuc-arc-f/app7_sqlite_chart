var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3')
var dbfileName = "./app1.sqlite"

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource-1234');
});
/******************************** 
* 
*********************************/
router.get('/index', function(req, res) {
    var db = new sqlite3.Database( dbfileName )
    var items = []
    var sql = "SELECT id,hnum, lnum ,date(mdate, '+9 hours') as mdate"
        sql +=" FROM mdats order by mdate;"
console.log(sql);
    db.serialize(function() {
        db.all(sql , function(err, rows) {
            rows.forEach( function (item) {
                items.push(item  );
//                console.log(item );
            });
            var param = {"docs": items };
            res.json(param);
        });
    });
    db.close();

});
/******************************** 
* 
*********************************/
router.post('/new', (req, res) => {
    data = req.body
//    res.json(data);
    var db = new sqlite3.Database( dbfileName )
    var sql = "INSERT INTO mdats (mdate, hnum, lnum, up_date) VALUES "
    sql += " (CURRENT_TIMESTAMP, ?, ? , CURRENT_TIMESTAMP)"
    db.serialize(function() {
        var stmt = db.prepare(sql)
        stmt.run(
            data.hnum,
            data.lnum,
        )
        stmt.finalize()
        res.json(data);
    });
    db.close();
}); 
/******************************** 
* 
*********************************/
router.get('/show/:id', function(req, res) {
    var db = new sqlite3.Database( dbfileName )
    var sql = "SELECT id,hnum, lnum ,date(mdate, '+9 hours') as mdate"
    sql +=" FROM mdats where id="+req.params.id
//console.log(sql);
    db.serialize(function() {
        db.all(sql, function(err, rows) {
           var param = {"docs": rows };
            res.json(param);
        });
    });
    db.close();
});
/******************************** 
* 
*********************************/
router.post('/update', (req, res) => {
    data = req.body
    var db = new sqlite3.Database( dbfileName )
    var sql = "update mdats set hnum= ?, lnum =? where id= ?"
    db.serialize(function() {
        var stmt = db.prepare( sql )
        stmt.run(
            data.hnum,
            data.lnum,
            data.id
        )
        stmt.finalize()
        res.json(data);
    });
    db.close();
//    res.json(data);
});
/******************************** 
*  delete
*********************************/
router.get('/delete/:id', function(req, res) {
    var db = req.db;
    var db = new sqlite3.Database( dbfileName )
    db.serialize(function() {
        var stmt = db.prepare('delete from mdats where id= ?')
        stmt.run(req.params.id )
        stmt.finalize()   
        res.json({id : req.params.id})
    });
    db.close();
});

module.exports = router;
