// Things to do before every run:
beforeEach(function () {
    'use strict';

    // Forward "ga()" calls to the actual Google Analytics method?
    var submitToGA = browser.params.GoogleAnalyticsWebTester.config.submitToGA;


    // Register the Google Analytics Event Data Interceptors:
    if (typeof browser.driver.registerGoogleAnalyticsEventDataInterceptor === 'undefined') {
        browser.driver.registerGoogleAnalyticsEventDataInterceptor = function () {
            browser.driver.executeScript(function () {
                var submitToGA = true;
                if (arguments.length > 0) {
                    submitToGA = arguments[0];
                }

                if (window && !window.gaEventDataBuffer && !window.gaLastEventData) {
                    // Setup the data accumulators:
                    if (window.ga) {
                        window.gaOriginal = ga;
                    }
                    window.gaEventDataBuffer = [];
                    window.gaLastEventData = {};

                    // Temporarily override the original "ga()" function, in order to intercept its arguments:
                    window.ga = function () {
                        window.gaEventDataBuffer.push(arguments);
                        window.gaLastEventData = arguments;

                        if (submitToGA) {
                            // Call the original "ga()" function with the supplied arguments:
                            window.gaOriginal.apply(null, arguments);
                        }
                    };
                }
            }, submitToGA);
        };
    }

    // Unregister the Google Analytics Event Data Interceptors:
    if (typeof browser.driver.unregisterGoogleAnalyticsEventDataInterceptor === 'undefined') {
        browser.driver.unregisterGoogleAnalyticsEventDataInterceptor = function () {
            browser.driver.executeScript(function () {
                if (window && window.gaEventDataBuffer && window.gaLastEventData) {
                    if (window.gaOriginal) {
                        // Restore the original "ga()" function:
                        window.ga = window.gaOriginal;
                    }

                    // Remove the data accumulators:
                    window.gaOriginal = undefined;
                    window.gaEventDataBuffer = undefined;
                    window.gaLastEventData = undefined;
                }
            });
        };
    }
});
