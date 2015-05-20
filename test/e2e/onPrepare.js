/**!
 * @file Injects the Google Analytics Interceptor before running each Spec.
 * @author Philippe Sawicki <http://github.com/philsawicki> 
 * @copyright Philippe Sawicki 2015
 * @license MIT
 */

// Things to do before every run:
beforeEach(function () {
    'use strict';

    // Load the Web Tester:
    var GoogleAnalyticsWebTester = require('./../../lib/GoogleAnalyticsWebTester');

    // Initialize the Web Tester:
    GoogleAnalyticsWebTester.initialize({
        browserParams: browser.params, // Browser params (from Protractor's "browser.params").
        browserDriver: browser.driver  // A reference to Protractor's WebDriver.
    });
});


/**
 * Take screenshots of passing/failing tests.
 */
if (false) {
    var fs = require('fs');

    var Utils = Utils || {
        /**
         * @name screenShotDirectory
         * @description The directory where screenshots will be created
         * @type {String}
         */
        screenShotDirectory: 'test/',

        /**
         * @name writeScreenShot
         * @description Write a screenshot string to file.
         * @param {String} data The base64-encoded string to write to file
         * @param {String} filename The name of the file to create (do not specify directory)
         */
        writeScreenShot: function (data, filename) {
            var stream = fs.createWriteStream(this.screenShotDirectory + filename);

            stream.write(new Buffer(data, 'base64'));
            stream.end();
        }
    };

    afterEach(function () {
        var passed = jasmine.getEnv().currentSpec.results().passed();
        var currentSpec = jasmine.getEnv().currentSpec;

        browser.takeScreenshot().then(function (png) {
            browser.getCapabilities().then(function (capabilities) {
                var browserName = capabilities.caps_.browserName;
                var passFail = (passed) ? 'pass' : 'FAIL';
                var filename = browserName + ' ' + passFail + ' - ' + currentSpec.id + '.png';

                Utils.writeScreenShot(png, filename);
            });
        });
    });
}
