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
