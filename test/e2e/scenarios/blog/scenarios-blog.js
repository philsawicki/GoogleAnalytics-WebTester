/**!
 * @file Base E2E test scenarios for the Blog page of the Application Demo.
 * @author Philippe Sawicki <http://github.com/philsawicki> 
 * @copyright Philippe Sawicki 2015
 * @license MIT
 */

'use strict';


if (typeof jasmine.GoogleAnalyticsWebTester === 'undefined') {
    jasmine.GoogleAnalyticsWebTester = {
        getGTMTrackerName: function (EventBuffer) {
            if (EventBuffer.length > 0) {
                var createEvent = EventBuffer[0];
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

        it('should redirect to "/" when location hash/fragment is empty', function () {
            expect( browser.getLocationAbsUrl() ).toContain( '/blog.html' );
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
            it('should return the GTM Tracker Name when a GA Event is fired', function (done) {
                // Click on the first "Archive" link of the Blog:
                element.all( by.css('.js-ga-blog-archive-link') ).get(0).click();
                
                // Get the "EventBuffer" object back from the browser:
                browser.driver.executeScript(function () {
                    return window.GAWebTester.getEventBuffer();
                })
                .then(
                    // Validate the content of the "EventBuffer" object:
                    function successCallback (EventBuffer) {
                        var gtmTrackerName = jasmine.GoogleAnalyticsWebTester.getGTMTrackerName(EventBuffer);

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
        
        describe('The "EventBuffer" method', function () {
            it('should contain the list of all Event Data fired', function (done) {
                // Click on the first "Archive" link of the Blog:
                element.all( by.css('.js-ga-blog-archive-link') ).get(0).click();
                
                // Get the "EventBuffer" object back from the browser:
                browser.driver.executeScript(function () {
                    return window.GAWebTester.getEventBuffer();
                })
                .then(
                    // Validate the content of the "EventBuffer" object:
                    function successCallback (EventBuffer) {
                        var gtmTrackerName = jasmine.GoogleAnalyticsWebTester.getGTMTrackerName(EventBuffer);

                        expect( gtmTrackerName ).toBeDefined();
                        expect( EventBuffer ).toContain([gtmTrackerName + '.send', {
                            'hitType': 'event',
                            'eventCategory': 'Blog Archive',
                            'eventAction': 'Click',
                            'eventLabel': 'March 2014',
                            'eventValue': null
                        }]);
                    },
                    // If there was an error getting back the "EventsBuffer" object from the browser, fail the test:
                    function errorCallback (error) {
                        fail('Should not have received Error: ' + JSON.stringify(error));
                    }
                )
                .then(done);
            });
        });
        
        describe('The "LastEvent" method', function () {
            it('should contain the last Event Data fired', function (done) {
                // Click on the first "Archive" link of the Blog:
                element.all( by.css('.js-ga-blog-archive-link') ).get(0).click();
                
                // Get the "LastEvent" object back from the browser:
                browser.driver.executeScript(function () {
                    return window.GAWebTester.getLastEvent();
                })
                .then(
                    // Validate the content of the "LastEvent" object:
                    function successCallback (LastEvent) {
                        expect( LastEvent ).toBeDefined();
                        expect( LastEvent ).not.toBeNull();

                        expect( LastEvent[1] ).toBeDefined();
                        expect( LastEvent[1] ).not.toBeNull();

                        expect( LastEvent[1] ).not.toEqual({
                            'hitType': 'event',
                            'eventCategory': 'Button',
                            'eventAction': 'Click',
                            'eventLabel': 'Jumbotron CTA',
                            'eventValue': null
                        });
                        expect( LastEvent[1] ).toEqual({
                            'hitType': 'event',
                            'eventCategory': 'Blog Archive',
                            'eventAction': 'Click',
                            'eventLabel': 'March 2014',
                            'eventValue': null
                        });
                        expect( LastEvent[1] ).not.toEqual({
                            'hitType': 'event',
                            'eventCategory': 'Button',
                            'eventAction': 'Click',
                            'eventLabel': 'Non-existing Label',
                            'eventValue': null
                        });
                    },
                    // If there was an error getting back the "LastEvent" object from the browser, fail the test:
                    function errorCallback (error) {
                        fail('Should not have received Error: ' + JSON.stringify(error));
                    }
                )
                .then(done);
            });
        });
        
        it('should properly catch a failure to receive the data buffer', function (done) {
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
                    expect( error.message ).toContain('nonExistingObject is not defined');
                }
            )
            .then(done);
        });
    });


    describe('The clicks on the Archive page links', function () {
        beforeEach(function () {
            // Load the page to test:
            browser.get('blog.html');
            
            // Register the Google Analytics Event Data Interceptor:
            browser.driver.registerGoogleAnalyticsEventDataInterceptor();
        });

        it('should fire a Google Analytics Event', function (done) {
            // Click on the first "Archive" link of the Blog:
            element.all( by.css('.js-ga-blog-archive-link') ).get(0).click();

            // Get the "LastEvent" object back from the browser:
            browser.driver.executeScript(function () {
                return window.GAWebTester.getLastEvent();
            })
            .then(
                // Validate the content of the "LastEvent" object:
                function successCallback (LastEvent) {
                    expect( LastEvent ).toBeDefined();
                    expect( LastEvent ).not.toBeNull();

                    expect( LastEvent[1] ).toBeDefined();
                    expect( LastEvent[1] ).not.toBeNull();

                    expect( LastEvent[1] ).toEqual({
                        'hitType': 'event',
                        'eventCategory': 'Blog Archive',
                        'eventAction': 'Click',
                        'eventLabel': 'March 2014',
                        'eventValue': null
                    });
                    //expect( LastEvent ).toContain(['set', 'metric1', '1']);
                },
                // If there was an error getting back the "LastEvent" object from the browser, fail the test:
                function errorCallback (error) {
                    fail('Should not have received Error: ' + JSON.stringify(error));
                }
            )
            .then(done);
        });
    });

    
    describe('The Sticky Menu', function () {
        beforeEach(function () {
            // Load the page to test:
            browser.get('blog.html');
        });

        describe('The link to the Homepage', function () {
            it('redirects the browser to the "/index.html" page', function () {
                // Click on the Nav Bar "Homepage" link:
                element( by.css('#homepage-nav-link') ).click();

                expect( browser.getLocationAbsUrl() ).toContain( '/index.html' );
            });
        });
    });
});
