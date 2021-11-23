var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const database = require("../db/database.js");


router.get('/', function(req, res, next) {
    const data = {
        data: {
            msg: "Hello World"
        }
    };

    res.json(data);
});

router.get('/dbconnect', function(req, res, next) {
    // let db;
    //
    // db = database.getDb();
    //
    // console.log(db);
    // let sql = `SELECT * FROM tbl1;`;
    //
    // db.all(sql, [], (err, rows) => {
    //   if (err) {
    //     throw err;
    //   }
    //   rows.forEach((row) => {
    //     console.log(row.one);
    //   });
    // });
    //
    // db.close();

    const data = {
        data: {
            msg: "Hello World"
        }
    };

    res.json(data);
});



router.get('/db', function(req, res, next) {
    // open the database
    let db = new sqlite3.Database("db/test2.db");

    let sql = `SELECT * FROM tbl1;`;


    db.all(sql, [], (err, rows) => {
      if (err) {
        throw err;
      }
      rows.forEach((row) => {
        console.log(row.one);
      });
    });

    // close the database connection
    db.close();


    const data = {
        data: {
            msg: "Hello World"
        }
    };

    res.json(data);
});


router.get("/hello/:msg", (req, res) => {
    const data = {
        data: {
            msg: req.params.msg
        }
    };

    res.json(data);
});

router.get("/hello/:msg/test", (req, res) => {
    const data = {
        data: {
            msg: req.params.msg
        }
    };

    res.json("testing " + data.data.msg);
});

module.exports = router;
