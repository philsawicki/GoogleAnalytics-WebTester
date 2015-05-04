/**!
 * @file Wiring up of Analytics Tracking to the website component (using jQuery).
 * @author Philippe Sawicki (https://github.com/philsawicki)
 * @copyright Copyright Philippe Sawicki 2015
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
     * Track clicks on the "Archive" links of the Blog page.
     * @return {void}
     */
    var _trackBlogArchives = function () {
        // The tracking is actually done through Google Tag Manager.
        // [...]
    };

    /**
     * Track the "Add To Cart" button clicks.
     * @return {void}
     */
    var _trackAddToCartClicks = function () {
        var addToCartButton = $('.js-ga-add-to-cart');
        if (addToCartButton.length > 0) {
            addToCartButton.on('click', function (event) {
                var button = $(this);
                var product = button.data('product');

                // To keep this simple, the product data is serialized as a JSON "data-" attribute:
                if (product) {
                    ga('ec:addProduct', product);

                    ga('ec:setAction', 'add');
                    ga('send', 'event', 'Enhanced E-Commerce', 'Click', 'Add to Cart'); // Send data using an Event.
                }
            });
        }
    };

    /**
     * Track whether or not Analytics tracking is disabled on the client-side.
     * @return {void}
     */
    var _trackAnalyticsLoaded = function () {
        setTimeout(_sendAnalyticsLoadedData, 5*1000);
    };

    /**
     * Sends a Custom Dimension recording whether or not Analytics tracking is disabled 
     * on the client-side.
     * @return {void}
     */
    var _sendAnalyticsLoadedData = function () {
        if (typeof window.ga !== 'undefined' && typeof window.ga.q === 'undefined') {
            // Set "Tracking Enabled" Dimension:
            ga('set', 'dimension2', 'true');
        } else {
            var versionID = '1';
            var trackingID = 'UA-58402941-1';
            var clientID = _getClientID();
            var dataSource = 'web';
            var hitType = 'event';

            var userAgent = navigator.userAgent;

            var documentLocationURL = document.location.origin + document.location.pathname + document.location.search;
            var documentTitle = document.title;

            var eventCategory = 'Client Tracking';
            var eventAction = 'Autodetect';
            var eventLabel = 'Tracking Blocked';

            //var customDimensionIndex = 'cd2';
            var customDimensionValue = 'false';

            var nonInteraction = '1';
            var cacheBuster = _getCacheBuster();

            var debug = false;

            $.ajax({
                url: 'https://www.google-analytics.com/' + (debug ? 'debug/' : '') + 'collect',
                method: 'POST',
                data: {
                    'v': versionID,
                    'tid': trackingID,
                    'cid': clientID,
                    'ds': dataSource,
                    't': hitType,
                    'ua': userAgent,
                    'dl': documentLocationURL,
                    'dt': documentTitle,
                    'ec': eventCategory,
                    'ea': eventAction,
                    'el': eventLabel,
                    'cd2': customDimensionValue, // Set "Tracking Enabled" Dimension:
                    'ni': nonInteraction,
                    'z': cacheBuster
                },
                success: function (data) {
                    //console.log('SUCCESS', data);
                },
                error: function (jqXHR, textStatus, errorThrown ) {
                    //console.log('ERROR', jqXHR, textStatus, errorThrown );
                }
            });
        }
    };

    /**
     * Returns a UUID for the Device.
     * 
     * This anonymously identifies a particular user, device, or browser instance. For the web, 
     * this is generally stored as a first-party cookie with a two-year expiration. The value of 
     * this field should be a random UUID (version 4) as described in 
     * http://www.ietf.org/rfc/rfc4122.txt
     * 
     * @return {String} A UUID for the Device.
     * @private
     */
    var _getClientID = function () {
        var UUID = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);

            return v.toString(16);
        });
        return UUID;
    };

    /**
     * Returns a cache-busting parameter (i.e. a Timestamp).
     * @return {String} A cache-busting parameter (i.e. a Timestamp).
     * @private
     */
    var _getCacheBuster = function () {
        var timestamp = (new Date()).getTime();
        return timestamp.toString();
    };


    /**
     * Register all tracking functions.
     * @return {void}
     */
    var bootstrap = function () {
        var trackingCallbacks = [
            _trackJumbotronCTA,
            _trackHeadingCTA,
            _trackBlogArchives,
            _trackAddToCartClicks,
            _trackAnalyticsLoaded
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
