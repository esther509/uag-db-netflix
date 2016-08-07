var express = require('express');
var http = require('http');
var router = express.Router();
var pg = require('pg');
var validator = require("validator");

if (process.env.DATABASE_URL) {
    pg.defaults.ssl = true;
}
var connectionString = process.env.DATABASE_URL || "postgres://Sergio:admin@localhost:5432/uag-db-netflix";

/* GET home page. */
router.get('/', function (req, res) {

    res.render('pages/register', { title: 'UAG Netflix' });
});

router.post('/new', function (req, res) {
    var data = req.body;
    console.log(data);
    if (data.password != password_conf) {
        res.json({ success: false, error: "La contraseña no coincide" });
        return;
    }

    //if (!validator.isEmail(data.email)) {
    //    res.json({ success: false, error: "El correo no es valido" });
    //    return;
    //}

    res.json({ success: true });

    //pg.connect(connectionString, function (err, client, done) {

    //    var query = client.query(
    //        "INSERT INTO public.user(username, password, full_name, email, user_type) VALUES ('" +
    //        data.username + "', '" + data.password + "', '" + data.fullname + "', '" + data.email + "', 'normal')");

    //    query.on('error', function (err) {
    //        done();
    //        res.json({ success: false, error: err });
    //    });

    //    query.on('end', function (row) {
    //        done();
    //        res.json({ success: true });
    //    });
    //});

});

module.exports = router;