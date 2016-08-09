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
    res.render('pages/login', helper.createRenderParams(req.session, {userhint: ""}));
});

router.get('/:username', function (req, res) {
    res.render('pages/login', helper.createRenderParams(req.session, { userhint: username }));
});

router.post('/', function (req, res) {

    var data = req.body;
    console.log(data);
    pg.connect(connectionString, function (err, client, done) {

        var query = client.query("SELECT * FROM public.user WHERE username=$1 AND password=$2", [data.username, data.password]);

        query.on('error', function (err) {
            done();
            console.log(err);
            res.json({ success: false, error: "SQL Error:" + err });
        });

        query.on('row', function (row, result) {
            result.addRow(row);
        });

        var sess = req.session;
        query.on('end', function (result) {

            done();
            if (result.rowCount > 0) {
                req.session.username = result.rows[0].username;
                req.session.type = result.rows[0].user_type;
                req.session.save();
                res.json({ success: true });
            } else {
                res.json({ success: false, error: "User \"" + data.username + "\" does not exist" });
            }

        });
    });
   
});

module.exports = router;