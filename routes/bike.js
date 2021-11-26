var express = require('express');
var router = express.Router();
const bike = require("../models/bike.js");

router.get('/', function(req, res) {
    const data = {
        data: {
            msg: "Show all bikes?"
        }
    };

    res.json(data);
});

router.get('/:id', (req, res) => bike.getSpecificBike(res, req));


module.exports = router;
