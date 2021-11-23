var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    const data = {
        data: {
            msg: "Hello World"
        }
    };

    res.json(data);
});


router.get("/hello/:msg", (req, res) => {
    const data = {
        data: {
            msg: req.params.msg
        }
    };

    res.json(data);
});

router.get("/hello/:msg/test", (req, res) => {
    const data = {
        data: {
            msg: req.params.msg
        }
    };

    res.json("testing " + data.data.msg);
});

module.exports = router;
