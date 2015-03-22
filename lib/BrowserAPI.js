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


        // Setup the data Interceptor API:
        window.GAWebTester = {
            SubmitToGA: submitToGA,
            EventBuffer:[],
            LastEvent: {},
            OriginalGA: undefined,

            gaCallback: function () {
                window.GAWebTester.EventBuffer.push(arguments);
                window.GAWebTester.LastEvent = arguments;
            
                // Call the original "ga()" function with the supplied arguments:
                if (window.GAWebTester.SubmitToGA && window.GAWebTester.OriginalGA) {
                    window.GAWebTester.OriginalGA.apply(null, arguments);
                }
            },
            getEventBuffer: function () {
                return window.GAWebTester.EventBuffer;
            },
            getLastEvent: function () {
                return window.GAWebTester.LastEvent;
            },
            getData: function () {
                var data = {
                    EventBuffer: window.GAWebTester.getEventBuffer(),
                    LastEvent: window.GAWebTester.getLastEvent(),
                    GTMTrackerName: window.GAWebTester.getGTMTrackerName()
                };
                return data;
            },
            getGTMTrackerName: function () {
                if (window.GAWebTester.EventBuffer.length > 0) {
                    var createEvent = window.GAWebTester.EventBuffer[0];
                    if (typeof createEvent !== 'undefined' && createEvent[0] === 'create') {
                        var trackerName = createEvent[2].name;
                        return trackerName;
                    }
                }
                return null;
            }
        };

        // Install the data Interceptor:
        if (typeof window.ga !== 'undefined') {
            window.GAWebTester.OriginalGA = window.ga;
        }
        window.ga = window.GAWebTester.gaCallback;
    };


    /**
     * Uninstall the Data Interceptor function, to be executed in the browser.
     * 
     * @return {void}
     * @private
     */
    exports.uninstallDataInterceptor = function () {
        // Uninstall the data Interceptor:
        if (window.GAWebTester) {
            // Clear/Restore the "ga()" Interceptor:
            if (window.GAWebTester.OriginalGA) {
                window.ga = window.GAWebTester.OriginalGA;
            }
            window.GAWebTester = undefined;
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
