/**!
 * @file Gulpfile for Google Analytics Web Tester.
 * @author Philippe Sawicki <http://github.com/philsawicki>
 * @copyright Philippe Sawicki 2015
 * @license MIT
 */


/**
 * Node modules:
 */
var es = require('event-stream'),
    cs = require('combined-stream');

/**
 * Gulp & Gulp plugins:
 */
var gulp = require('gulp'),
    concat = require('gulp-concat'),
    replace = require('gulp-replace'),
    eslint = require('gulp-eslint'),
    htmlReplace = require('gulp-html-replace'),
    minifyCSS = require('gulp-minify-css'),
    minifyHTML = require('gulp-minify-html'),
    uglify = require('gulp-uglify');


/**
 * File paths:
 */
var paths = {
	library:  'lib/**/*.js',
	unitTest: 'test/unit/**/*.js',
    e2eTest:  'test/e2e/scenarios/**/*.js'
};

/**
 * Composite configuration values:
 */
var config = {
    filesToLint: [paths.library, paths.unitTest, paths.e2eTest]
};



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
        'app/css/theme-simplex/bootstrap.css',
        'app/css/bootswatch.min.css',
        'app/css/app.css',
        'app/css/addToCart.css'
    ];

    var bootstrapBaseCSS = gulp.src('app/bower_components/bootstrap/dist/css/bootstrap.min.css')
            .pipe(replace(/url\((')?\.\.\/fonts\//g, 'url($1fonts/')),
        //bootstrapThemeCSS = gulp.src('app/bower_components/bootstrap/dist/css/bootstrap-theme.min.css'),
        applicationCSS = gulp.src(stylesheets),
        combinedStream = cs.create(),
        fontFiles = gulp.src('./app/bower_components/bootstrap/fonts/*', { base: './app/bower_components/bootstrap/' });

    combinedStream.append(bootstrapBaseCSS);
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
gulp.task('minify-js', function() {
    // Library references (order-dependent):
    var libs = [
        'app/js/bootstrap.min.js',
        'app/js/bootswatch.js',
        'app/bower_components/angular/angular.js',
        'app/bower_components/angular-route/angular-route.js',
        'app/js/app.js',
        'app/js/controllers/HomePageController.js',
        'app/js/libs/googleAnalyticsTracking.js'
        //'./app/bower_components/html5-boilerplate/js/vendor/modernizr-2.6.2.min.js',
        //'./app/bower_components/jquery/dist/jquery.js',
        //'./app/bower_components/angular/angular.js',
        //'./app/bower_components/angular-route/angular-route.js',
        //'./app/bower_components/bootstrap/dist/js/bootstrap.min.js',
        //'./app/bower_components/globalize/lib/globalize.js',
        //'./app/bower_components/globalize/lib/cultures/globalize.culture.en-GB.js',
        //'./app/bower_components/d3/d3.min.js',
        //'./app/bower_components/jquery-mockjax/jquery.mockjax.js'
        
        //'./app/js/**/*.js',
        //'./tmp/templates.js'
    ];

    var jsStream = cs.create();
    jsStream.append(gulp.src(libs));

    return jsStream
        .pipe(concat('scripts.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js/'));
});

/**
 * Copy index.html, replacing "<script>" and "<link>" tags to reference production URLs.
 */
gulp.task('minify-html', function () {
    // Minify HTML for the "async" JS loader:
    //gulp.src('./app/index-async.html')
    //    .pipe(htmlReplace({
    //        css: 'css/css.css',
    //        js: 'js/scripts.js'
    //    }))
    //    .pipe(minifyHTML({ conditionals: true, empty: true, quotes: true })) // There is an issue with IE conditionals being removed with "comments: true".
    //    .pipe(gulp.dest('./dist/'));

    // Copy Modernizr to "/dist" folder:
    gulp.src('app/bower_components/html5-boilerplate/js/vendor/modernizr-2.6.2.min.js')
        .pipe(gulp.dest('dist/js'));

    // Minify HTML for the "sync" JS loader:
    return gulp.src('./app/*.html')
        .pipe(htmlReplace({
            css: 'css/css.css',
            js: 'js/scripts.js',
            modernizr: 'js/modernizr-2.6.2.min.js'
        }))
        .pipe(minifyHTML({ conditionals: true, empty: true, quotes: true })) // There is an issue with IE conditionals being removed with "comments: true".
        .pipe(gulp.dest('./dist/'));
});



/**
 * Run the tasks when a file changes.
 */
gulp.task('watch', function() {
    // Lint JavaScript files:
    gulp.watch(config.filesToLint, ['js-linting']);

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
