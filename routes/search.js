﻿var express = require('express');
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
    console.log(req.query);

    var q = req.query.q = req.query.q || "";
    var t = req.query.t = req.query.t || "";
    var d = req.query.d = req.query.d || "";
    var c = req.query.c = req.query.c || "";
    var y = req.query.y = req.query.y || "";
    var g = req.query.g = req.query.g || "";

    var reqQuery = req.query;

    var having = "";
    if (q != "") {
        having = "HAVING movie.name ILIKE '%" + q +
            "%' OR string_agg(DISTINCT(director.name), ', ') ILIKE '%" + q +
            "%' OR string_agg(DISTINCT(category.name), ', ') ILIKE '%" + q + 
            "%' OR releasedate ILIKE '%" + q + 
            "%' OR country ILIKE '%" + q + 
            "%' OR awards ILIKE '%" + q + "%'";
    } else {
        options = [];
        if (t != "") {
            options.push("movie.name ILIKE '%" + t+ "%'");
        }
        if (d != "") {
            options.push("string_agg(DISTINCT(director.name), ', ') ILIKE '%" + d + "%'");
        }
        if (g != "") {
            options.push("string_agg(DISTINCT(category.name), ', ') ILIKE '%" + g + "%'");
        }
        if (c != "") {
            options.push("country ILIKE '%" + c + "%'");
        }
        if (y != "") {
            options.push("releasedate ILIKE '%" + y + "%'");
        }

        if (options.length > 0 ) 
            having = 'HAVING ' + options.join(' AND ');
    }

    console.log(having);

    if (having == "") {
        res.render('pages/search', helper.createRenderParams(req.session, { query: reqQuery, results: [] }));
        return;
    }

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
        GROUP BY movie.id ` + having;

        var query = client.query(queryString);

        query.on('error', function (err) {
            done();
            console.log(err);
            res.render('pages/search', helper.createRenderParams(req.session, { query: reqQuery, results: [] }));
        });

        query.on('row', function (row, result) {
            result.addRow(row);
        });

        var sess = req.session;
        query.on('end', function (result) {

            done();
            console.log(result);
            for (i = 0; i < result.rows; i++) {
                console.log(result.rows[0]);
            }

            res.render('pages/search', helper.createRenderParams(req.session, { query: reqQuery, results: result.rows }));
        });
    });

});

module.exports = router;