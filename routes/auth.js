var express = require('express');
var router = express.Router();
const authModel = require("../models/auth.js");
const customerModel = require("../models/customer.js");
const staffModel = require("../models/staff.js");

//lägg till ny kund/användare
router.post('/customer', (req, res) => authModel.register(res, req));

//logga in användare/kund
router.post('/customer/login', (req, res) => authModel.login(res, req));

//lägg till ny admin/staff
router.post('/staff', (req, res) => authModel.registerStaff(res, req));

//logga in admin/staff
router.post('/staff/login', (req, res) => authModel.loginStaff(res, req));

//visa alla kunder - endast inloggad personal/staff
router.get('/customer',
    (req, res, next) => authModel.checkStaffToken(req, res, next),
    (req, res) => customerModel.getAllCustomers(res, req)
);

//visa alla kunder - endast inloggad personal/staff
router.get('/customer/:id',
    (req, res, next) => authModel.checkToken(req, res, next),
    (req, res) => customerModel.getSpecificCustomer(res, req)
);

//visa alla admin/staff - endast inloggad personal/staff
router.get('/staff',
    (req, res, next) => authModel.checkStaffToken(req, res, next),
    (req, res) => staffModel.getAllStaff(res, req)
);

module.exports = router;
