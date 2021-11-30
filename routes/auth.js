var express = require('express');
var router = express.Router();
const authModel = require("../models/auth.js");

router.post('/login', (req, res) => authModel.login(res, req.body));

router.post('/register', (req, res) => authModel.register(res, req.body));

module.exports = router;
