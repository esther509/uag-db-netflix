var express = require('express');
var http = require('http');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    var sess = req.session;
    var sessname = "";
    if (sess.username) {
        sessname = sess.username;
    }
    res.render('pages/single', { title: 'UAG Netflix', username: sessname });
});

module.exports = router;