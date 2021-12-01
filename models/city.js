/**
 * planning on adding data to retrieve cities, stations, bikes etc
 *
*/
const database = require("../db/database.js");

const city = {
    /*
        get all bikes
    */
    getAllCities: function (res) {
        let db;

        db = database.getDb();

        let sql = `SELECT * FROM city;`;

        db.all(sql, [], (err, rows) => {
            if (err) {
                return res.status(400).json({
                    errors: {
                        status: 400,
                        path: "/city",
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

module.exports = city;
