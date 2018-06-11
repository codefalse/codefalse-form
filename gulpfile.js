let gulp = require('gulp'),
    babel = require('gulp-babel'),
    clean = require('gulp-clean'),
    uglify = require('gulp-uglify');

let jsDist = './dist/js/';

gulp.task('clean', () => {
    gulp.src('./dist')
        .pipe(clean());
});
gulp.task('babel', () => {
    gulp.src('./src/js/*.js')
        .pipe(babel())
        .pipe(gulp.dest(jsDist));
});
gulp.task('uglify', ['babel'], () => {
    gulp.src('./dist/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));
});
gulp.task('default', ['clean', 'babel']);