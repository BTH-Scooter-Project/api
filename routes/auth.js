var express = require('express');
var router = express.Router();
const authModel = require("../models/auth.js");
const customerModel = require("../models/customer.js");

router.post('/login', (req, res) => authModel.login(res, req.body));

router.post('/register', (req, res) => authModel.register(res, req.body));

router.get('/customer',
    (req, res, next) => authModel.checkToken(req, res, next),
    (req, res) => customerModel.getAllCustomers(res, req)
);

router.get('/staff',
    (req, res, next) => authModel.checkToken(req, res, next),
    (req, res) => customerModel.getAllCustomers(res, req)
);

module.exports = router;
