var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const database = require("../db/database.js");
const data = require("../models/data.js");


router.get('/', function(req, res, next) {
    const data = {
        data: {
            msg: "Hello World"
        }
    };

    res.json(data);
});

router.get('/data/:id', (req, res) => data.getSpecificRow(res, req));

router.get('/data', (req, res) => data.getAllData(res, req));

router.post('/data', (req, res) => data.addData(res, req));

router.get('/db', function(req, res, next) {
    //testing opening the test-db
    let db;

    db = database.getDb();

    let sql = `SELECT * FROM tbl1;`;

    db.all(sql, [], (err, rows) => {
      if (err) {
        throw err;
      }
      rows.forEach((row) => {
        console.log(row.one);
      });
    });

    db.close();

    const data = {
        data: {
            msg: "Hello World"
        }
    };

    res.json(data);
});


//example routes
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
