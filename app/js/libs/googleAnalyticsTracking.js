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
     * Register all tracking functions.
     * @return {void}
     */
    var bootstrap = function () {
        var trackingCallbacks = [
            _trackJumbotronCTA,
            _trackHeadingCTA,
            _trackBlogArchives,
            _trackAddToCartClicks
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
