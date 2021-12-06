
var express = require('express');
var router = express.Router();
const cityModel = require("../models/city.js");

//route /v1/city
router.get('/', (req, res) => cityModel.getAllCities(res, req));

//route /v1/city/:id
router.get('/:id', (req, res) => cityModel.getCityById(res, req));

//route /v1/city/:id/station
router.get('/:id/station', (req, res) => cityModel.getStations(res, req));

//route /v1/city/:id/bike
router.get('/:id/bike', (req, res) => cityModel.getBikes(res, req));

module.exports = router;
