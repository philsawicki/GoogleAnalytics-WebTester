/**!
 * @file Base E2E test scenarios for the Blog page of the Application Demo.
 * @author Philippe Sawicki <http://github.com/philsawicki> 
 * @copyright Philippe Sawicki 2015
 * @license MIT
 */

'use strict';


describe('Demo application for the Blog page of the Google Analytics WebTester', function () {
    describe('The Blog page setup', function () {
		beforeEach(function () {
			browser.get('blog.html');
		});

		it('should automatically redirect to "/" when location hash/fragment is empty', function () {
			expect(browser.getLocationAbsUrl()).toMatch('/');
		});
	});
});
