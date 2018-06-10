var gulp = require('gulp');
var babel = require('gulp-babel');

gulp.task('default', function() {
    // es6 -> es5
    gulp.src('./src/js/*.js')
        .pipe(babel())
        .pipe(gulp.dest('dist'));
});