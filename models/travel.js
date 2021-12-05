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
        let loggedInCustomerId = req.user.id;
        let cityId = req.user.cityid;
        let bikeId = req.params.bikeid;

        /* Check if bike is available!? */

        // let loggedInCustomerId = req.body.userid;
        // let cityId = req.body.cityid;

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
        let loggedInCustomerId = req.user.id;
        let bikeId = req.params.bikeid;

        //check if bike is in rentList
        let bikeIndex = rentList.findIndex(v => v.bikeid == bikeId);

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
        Update bike info
        If canceled = true then remove bike
        from rent-list
    */
    // updateBike: function (res, req) {
    //     let bikeId = req.body.bikeid;
    //     let canceled = req.body.canceled;
    //
    //     //check if bike is in rentList
    //     let bikeIndex = rentList.findIndex(v => v.bikeid == bikeId);
    //
    //     if (bikeIndex < 0) {
    //         return res.status(404).json({
    //             errors: {
    //                 status: 404,
    //                 path: `/v1/travel${req.path}`,
    //                 title: "Not found",
    //                 message: "Bike not found"
    //             }
    //         });
    //     }
    //
    //     console.log(bike info:);
    //     console.log(rentList[bikeIndex]);
    //
    //     //remove from rent-list
    //     rentList.splice(bikeIndex, 1);
    //
    //     return res.status(201).json({
    //         data: {
    //             type: "success",
    //             message: "Bike returned"
    //         }
    //     });
    // }
};

module.exports = travel;
