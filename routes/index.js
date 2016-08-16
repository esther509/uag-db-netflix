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

    pg.connect(connectionString, function (err, client, done) {
        // Three random movies with banner
        var query = client.query("SELECT bannerurl, id, releasedate, name FROM movie WHERE NOT bannerurl='' AND NOT bannerurl='N/A' ORDER by random() LIMIT 3");

        query.on("error", function (error) {
            done();
            res.json({ error: "SQL ERROR : " + error });
        });

        query.on("row", function (row, result) {
            result.addRow(row);
        });

        query.on("end", function (result) {
            var banners = result.rows;

            var queryFeatured = client.query("SELECT name, posterurl, id, videourl, releasedate FROM movie WHERE NOT videourl='' AND NOT posterurl='' ORDER by random() LIMIT 10");

            queryFeatured.on("error", function (error) {
                done();
                res.json({ error: "SQL ERROR : " + error });
            });

            queryFeatured.on("row", function (row, result) {
                result.addRow(row);
            });

            queryFeatured.on("end", function (result) {
                done();
                console.log(result.rows);
                res.render('pages/index', helper.createRenderParams(req.session, { banners: banners, movies: result.rows }));
            });
        });
    });

    
});

module.exports = router;