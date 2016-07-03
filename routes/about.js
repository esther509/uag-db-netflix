var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('about', { title: 'About', year: new Date().getFullYear(), message: 'Your application description page' });
});

module.exports = router;