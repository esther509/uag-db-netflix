var express = require('express');
var http = require('http');
var router = express.Router();



/* GET home page. */
router.get('/', function (req, res) {
    req.session.destroy();
    console.log(req.session);
    res.render('pages/logout', { title: 'UAG Netflix', userhint: "", username: "" });
});

module.exports = router;