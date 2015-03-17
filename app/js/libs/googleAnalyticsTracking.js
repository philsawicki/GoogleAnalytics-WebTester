/**!
 * @file Wiring up of Analytics Tracking to the website component (using jQuery).
 * @author Philippe Sawicki <http://github.com/philsawicki> 
 * @copyright Philippe Sawicki 2015
 * @license MIT
 */


(function ($, window, undefined) {
    'use strict';


    /**
     * Track clicks on the "Jumbotron" CTA.
     * @return {void}
     */
    var _trackJumbotronCTA = function () {
        var jumbotronCTA = $('#jumbotronCTA');
        if (jumbotronCTA.length > 0) {
            jumbotronCTA.on('click', function (event) {
                ga('send', 'event', 'Button', 'Click', 'Jumbotron CTA');
            });
        }
    };

    /**
     * Track clicks on "Heading" CTAs.
     * @return {void}
     */
    var _trackHeadingCTA = function () {
        var headingCTA = $('.heading-cta');
        if (headingCTA.length > 0) {
            headingCTA.on('click', function (event) {
                // Get the index of the clicked CTA button:
                var button = $(this);
                var buttonIndex = button.closest('.col-md-4').index() + 1;
                ga('set', 'metric1', buttonIndex.toString());
                
                // Send "click" Event:
                ga('send', 'event', 'Button', 'Click', 'Heading CTA');
            });
        }
    };


    /**
     * Register all tracking functions.
     * @return {void}
     */
    var bootstrap = function () {
        var trackingCallbacks = [
            _trackJumbotronCTA,
            _trackHeadingCTA
       ];

        for (var i = 0, nbCallbacks = trackingCallbacks.length; i < nbCallbacks; i++) {
            try {
                trackingCallbacks[i]();
            } catch (ex) {
                if (console && console.error) {
                    console.error(ex.message, ex);
                }
            }
        }
    };


    /**
     * Kickstart the tracking of on-page elements.
     */
    $(document).ready(function () {
        // Only execute the bootstraping code if "window.ga(...)" is defined (i.e. if "analytics.js" is loaded):
        if (typeof window !== 'undefined' && typeof window.ga !== 'undefined') {
            bootstrap();
        }
    });
})(jQuery, window);
