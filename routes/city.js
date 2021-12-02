
var express = require('express');
var router = express.Router();
const cityModel = require("../models/city.js");

//route /v1/city
router.get('/', (req, res) => cityModel.getAllCities(res, req));

//route /v1/city/:id
router.get('/:id', (req, res) => cityModel.getCityById(res, req));

//route /v1/city/:id/station


module.exports = router;
