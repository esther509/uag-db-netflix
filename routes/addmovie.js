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

router.post('/add', function (req, res) {
    var data = req.body;
    console.log(data);
    pg.connect(connectionString, function (err, client, done) {

        var query = client.query("INSERT INTO public.movie (name, year, country, bannerUrl, posterUrl, videoUrl, plot) VALUES ($1, $2, $3, $4, $5, $6, $7)",
            [data.name, data.year, data.country, data.banner, data.poster, data.video, data.plot]);

        query.on('error', function (err) {
            done();
            console.log(err);
            res.json({ success: false, error: "SQL Error1:" + err });
        });

        query.on('end', function (result) {
            done();
            console.log(result);
            res.json({ success: true });
        });

    });
    
});

module.exports = router;