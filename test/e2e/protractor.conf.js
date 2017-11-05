exports.config = {
    // The timeout in milliseconds for each script run on the browser. This should
    // be longer than the maximum time the application needs to stabilize between
    // tasks.
    allScriptsTimeout: 11 * 1000,

    // Spec patterns are relative to the location of this config:
    //specs: [
    //    'scenarios/**/*.js'
    //],

    // When run without a command line parameter, all suites will run. If run with
    // --suite=smoke or --suite=smoke,full only the patterns matched by the specified
    // suites will run.
    suites: {
        home: 'scenarios/home/*.js',
        blog: 'scenarios/blog/*.js',
        addToCart: 'scenarios/addToCart/*.js'
    },

    // Patterns to exclude:
    exclude: [],

    // If true, Protractor will connect directly to the browser Drivers at the locations
    // specified by "chromeDriver" and "firefoxPath". Only Chrome and Firefox are supported
    // for direct connect.
    directConnect: true,

    capabilities: {
        'browserName': 'chrome'
    },

    baseUrl: 'http://localhost:8000/dist/',

    // Test framework to use (may be one of "jasmine", "jasmine2", "cucumber", "mocha" or "custom"):
    framework: 'jasmine',

    // Options to be passed to "minijasminenode" (https://github.com/juliemr/minijasminenode/tree/jasmine1):
    jasmineNodeOpts: {
         // Display Spec names:
        isVerbose: true,
        // Print colors to the terminal:
        showColors: true,
        // Print timestamps for failures:
        showTiming: true,
        // Include stack traces in failures:
        includeStackTrace: true,
        // Default time to wait (in ms) before a test fails:
        defaultTimeoutInterval: 30 * 1000
    },

    // Options to be passed to "jasmine2" (https://github.com/jasmine/jasmine-npm/blob/master/lib/jasmine.js):
    /*jasmineNodeOpts: {
        // Print colors to the terminal:
        showColors: true,
        // Default time to wait (in ms) before a test fails:
        defaultTimeoutInterval: 30000
        // Function called to print Jasmine results:
        //print: function () {},
        // If set, only execute Specs whose names match the pattern, which is
        // internally compiled to a RegExp:
        //grep: 'pattern',
        // Inverts 'grep' matches:
        //invertGrep: false
    },*/

    // The params object will be passed directly to the Protractor instance,
    // and can be accessed from the tests. It is an arbitrary object and can
    // contain anything needed for tests.
    // This can be changed via the command line as:
    //   --params.login.user 'Joe'
    params: {
        GoogleAnalyticsWebTester: {
            // Does the Application reference "ga()" directly?
            usesGACalls: false,
            // Does the Application reference "ga()" through Google Tag Manager?
            usesGTMCalls: true,
            // Submit test data to Google Analytics?
            submitToGA: false,
            // Disable "onClick" events in the browser?
            disableClicks: false
        }
    },

    // Place the "ga()" interceptor before executing the Specs in the browser:
    onPrepare: './onPrepare.js'
};
