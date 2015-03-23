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
    });


    describe('The "window namespace" of the Module', function () {
        it('exposes the "installDataInterceptor" method', function () {
            expect( window.GoogleAnalyticsWebTesterBrowserAPI.installDataInterceptor ).toBeDefined();
        });

        it('exposes the "uninstallDataInterceptor" method', function () {
            expect( window.GoogleAnalyticsWebTesterBrowserAPI.uninstallDataInterceptor ).toBeDefined();
        });
    });


    describe('The proper "etiquette" of the Module', function () {
        it('does not leak the "uninstallDataInterceptor" method to the "window"', function () {
            expect( window.uninstallDataInterceptor ).not.toBeDefined();
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
});
