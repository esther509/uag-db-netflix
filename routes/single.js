﻿var express = require('express');
var http = require('http'); var helper = require("../modules/pageshelper");
var router = express.Router();

var pg = require('pg');

if (process.env.DATABASE_URL) {
    pg.defaults.ssl = true;
}
var connectionString = process.env.DATABASE_URL || "postgres://Sergio:admin@localhost:5432/uag-db-netflix";

router.get('/', function (req, res) {
    res.render('pages/single', helper.createRenderParams(req.session));
});

router.get('/:movieid', function (req, res) {

    var movieid = req.params.movieid;

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
            string_agg(DISTINCT(acts_in.actor_name), ', ') as actors
        FROM director 
        INNER JOIN directed_by ON director.id = directed_by.director_id
        INNER JOIN movie ON movie.id = directed_by.movie_id
        INNER JOIN acts_in ON movie.id = acts_in.movie_id
        INNER JOIN movie_category ON movie.id = movie_category.movie_id
        INNER JOIN category ON category.id = movie_category.category_id
        WHERE movie.id = $1 
        GROUP BY movie.id`;

        //var query = client.query("SELECT movie.id as movieid, movie.name as moviename, country, year, posterurl, videourl, releasedate, plot, director.name as directorname, awards, metascore, " +
        //    " (SELECT string_agg(actor_name, ', ') from acts_in INNER JOIN movie ON id= movie_id WHERE movie.id = $1) as actors, " +
        //    " (SELECT string_agg(category.name, ', ') from movie_category, category, movie WHERE movie.id = $1 AND movie.id = movie_id AND category.id = category_id) as categories " +
        //    " FROM director INNER JOIN " +
        //    " (movie INNER JOIN directed_by ON movie.id = directed_by.movie_id) " +
        //    " ON director.id = directed_by.director_id " +
        //    " WHERE public.movie.id = $1", [movieid]);

        var query = client.query(queryString, [movieid]);

        query.on('error', function (err) {
            done();
            console.log(err);
            res.render('pages/single', helper.createRenderParams(req.session));
        });

        query.on('row', function (row, result) {
            result.addRow(row);
        });

        var sess = req.session;
        query.on('end', function (result) {

            done();
            console.log(result);
            if (result.rowCount > 0) {
                console.log(result.rows[0]);
                res.render('pages/single', helper.createRenderParams(req.session, { movie: result.rows[0] } ));
            } else {
                res.render('pages/single', helper.createRenderParams(req.session));
            }

        });
    });
    
});

module.exports = router;