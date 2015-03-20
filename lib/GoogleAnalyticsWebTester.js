/**!
 * @file Google Analytics Web Tester Module.
 * @author Philippe Sawicki <http://github.com/philsawicki> 
 * @copyright Philippe Sawicki 2015
 * @license MIT
 */


/**
 * Google Analytics Web Tester Module.
 * 
 * @return {Object} The Google Analytics Web Tester Module API.
 */
var GoogleAnalyticsWebTester = (function () {

    /**
     * A reference to Protractor's "browser.params".
     * 
     * @type {Object|undefined}
     * @private
     */
    var browserParams_ = undefined;

    /**
     * A reference to Protractor's "browser.driver".
     * 
     * @type {Object|undefined}
     * @private
     */
    var browserDriver_ = undefined;


    /**
     * Initialize the Module.
     * 
     * @param  {Object} options An object with references to Protractor's "browser.params" and "browser.driver".
     * @return {void}
     * @public
     */
    this.initialize = function (options) {
        // Extract the expected options:
        browserParams_ = options.browserParams || undefined;
        browserDriver_ = options.browserDriver;

        // Generate the configuration settings:
        var config = loadConfigurationSettings(browserParams_);
        
        // Attach the utility methods to "browser.driver":
        registerBrowserDriverUtilities(browserDriver_, config);
    };


    /**
     * Load configuration settings for the Web Tester.
     *
     * @param  {Object} browserParams A reference to Protractor's "browser.params".
     * @return {Object} The configuration settings for the Web Tester.
     * @public
     */
    this.loadConfigurationSettings = function (browserParams) {
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
    this.registerBrowserDriverUtilities = function (browserDriver, config) {
        registerGoogleAnalyticsEventDataInterceptor(browserDriver, config);
        registerGoogleAnalyticsEventDataInterceptorCleanup(browserDriver, config);
    };


    /**
     * Register the Google Analytics Event Data Interceptors to Protractor's "browser.driver".
     * 
     * @param  {Object} browserDriver A reference to Protractor's "browser.driver".
     * @param  {Object} config        The configuration settings.
     * @return {void}
     * @public
     */
    this.registerGoogleAnalyticsEventDataInterceptor = function (browserDriver, config) {
        if (typeof browserDriver.registerGoogleAnalyticsEventDataInterceptor === 'undefined') {
            browserDriver.registerGoogleAnalyticsEventDataInterceptor = function () {
                // Execute the Inteceptor setup in the browser:
                browserDriver.executeScript(_installDataInterceptor, config);
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
    this.registerGoogleAnalyticsEventDataInterceptorCleanup = function (browserDriver, config) {
        // Unregister the Google Analytics Event Data Interceptors:
        if (typeof browserDriver.unregisterGoogleAnalyticsEventDataInterceptor === 'undefined') {
            browserDriver.unregisterGoogleAnalyticsEventDataInterceptor = function () {
                // Execute the Interceptor cleanup function:
                browserDriver.executeScript(_uninstallDataInterceptor);
            };
        }
    };

    
    /**
     * Install the Data Interceptor function, to be executed in the browser.
     *
     * @param  {Object} config The configuration settings.
     * @return {void}
     * @private
     */
    var _installDataInterceptor = function (config) {
        /*
        // @TODO: Read from config arguments:
        var disableAllLinks = true;
        if (disableAllLinks) {
            //var links = document.getElementsByTagName('a');
            //for (var i = 0, nbLinks = links.length; i < nbLinks; i++) {
            //    //links[i].onClick = function (e) {
            //    //    e.preventDefault();
            //    //    return false;
            //    //};
            //    links[i].href = 'javascript:return false;';
            //}
                       
            document.addEventListener("click", handler, true);
            function handler (e) {
                //e.stopPropagation();
                e.preventDefault();
                //return false;
            }
        }
        */
        window.submitToGA = false;
        if (config && config.submitToGA) {
            window.submitToGA = config.submitToGA;
        }

        if (window && !window.gaEventDataBuffer && !window.gaLastEventData) {
            // Setup the data accumulators:
            if (typeof window.ga !== 'undefined') {
                window.gaOriginal = ga;
            }
            window.gaEventDataBuffer = [];
            window.gaLastEventData = {};

            // Temporarily override the original "ga()" function, in order to intercept its arguments:
            window.ga = function () {
                window.gaEventDataBuffer.push(arguments);
                window.gaLastEventData = arguments;

                if (window.submitToGA && window.gaOriginal) {
                    // Call the original "ga()" function with the supplied arguments:
                    window.gaOriginal.apply(null, arguments);
                }
            };
        }
    };


    /**
     * Uninstall the Data Interceptor function, to be executed in the browser.
     * 
     * @return {void}
     * @private
     */
    var _uninstallDataInterceptor = function () {
        // Clear/Restore the "ga()" Interceptor/Proxy:
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
    };


    /**
     * Returns "true" if the options given to "initialize()" indicate that Google Tag Manager is used.
     * 
     * @return {boolean} "true" if the options given to "initialize()" indicate that Google Tag Manager is used.
     * @public
     */
    this.usesGTM = function () {
        return browserParams_.usesGTMCalls;
    };


    /**
     * Returns "true" if the options given to "initialize()" indicate that "ga()" is used directly.
     * 
     * @return {boolean} "true" if the options given to "initialize()" indicate that "ga()" is used directly.
     * @public
     */
    this.usesGA = function () {
        return browserParams_.usesGACalls;
    };


    return this;
})();


/**
 * Exports the Google Analytics Web Tester API.
 */
(typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    ? module.exports = GoogleAnalyticsWebTester
    : this.GoogleAnalyticsWebTester = GoogleAnalyticsWebTester;
