var express = require('express');
var http = require('http');
var helper = require("../modules/pageshelper");
var router = express.Router();
var pg = require('pg');

if (process.env.DATABASE_URL) {
    pg.defaults.ssl = true;
}
var connectionString = process.env.DATABASE_URL || "postgres://Sergio:admin@localhost:5432/uag-db-netflix";

/* GET home page. */
router.get('/', function (req, res) {
    res.render('pages/search', helper.createRenderParams(req.session));
});

module.exports = router;