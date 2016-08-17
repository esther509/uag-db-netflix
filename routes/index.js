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

        var bannerString = `
            SELECT bannerurl, id, releasedate, name, coalesce(FLOOR(AVG(rate)), 0) as rate
            FROM movie FULL OUTER JOIN rated_by ON movie.id=rated_by.movie_id 
            WHERE NOT bannerurl='' AND NOT bannerurl='N/A' 
            GROUP BY movie.id 
            ORDER by random() 
            LIMIT 3
        `;

        // Three random movies with banner
        var query = client.query(bannerString);

        query.on("error", function (error) {
            done();
            res.json({ error: "SQL ERROR : " + error });
        });

        query.on("row", function (row, result) {
            result.addRow(row);
        });

        query.on("end", function (result) {
            var banners = result.rows;

            var featuredString = `
                SELECT name, posterurl, id, videourl, releasedate, ('/images/rating1_' || to_char(coalesce(FLOOR(AVG(rate)), 0), '9') || '.png') as rate 
                FROM movie FULL OUTER JOIN rated_by ON movie.id=rated_by.movie_id 
                WHERE NOT videourl='' AND NOT posterurl='' AND NOT posterurl='N/A' 
                GROUP BY movie.id 
                ORDER by random() 
                LIMIT 10;
            `;

            var queryFeatured = client.query(featuredString);

            queryFeatured.on("error", function (error) {
                done();
                res.json({ error: "SQL ERROR : " + error });
            });

            queryFeatured.on("row", function (row, result) {
                //console.log();
                row.rate = row.rate.replace(" ", "");
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