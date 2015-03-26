/**!
 * @file Base E2E test scenarios for the "Add to Cart" page of the Application Demo.
 * @author Philippe Sawicki <http://github.com/philsawicki>
 * @copyright Philippe Sawicki 2015
 * @license MIT
 */

'use strict';


describe('Demo application for the "Add to Cart" page of the Google Analytics WebTester', function () {
    describe('The Checkout page setup', function () {
        beforeEach(function () {
            // Load the page to test:
            browser.get('addToCart.html');
        });

        xit('should redirect to "/addToCart" when location hash/fragment is empty', function () {
            expect( browser.getLocationAbsUrl() ).toContain( '/addToCart.html' );
        });
    });


    describe('The Enhanced E-Commerce Tracking of the "Add to Cart" button', function () {
        beforeEach(function () {
            // Load the page to test:
            browser.get('addToCart.html');

            // Register the Google Analytics Event Data Interceptor:
            browser.driver.registerGoogleAnalyticsEventDataInterceptor();

            // Click on the "Add to Cart" CTA:
            element.all( by.css('.js-ga-add-to-cart') ).get(0).click();
        });

        it('should fire a "ec:addProduct" Event', function (done) {
            // Get the "EventBuffer" object back from the browser:
            browser.driver.executeScript(function () {
                return window.GAWebTester.getEventBuffer();
            })
            .then(
                // Validate the content of the "EventBuffer" object:
                function successCallback (EventBuffer) {
                    expect( EventBuffer ).toBeDefined();
                    expect( EventBuffer ).not.toBeNull();
                    expect( EventBuffer ).toContain( ['ec:addProduct', {
                        'id': 'P12345',
                        'name': 'Android Warhol T-Shirt',
                        'category': 'Apparel',
                        'brand': 'Google',
                        'variant': 'black',
                        'price': '29.20',
                        'quantity': 1
                    }] );
                },
                // If there was an error getting back the "EventBuffer" object from the browser, fail the test:
                function errorCallback (error) {
                    fail('Should not have received Error: ' + JSON.stringify(error));
                }
            )
            .then(done);
        });

        it('should fire a "ec:setAction" Event', function (done) {
            // Get the "EventBuffer" object back from the browser:
            browser.driver.executeScript(function () {
                return window.GAWebTester.getEventBuffer();
            })
            .then(
                // Validate the content of the "EventBuffer" object:
                function successCallback (EventBuffer) {
                    expect( EventBuffer ).toBeDefined();
                    expect( EventBuffer ).not.toBeNull();
                    expect( EventBuffer ).toContain( ['ec:setAction', 'add'] );
                },
                // If there was an error getting back the "EventBuffer" object from the browser, fail the test:
                function errorCallback (error) {
                    fail('Should not have received Error: ' + JSON.stringify(error));
                }
            )
            .then(done);
        });

        it('should fire an "Add to Cart" Event', function (done) {
            // Get the "EventBuffer" object back from the browser:
            browser.driver.executeScript(function () {
                return window.GAWebTester.getEventBuffer();
            })
            .then(
                // Validate the content of the "EventBuffer" object:
                function successCallback (EventBuffer) {
                    expect( EventBuffer ).toBeDefined();
                    expect( EventBuffer ).not.toBeNull();
                    expect( EventBuffer ).toContain( ['send', 'event', 'Enhanced E-Commerce', 'Click', 'Add to Cart'] );
                },
                // If there was an error getting back the "EventBuffer" object from the browser, fail the test:
                function errorCallback (error) {
                    fail('Should not have received Error: ' + JSON.stringify(error));
                }
            )
            .then(done);
        });
    });
});
