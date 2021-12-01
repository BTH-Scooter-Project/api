/**
 * planning on adding data concerning customers
 *
*/
const database = require("../db/database.js");

const customer = {
    /*
        get all bikes
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
    }
};

module.exports = customer;
