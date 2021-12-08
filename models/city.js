/**
 * planning on adding data to retrieve cities, stations, bikes etc
 *
*/
const database = require("../db/database.js");

const city = {
    /*
        get all cities
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
    },
    /*
        get all stations in city with id cityId
    */
    getStations: function (res, req) {
        let db;
        let cityId = req.params.id;

        db = database.getDb();

        var sql ='SELECT * from STATION WHERE cityid=?;';
        var params =[cityId];

        db.all(sql, [params], (err, rows) => {
            if (err) {
                return res.status(400).json({
                    errors: {
                        status: 400,
                        path: `/city${req.path}`,
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
        get all bikes in city with id cityId
    */
    getBikes: function (res, req) {
        let db;
        let cityId = req.params.id;

        db = database.getDb();
        var sql = `select name, image, description, status,
        battery_level, gps_lat, gps_lon from bike
        where cityid = ?;`;

        var params =[cityId];

        db.all(sql, [params], (err, rows) => {
            if (err) {
                return res.status(400).json({
                    errors: {
                        status: 400,
                        path: `/city${req.path}`,
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
