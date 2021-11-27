/**
 * planning on adding data to retrieve cities, stations, bikes etc
 *
*/
const database = require("../db/database.js");

const bike = {
    /*
        get all bikes
    */
    getAllBikes: function (res) {
        let db;

        db = database.getDb();

        let sql = `SELECT * FROM bike;`;

        db.all(sql, [], (err, rows) => {
            if (err) {
                return res.status(400).json({
                    errors: {
                        status: 400,
                        path: "/bike",
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
    //get Bike with specific id
    getSpecificBike: function (res, req) {
        let db;

        db = database.getDb();

        var sql ='SELECT * from bike WHERE bikeid = ?;';
        var params =[req.params.id];

        db.get(sql, params, function (err, row) {
            if (err) {
                return res.status(400).json({
                    errors: {
                        status: 400,
                        path: `/bike/${req.params.id}`,
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
                        path: `/bike/${req.params.id}`,
                        title: "Not found",
                        message: "The bike is not found"
                    }
                });
        });
    }
};

module.exports = bike;
