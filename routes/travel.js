var express = require('express');
var router = express.Router();
const authModel = require("../models/auth.js");
const customerModel = require("../models/customer.js");
const travelModel = require("../models/travel.js");

//visa alla kunder - endast inloggad personal/staff
router.get('/customer/:id',
    (req, res, next) => authModel.checkToken(req, res, next),
    (req, res) => travelModel.getCustomerTravel(res, req)
);


module.exports = router;
