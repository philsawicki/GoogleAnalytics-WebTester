/**!
 * @file Base E2E test scenarios for the Home page of the Application Demo.
 * @author Philippe Sawicki <http://github.com/philsawicki> 
 * @copyright Philippe Sawicki 2015
 * @license MIT
 */

'use strict';


describe('Demo application for the Home page of the Google Analytics WebTester', function () {
    describe('The AngularJS Demo Application setup', function () {
		browser.get('index.html');

		it('should automatically redirect to "/" when location hash/fragment is empty', function () {
			expect(browser.getLocationAbsUrl()).toMatch('/');
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
					expect(ga).toBeDefined();
					expect(ga).not.toBeNull();
				})
				.then(null, function errorCallback (error) {
					fail('Error: ' + JSON.stringify(error));
				})
				.then(done);
			});
			
			it('should have "window.gaEventDataBuffer" defined', function (done) {
				browser.driver.executeScript(function () {
					return window.gaEventDataBuffer;
				})
				.then(function successCallback (gaEventDataBuffer) {
					expect(gaEventDataBuffer).toBeNull();
				})
				.then(null, function errorCallback (error) {
					fail('Error: ' + JSON.stringify(error));
				})
				.then(done);
			});
			
			it('should have "window.gaLastEventData" defined', function (done) {
				browser.driver.executeScript(function () {
					return window.gaLastEventData;
				})
				.then(function successCallback (gaLastEventData) {
					expect(gaLastEventData).toBeNull();
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
					expect(ga).toBeDefined();
					expect(ga).not.toBeNull();
				})
				.then(null, function errorCallback (error) {
					fail('Error: ' + JSON.stringify(error));
				})
				.then(done);
			});
			
			it('should have "window.gaEventDataBuffer" defined', function (done) {
				browser.driver.executeScript(function () {
					return window.gaEventDataBuffer;
				})
				.then(function successCallback (gaEventDataBuffer) {
					expect(gaEventDataBuffer).toBeDefined();
					expect(gaEventDataBuffer).not.toBeNull();
					expect(gaEventDataBuffer).toEqual([]);
				})
				.then(null, function errorCallback (error) {
					fail('Error: ' + JSON.stringify(error));
				})
				.then(done);
			});
			
			it('should have "window.gaLastEventData" defined', function (done) {
				browser.driver.executeScript(function () {
					return window.gaLastEventData;
				})
				.then(function successCallback (gaLastEventData) {
					expect(gaLastEventData).toBeDefined();
					expect(gaLastEventData).not.toBeNull();
					expect(gaLastEventData).toEqual({});
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
					expect(ga).toBeDefined();
					expect(ga).not.toBeNull();
				})
				.then(null, function errorCallback (error) {
					fail('Error: ' + JSON.stringify(error));
				})
				.then(done);
			});
			
			it('should have "window.gaEventDataBuffer" be null', function (done) {
				browser.driver.executeScript(function () {
					return window.gaEventDataBuffer;
				})
				.then(function successCallback (gaEventDataBuffer) {
					expect(gaEventDataBuffer).toBeNull();
				})
				.then(null, function errorCallback (error) {
					fail('Error: ' + JSON.stringify(error));
				})
				.then(done);
			});
			
			it('should have "window.gaLastEventData" be null', function (done) {
				browser.driver.executeScript(function () {
					return window.gaLastEventData;
				})
				.then(function successCallback (gaLastEventData) {
					expect(gaLastEventData).toBeNull();
				})
				.then(null, function errorCallback (error) {
					fail('Error: ' + JSON.stringify(error));
				})
				.then(done);
			});
		});
    });
	
	
	describe('The "gaEventDataBuffer" object', function () {
		beforeEach(function () {
			// Register the Google Analytics Event Data Interceptor:
			browser.driver.registerGoogleAnalyticsEventDataInterceptor();
		});
		
		it('should be exposed globally', function (done) {
			// Get the "gaEventDataBuffer" object back from the browser:
			browser.driver.executeScript(function () {
				return window.gaEventDataBuffer;
			})
			.then(
				// Validate the content of the "gaEventDataBuffer" object:
                function successCallback (gaEventDataBuffer) {
					expect(gaEventDataBuffer).toBeDefined();
					expect(gaEventDataBuffer).not.toBeNull();
                },
				// There was an error getting back the "gaEventDataBuffer" object from the browser, fail the test:
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
        });
		
		describe('The "gaEventDataBuffer" object', function () {
			it('should contain the list of all Event Data fired', function (done) {
				// Click on the "Jumbotron" CTA:
				element( by.css('#jumbotronCTA') ).click();
				
				// Click on the first "Heading" CTA:
				element.all( by.css('.heading-cta') ).get(0).click();
				
				// Get the "gaEventDataBuffer" object back from the browser:
				browser.driver.executeScript(function () {
					return window.gaEventDataBuffer;
				})
				.then(
					// Validate the content of the "gaEventDataBuffer" object:
					function successCallback (gaEventDataBuffer) {
						expect(gaEventDataBuffer).toContain(['send', 'event', 'Button', 'Click', 'Jumbotron CTA']);
						expect(gaEventDataBuffer).toContain(['send', 'event', 'Button', 'Click', 'Heading CTA']);
						expect(gaEventDataBuffer).not.toContain(['send', 'event', 'Button', 'Click', 'Non-existing Label']);
					},
					// If there was an error getting back the "gaEventDataBuffer" object from the browser, fail the test:
					function errorCallback (error) {
						fail('Should not have received Error: ' + JSON.stringify(error));
					}
				)
				.then(done);
			});
		});
		
		describe('The "gaLastEvendData" object', function () {
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
					expect(error.message).toContain('nonExistingObject is not defined');
                }
            )
			.then(done);
		});
	});
	
	
    describe('Google Analytics "click" tracking', function () {
		it('should fire an Event when clicking on the Jumbotron CTA (expanded form)', function (done) {
			// Click on the "Jumbotron" CTA:
			element( by.css('#jumbotronCTA') ).click();
				
			// Get the "gaLastEventData" object back from the browser:
			browser.driver.executeScript(function () {
				return window.gaLastEventData;
			})
			.then(
				// Validate the content of the "gaLastEventData" object:
				function successCallback (gaLastEventData) {
					expect(gaLastEventData).toEqual(['send', 'event', 'Button', 'Click', 'Jumbotron CTA']);
				},
				// If there was an error getting back the "gaLastEventData" object from the browser, fail the test:
				function errorCallback (error) {
					fail('Should not have received Error: ' + JSON.stringify(error));
				}
			)
			.then(done);
		});
		
		it('should fire an Event when clicking on the Jumbotron CTA (condensed-form)', function (done) {
			// Click on the "Jumbotron" CTA:
			element( by.css('#jumbotronCTA') ).click();
				
			// Get the "gaLastEventData" object back from the browser and validate its data:
			browser.driver.executeScript(function () { return window.gaLastEventData; })
			.then(function (gaLastEventData) {
				expect(gaLastEventData).toEqual(['send', 'event', 'Button', 'Click', 'Jumbotron CTA']);
				done();
			});
		});
		
		it('should fire an Event when clicking on the Heading CTA', function (done) {
			// Click on the first "Heading" CTA:
			element.all( by.css('.heading-cta') ).get(0).click();
				
			// Get the "gaEventDataBuffer" object back from the browser:
			browser.driver.executeScript(function () {
				return window.gaEventDataBuffer;
			})
			.then(
				// Validate the content of the "gaEventDataBuffer" object:
				function successCallback (gaEventDataBuffer) {
					expect(gaEventDataBuffer).toContain(['send', 'event', 'Button', 'Click', 'Heading CTA']);
				},
				// If there was an error getting back the "gaEventDataBuffer" object from the browser, fail the test:
				function errorCallback (error) {
					fail('Should not have received Error: ' + JSON.stringify(error));
				}
			)
			.then(done);
		});
		
		it('should fire a Metric when clicking on the Heading CTA', function (done) {
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

	
	// Since this cannot access the "params" attribute set in "protractor.conf.js", this will actually submit the
	// test data to "ga()":
    xdescribe('Alternative method of tracking Google Analytics Event Data, straight from the browser', function () {
        beforeEach(function () {
            browser.get('index.html#/');
        });

        it('should fire an Event when clicking on the Jumbotron CTA', function (done) {
            browser.driver.executeScript(function () {
                window.gaOriginal = window.ga;
                window.gaEventDataBuffer = [];
				window.gaLastEventData = arguments;

                window.ga = function () {
					window.gaEventDataBuffer.push(arguments);
					window.gaLastEventData = arguments;
						
					// Call the original "ga()" function with the supplied arguments:
					window.gaOriginal.apply(null, arguments);
				};
            })
			.then(function spySuccessfullyRegistered () {
				// Click on the "Jumbotron" CTA:
                element( by.css('#jumbotronCTA') ).click()
                //.then(function () {

				
					browser.driver.executeScript(function () {
	                    return window.gaLastEventData;
	                })
					.then(function (gaLastEventData) {
						expect(gaLastEventData).toEqual(['send', 'event', 'Button', 'Click', 'Jumbotron CTA']);
					});
                //});
			})
			.then(null, function errorCallback (error) {
				fail('Error: ' + JSON.stringify(error));
			})
			.then(done);
        });

        it('should fire an Event when clicking on the Heading CTA', function (done) {
            browser.driver.executeScript(function () {
                window.gaOriginal = window.ga;
                window.gaEventDataBuffer = [];
				window.gaLastEventData = arguments;

                window.ga = function () {
					window.gaEventDataBuffer.push(arguments);
					window.gaLastEventData = arguments;
						
					// Call the original "ga()" function with the supplied arguments:
					window.gaOriginal.apply(null, arguments);
				};
            })
			.then(function spySuccessfullyRegistered () {
				// Click on the first "Heading" CTA:
                element.all( by.css('.heading-cta') ).get(0).click();
				
				browser.driver.executeScript(function () {
                    return window.gaLastEventData;
                })
				.then(function (gaLastEventData) {
					expect(gaLastEventData).toEqual(['send', 'event', 'Button', 'Click', 'Heading CTA']);
				});
			})
			.then(null, function errorCallback (error) {
				fail('Error: ' + JSON.stringify(error));
			})
			.then(done);
        });
    });
});
