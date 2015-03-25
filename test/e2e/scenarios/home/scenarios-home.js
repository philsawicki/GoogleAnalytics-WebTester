/**!
 * @file Base E2E test scenarios for the Home page of the Application Demo.
 * @author Philippe Sawicki <http://github.com/philsawicki> 
 * @copyright Philippe Sawicki 2015
 * @license MIT
 */

'use strict';


describe('Demo application for the Home page of the Google Analytics WebTester', function () {
    describe('The AngularJS Demo Application setup', function () {
		beforeEach(function () {
			browser.get('index.html');
		});

		it('should automatically redirect to "/" when location hash/fragment is empty', function () {
			expect( browser.getLocationAbsUrl() ).toMatch( '/' );
		});

		it('should redirect to the Blog when clicking on the Jumbotron CTA', function () {
			// Click on the "Jumbotron" CTA:
			element( by.css('#jumbotronCTA') ).click();

			expect( browser.getLocationAbsUrl() ).toMatch( '/blog.html' );
		});

		it('should redirect to the Blog Archive when clicking on a Heading CTA', function () {
			// Click on the first "Heading" CTA:
			element.all( by.css('.heading-cta') ).get(0).click();

			expect( browser.getLocationAbsUrl() ).toContain( '/blog.html?archive=2014-12' );
		});
	});

	
    describe('Library deployment', function () {
		describe('Behavior of the page without "Google Analytics Event Data Interceptor"', function () {
			beforeEach(function () {
				browser.get('index.html#/');
			});

			it('should have "window.ga()" defined', function (done) {
				browser.driver.executeScript(function () {
					return window.ga;
				})
				.then(function successCallback (ga) {
					expect( ga ).toBeDefined();
					expect( ga ).not.toBeNull();
				})
				.then(null, function errorCallback (error) {
					fail('Error: ' + JSON.stringify(error));
				})
				.then(done);
			});

			it('should not have a global "GAWebTester" object', function (done) {
				browser.driver.executeScript(function () {
					return window.GAWebTester;
				})
				.then(function successCallback (GAWebTester) {
					expect( GAWebTester ).toBeNull();
				})
				.then(null, function errorCallback (error) {
					fail('Error: ' + JSON.stringify(error));
				})
				.then(done);
			});
		});
		
		
		describe('Registration of the "Google Analytics Event Data Interceptor"', function () {
			beforeEach(function () {
				browser.get('index.html#/');
				
				// Register the Google Analytics Event Data Interceptor:
				browser.driver.registerGoogleAnalyticsEventDataInterceptor();
			});

			it('should have "window.ga()" defined', function (done) {
				browser.driver.executeScript(function () {
					return window.ga;
				})
				.then(function successCallback (ga) {
					expect( ga ).toBeDefined();
					expect( ga ).not.toBeNull();
				})
				.then(null, function errorCallback (error) {
					fail('Error: ' + JSON.stringify(error));
				})
				.then(done);
			});
			
			it('should have "window.GAWebTester.getEventBuffer()" defined', function (done) {
				browser.driver.executeScript(function () {
					return window.GAWebTester.getEventBuffer();
				})
				.then(function successCallback (EventBuffer) {
					expect( EventBuffer ).toBeDefined();
					expect( EventBuffer ).not.toBeNull();
					expect( EventBuffer ).toEqual( [] );
				})
				.then(null, function errorCallback (error) {
					fail('Error: ' + JSON.stringify(error));
				})
				.then(done);
			});
			
			it('should have "window.GAWebTester.getLastEvent()" defined', function (done) {
				browser.driver.executeScript(function () {
					return window.GAWebTester.getLastEvent();
				})
				.then(function successCallback (LastEvent) {
					expect( LastEvent ).toBeDefined();
					expect( LastEvent ).not.toBeNull();
					expect( LastEvent ).toEqual( {} );
				})
				.then(null, function errorCallback (error) {
					fail('Error: ' + JSON.stringify(error));
				})
				.then(done);
			});
		});
		
		
		describe('Deregistration of the "Google Analytics Event Data Interceptor"', function () {
			beforeEach(function () {
				browser.get('index.html#/');
				
				// Register the Google Analytics Event Data Interceptor:
				browser.driver.registerGoogleAnalyticsEventDataInterceptor();
				
				// Unregister the Google Analytics Event Data Interceptor:
				browser.driver.unregisterGoogleAnalyticsEventDataInterceptor();
			});

			it('should have "window.ga()" defined', function (done) {
				browser.driver.executeScript(function () {
					return window.ga;
				})
				.then(function successCallback (ga) {
					expect( ga ).toBeDefined();
					expect( ga ).not.toBeNull();
				})
				.then(null, function errorCallback (error) {
					fail('Error: ' + JSON.stringify(error));
				})
				.then(done);
			});
			
			it('should have "window.GAWebTester" be null', function (done) {
				browser.driver.executeScript(function () {
					return window.GAWebTester;
				})
				.then(function successCallback (GAWebTester) {
					expect( GAWebTester ).toBeNull();
				})
				.then(null, function errorCallback (error) {
					fail('Error: ' + JSON.stringify(error));
				})
				.then(done);
			});
		});
    });
	
	
	describe('The "GAWebTester.EventBuffer" object', function () {
		beforeEach(function () {
			// Register the Google Analytics Event Data Interceptor:
			browser.driver.registerGoogleAnalyticsEventDataInterceptor();
		});
		
		it('should be exposed globally', function (done) {
			// Get the "EventBuffer" object back from the browser:
			browser.driver.executeScript(function () {
				return window.GAWebTester.EventBuffer;
			})
			.then(
				// Validate the content of the "EventBuffer" object:
                function successCallback (EventBuffer) {
					expect( EventBuffer ).toBeDefined();
					expect( EventBuffer ).not.toBeNull();
                },
				// There was an error getting back the "EventBuffer" object from the browser, fail the test:
                function errorCallback (error) {
					fail('Should not have received Error: ' + JSON.stringify(error));
                }
            )
			.then(done);
		});
	});
	
	
	describe('The wiring up of the Google Analytics Event Data interceptor', function () {
		beforeEach(function () {
			// Load the page to test:
            browser.get('index.html#/');
			
			// Register the Google Analytics Event Data Interceptor:
			browser.driver.registerGoogleAnalyticsEventDataInterceptor();

			browser.driver.disableClicks();
        });
		
		describe('The "EventBuffer" object', function () {
			it('should contain the list of all Event Data fired', function (done) {
				// Click on the "Jumbotron" CTA:
				element( by.css('#jumbotronCTA') ).click();
				
				// Click on the first "Heading" CTA:
				element.all( by.css('.heading-cta') ).get(0).click();
				
				// Get the "EventBuffer" object back from the browser:
				browser.driver.executeScript(function () {
					return window.GAWebTester.EventBuffer;
				})
				.then(
					// Validate the content of the "EventBuffer" object:
					function successCallback (EventBuffer) {
						expect( EventBuffer ).toContain( ['send', 'event', 'Button', 'Click', 'Jumbotron CTA'] );
						expect( EventBuffer ).toContain( ['send', 'event', 'Button', 'Click', 'Heading CTA'] );
						expect( EventBuffer ).not.toContain( ['send', 'event', 'Button', 'Click', 'Non-existing Label'] );
					},
					// If there was an error getting back the "EventBuffer" object from the browser, fail the test:
					function errorCallback (error) {
						fail('Should not have received Error: ' + JSON.stringify(error));
					}
				)
				.then(done);
			});
		});
		
		describe('The "getLastEvent()" method', function () {
			it('should contain the last Event Data fired', function (done) {
				// Click on the "Jumbotron" CTA:
				element( by.css('#jumbotronCTA') ).click();
				
				// Click on the first "Heading" CTA:
				element.all( by.css('.heading-cta') ).get(0).click();
				
				// Get the "LastEvent" object back from the browser:
				browser.driver.executeScript(function () {
					return window.GAWebTester.getLastEvent();
				})
				.then(
					// Validate the content of the "LastEvent" object:
					function successCallback (LastEvent) {
						expect( LastEvent ).not.toEqual( ['send', 'event', 'Button', 'Click', 'Jumbotron CTA'] );
						expect( LastEvent ).toEqual( ['send', 'event', 'Button', 'Click', 'Heading CTA'] );
						expect( LastEvent ).not.toEqual( ['send', 'event', 'Button', 'Click', 'Non-existing Label'] );
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
					expect( error.message ).toContain( 'nonExistingObject is not defined' );
                }
            )
			.then(done);
		});
	});
	
	
    describe('Google Analytics "click" tracking', function () {
		it('should fire an Event when clicking on the Jumbotron CTA (expanded form)', function (done) {
			// Click on the "Jumbotron" CTA:
			element( by.css('#jumbotronCTA') ).click();
				
			// Get the "LastEvent" object back from the browser:
			browser.driver.executeScript(function () {
				return window.GAWebTester.getLastEvent();
			})
			.then(
				// Validate the content of the "LastEvent" object:
				function successCallback (LastEvent) {
					expect( LastEvent ).toEqual( ['send', 'event', 'Button', 'Click', 'Jumbotron CTA'] );
				},
				// If there was an error getting back the "LastEvent" object from the browser, fail the test:
				function errorCallback (error) {
					fail('Should not have received Error: ' + JSON.stringify(error));
				}
			)
			.then(done);
		});
		
		it('should fire an Event when clicking on the Jumbotron CTA (condensed-form)', function (done) {
			// Click on the "Jumbotron" CTA:
			element( by.css('#jumbotronCTA') ).click();
				
			// Get the "LastEvent" object back from the browser and validate its data:
			browser.driver.executeScript(function () { return window.GAWebTester.getLastEvent(); })
			.then(function (LastEvent) {
				expect( LastEvent ).toEqual( ['send', 'event', 'Button', 'Click', 'Jumbotron CTA'] );
				done();
			});
		});
		
		it('should fire an Event when clicking on the Heading CTA', function (done) {
			// Click on the first "Heading" CTA:
			element.all( by.css('.heading-cta') ).get(0).click();
				
			// Get the "EventBuffer" object back from the browser:
			browser.driver.executeScript(function () {
				return window.GAWebTester.EventBuffer;
			})
			.then(
				// Validate the content of the "EventBuffer" object:
				function successCallback (EventBuffer) {
					expect( EventBuffer ).toContain( ['send', 'event', 'Button', 'Click', 'Heading CTA'] );
				},
				// If there was an error getting back the "EventBuffer" object from the browser, fail the test:
				function errorCallback (error) {
					fail('Should not have received Error: ' + JSON.stringify(error));
				}
			)
			.then(done);
		});
		
		it('should fire a Metric when clicking on the Heading CTA', function (done) {
			// Click on the first "Heading" CTA:
			element.all( by.css('.heading-cta') ).get(0).click();
			
			// Get the "EventBuffer" object back from the browser:
			browser.driver.executeScript(function () {
				return window.GAWebTester.getEventBuffer();
			})
			.then(
				// Validate the content of the "EventBuffer" object:
				function successCallback (EventBuffer) {
					expect( EventBuffer ).toContain( ['set', 'metric1', '1'] );
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
