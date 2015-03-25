/**!
 * @file Gulpfile for Google Analytics Web Tester.
 * @author Philippe Sawicki <http://github.com/philsawicki>
 * @copyright Philippe Sawicki 2015
 * @license MIT
 */


/**
 * Node modules:
 */
var gulp = require('gulp'),
    eslint = require('gulp-eslint');

/**
 * File paths:
 */
var paths = {
	library:  'lib/**/*.js',
	unitTest: 'test/unit/**/*.js'
};


/**
 * If there is a linting error, the "failOnError" will fail 
 * the task, making the process exit with an error code (1).
 */
gulp.task('js-linting', function () {
    return gulp.src([paths.library, paths.unitTest])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

/**
 * Run the tasks when a file changes.
 */
gulp.task('watch', function() {
    // Lint the "/lib" and "/test/unit" files:
    gulp.watch([paths.library, paths.unitTest], ['js-linting']);
});


/**
 * Default task (called when running `gulp` from CLI).
 */
gulp.task('default', ['watch'], function () {
    // ...
});
