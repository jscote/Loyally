'use strict';


// Declare app level module which depends on filters, and services
angular.module('loyuly', ['loyuly.controllers','loyuly.services', 'loyuly.directives']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'checkinCtrl'});
    $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'checkoutCtrl'});
    $routeProvider.otherwise({redirectTo: '/view1'});
  }]);

var controllers = angular.module('loyuly.controllers', []);
var services = angular.module('loyuly.services', []);
var directives = angular.module('loyuly.directives', []);
