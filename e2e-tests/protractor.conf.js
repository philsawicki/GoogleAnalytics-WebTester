exports.config = {
    // The timeout in milliseconds for each script run on the browser. This should
    // be longer than the maximum time the application needs to stabilize between
    // tasks.
    allScriptsTimeout: 11000,

    // Spec patterns are relative to the location of this config:
    specs: [
        '*.js'
    ],
    
    // Patterns to exclude:
    exclude: [],

    capabilities: {
        'browserName': 'chrome'
    },

    baseUrl: 'http://localhost:8000/app/',

    // Test framework to use (may be one of "jasmine", "jasmine2", "cucumber", "mocha" or "custom"):
    framework: 'jasmine2',

    // Options to be passed to "minijasminenode" (https://github.com/juliemr/minijasminenode/tree/jasmine1):
    jasmineNodeOpts: {
         // Display spec names:
        isVerbose: false,
        // Print colors to the terminal:
        showColors: true,
        // Include stack traces in failures:
        includeStackTrace: true,
        // Default time to wait (in ms) before a test fails:
        defaultTimeoutInterval: 30000
    },
    
    onPrepare: function () {
        // Things to do before every run:
        beforeEach(function () {
            'use strict';
            
            // Register the Google Analytics Event Data Interceptors:
            if (typeof browser.driver.registerGoogleAnalyticsEventDataInterceptor === 'undefined') {
                browser.driver.registerGoogleAnalyticsEventDataInterceptor = function () {
                    browser.driver.executeScript(function () {
                        if (window && window.ga && !window.gaEventDataBuffer && !window.gaLastEventData) {
                            window.gaOriginal = ga;
                            window.gaEventDataBuffer = [];
                            window.gaLastEventData = {};

                            // Temporarily override the original "ga()" function, in order to intercept its arguments:
                            window.ga = function () {
                                window.gaEventDataBuffer.push(arguments);
                                window.gaLastEventData = arguments;

                                // Call the original "ga()" function with the supplied arguments:
                                window.gaOriginal.apply(null, arguments);
                            };
                        }
                    });
                };
            }

            // Unregister the Google Analytics Event Data Interceptors:
            if (typeof browser.driver.unregisterGoogleAnalyticsEventDataInterceptor === 'undefined') {
                browser.driver.unregisterGoogleAnalyticsEventDataInterceptor = function () {
                    browser.driver.executeScript(function () {
                        if (window && window.gaOriginal) {
                            // Restore the original "ga()" function:
                            window.ga = window.gaOriginal;

                            // Remove the data accumulators:
                            window.gaOriginal = undefined;
                            window.gaEventDataBuffer = undefined;
                            window.gaLastEventData = undefined;
                        }
                    });
                };
            }
        });
    }
};
