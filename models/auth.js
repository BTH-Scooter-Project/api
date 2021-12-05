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

const jwtSecret = process.env.JWT_SECRET || config.jwt_secret;
const jwtSecretStaff = process.env.STAFF_JWT_SECRET || config.staff_jwt_secret;
const apikey = process.env.API_KEY || config.apikey;

const auth = {
    /**
     * login staff if email + password
     * exists in the db
    */
    loginStaff: async function (res, req) {
        req.staff = true;
        return auth.login(res, req);
    },

    /**
     * login user or staff if email + password
     * exists in the db
    */
    login: async function (res, req) {
        let db;

        db = database.getDb();

        const email = req.body.email;
        const password = req.body.password;

        if (!email || !password) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: `/v1/auth${req.path}`,
                    title: "Email or password missing",
                    detail: "Email or password missing in request"
                }
            });
        }

        var sql ='SELECT * from customer WHERE email = ?;';

        //if staff, check in other table in DB
        if (req.staff) {
            sql = 'SELECT * from staff WHERE email = ?;';
        }

        var params =[email];

        //check if user exists in customer table
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

            //check if row exists ie email exists
            //if email exists, continue to check if password is valid
            if (row) {
                return auth.comparePasswords(
                    res,
                    password,
                    row,
                    req.staff,
                    req.path
                );
            }

            return res.status(401).json({
                errors: {
                    status: 401,
                    source: `/v1/auth${req.path}`,
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
    comparePasswords: function(res, password, user, staff, path) {
        // console.log("inside comparePasswords");
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: `/v1/auth${path}`,
                        title: "bcrypt error",
                        detail: "bcrypt error"
                    }
                });
            }

            if (result) {
                //if staff, compare with other jwtToken.
                if (staff) {
                    let payload = { email: user.email, id: user.staffid, cityid: null };
                    let jwtToken = jwt.sign(payload, jwtSecretStaff, { expiresIn: '1h' });

                    //if password is correct, return jwt token
                    return res.json({
                        data: {
                            type: "success",
                            message: "Admin logged in",
                            user: user.email,
                            token: jwtToken
                        }
                    });
                }
                //else try login customer
                let payload = { email: user.email, id: user.userid, cityid: user.cityid };
                let jwtToken = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });

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
                    source: `/v1/auth${path}`,
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
    register: async function (res, req) {
        let db;

        db = database.getDb();

        const password = req.body.password;

        const data = {
            email: req.body.email,
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
                    source: `/v1/auth${req.path}`,
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
                        source: `/v1/auth${req.path}`,
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
                            source: `/v1/auth${req.path}`,
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
     * register new staff with email + password
     * password is encrypted with bcrypt
    */
    registerStaff: async function (res, req) {
        let db;

        db = database.getDb();

        const password = req.body.password;

        const data = {
            email: req.body.email
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
                    source: `/v1/auth${req.path}`,
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
                        source: `/v1/auth${req.path}`,
                        title: "bcrypt error",
                        detail: "bcrypt error"
                    }
                });
            }

            var sql = `INSERT into staff
                        (password, email)
                        values (?, ?);`;
            var params =[hash, data.email];

            db.run(sql, params, function (err) {
                if (err) {
                    return res.status(400).json({
                        errors: {
                            status: 400,
                            path: `/v1/auth${req.path}`,
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
     * check if token is correct and valid
     *
    */
    checkStaffToken: function(req, res, next) {
        req.staff = true;
        return auth.checkToken(req, res, next);
    },

    /**
     * check if token is correct and valid
     *
    */
    checkToken: function(req, res, next) {
        let token = req.headers['x-access-token'];
        // let apiKey = req.query.api_key || req.body.api_key;

        let currentSecret;

        //if staff, check against staff-jwt-secret, else against the customer secret
        req.staff ? currentSecret = jwtSecretStaff : currentSecret = jwtSecret;

        if (token) {
            jwt.verify(token, currentSecret, function(err, decoded) {
                if (err) {
                    return res.status(500).json({
                        errors: {
                            status: 500,
                            source: `/v1/auth${req.path}`,
                            title: "Failed authentication",
                            detail: err.message
                        }
                    });
                }

                req.user = {};
                // req.user.api_key = apiKey;
                req.user.email = decoded.email;
                req.user.id = decoded.id;
                req.user.cityid = decoded.cityid;

                return next();
            });
        } else {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: `/v1/auth${req.path}`,
                    title: "No token",
                    detail: "No token provided in request headers"
                }
            });
        }
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
