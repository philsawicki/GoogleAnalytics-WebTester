var gulp       = require('gulp'),
    jade       = require('gulp-jade'),
    cleanCSS   = require('gulp-cleancss'),
    concat     = require('gulp-concat'),
    data       = require('gulp-data'),
    minifyHTML = require('gulp-minify-html'),
    prefix     = require('gulp-autoprefixer'),
    rename     = require('gulp-rename'),
    rework     = require('gulp-rework'),
    sitemap    = require('gulp-sitemap'),
    uglify     = require('gulp-uglify'),
    path       = require('path'),
    suit       = require('rework-suit'),
    fs         = require('fs');


/**
 * Compile Jade templates.
 */
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

/**
 * Generate "sitemap.xml" file.
 */
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

/**
 * Compile & minify JavaScript files.
 */
gulp.task('js', function () {
    var javaScriptFiles = [
        './javascripts/bootstrap.js',
        './javascripts/bootswatch.js',
        './javascripts/main.js'
    ];

    return gulp.src(javaScriptFiles)
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./public/js/'));
});

/**
 * Concat & minify CSS files.
 */
gulp.task('css', function () {
    return gulp.src('./stylesheets/main.css')
        .pipe(rework(suit(), /*inline('./src/images'),*/ { sourcemap: true }))
        .pipe(prefix('> 1%', 'last 2 versions', 'Safari >= 5.1', 'ie >= 10', 'Firefox ESR'))
        .pipe(cleanCSS({ keepSpecialComments: 0}))
        .pipe(gulp.dest('./public/css'));
});



gulp.task('watch', function () {
    // Compile Jade templates:
    gulp.watch('./templates/**/*.jade', ['jade']);
    gulp.watch('./data/**/*.*', ['jade']);

    // Generate "sitemap.xml" file:
    gulp.watch('./templates/**/*.page.jade', ['sitemap']);

    // Concat & minify JavaScript files:
    gulp.watch('./javascripts/**/*.js', ['js']);

    // Concat & minify CSS files:
    gulp.watch('./stylesheets/**/*.css', ['css']);
});


gulp.task('default', ['watch'], function (callback) {
    callback();
});
