var express = require('express');
var http = require('http');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
	
	res.render('pages/login', { title: 'UAG Netflix', username: "" });
});

router.get('/:username', function (req, res) {
    var username = req.params.username;
    res.render('pages/login', { title: 'UAG Netflix', username: username });
});

module.exports = router;