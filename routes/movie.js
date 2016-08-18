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

        var queryString = `
        SELECT
            movie.id as movieid,
            movie.name as moviename,
            country,
            year,
            posterurl,
            videourl,
            releasedate,
            plot,
            awards,
            metascore,
            string_agg(DISTINCT(director.name), ', ') as directors,
            string_agg(DISTINCT(category.name), ', ') as categories,
            string_agg(DISTINCT(acts_in.actor_name), ', ') as actors,
            ('/images/rating1_' || to_char(coalesce(FLOOR(AVG(rate)), 0), '9') || '.png') as rate 
        FROM director 
        INNER JOIN directed_by ON director.id = directed_by.director_id
        INNER JOIN movie ON movie.id = directed_by.movie_id
        INNER JOIN acts_in ON movie.id = acts_in.movie_id
        INNER JOIN movie_category ON movie.id = movie_category.movie_id
        INNER JOIN category ON category.id = movie_category.category_id 
        FULL OUTER JOIN rated_by ON movie.id=rated_by.movie_id 
        GROUP BY movie.id `;

        var query = client.query(queryString);

        query.on('error', function (err) {
            done();
            console.log(err);
            res.render('pages/movie', helper.createRenderParams(req.session, { results: [] }));
        });

        query.on('row', function (row, result) {
            row.rate = row.rate.replace(" ", "");
            result.addRow(row);
        });

        var sess = req.session;
        query.on('end', function (result) {

            done();
            //console.log(result);
            for (i = 0; i < result.rows; i++) {
                console.log(result.rows[0]);
            }

            res.render('pages/movie', helper.createRenderParams(req.session, { results: result.rows }));
        });
    });

});

module.exports = router;