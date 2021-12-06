/**
 * planning on adding data concerning travel
 *
*/
const database = require("../db/database.js");

let rentQueue = [];
let cancelQueue = [];
let rentList = [];

const travel = {
    /*
        get all travels for a certain customer
    */
    getCustomerTravel: function (res, req) {
        let db;

        db = database.getDb();

        //check which customer is logged in
        let loggedInCustomerId = req.user.id;

        //if a request is sent to view any other customers data except the
        //customers own data, it will be denied.
        if (loggedInCustomerId != req.params.id) {
            return res.status(400).json({
                errors: {
                    status: 401,
                    path: `/v1/travel${req.path}`,
                    title: "Unauthorized",
                    message: "Current user is not authorized to view data from other users",
                }
            });
        }

        var sql ='SELECT * from travel_history WHERE userid = ?;';
        var params =[req.params.id];

        db.all(sql, params, function (err, rows) {
            if (err) {
                return res.status(400).json({
                    errors: {
                        status: 400,
                        path: `/v1/travel${req.path}`,
                        title: "Bad request",
                        message: err.message
                    }
                });
            }
            //check if row exists ie id exists, otherwise no travels has occurred
            if (rows) {
                //if a message should be sent when there are no travels:
                // if (rows.length == 0) {
                //     return res.status(200).json({
                //         "data": "No travels to show yet."
                //     });
                // }
                return res.status(200).json({
                    "data": rows
                });
            }
            return res.status(404).json({
                errors: {
                    status: 404,
                    path: `/v1/travel${req.path}`,
                    title: "Not found",
                    message: "Customer not found"
                }
            });
        });
    },
    /*
        rent a bike, add customer id + bike id to queue
    */
    rentBike: function (res, req) {
        //check which customer is logged in
        //TEST req.body in loggedInCustomerId and cityId
        console.log(req.body);
        // let loggedInCustomerId = req.user.id;
        // let cityId = req.user.cityid;
        let loggedInCustomerId = req.body.userid;
        let cityId =  req.body.cityid;
        let bikeId = req.params.bikeid;

        console.log("customer: " + loggedInCustomerId);

        /* Check if bike is available!? */

        let newEvent = {
            customerid: loggedInCustomerId,
            bikeid: bikeId,
            cityid: cityId,
            timestamp: Date.now()
        };

        rentQueue.unshift(newEvent);
        // console.log("added travel:");
        // console.log(rentQueue);

        console.log(rentQueue);

        return res.status(201).json({
            data: {
                type: "success",
                message: "Bike rented"
            }
        });
    },

    /*
        route returns all newly rented bikes,
        empties that queue and add those bikes to
        the rent-list. Ie:
        - store all bikeids in a temporary array
        - copy data from rentQueue to rentList
        - empty rentQueue
        - return all bikeid's from rentQueue
    */
    getRentQueue: function(res) {
        //temporary array for bikeids
        let bikeids = [];

        //add bikeids to temporary array,
        //add rentQueue objects to rentList
        rentQueue.map(element => {
            bikeids.push(element.bikeid);
            rentList.push(element);
        });

        //empty rentQueue
        rentQueue = [];

        console.log(rentList);

        //return list of bikeids
        return res.status(200).json(bikeids);
    },
    /*
        customer ends bike rental
    */
    returnBike: function (res, req) {
        //TEST loggedInCustomerId
        // let loggedInCustomerId = req.user.id;
        let loggedInCustomerId = req.body.userid;
        let bikeId = req.params.bikeid;

        //check if bike is in rentList
        let bikeIndex = rentList.findIndex(v => v.bikeid == bikeId);

        console.log("rentList: ");
        console.log(rentList);

        if (bikeIndex < 0) {
            return res.status(404).json({
                errors: {
                    status: 404,
                    path: `/v1/travel${req.path}`,
                    title: "Not found",
                    message: "Bike not found"
                }
            });
        }

        //check that logged in customer is the same as the one
        //who had rented the bike in question
        if (rentList[bikeIndex].customerid == loggedInCustomerId) {
            let newEvent = {
                bikeId
            };

            //add bike to queue of canceled bikes
            cancelQueue.unshift(newEvent);

            console.log("cancelQueue");
            console.log(cancelQueue);

            return res.status(201).json({
                data: {
                    type: "success",
                    message: "Bike returned"
                }
            });
        }

        console.log(cancelQueue);

        return res.status(404).json({
            errors: {
                status: 404,
                path: `/v1/travel${req.path}`,
                title: "Not found",
                message: `This customer has not rented bike with id ${bikeId}`
            }
        });
    },

    /*
        route returns all newly returned/canceled bikes
        and empties that queue.
    */
    getCancelQueue: function(res) {
        //temprary queue
        let returnQueue = cancelQueue;

        console.log("cancelQueue before empty:");
        console.log(cancelQueue);

        //empty cancelQueue
        cancelQueue = [];

        console.log("cancelQueue after empty:");
        console.log(cancelQueue);

        //return list of bikeids
        return res.status(200).json(returnQueue);
    },

    /*
        Update bike info
        If canceled = true then remove bike
        from rent-list
    */
    updateBike: function (res, req) {
        //check input
        var errors=[]
        if (!req.body.battery_level){
            errors.push("No batter_level specified");
        }
        if (!req.body.gps_lat || ! req.body.gps_lon){
            errors.push("No gps coordinates specified");
        }
        if (!req.body.rent_time){
            errors.push("No rent_time specified");
        }
        if (!req.body.canceled){
            errors.push("Not specified if ride is canceled or not");
        }
        //if any of the above information is missing,
        //return error message
        if (errors.length){
            return res.status(400).json({
                status: 400,
                path: `/v1/travel${req.path}`,
                title: "Missing input information",
                message: errors.join(",")
            });
        }

        let bikeId = req.params.bikeid;

        //TEST
        rentList = [
            {
                customerid: '2',
                bikeid: '2',
                cityid: '2',
                timestamp: 1638784510147
            },
            {
                customerid: '1',
                bikeid: '1',
                cityid: '1',
                timestamp: 1638784499765
            }
        ];

        //check if bike is in rentList
        let bikeIndex = rentList.findIndex(v => v.bikeid == bikeId);

        if (bikeIndex < 0) {
            return res.status(404).json({
                errors: {
                    status: 404,
                    path: `/v1/travel${req.path}`,
                    title: "Not found",
                    message: "Bike not found"
                }
            });
        }

        let canceled = req.body.canceled;

        let updatedBike = {
            battery_level: req.body.battery_level,
            gps_lat: req.body.gps_lat,
            gps_lon: req.body.gps_lon,
            rent_time: req.body.rent_time,
            canceled: canceled
        };

        //update bike
        let bike = rentList[bikeIndex];
        console.log("bike info before update:");
        console.log(bike);

        bike.battery_level = req.body.battery_level;
        bike.gps_lat = req.body.gps_lat;
        bike.gps_lon = req.body.gps_lon;
        bike.rent_time = req.body.rent_time;
        bike.canceled = canceled;

        console.log("after update:");
        console.log(bike);

        if (canceled == 'true') {
            console.log("update db");
            return res.status(200).json({
                data: {
                    type: "success",
                    message: "Bike ride canceled"
                }
            });
        }

        return res.status(200).json({
            data: {
                type: "success",
                message: "Bike updated"
            }
        });
    }
};

module.exports = travel;
