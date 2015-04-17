/**!
 * @file Main file for the Angular Demo Application.
 * @author Philippe Sawicki (https://github.com/philsawicki)
 * @copyright Copyright Philippe Sawicki 2015
 * @license MIT
 */

'use strict';


// Declare "Controllers" module for the app:
angular.module('myApp.Controllers', []);

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'myApp.Controllers'
]).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/home-page.html',
                controller: 'HomePageController'
            })
            .otherwise({
                redirectTo: '/'
            });
    }]);
