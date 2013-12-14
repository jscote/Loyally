/**
 * Created by jscote on 10/27/13.
 */
(function () {
    'use strict';

    var app = angular.module('loyuly');

    // Collect the routes
    app.constant('routes', getRoutes());

    // Configure the routes and route resolvers
    app.config(['$routeProvider', 'routes', routeConfigurator]);
    function routeConfigurator($routeProvider, routes) {
        routes.forEach(function (r) {
            $routeProvider.when(r.url, {templateUrl: r.config.templateUrl , controller: r.config.controller });
        });
        $routeProvider.otherwise({ redirectTo: '/' });
    }

    // Define the routes
    function getRoutes() {

        return [
            {
                url: '/View1',
                config: {
                    templateUrl: 'server/partials/partial1.html',
                    title: 'Featured Garage Sales',
                    controller: 'checkinCtrl',
                    settings: {
                        nav: 1,
                        content: '<i class="icon-dashboard"></i> Featured Garage Sales'
                    }
                }
            }, {
                url: '/View2',
                config: {
                    title: 'My Account',
                    templateUrl: 'server/partials/partial2.html',
                    controller: 'checkoutCtrl',
                    settings: {
                        nav: 2,
                        content: '<i class="icon-lock"></i> My Account'
                    }
                }
            }
        ];
    }
})();