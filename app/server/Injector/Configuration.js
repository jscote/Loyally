/**
 * Created by jscote on 10/20/13.
 */

var lodash = require('lodash');
var permissionEnum = require(Injector.getBasePath() + '/Security/permissionEnum');
var decoratorHelper = require(Injector.getBasePath() + '/Helpers/decoratorHelper');
var permissionHelper = require(Injector.getBasePath() + '/Helpers/permissionHelper');

(function (_, decoratorHelper, permissionHelper, permissionEnum) {

//TODO: Make this file ENV dependent


    module.exports = function () {
        console.log('Configuring the injection container');
        console.log('dirname is: ' + Injector.getBasePath());
        Injector
            .decorator('eventService', function (delegateClass) {

                decoratorHelper.decorateFunction(delegateClass, 'getEventsForCustomer', function (delegateFn) {
                    return function () {
                        console.log("logging from decorator for getEventService");
                        var args = [].slice.call(arguments);
                        return delegateFn.apply(delegateClass, args)
                    };
                });
                return delegateClass;

            }, '/customers/:customer/events/:event?/:op?')
            .decorator('EventController', function (delegateClass) {

                decoratorHelper.decorateFunction(delegateClass, 'index', function (delegateFn) {
                    return function () {
                        console.log("logging from decorator 1");
                        var args = [].slice.call(arguments);
                        delegateFn.apply(delegateClass, args)
                    };
                });

                return delegateClass;
            }, '/customers/:customer/events/:event?/:op?', 2)
            .decorator('EventController', function (delegateClass) {

                //TODO: Modify injector so that we can decorate all instances of a specific type (to be used with inherited classes so we can decorate all descendant of a class)
                //TODO: Implement base class for controllers: If we separate the concern of getting the user from request (which we could assume to be at a specific place for specific derived class/methods) and the actual application of the permission, then we should be ok


                decoratorHelper.decorateFunctions(delegateClass, function (delegateFn) {
                    //TODO: Consider refactoring to extract the way we obtain the method to know if a user is authenticated
                    //TODO: consider refactoring to extract the way we obtain the current permissions of a user
                    //      This would allow to decouple the method to verify permissions from the fact that it is obtained from a request, in effect, allowing to use this mechanism in other places

                    return function () {

                        var args = [].slice.call(arguments);

                        var req = args[0];
                        var user = req.user;

                        if(!req.isAuthenticated()) {
                            (function (request, response) {
                                response.statusCode = 403;
                                response.send({error: 'Not Authenticated'});
                            }).apply(delegateClass, args);

                            return;
                        }

                        console.log("logging from decorator 2");

                        var permissions = permissionHelper.getRequestedPermissions(delegateClass, delegateFn);

                        var hasPermission = true;

                        _.forEach(permissions, function (item) {
                            if (!_.contains(user.permissions, item)) {
                                hasPermission = false;
                                return false;
                            }
                        });

                        if (hasPermission) {
                            delegateFn.apply(delegateClass, args)
                        } else {
                            (function (request, response) {
                                response.statusCode = 403;
                                response.send({error: 'Permission Denied'});
                            }).apply(delegateClass, args);
                        }
                    };
                });

                return delegateClass;
            }, '/customers/:customer/events/:event?/:op?', 1)
            .decorator('fs', function (delegateClass) {
                delegateClass.myFunction = function () {
                    console.log("from fs myFunction");
                };
                return delegateClass;
            })
            .register({dependency: '/Injector/StrategyResolver', name: 'strategyResolver'})
            .register({dependency: '/Injector/ControllerResolver', name: 'controllerResolver'})
            .register({dependency: '/controllers/EventController', name: 'EventController', resolutionName: '/events/:event?/:op?'})
            .register({dependency: '/controllers/CustomerEventController', name: 'EventController', resolutionName: '/customers/:customer/events/:event?/:op?'})
            .register({dependency: '/services/EventService', name: 'eventService', resolutionName: '/events/:event?/:op?'})
            .register({dependency: '/services/CustomerEventService', name: 'eventService', resolutionName: '/customers/:customer/events/:event?/:op?'})
            .register({dependency: '/controllers/test', name: 'test'})
            .register({dependency: '/controllers/CustomerController', name: 'CustomerController', resolutionName: '/customers/:customer?/:op?'})

    }()
})(lodash, decoratorHelper, permissionHelper, permissionEnum);