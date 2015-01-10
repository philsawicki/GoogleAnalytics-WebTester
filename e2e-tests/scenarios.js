'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('my app', function() {
    browser.get('index.html');

    it('should automatically redirect to "/" when location hash/fragment is empty', function() {
        expect(browser.getLocationAbsUrl()).toMatch('/');
    });


    xdescribe('view1', function() {
        beforeEach(function() {
            browser.get('index.html#/view1');
        });

        it('should render view1 when user navigates to /view1', function() {
            expect(element.all(by.css('[ng-view] p')).first().getText()).toMatch(/partial for view 1/);
        });
    });

    xdescribe('view2', function() {
        beforeEach(function() {
            browser.get('index.html#/view2');
        });

        it('should render view2 when user navigates to /view2', function() {
            expect(element.all(by.css('[ng-view] p')).first().getText()).toMatch(/partial for view 2/);
        });
    });

    describe('Google Analytics snippet detection', function() {
        beforeEach(function() {
            browser.get('index.html#/');
        });

        it('should have "window.ga()" defined', function (done) {
            var gaIsDefined = false;

            browser.driver.executeScript(function() {
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

    describe('Click interaction', function() {
        beforeEach(function() {
            browser.get('index.html#/');
        });

        it('should call "window.ga(...)" when clicking on the Jumbotron CTA', function (done) {
            var gaSpyRegistered = false;

            browser.driver.executeScript(function() {
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


            var spyRegistered = function() {
                var gaArgumentsDefined = false;

                // Send a click on the "Jumbotron" CTA:
                element(by.css('#jumbotronCTA')).click();

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

            browser.driver.executeScript(function() {
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


            var spyRegistered = function() {
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
