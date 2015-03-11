'use strict';

/**
 * https://github.com/angular/protractor/blob/master/docs/referenceConf.js
 * https://github.com/angular/protractor/blob/master/docs/toc.md
 */

describe('Demo application for Google Analytics WebTester', function () {
    browser.get('index.html');

    it('should automatically redirect to "/" when location hash/fragment is empty', function () {
        expect(browser.getLocationAbsUrl()).toMatch('/');
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
				
			// Get the "gaLastEventData" object back from the browser:
			browser.driver.executeScript(function () {
				return window.gaLastEventData;
			})
			.then(
				// Validate the content of the "gaLastEventData" object:
				function successCallback (gaLastEventData) {
					expect(gaLastEventData).toEqual(['send', 'event', 'Button', 'Click', 'Heading CTA']);
				},
				// If there was an error getting back the "gaLastEventData" object from the browser, fail the test:
				function errorCallback (error) {
					fail('Should not have received Error: ' + JSON.stringify(error));
				}
			)
			.then(done);
		});
	});

    xdescribe('Google Analytics snippet detection', function () {
        beforeEach(function () {
            browser.get('index.html#/');
        });

        it('should have "window.ga()" defined', function (done) {
            var gaIsDefined = false;

            browser.driver.executeScript(function () {
                return typeof window.ga;
            }).then(
                function (result) {
                    if (result !== 'undefined') {
                        gaIsDefined = true;
                    }

                    expect(result).not.toEqual('undefined');
                    expect(gaIsDefined).toBeTruthy();
                    done();
                },
                function (error) {
                    expect(gaIsDefined).toBeTruthy();
                    done();
                }
            );
        });
    });

    xdescribe('Click interaction', function () {
        beforeEach(function () {
            browser.get('index.html#/');
        });

        it('should call "window.ga(...)" when clicking on the Jumbotron CTA', function (done) {
            var gaSpyRegistered = false;

            browser.driver.executeScript(function () {
                (function (globalScope) {
                    var originalGA = ga;
                    globalScope.gaEventData = {};

                    var newGA = function(paramSend, paramEvent, paramCategory, paramAction, paramLabel, paramValue) {
                        globalScope.gaEventData.send = paramSend;
                        globalScope.gaEventData.event = paramEvent;
                        globalScope.gaEventData.category = paramCategory;
                        globalScope.gaEventData.action = paramAction;
                        globalScope.gaEventData.label = paramLabel;
                        globalScope.gaEventData.value = paramValue;

                        originalGA(paramSend, paramEvent, paramCategory, paramAction, paramLabel, paramValue);
                    };

                    ga = newGA;
                })(window);

                return 'success';
            }).then(
                function (result) {
                    if (result === 'success') {
                        gaSpyRegistered = true;
                    }

                    expect(result).toEqual('success');
                    expect(gaSpyRegistered).toBeTruthy();
                    spyRegistered();
                },
                function (error) {
                    expect(gaSpyRegistered).toBeTruthy();
                    done();
                }
            );


            var spyRegistered = function () {
                var gaArgumentsDefined = false;

                // Send a click on the "Jumbotron" CTA:
                element(by.css('#jumbotronCTA')).click();

                browser.driver.executeScript(function () {
                    return gaEventData;
                }).then(
                    function (result) {
                        if (result !== 'undefined') {
                            gaArgumentsDefined = true;
                        }

                        expect(gaArgumentsDefined).toBeTruthy();
                        expect(result).not.toEqual('undefined');
                        expect(result).toEqual({
                            send: 'send',
                            event: 'event',
                            category: 'Button',
                            action: 'Click',
                            label: 'Jumbotron CTA',
                            value: null
                        })

                        done();
                    },
                    function (error) {
                        expect(gaArgumentsDefined).toBeTruthy();

                        done();
                    }
                );
            };
        });





        it('should call "window.ga(...)" when clicking on the Heading CTA', function (done) {
            var gaSpyRegistered = false;

            browser.driver.executeScript(function () {
                (function (globalScope) {
                    var originalGA = ga;
                    globalScope.gaEventData = {};

                    var newGA = function(paramSend, paramEvent, paramCategory, paramAction, paramLabel, paramValue) {
                        globalScope.gaEventData.send = paramSend;
                        globalScope.gaEventData.event = paramEvent;
                        globalScope.gaEventData.category = paramCategory;
                        globalScope.gaEventData.action = paramAction;
                        globalScope.gaEventData.label = paramLabel;
                        globalScope.gaEventData.value = paramValue;

                        originalGA(paramSend, paramEvent, paramCategory, paramAction, paramLabel, paramValue);
                    };

                    ga = newGA;
                })(window);

                return 'success';
            }).then(
                function (result) {
                    if (result === 'success') {
                        gaSpyRegistered = true;
                    }

                    expect(result).toEqual('success');
                    expect(gaSpyRegistered).toBeTruthy();
                    spyRegistered();
                },
                function (error) {
                    expect(gaSpyRegistered).toBeTruthy();
                    done();
                }
            );


            var spyRegistered = function () {
                var gaArgumentsDefined = false;

                // Send a click on the first "Heading" CTA:
                element.all(by.css('.heading-cta')).get(0).click();

                browser.driver.executeScript(function() {
                    return gaEventData;
                }).then(
                    function (result) {
                        if (result !== 'undefined') {
                            gaArgumentsDefined = true;
                        }

                        expect(gaArgumentsDefined).toBeTruthy();
                        expect(result).not.toEqual('undefined');
                        expect(result).toEqual({
                            send: 'send',
                            event: 'event',
                            category: 'Button',
                            action: 'Click',
                            label: 'Heading CTA',
                            value: null
                        })

                        done();
                    },
                    function (error) {
                        expect(gaArgumentsDefined).toBeTruthy();

                        done();
                    }
                );
            };
        });
    });
});
