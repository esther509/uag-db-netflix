var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('contact', { title: 'Contact', year: new Date().getFullYear(), message: 'Your contact page' });
});

module.exports = router;