var express = require('express');
var router = express.Router();
const bikeModel = require("../models/bike.js");

let config;

try {
    config = require('../config/config.json');
} catch (error) {
    console.error(error);
}

router.get('/', function(res) {
    const data = {
        data: {
            msg: "Show all bikes?"
        }
    };

    res.json(data);
});

router.get('/:id', async function(req, res) {
    const data = {
        data: {
            bike: await bikeModel.getSpecificBike(res, req),
        }
    };

    res.json(data);
});


module.exports = router;
