'use strict';

(function ($, window, undefined) {
	/**
	 * Track clicks on the "Jumbotron" CTA.
	 * @return {void}
	 */
	var trackJumbotronCTA = function () {
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
	 *
	 * @todo Find a workaround to delay the loading of this function until the Angular template has loaded.
	 */
	var trackHeadingCTA = function () {
		//var headingCTA = $('.heading-cta');
		//if (headingCTA.length > 0) {
			$('body').on('click', '.heading-cta', function (event) {
				ga('send', 'event', 'Button', 'Click', 'Heading CTA');
			});
		//}
	};


	/**
	 * Register all tracking functions.
	 * @return {void}
	 */
	var bootstrap = function () {
		var trackingCallbacks = [
			trackJumbotronCTA,
			trackHeadingCTA
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
