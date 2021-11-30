/**
 * DB-queries concerning login, token, api-key
 *
*/

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const database = require("../db/database.js");

let config;

try {
    config = require('../config/config.json');
} catch (error) {
    console.error(error);
}

const secret = process.env.JWT_SECRET || config.secret;
const apikey = process.env.API_KEY || config.apikey;

const auth = {
    /**
     * login user if email + password
     * exists in the db
    */
    login: async function (res, body) {
        let db;

        db = database.getDb();

        const email = body.email;
        const password = body.password;

        if (!email || !password) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/auth/login",
                    title: "Email or password missing",
                    detail: "Email or password missing in request"
                }
            });
        }

        var sql ='SELECT * from customer WHERE email = ?;';
        var params =[email];

        //check if user exists in customer table
        db.get(sql, params, function (err, row) {
            if (err) {
                return res.status(400).json({
                    errors: {
                        status: 400,
                        path: `/auth/login`,
                        title: "Bad request",
                        message: err.message
                    }
                });
            }

            //check if row exists ie email exists
            //if email exists, continue to check if password is valid
            if (row) {
                return auth.comparePasswords(
                    res,
                    password,
                    row,
                );
            }

            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/auth/login",
                    title: "User not found",
                    detail: "User with provided email not found."
                }
            });
        });
    },

    /**
     * check if user input password matches the password in the DB
     *
    */
    comparePasswords: function(res, password, user) {
        // console.log("inside comparePasswords");
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/auth/login",
                        title: "bcrypt error",
                        detail: "bcrypt error"
                    }
                });
            }

            if (result) {
                let payload = { email: user.email };
                let jwtToken = jwt.sign(payload, secret, { expiresIn: '1h' });

                //if password is correct, return jwt token
                return res.json({
                    data: {
                        type: "success",
                        message: "User logged in",
                        user: user.email,
                        token: jwtToken
                    }
                });
            }

            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/auth/login",
                    title: "Wrong password",
                    detail: "Password is incorrect."
                }
            });
        });
    },
    /**
     * register new user with email + password
     * password is encrypted with bcrypt
    */
    register: async function (res, body) {
        let db;

        db = database.getDb();

        const password = body.password;

        const data = {
            email: body.email,
            firstName: "Test",
            lastName: "Testsson",
            city: "Stockholm"
        };

        var errors=[];

        if (!data.email) {
            errors.push("Email not specified");
        }
        if (!password) {
            errors.push("Password not specified");
        }
        if (errors.length) {
            return res.status(400).json({
                errors: {
                    status: 400,
                    source: "/auth/register",
                    message: "Missing input",
                    detail: errors.join(",")
                }
            });
        }

        //encrypt incoming password
        bcrypt.hash(password, 10, async function(err, hash) {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/register",
                        title: "bcrypt error",
                        detail: "bcrypt error"
                    }
                });
            }

            var sql = `INSERT into CUSTOMER
                        (firstname, lastname, password, email, city)
                        values (?, ?, ?, ?, ?);`;
            var params =[data.firstName, data.lastName, hash, data.email, data.city];

            db.run(sql, params, function (err) {
                if (err) {
                    return res.status(400).json({
                        errors: {
                            status: 400,
                            message: "Error creating user",
                            detail: err.message
                        }
                    });
                }
                return res.status(201).json({
                    data: {
                        type: "success",
                        message: "User created",
                        user: data.email,
                        id: this.lastID
                    }
                });
            });
        });
    },

    /**
     * function to check if API-key is valid
     * used on all routes (in app.js-file)
     * except for any routes specified first
     * in function below
    */
    checkAPIKey: function (req, res, next) {
        //exclude all routes starting with /test/ - will not require api key
        if (req.path.startsWith('/test/')) {
            console.log("test routes");
            return next();
        }

        //all routes starting with /user/ will not require api key
        if (req.path.startsWith('/user/')) {
            console.log("test user route");
            return next();
        }

        //depending on route the api_key will be found in query or in body parameter
        let clientApiKey = req.query.apiKey || req.body.apiKey;

        //compare with api-key from config-file or env-variable
        //if valid api-key, send to actual route
        if (clientApiKey == apikey) {
            return next();
        }

        return res.status(401).json({
            errors: {
                status: 401,
                source: `${req.path}`,
                title: "Valid API key",
                detail: "No valid API key provided."
            }
        });
    }
};

module.exports = auth;
