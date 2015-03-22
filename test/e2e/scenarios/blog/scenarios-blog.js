/**!
 * @file Base E2E test scenarios for the Blog page of the Application Demo.
 * @author Philippe Sawicki <http://github.com/philsawicki> 
 * @copyright Philippe Sawicki 2015
 * @license MIT
 */

'use strict';


if (typeof jasmine.GoogleAnalyticsWebTester === 'undefined') {
    jasmine.GoogleAnalyticsWebTester = {
        getGTMTrackerName: function (gaEventBuffer) {
            if (gaEventBuffer.length > 0) {
                var createEvent = gaEventBuffer[0];
                if (typeof createEvent !== 'undefined' && createEvent[0] === 'create') {
                    var trackerName = createEvent[2].name;
                    return trackerName;
                }
            }
            return null;
        }
    };
}


describe('Demo application for the Blog page of the Google Analytics WebTester', function () {
    describe('The Blog page setup', function () {
        beforeEach(function () {
            browser.get('blog.html');
        });

        it('should automatically redirect to "/" when location hash/fragment is empty', function () {
            expect(browser.getLocationAbsUrl()).toMatch('/');
        });
    });


    describe('The Jasmine Google Analytics Web Tester helpers', function () {
        beforeEach(function () {
            // Load the page to test:
            browser.get('blog.html');
            
            // Register the Google Analytics Event Data Interceptor:
            browser.driver.registerGoogleAnalyticsEventDataInterceptor();
        });

        describe('The "jasmine.GoogleAnalyticsWebTester.getGTMTrackerName" method', function () {
            it('should return the GTM tracker name when a Google Analytics Event is fired', function (done) {
                // Click on the first "Archive" link of the Blog:
                element.all( by.css('.js-ga-blog-archive-link') ).get(0).click();
                
                // Get the "EventBuffer" object back from the browser:
                browser.driver.executeScript(function () {
                    return window.GAWebTester.getEventBuffer();
                })
                .then(
                    // Validate the content of the "EventBuffer" object:
                    function successCallback (gaEventDataBuffer) {
                        var gtmTrackerName = jasmine.GoogleAnalyticsWebTester.getGTMTrackerName(gaEventDataBuffer);

                        expect( gtmTrackerName ).toBeDefined();
                        expect( gtmTrackerName ).not.toBeNull();
                        expect( gtmTrackerName ).toContain( 'gtm' );
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


    describe('The wiring up of the Google Analytics Event Data interceptor', function () {
        beforeEach(function () {
            // Load the page to test:
            browser.get('blog.html');
            
            // Register the Google Analytics Event Data Interceptor:
            browser.driver.registerGoogleAnalyticsEventDataInterceptor();
        });
        
        describe('The "gaEventDataBuffer" object', function () {
            it('should contain the list of all Event Data fired', function (done) {
                // Click on the first "Archive" link of the Blog:
                element.all( by.css('.js-ga-blog-archive-link') ).get(0).click();
                
                // Get the "EventBuffer" object back from the browser:
                browser.driver.executeScript(function () {
                    return window.GAWebTester.getEventBuffer();
                })
                .then(
                    // Validate the content of the "gaEventDataBuffer" object:
                    function successCallback (gaEventDataBuffer) {
                        var gtmTrackerName = jasmine.GoogleAnalyticsWebTester.getGTMTrackerName(gaEventDataBuffer);

                        expect(gtmTrackerName).toBeDefined();
                        expect(gaEventDataBuffer).toContain([gtmTrackerName + '.send', {
                            'hitType': 'event',
                            'eventCategory': 'Blog Archive',
                            'eventAction': 'Click',
                            'eventLabel': 'March 2014',
                            'eventValue': null
                        }]);
                    },
                    // If there was an error getting back the "gaEventDataBuffer" object from the browser, fail the test:
                    function errorCallback (error) {
                        fail('Should not have received Error: ' + JSON.stringify(error));
                    }
                )
                .then(done);
            });
        });
        
        xdescribe('The "gaLastEvendData" object', function () {
            it('should contain the last Event Data fired', function (done) {
                // Click on the "Jumbotron" CTA:
                element( by.css('#jumbotronCTA') ).click();
                
                // Click on the first "Heading" CTA:
                element.all( by.css('.heading-cta') ).get(0).click();
                
                // Get the "gaLastEventData" object back from the browser:
                browser.driver.executeScript(function () {
                    return window.gaLastEventData;
                })
                .then(
                    // Validate the content of the "gaLastEventData" object:
                    function successCallback (gaLastEventData) {
                        expect(gaLastEventData).not.toEqual(['send', 'event', 'Button', 'Click', 'Jumbotron CTA']);
                        expect(gaLastEventData).toEqual(['send', 'event', 'Button', 'Click', 'Heading CTA']);
                        expect(gaLastEventData).not.toEqual(['send', 'event', 'Button', 'Click', 'Non-existing Label']);
                    },
                    // If there was an error getting back the "gaLastEventData" object from the browser, fail the test:
                    function errorCallback (error) {
                        fail('Should not have received Error: ' + JSON.stringify(error));
                    }
                )
                .then(done);
            });
        });
        
        xit('should properly catch a failure to receive the data buffer', function (done) {
            // Try to get an undefined object from the browser:
            browser.driver.executeScript(function () {
                return nonExistingObject.nonExistingProperty;
            })
            .then(
                // The "success" callback should not be called, as the requested object is not defined and should throw an Error:
                function successCallback (nonExistingObject) {
                    fail('Test should have failed, but received: ' + JSON.stringify(nonExistingObject));
                },
                // The "error" callback should be called, as requesting an undefined object should throw an Error:
                function errorCallback (error) {
                    expect(error.message).toContain('nonExistingObject is not defined');
                }
            )
            .then(done);
        });
    });


    xdescribe('The clicks on the Archive page links', function () {
        beforeEach(function () {
            browser.get('blog.html');
        });

        it('should fire a Google Analytics Event', function (done) {
            // Click on the first "Heading" CTA:
            element.all( by.css('.heading-cta') ).get(0).click();

            // Get the "gaEventDataBuffer" object back from the browser:
            browser.driver.executeScript(function () {
                return window.gaEventDataBuffer;
            })
            .then(
                // Validate the content of the "gaEventDataBuffer" object:
                function successCallback (gaEventDataBuffer) {
                    expect(gaEventDataBuffer).toContain(['set', 'metric1', '1']);
                },
                // If there was an error getting back the "gaEventDataBuffer" object from the browser, fail the test:
                function errorCallback (error) {
                    fail('Should not have received Error: ' + JSON.stringify(error));
                }
            )
            .then(done);
        });
    });
});
