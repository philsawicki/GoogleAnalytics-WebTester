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

    // The params object will be passed directly to the Protractor instance,
    // and can be accessed from the tests. It is an arbitrary object and can
    // contain anything needed for tests.
    // This can be changed via the command line as:
    //   --params.login.user 'Joe'
    params: {
        GoogleAnalyticsWebTester: {
            config: {
                submitToGA: true // Submit test data to Google Analytics?
            }
        }
    },
    
    // Place the "ga()" interceptor before executing the Specs in the browser:
    onPrepare: './GoogleAnalyticsWebTesterInterceptor.js'
};
