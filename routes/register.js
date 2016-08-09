var express = require('express');
var http = require('http');
var router = express.Router();
var pg = require('pg');
var validator = require("validator");
var helper = require("../modules/pageshelper");

if (process.env.DATABASE_URL) {
    pg.defaults.ssl = true;
}
var connectionString = process.env.DATABASE_URL || "postgres://Sergio:admin@localhost:5432/uag-db-netflix";

/* GET home page. */
router.get('/', function (req, res) {  
    res.render('pages/register', helper.createRenderParams(req.session));
});

router.post('/new', function (req, res) {
    var data = req.body;
    console.log(data);
    if (data.password != data.password_conf) {
        res.json({ success: false, error: "La contraseña no coincide" });
        return;
    }

    if (!validator.isEmail(data.email)) {
        res.json({ success: false, error: "El correo no es valido" });
        return;
    }

    pg.connect(connectionString, function (err, client, done) {

        var queryCheck = client.query("SELECT * FROM public.user WHERE username=$1 OR email=$2", [data.username, data.email]);

        queryCheck.on('error', function (err) {
            done();
            console.log(err);
            res.json({ success: false, error: "SQL Error1:" + err });
        });

        queryCheck.on('end', function (result) {

            if (result.rowCount > 0) {
                done();
                res.json({ success: false, error: "User name or email already in use" });
            } else {
                var queryInsert = client.query(
                    "INSERT INTO public.user(username, password, full_name, email, user_type) VALUES ($1, $2, $3, $4, 'normal')",
                    [data.username, data.password, data.fullname, data.email]);

                queryInsert.on('error', function (err) {
                    done();
                    console.log(err);
                    res.json({ success: false, error: "SQL Error2:" + err });
                });

                queryInsert.on('end', function (row) {
                    done();
                    res.json({ success: true });
                });
            }

        });
    });

});

module.exports = router;