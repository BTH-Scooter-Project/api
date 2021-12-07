/**
 * planning on adding data concerning customers
 *
*/
const database = require("../db/database.js");

const customer = {
    /*
        get all customers
    */
    getAllCustomers: function (res) {
        let db;

        db = database.getDb();

        let sql = `SELECT * FROM customer;`;

        db.all(sql, [], (err, rows) => {
            if (err) {
                return res.status(400).json({
                    errors: {
                        status: 400,
                        path: "/customer",
                        title: "Bad request",
                        message: err.message
                    }
                });
            }
            return res.status(200).json({
                "data": rows
            });
        });
    },
    /*
        get specific customer
    */
    getSpecificCustomer: function (res, req) {
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
                    path: `/v1/auth${req.path}`,
                    title: "Unauthorized",
                    message: "Current user is not authorized to view data from other users",
                }
            });
        }

        var sql =`SELECT
                    userid, firstname, lastname, email,
                    cityid, payment, balance
                    FROM customer WHERE userid = ?;`;
        var params =[req.params.id];

        db.get(sql, params, function (err, row) {
            if (err) {
                return res.status(400).json({
                    errors: {
                        status: 400,
                        path: `/v1/auth${req.path}`,
                        title: "Bad request",
                        message: err.message
                    }
                });
            }
            //check if row exists ie id exists
            return row
                ? res.status(200).json({
                    "data": row
                })
                : res.status(404).json({
                    errors: {
                        status: 404,
                        path: `/v1/auth${req.path}`,
                        title: "Not found",
                        message: "The customer is not found"
                    }
                });
        });
    }
};

module.exports = customer;
