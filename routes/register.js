var express = require('express');
var http = require('http');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
	
	res.render('pages/register', { title: 'UAG Netflix' });
});

module.exports = router;