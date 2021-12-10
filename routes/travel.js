var express = require('express');
var router = express.Router();
const authModel = require("../models/auth.js");
const travelModel = require("../models/travel.js");

//show logged in customer's travels
router.get('/customer/:id',
    (req, res, next) => authModel.checkToken(req, res, next),
    (req, res) => travelModel.getCustomerTravel(res, req)
);


//logged in customer can rent a bike
router.post('/bike/:bikeid',
    (req, res, next) => authModel.checkToken(req, res, next),
    (req, res) => travelModel.rentBike(res, req)
);

//logged in customer can return bike / end renting period of bike
router.delete('/bike/:bikeid',
    (req, res, next) => authModel.checkToken(req, res, next),
    (req, res) => travelModel.returnBike(res, req)
);

//esc can update a rented bike
router.put('/bike/:bikeid',
    (req, res) => travelModel.updateBike(res, req)
);

//esc can get all bikeids from rentQueue, empty queue
router.get('/rented',
    (req, res) => travelModel.getRentQueue(res)
);

//esc can get all bikeids from cancelQueue, empty queue
router.get('/canceled',
    (req, res) => travelModel.getCancelQueue(res)
);

module.exports = router;
