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

            var movie = {};
            if (result.rowCount > 0) {
                movie = result.rows[0];
            }

            // Three random movies with banner
            var query3Imgs = client.query("SELECT posterurl, id, name FROM movie WHERE NOT posterurl='' AND NOT posterurl='N/A' ORDER by random() LIMIT 3");

            query3Imgs.on('error', function (err) {
                done();
                console.log(err);
                res.render('pages/single', helper.createRenderParams(req.session));
            });

            query3Imgs.on('row', function (row, result) {
                result.addRow(row);
            });

            query3Imgs.on('end', function (result) {
                

                var ads = result.rows;

                var userid = "";
                if (sess && sess.username) {
                    userid = sess.userid;
                }

                if (userid == "") {
                    done();
                    res.render('pages/single', helper.createRenderParams(req.session, { movie: movie, ads: ads, movieid: movieid, rating: "0" }));
                    return;
                }

                // Three random movies with banner
                var queryRating = client.query("SELECT rate FROM movie INNER JOIN rated_by ON movie.id=rated_by.movie_id WHERE rated_by.user_id = $1 AND movie.id = $2", [userid, movieid]);

                queryRating.on('error', function (err) {
                    done();
                    console.log(err);
                    res.render('pages/single', helper.createRenderParams(req.session));
                });

                queryRating.on('row', function (row, result) {
                    result.addRow(row);
                });

                queryRating.on('end', function (result) {
                    done();

                    rating = "0";

                    if (result.rowCount > 0) {
                        rating = result.rows[0].rate;
                    }
                    console.log("************************| " + rating + " |**********************************");
                    res.render('pages/single', helper.createRenderParams(req.session, { movie: movie, ads: ads, movieid: movieid, rating: rating }));
                });
            });

        });
    });
    
});

router.post('/:movieid/rate', function (req, res) {
    var movieid = req.params.movieid;
    var rate = req.body.rating;

    var sess = req.session;
    if (sess.username == "") {
        res.json({ success: false });
        return;
    }

    pg.connect(connectionString, function (err, client, done) {

        var sqlString = "INSERT INTO rated_by (movie_id, user_id, rate) VALUES ($1, $2, $3) ON CONFLICT (movie_id, user_id) DO UPDATE SET rate = $3";

        var query = client.query(sqlString, [movieid, sess.userid, rate]);

        query.on("error", function (err) {
            done();
            console.log(err);
            res.json({ success: false });
        });

        query.on('end', function (result) {
            done();
            console.log(result);
            res.json({ success: true });
        });4
    });
});

module.exports = router;