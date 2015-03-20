/**!
 * @file Google Analytics Web Tester Browser Module.
 * @author Philippe Sawicki <http://github.com/philsawicki> 
 * @copyright Philippe Sawicki 2015
 * @license MIT
 */


/**
 * Google Analytics Web Tester Browser Module.
 */
(function (exports) {
    
    /**
     * Install the Data Interceptor function, to be executed in the browser.
     *
     * @param  {Object} config The configuration settings.
     * @return {void}
     * @private
     */
    exports.installDataInterceptor = function (config) {
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
    exports.uninstallDataInterceptor = function () {
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
})(
    /**
     * Exports the Google Analytics Web Tester API.
     */
    (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
        ? module.exports
        : this.GoogleAnalyticsWebTesterBrowserAPI = {}
);
