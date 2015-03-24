/**!
 * @file Google Analytics Web Tester Browser Spec file.
 * @author Philippe Sawicki <http://github.com/philsawicki>
 * @copyright Philippe Sawicki 2015
 * @license MIT
 */


'use strict';


describe('The Browser API', function () {
	var module;

	beforeEach(function () {
        module = window.GoogleAnalyticsWebTesterBrowserAPI;
    });


    describe('The Module interface', function () {
        it('exposes the "installDataInterceptor" method', function () {
            expect( module.installDataInterceptor ).toBeDefined();
        });

        it('exposes the "uninstallDataInterceptor" method', function () {
            expect( module.uninstallDataInterceptor ).toBeDefined();
        });

        it('exposes the "disableClicks " method', function () {
            expect( module.disableClickHandlers ).toBeDefined();
        });
    });


    describe('The "window namespace" of the Module', function () {
        it('exposes the "installDataInterceptor" method', function () {
            expect( window.GoogleAnalyticsWebTesterBrowserAPI.installDataInterceptor ).toBeDefined();
        });

        it('exposes the "uninstallDataInterceptor" method', function () {
            expect( window.GoogleAnalyticsWebTesterBrowserAPI.uninstallDataInterceptor ).toBeDefined();
        });

        it('exposes the "disableClickHandlers" method', function () {
            expect( window.GoogleAnalyticsWebTesterBrowserAPI.disableClickHandlers ).toBeDefined();
        });
    });


    describe('The proper "etiquette" of the Module', function () {
        it('does not leak the "installDataInterceptor" method to the "window"', function () {
            expect( window.installDataInterceptor ).not.toBeDefined();
        });

        it('does not leak the "uninstallDataInterceptor" method to the "window"', function () {
            expect( window.uninstallDataInterceptor ).not.toBeDefined();
        });
        
        it('does not leak the "disableClickHandlers" method to the "window"', function () {
            expect( window.disableClickHandlers ).not.toBeDefined();
        });
    });


    describe('The handling of the "click" handlers on the "document"', function () {
        beforeEach(function () {
            spyOn(document, 'addEventListener').and.callThrough();
        });


        it('does not disable the clicks on links by default', function () {
            expect( document.addEventListener ).not.toHaveBeenCalled();


            // Initialize the module, and disable all "click" Events on the "document":
            module.installDataInterceptor();

            // Create & Fire a "click" event on the "document":
            var event = document.createEvent('Event');
            event.initEvent('click', true, true);
            document.dispatchEvent(event);


            expect( document.addEventListener ).not.toHaveBeenCalled();
            expect( window.GAWebTester.ClickHandlerCalled ).toBeFalsy();
        });

        it('does not disable the clicks on links when configured not to', function () {
            expect( document.addEventListener ).not.toHaveBeenCalled();


            // Initialize the module, and disable all "click" Events on the "document":
            module.installDataInterceptor({
                disableClicks: false
            });

            // Create & Fire a "click" event on the "document":
            var event = document.createEvent('Event');
            event.initEvent('click', true, true);
            document.dispatchEvent(event);


            expect( document.addEventListener ).not.toHaveBeenCalled();
            expect( window.GAWebTester.ClickHandlerCalled ).toBeFalsy();
        });

        it('disables the clicks on links when configured to', function () {
            expect( document.addEventListener ).not.toHaveBeenCalled();


            // Initialize the module, and disable all "click" Events on the "document":
            module.installDataInterceptor({
                disableClicks: true
            });

            // Create & Fire a "click" event on the "document":
            var event = document.createEvent('Event');
            event.initEvent('click', true, true);
            document.dispatchEvent(event);


            expect( document.addEventListener ).toHaveBeenCalled();
            expect( window.GAWebTester.ClickHandlerCalled ).toBeTruthy();
        });
    });


    describe('The "window.GAWebTester" API', function () {
        beforeEach(function () {
            module.installDataInterceptor();
        });

        afterEach(function () {
            module.uninstallDataInterceptor();
        });

        it('should have deployed "window.GAWebTester"', function () {
            expect( window.GAWebTester ).toBeDefined();
            expect( window.GAWebTester ).not.toBeNull();
        });

        describe('The "getData()" method', function () {
            it('should return a default object when no Event fired', function () {
                expect( window.GAWebTester.getData() ).toBeDefined();
                expect( window.GAWebTester.getData() ).not.toBeNull();
                expect( window.GAWebTester.getData() ).toEqual({
                    EventBuffer: [],
                    LastEvent: {},
                    GTMTrackerName: null
                });
            });

            it('should return the value of the "EventBuffer"', function () {
                window.GAWebTester.EventBuffer = ['1', '2', '3'];

                expect( window.GAWebTester.getData() ).toEqual({
                    EventBuffer: ['1', '2', '3'],
                    LastEvent: {},
                    GTMTrackerName: null
                });
            });

            it('should return the value of the "LastEvent"', function () {
                window.GAWebTester.LastEvent = { 'key': 'value' };

                expect( window.GAWebTester.getData() ).toEqual({
                    EventBuffer: [],
                    LastEvent: { 'key': 'value' },
                    GTMTrackerName: null
                });
            });
        });

        describe('The "getEventBuffer()" method', function () {
            it('should return an empty Array when no Event recorded', function () {
                expect( window.GAWebTester.getEventBuffer() ).toBeDefined();
                expect( window.GAWebTester.getEventBuffer() ).not.toBeNull();
                expect( window.GAWebTester.getEventBuffer() ).toEqual([]);
            });
        });

        describe('The "getLastEvent()" method', function () {
            it('should return an empty Object when no Event recorded', function () {
                expect( window.GAWebTester.getLastEvent() ).toBeDefined();
                expect( window.GAWebTester.getLastEvent() ).not.toBeNull();
                expect( window.GAWebTester.getLastEvent() ).toEqual({});
            });
        });

        describe('The "getGTMTrackerName()" method', function () {
            it('should return "null" when no Event recorded', function () {
                expect( window.GAWebTester.getGTMTrackerName() ).toBeDefined();
                expect( window.GAWebTester.getGTMTrackerName() ).toBeNull();
            });

            it('should return the Tracker Name when a "create" Event is recorded', function () {
                window.GAWebTester.EventBuffer.push(['create', 'test', {
                    'name': 'GTMTrackerName'
                }]);

                expect( window.GAWebTester.getGTMTrackerName() ).toBeDefined();
                expect( window.GAWebTester.getGTMTrackerName() ).not.toBeNull();
                expect( window.GAWebTester.getGTMTrackerName() ).toEqual('GTMTrackerName');
            });
        });
    });

    
    describe('The "disableClickHandlers" method', function () {
        beforeEach(function () {
            module.installDataInterceptor();
        });

        afterEach(function () {
            module.uninstallDataInterceptor();
        });

        it('calls "window.GAWebTester.disableClickHandlers"', function () {
            window.GAWebTester.disableClickHandlers = jasmine.createSpy();

            expect( window.GAWebTester.disableClickHandlers ).not.toHaveBeenCalled();

            module.disableClickHandlers();

            expect( window.GAWebTester.disableClickHandlers ).toHaveBeenCalled();
        });
    });
});
