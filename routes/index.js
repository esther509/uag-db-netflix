var express = require('express');
var http = require('http');
var helper = require("../modules/pageshelper");
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    
    res.render('pages/index', helper.createRenderParams(req.session));
});

module.exports = router;