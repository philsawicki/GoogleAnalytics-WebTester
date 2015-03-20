'use strict';


describe('The Browser API', function () {
	var module;

	beforeEach(function () {
        module = window.GoogleAnalyticsWebTester;
    });


    describe('The Module interface', function () {
        it('exposes the "uninstallDataInterceptor" method', function () {
            expect( module.initialize ).toBeDefined();
        });
    });


    describe('The "window namespace" of the Module', function () {
        it('exposes the "uninstallDataInterceptor" method', function () {
            expect( window.GoogleAnalyticsWebTesterBrowserAPI.uninstallDataInterceptor ).toBeDefined();
        });
    });


    describe('The proper "etiquette" of the Module', function () {
        it('does not leak the "uninstallDataInterceptor" method to the "window"', function () {
            expect( window.uninstallDataInterceptor ).not.toBeDefined();
        });
    });
});
