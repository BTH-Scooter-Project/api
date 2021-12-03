/**
 * planning on adding data concerning travel
 *
*/
const database = require("../db/database.js");

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
    }
};

module.exports = travel;
