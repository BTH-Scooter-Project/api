var express = require('express');
var router = express.Router();
const bikeModel = require("../models/bike.js");

router.get('/', function(res) {
    const data = {
        data: {
            msg: "Show all bikes?"
        }
    };

    res.json(data);
});

router.get('/:id', (req, res) => bikeModel.getSpecificBike(res, req));


module.exports = router;
