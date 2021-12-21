var express = require('express');
var router = express.Router();
const bikeModel = require("../models/bike.js");

router.get('/', function(req, res) {
    const data = {
        data: {
            msg: "Show all bikes?"
        }
    };

    res.json(data);
});

router.get('/mode', (req, res) => bikeModel.getSystemMode(res));

router.get('/:id', (req, res) => bikeModel.getSpecificBike(res, req));

router.put('/:id', (req, res) => bikeModel.updateSpecificBike(res, req));

module.exports = router;
