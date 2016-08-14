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
    res.render('admin/addmovie', helper.createRenderParams(req.session));
});

var rollback = function (client, err) {
    //terminating a client connection will
    //automatically rollback any uncommitted transactions
    //so while it's not technically mandatory to call
    //ROLLBACK it is cleaner and more correct
    client.query('ROLLBACK', function () {
        client.end();
    });
    res.json({ success: false, error: "SQL Error1:" + err });
};

router.post('/add', function (req, res) {
    var data = req.body;
    console.log(data);
    pg.connect(connectionString, function (err, client, done) {

        var directors = data.directors.split(",");
        var values = "";
        for (i = 0; i < directors.length; i++) {
            values += "('" + directors[i].trim() + "'),";
        }
        values = values.slice(0, -1);
        console.log(values);
        var querydir = client.query("INSERT INTO public.director (name) VALUES " + values + " ON CONFLICT (name) DO NOTHING");

        querydir.on('error', function (err) {
            done();
            console.log(err);
            res.json({ success: false, error: "SQL Error1:" + err });
        });

        querydir.on('end', function (result) {
            console.log("======================================================================");
            console.log(result);

            var categories = data.categories.split(",");
            var values = "";
            for (i = 0; i < categories.length; i++) {
                values += "('" + categories[i].trim() + "'),";
            }
            values = values.slice(0, -1);
            console.log(values);
            var querycat = client.query("INSERT INTO public.category (name) VALUES " + values + " ON CONFLICT (name) DO NOTHING");

            querycat.on('error', function (err) {
                done();
                console.log(err);
                res.json({ success: false, error: "SQL Error2:" + err });
            });

            querycat.on('end', function (result) {
                console.log("======================================================================");
                console.log(result);

                var query = client.query("INSERT INTO public.movie (name, year, country, bannerUrl, posterUrl, videoUrl, plot, imdbid, metascore, lang, awards, releasedate) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) ON CONFLICT (name) DO NOTHING",
                    [data.name, data.year, data.country, data.banner, data.poster, data.video, data.plot, data.imdb, data.metascore, data.lang, data.awards, data.release]);

                query.on('error', function (err) {
                    done();
                    console.log(err);
                    res.json({ success: false, error: "SQL Error3:" + err });
                });

                query.on('end', function (result) {
                    console.log("======================================================================");
                    console.log(result);

                    var actors = data.actors.split(",");
                    var values = "";
                    for (i = 0; i < actors.length; i++) {
                        values += "((SELECT id FROM movie WHERE name='" + data.name + "'), '" + actors[i].trim() + "'),";
                    }
                    values = values.slice(0, -1);
                    console.log(values);
                    var queryactors = client.query("INSERT INTO public.acts_in (movie_id, actor_name) VALUES " + values + " ON CONFLICT (movie_id, actor_name) DO NOTHING");

                    queryactors.on('error', function (err) {
                        done();
                        console.log(err);
                        res.json({ success: false, error: "SQL Error4:" + err });
                    });

                    queryactors.on('end', function (result) {

                        console.log("======================================================================");
                        console.log(result);

                        // directed by
                        var values = "";
                        for (i = 0; i < directors.length; i++) {
                            values += "'" + directors[i].trim() + "',";
                        }
                        values = values.slice(0, -1);
                        console.log(values);
                        var querydirs = client.query("INSERT INTO directed_by (movie_id, director_id) SELECT movie.id as movie_id, director.id as director_id FROM director, movie WHERE movie.name=$1 AND director.name IN (" + values + ") ", [data.name]);

                        querydirs.on('error', function (err) {
                            done();
                            console.log(err);
                            res.json({ success: false, error: "SQL Error5:" + err });
                        });

                        querydirs.on("end", function (result) {
                            // movie categories
                            values = "";
                            for (i = 0; i < categories.length; i++) {
                                values += "'" + categories[i].trim() + "',";
                            }
                            values = values.slice(0, -1);
                            var querycats = client.query("INSERT INTO movie_category (movie_id, category_id) SELECT movie.id as movie_id, category.id as category_id FROM category, movie WHERE movie.name=$1 AND category.name IN (" + values + ") ", [data.name]);

                            querycats.on('error', function (err) {
                                done();
                                console.log(err);
                                res.json({ success: false, error: "SQL Error6:" + err });
                            });

                            querycats.on("end", function (result) {
                                done();
                                console.log("======================================================================");
                                console.log(result);
                                res.json({ success: true });
                            });
                        });

                    });
                });

            });
        });
    });
});

module.exports = router;