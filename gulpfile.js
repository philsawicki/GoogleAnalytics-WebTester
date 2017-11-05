/**!
 * @file Gulpfile for Google Analytics Web Tester.
 * @author Philippe Sawicki (https://github.com/philsawicki)
 * @copyright Philippe Sawicki 2015
 * @license MIT
 */

 'use strict';

/**
 * Node modules:
 */
var es = require('event-stream'),
    cs = require('combined-stream');

/**
 * Gulp & Gulp plugins:
 */
var gulp = require('gulp'),
    templateCache = require('gulp-angular-templatecache'),
    concat = require('gulp-concat'),
    eslint = require('gulp-eslint'),
    htmlReplace = require('gulp-html-replace'),
    minifyCSS = require('gulp-minify-css'),
    minifyHTML = require('gulp-minify-html'),
    replace = require('gulp-replace'),
    uglify = require('gulp-uglify');


/**
 * File paths:
 */
var paths = {
    angularViews: 'app/views/**/*.html',
	library: 'lib/**/*.js',
	unitTest: 'test/unit/**/*.js',
    e2eTest: 'test/e2e/scenarios/**/*.js'
};

/**
 * Composite configuration values:
 */
var config = {
    angularViews: [paths.angularViews],
    filesToLint: [paths.library, paths.unitTest, paths.e2eTest]
};



/**
 * Package up the Angular Views into a single initial download:
 */
gulp.task('package-partials', function () {
    return gulp.src(config.angularViews)
        .pipe(minifyHTML({ empty: true, quotes: true }))
        .pipe(templateCache('templates.js', { root: 'views/', module: 'myApp' }))
        .pipe(gulp.dest('./tmp'));
});

/**
 * If there is a linting error, the "failOnError" will fail
 * the task, making the process exit with an error code (1).
 */
gulp.task('js-linting', function () {
    return gulp.src(config.filesToLint)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

/**
 * Minify CSS files, rewrite relative paths of Bootstrap fonts & copy Bootstrap fonts.
 */
gulp.task('minify-css', function () {
    // Application stylesheets (order-dependent):
    var stylesheets = [
        'bower_components/html5-boilerplate/css/normalize.css',
        'bower_components/html5-boilerplate/css/main.css',
        'app/css/bootswatch-simplex.css',
        'app/css/bootswatch.min.css',
        'app/css/app.css',
        'app/css/addToCart.css'
    ];

    var //bootstrapBaseCSS = gulp.src('app/bower_components/bootstrap/dist/css/bootstrap.min.css')
        //    .pipe(replace(/url\((')?\.\.\/fonts\//g, 'url($1fonts/')),
        //bootstrapThemeCSS = gulp.src('app/bower_components/bootstrap/dist/css/bootstrap-theme.min.css'),
        applicationCSS = gulp.src(stylesheets),
        fontFiles = gulp.src('./app/bower_components/bootstrap/fonts/*', { base: './app/bower_components/bootstrap/' });

    var combinedStream = cs.create();
    //combinedStream.append(bootstrapBaseCSS);
    //combinedStream.append(bootstrapThemeCSS);
    combinedStream.append(applicationCSS);

    var combinedCSS = combinedStream
        //.pipe(uncss({
        //    html: ['./app/index.html', './app/views/**/*.html']
        //}))
        .pipe(minifyCSS({ cache: true, keepSpecialComments: 0, advanced: true }))
        .pipe(concat('css.css'));

    return es.concat(combinedCSS, fontFiles)
        .pipe(gulp.dest('./dist/css/'));
});

/**
 * Minify JS.
 */
gulp.task('minify-js', ['package-partials'], function () {
    // Library references (order-dependent):
    var libs = [
        'app/bower_components/jquery/dist/jquery.js',
        'app/js/bootstrap.min.js',
        'app/js/bootswatch.js',
        'app/bower_components/angular/angular.js',
        'app/bower_components/angular-route/angular-route.js',
        'app/js/app.js',
        'app/js/controllers/HomePageController.js',
        'app/js/libs/googleAnalyticsTracking.js',
        'tmp/templates.js'
    ];

    return gulp.src(libs)
        .pipe(concat('scripts.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js/'));
});

/**
 * Copy index.html, replacing "<script>" and "<link>" tags to reference production URLs.
 */
gulp.task('minify-html', ['package-partials'], function () {
    // Copy Modernizr to "/dist" folder:
    gulp.src('app/bower_components/html5-boilerplate/js/vendor/modernizr-2.6.2.min.js')
        .pipe(gulp.dest('dist/js'));

    // Minify HTML for the "sync" JS loader:
    return gulp.src('app/*.html')
        .pipe(htmlReplace({
            css: 'css/css.css',
            js: {
                src: 'js/scripts.js',
                tpl: '<script src="%s" async></script>'
            },
            modernizr: 'js/modernizr-2.6.2.min.js'
        }))
        .pipe(minifyHTML({ conditionals: true, empty: true, quotes: true })) // There is an issue with IE conditionals being removed with "comments: true".
        .pipe(gulp.dest('dist/'));
});



/**
 * Run the tasks when a file changes.
 */
gulp.task('watch', function () {
    // Lint JavaScript files:
    gulp.watch(config.filesToLint, ['js-linting']);

    // TemplateCache the Angular Views:
    gulp.watch(config.angularViews, ['package-partials']);

    // Concat & Minify CSS files:
    gulp.watch(['app/css/**/*.css'], ['minify-css']);

    // Concat & Minify JS files:
    gulp.watch(['app/js/**/*.js'], ['minify-js']);

    // Minify HTML files:
    gulp.watch(['app/*.html'], ['minify-html']);
});


/**
 * Default task (called when running `gulp` from CLI).
 */
gulp.task('default', ['watch'], function () {
    // ...
});
