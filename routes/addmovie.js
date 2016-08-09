var express = require('express');
var http = require('http');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    var sesstype = "";
    if (sess.type) {
        sesstype = sess.type;
    }
	res.render('admin/addmovie', { title: 'UAG Netflix' });
});

module.exports = router;