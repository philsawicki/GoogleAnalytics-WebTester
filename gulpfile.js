var gulp       = require('gulp'),
    jade       = require('gulp-jade'),
    data       = require('gulp-data'),
    minifyHTML = require('gulp-minify-html'),
    rename     = require('gulp-rename'),
    sitemap    = require('gulp-sitemap'),
    uglify     = require('gulp-uglify'),
    path       = require('path'),
    fs         = require('fs');


gulp.task('jade', function () {
    return gulp.src('./templates/**/*.page.jade')
        //.pipe(plumber())
        .pipe(data(function (file) {
            return require('./data/' + path.basename(file.path) + '.json');
        }))
        .pipe(jade({
            pretty: true,
            locals: require('./data/siteData.json')
        }))
        .pipe(rename({ extname: '' }))
        .pipe(rename({ extname: '.html' }))
        //.pipe(sitemap({
        //    siteUrl: 'https://philsawicki.github.io/GoogleAnalytics-WebTester'
        //}))
        .pipe(minifyHTML({ quotes: true, conditionals: true }))
        .pipe(gulp.dest('./'));
});

gulp.task('sitemap', function () {
    return gulp.src('./templates/**/*.page.jade')
        //.pipe(plumber())
        .pipe(data(function (file) {
            return require('./data/' + path.basename(file.path) + '.json');
        }))
        .pipe(jade({
            pretty: true,
            locals: require('./data/siteData.json')
        }))
        .pipe(rename({ extname: '' }))
        .pipe(rename({ extname: '.html' }))
        .pipe(sitemap({
            siteUrl: 'https://philsawicki.github.io/GoogleAnalytics-WebTester'
        }))
        .pipe(gulp.dest('./'));
});

gulp.task('js', function () {
    return gulp.src('./javascripts/**/*.js')
        .pipe(uglify())
        .pipe(rename({ extname: '' }))
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest('./public/js/'));
});

gulp.task('watch', function () {
    gulp.watch('./templates/**/*.jade', ['jade']);
    gulp.watch('./templates/**/*.page.jade', ['sitemap']);
    gulp.watch('./javascripts/**/*.js', ['js']);
});

gulp.task('default', ['watch'], function (callback) {
    callback();
});
