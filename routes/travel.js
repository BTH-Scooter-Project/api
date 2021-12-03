var express = require('express');
var router = express.Router();
const authModel = require("../models/auth.js");
const travelModel = require("../models/travel.js");

//visa alla kunder - endast inloggad personal/staff
router.get('/customer/:id',
    (req, res, next) => authModel.checkToken(req, res, next),
    (req, res) => travelModel.getCustomerTravel(res, req)
);

//visa alla kunder - endast inloggad personal/staff
router.post('/',
    // (req, res, next) => authModel.checkToken(req, res, next),
    (req, res) => travelModel.addCustomerTravel(res, req)
);

//visa alla kunder - endast inloggad personal/staff
router.delete('/',
    // (req, res, next) => authModel.checkToken(req, res, next),
    (req, res) => travelModel.removeCustomerTravel(res, req)
);

module.exports = router;
