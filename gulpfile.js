var gulp = require('gulp'),
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify');

gulp.task('default', function() {
    // es6 -> es5
    gulp.src('./src/js/*.js')
        .pipe(babel())
        .pipe(gulp.dest('dist'));
});