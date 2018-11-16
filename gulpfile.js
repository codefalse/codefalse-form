let gulp = require('gulp'),
    babel = require('gulp-babel'),
    clean = require('gulp-clean'),
    uglify = require('gulp-uglify'),
    uglifycss = require('gulp-uglifycss'),
    sourcemaps = require('gulp-sourcemaps'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat');

gulp.task('clean', () => {
    gulp.src('./dist')
        .pipe(clean());
});
gulp.task('minjs', () => {
    gulp.src('./src/js/*.js')
        .pipe(babel())
        .pipe(sourcemaps.init())
        .pipe(gulp.dest('./dist/js/'))
        .pipe(uglify({
            compress: {
                drop_console: true
            }
        }))
        .pipe(rename({extname: '.min.js'}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/js/'));
});
gulp.task('mincss', () => {
    gulp.src('./src/css/*.css')
        .pipe(uglifycss())
        .pipe(gulp.dest('./dist/css/'));
});
gulp.task('concatjs', () => {
    gulp.src('./src/js/*.js')
        .pipe(concat('codefalse-form.all.js'))
        .pipe(babel())
        .pipe(sourcemaps.init())
        .pipe(gulp.dest('./dist/js/'))
        .pipe(uglify({
            compress: {
                drop_console: true
            }
        }))
        .pipe(rename({extname: '.min.js'}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/js/'));
});
gulp.task('concatcss', () => {
    gulp.src('./src/css/*.css')
        .pipe(concat('codefalse-form.all.css'))
        .pipe(uglifycss())
        .pipe(gulp.dest('./dist/css/'));
})
gulp.task('default', ['clean'], () => {
    gulp.start('minjs', 'mincss', 'concatjs', 'concatcss');
});