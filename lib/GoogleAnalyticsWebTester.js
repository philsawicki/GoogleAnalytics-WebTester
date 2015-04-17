/**!
 * @file Google Analytics Web Tester Module.
 * @author Philippe Sawicki (https://github.com/philsawicki)
 * @copyright Copyright Philippe Sawicki 2015
 * @license MIT
 */


/**!
 * Google Analytics Web Tester Module.
 *
 * @author Philippe Sawicki (https://github.com/philsawicki)
 * @copyright Copyright Philippe Sawicki 2015
 * @license MIT
 */
(function (exports, BrowserAPI) {

    'use strict';

    /**
     * Reference to self.
     * @type {Object}
     */
    var self = exports;

    /**
     * A reference to Protractor's "browser.params".
     *
     * @type {Object|undefined}
     * @private
     */
    var browserParams_;

    /**
     * A reference to Protractor's "browser.driver".
     *
     * @type {Object|undefined}
     * @private
     */
    var browserDriver_;


    /**
     * Initialize the Module.
     *
     * @param  {Object} options An object with references to Protractor's "browser.params" and "browser.driver".
     * @return {void}
     * @public
     */
    self.initialize = function (options) {
        // Extract the expected options:
        browserParams_ = options.browserParams || undefined;
        browserDriver_ = options.browserDriver;

        // Generate the configuration settings:
        var config = self.loadConfigurationSettings(browserParams_);

        // Attach the utility methods to "browser.driver":
        self.registerBrowserDriverUtilities(browserDriver_, config);
    };


    /**
     * Load configuration settings for the Web Tester.
     *
     * @param  {Object} browserParams A reference to Protractor's "browser.params".
     * @return {Object} The configuration settings for the Web Tester.
     * @public
     */
    self.loadConfigurationSettings = function (browserParams) {
        // Setup default values for the Test Runner:
        var settings = {
            usesGACalls: false,  // Does the Application reference "ga()" directly?
            usesGTMCalls: true,  // Does the Application reference "ga()" through Google Tag Manager?
            submitToGA: false,   // Forward "ga()" calls to the actual Google Analytics method?
            disableClicks: false // Disable "onClick" events in the browser?
        };

        // Attempt to get the values from Protractor's "browser.params":
        if (typeof browserParams !== 'undefined' && typeof browserParams.GoogleAnalyticsWebTester !== 'undefined') {
            // Load the configuration setting for "usesGACalls":
            if (typeof browserParams.GoogleAnalyticsWebTester.usesGACalls !== 'undefined') {
                settings.usesGACalls = browserParams.GoogleAnalyticsWebTester.usesGACalls;
            }

            // Load the configuration setting for "usesGTMCalls":
            if (typeof browserParams.GoogleAnalyticsWebTester.usesGTMCalls !== 'undefined') {
                settings.usesGTMCalls = browserParams.GoogleAnalyticsWebTester.usesGTMCalls;
            }

            // Load the configuration setting for "submitToGA":
            if (typeof browserParams.GoogleAnalyticsWebTester.submitToGA !== 'undefined') {
                settings.submitToGA = browserParams.GoogleAnalyticsWebTester.submitToGA;
            }

            // Load the configuration setting for "disableClicks":
            if (typeof browserParams.GoogleAnalyticsWebTester.disableClicks !== 'undefined') {
                settings.disableClicks = browserParams.GoogleAnalyticsWebTester.disableClicks;
            }
        }

        // Return the resolved params:
        return settings;
    };


    /**
     * Register the utility methods to Protractor's "browser.driver".
     *
     * @param  {Object} browserDriver A reference to Protractor's "browser.driver".
     * @param  {Object} config        The configuration settings.
     * @return {void}
     * @public
     */
    self.registerBrowserDriverUtilities = function (browserDriver, config) {
        self.registerGoogleAnalyticsEventDataInterceptor(browserDriver, config);
        self.registerGoogleAnalyticsEventDataInterceptorCleanup(browserDriver, config);

        self.registerDisableClicksMethod(browserDriver, config);
        self.registerEnableClicksMethod(browserDriver, config);
    };


    /**
     * Register the Google Analytics Event Data Interceptors to Protractor's "browser.driver".
     *
     * @param  {Object} browserDriver A reference to Protractor's "browser.driver".
     * @param  {Object} config        The configuration settings.
     * @return {void}
     * @public
     */
    self.registerGoogleAnalyticsEventDataInterceptor = function (browserDriver, config) {
        if (typeof browserDriver.registerGoogleAnalyticsEventDataInterceptor === 'undefined') {
            browserDriver.registerGoogleAnalyticsEventDataInterceptor = function () {
                // Execute the Inteceptor setup in the browser:
                browserDriver.executeScript(BrowserAPI.installDataInterceptor, config);
            };
        }
    };


    /**
     * Unregister the Google Analytics Event Data Interceptors to Protractor's "browser.driver".
     *
     * @param  {Object} browserDriver A reference to Protractor's "browser.driver".
     * @param  {Object} config        The configuration settings.
     * @return {void}
     * @public
     */
    self.registerGoogleAnalyticsEventDataInterceptorCleanup = function (browserDriver, config) {
        // Unregister the Google Analytics Event Data Interceptors:
        if (typeof browserDriver.unregisterGoogleAnalyticsEventDataInterceptor === 'undefined') {
            browserDriver.unregisterGoogleAnalyticsEventDataInterceptor = function () {
                // Execute the Interceptor cleanup function:
                browserDriver.executeScript(BrowserAPI.uninstallDataInterceptor);
            };
        }
    };


    /**
     * Disable "click" handlers from the "document".
     *
     * @param  {Object} browserDriver A reference to Protractor's "browser.driver".
     * @param  {Object} config        The configuration settings.
     * @return {void}
     * @public
     */
    self.registerDisableClicksMethod = function (browserDriver, config) {
        if (typeof browserDriver.disableClicks === 'undefined') {
            browserDriver.disableClicks = function () {
                browserDriver.executeScript(BrowserAPI.disableClickHandlers);
            };
        }
    };


    /**
     * Enable "click" handlers from the "document".
     *
     * @param  {Object} browserDriver A reference to Protractor's "browser.driver".
     * @param  {Object} config        The configuration settings.
     * @return {void}
     * @public
     */
    self.registerEnableClicksMethod = function (browserDriver, config) {
        if (typeof browserDriver.enableClicks === 'undefined') {
            browserDriver.enableClicks = function () {
                browserDriver.executeScript(BrowserAPI.enableClickHandlers);
            };
        }
    };


    /**
     * Returns "true" if the options given to "initialize()" indicate that Google Tag Manager is used.
     *
     * @return {Boolean} "true" if the options given to "initialize()" indicate that Google Tag Manager is used.
     * @public
     */
    self.usesGTM = function () {
        return browserParams_.usesGTMCalls;
    };


    /**
     * Returns "true" if the options given to "initialize()" indicate that "ga()" is used directly.
     *
     * @return {Boolean} "true" if the options given to "initialize()" indicate that "ga()" is used directly.
     * @public
     */
    self.usesGA = function () {
        return browserParams_.usesGACalls;
    };
})(
    /**
     * Exports the Google Analytics Web Tester API.
     */
    (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
        ? module.exports
        : this.GoogleAnalyticsWebTester = {},

    /**
     * Import the Google Analytics Web Tester Browser API.
     */
    (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
        ? require('./BrowserAPI')
        : this.GoogleAnalyticsWebTesterBrowserAPI
);
