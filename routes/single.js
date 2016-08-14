var express = require('express');
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

        var query = client.query("SELECT movie.name as moviename, country, year, posterurl, videourl, releasedate, plot, director.name as directorname" +
             " FROM director INNER JOIN (movie INNER JOIN directed_by ON movie.id = directed_by.movie_id) ON director.id = directed_by.director_id  WHERE public.movie.id = $1", [movieid]);

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