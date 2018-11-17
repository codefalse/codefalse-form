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
gulp.task('minCss', () => {
    gulp.src('./src/css/*.css')
        .pipe(uglifycss())
        .pipe(gulp.dest('./dist/css/'));
});
gulp.task('concatJs', () => {
    //file module
    gulp.src(['./src/modaal/js/modaal.js', './src/js/cf-file.js'])
        .pipe(concat('cf-file.js'))
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
gulp.task('concatAllJS', ['concatJs'], () => {
    gulp.src('./dist/js/*.min.js')
        .pipe(concat('codefalse-form.all.js'))
        .pipe(gulp.dest('./dist/js/'));
});
gulp.task('concatAllCss', ['minCss'], () => {
    gulp.src('./dist/css/*.css')
        .pipe(concat('codefalse-form.all.css'))
        .pipe(gulp.dest('./dist/css/'));
});
gulp.task('copy', () => {
    gulp.src('./src/iconfont/*')
        .pipe(gulp.dest('./dist/iconfont/'));
    gulp.src('./src/modaal/**/*')
        .pipe(gulp.dest('./dist/modaal/'))
})
gulp.task('default', ['clean'], () => {
    gulp.run('minjs', 'mincss', 'concatjs', 'concatcss');
});