let gulp = require('gulp'),
    babel = require('gulp-babel'),
    clean = require('gulp-clean'),
    uglify = require('gulp-uglify'),
    uglifycss = require('gulp-uglifycss'),
    sourcemaps = require('gulp-sourcemaps');

gulp.task('clean', () => {
    gulp.src('./dist')
        .pipe(clean());
});
gulp.task('minjs', () => {
    gulp.src('./src/js/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(uglify({
            compress: {
                drop_console: true
            }
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/js/'));
});
gulp.task('mincss', () => {
    gulp.src('./src/css/*.css')
        .pipe(uglifycss())
        .pipe(gulp.dest('./dist/css/'))
});
gulp.task('default', ['clean'], () => {
    gulp.start('minjs', 'mincss');
});