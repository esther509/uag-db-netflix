var gulp = require('gulp');

gulp.task('default', ['copy'], function () {
    // place code for your default task here
});

gulp.task('copy', function () {

    gulp.src('./node_modules/bootstrap/dist/css/bootstrap.min.css')
        .pipe(gulp.dest('./public/stylesheets'));

    gulp.src(['./node_modules/bootstrap/dist/js/bootstrap.min.js', './node_modules/jquery/dist/jquery.min.js'])
        .pipe(gulp.dest('./public/javascripts'));

    gulp.src('./node_modules/bootstrap/dist/fonts/glyphicons*')
        .pipe(gulp.dest('./public/fonts'));

});