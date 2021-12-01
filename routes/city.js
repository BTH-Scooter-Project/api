
var express = require('express');
var router = express.Router();
const cityModel = require("../models/city.js");

//route /v1/city
router.get('/', (req, res) => cityModel.getAllCities(res, req));

module.exports = router;
