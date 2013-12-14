'use strict';

var _$ = {};


// Declare app level module which depends on filters, and services
angular.module('loyuly', [
        'loyuly.controllers',
        'loyuly.services',
        'loyuly.directives',
        'ngRoute',
        'ngSanitize'
    ]);
    /*.
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/view1', {templateUrl: 'server/partials/partial1.html', controller: 'checkinCtrl'});
    $routeProvider.when('/view2', {templateUrl: 'server/partials/partial2.html', controller: 'checkoutCtrl'});
    $routeProvider.otherwise({redirectTo: '/view1'});
  }]);*/
_$.controllers = angular.module('loyuly.controllers', []);
_$.services = angular.module('loyuly.services', []);
_$.directives = angular.module('loyuly.directives', []);

