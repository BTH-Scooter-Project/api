/**
 * planning on adding db queries concerning login, token, api-key
 *
*/

let config;

try {
    config = require('../config/config.json');
} catch (error) {
    console.error(error);
}

const auth = {
    /*
    function to check if API-key is valid
    used on all routes (in app.js-file)
    except for any routes specified first
    in function below
    */
    checkAPIKey: function (req, res, next) {
        // //exclude bike-path from api-check
        // if (req.path == '/bike') {
        //     console.log("testing bike route");
        //     return next();
        // }

        //all routes starting with /test/ will not require api key
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
        let clientApiKey = req.query.api_key || req.body.api_key;

        //compare with api-key from config-file
        //if valid api-key, send to actual route
        if (clientApiKey == config.apikey) {
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
