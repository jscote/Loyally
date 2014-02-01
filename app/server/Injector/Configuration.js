/**
 * Created by jscote on 10/20/13.
 */

var lodash = require('lodash');
var PermissionAnnotation = require(Injector.getBasePath() + '/app/server/Security/PermissionAnnotation');
var permissionEnum = require(Injector.getBasePath() + '/app/server/Security/permissionEnum');

(function (_, PermissionAnnotation, permissionEnum) {

    function decorateFunction(delegate, copyFromFunction, copyToFunction) {
        var fn = delegate[copyFromFunction];
        var annotations = delegate[copyFromFunction].annotations;
        delegate[copyFromFunction] = copyToFunction(fn);
        delegate[copyFromFunction].annotations = annotations;
    };

    function decorateFunctions(delegate, copyToFunction) {

        //var props = Object.getOwnPropertyNames(delegate.constructor.prototype);
        //for(var i=0; i< props.length; i++) {
            //var prop = props[i];
        for(var prop in delegate.__proto__) {
            if(_.isFunction(delegate[prop])) {
                var fn = delegate[prop];
                var annotations = delegate[prop].annotations;
                delegate[prop] = copyToFunction(fn);
                delegate[prop].annotations = annotations;
            }
        }
    };

    function getRequestedPermissions(delegateClass, delegateFn) {
        var typeAnnotations = delegateClass.constructor.prototype.annotations;
        var fnAnnotations = delegateFn.annotations;

        //var requiredPermissions
        var permissions =
            _.union(
                _.map(
                    _.filter(typeAnnotations, function (item) {
                        return item instanceof PermissionAnnotation
                    }), function (item) {
                        return item.requiredPermissions
                    }),
                _.map(
                    _.filter(fnAnnotations, function (item) {
                        return item instanceof PermissionAnnotation
                    }), function (item) {
                        return item.requiredPermissions

                    }));

        var p = [];

        _.forEach(permissions, function (item) {
            _.forEach(item, function (i) {
                p.push(i.value);
            });
        });
        return p;
    }

//TODO: Make this file ENV dependent


    module.exports = function () {
        console.log('Configuring the injection container');
        console.log('dirname is: ' + Injector.getBasePath());
        Injector
            .decorator('eventService', function (delegateClass) {

                decorateFunction(delegateClass, 'getEventsForCustomer', function (delegateFn) {
                    return function () {
                        console.log("logging from decorator for getEventService");
                        var args = [].slice.call(arguments);
                        return delegateFn.apply(delegateClass, args)
                    };
                });
                return delegateClass;

            }, '/customers/:customer/events/:event?/:op?')
            .decorator('EventController', function (delegateClass) {

                decorateFunction(delegateClass, 'index', function(delegateFn) {
                    return function() {
                        console.log("logging from decorator 1");
                        var args = [].slice.call(arguments);
                        delegateFn.apply(delegateClass, args)
                    };
                });

                return delegateClass;
            }, '/customers/:customer/events/:event?/:op?', 2)
            .decorator('EventController', function (delegateClass) {

                //TODO: Refactor this decorator to extract the method to get annotation so we can pass different type of annotations
                //TODO: Create an object to assign to prototype.annotations that can accept only annotation type of objects.
                //TODO: Enumerate the function of the delegate to insert permission check on all of them
                //TODO: Modify injector so that we can decorate all instances of a specific type (to be used with inherited classes so we can decorate all descendant of a class)
                //TODO: Implement real authentication so that we can keep the user somewhere or know how to retrieve it from the request
                //TODO: Implement base class for controllers: If we separate the concern of getting the user from request (which we could assume to be at a specific place for specific derived class/methods) and the actual application of the permission, then we should be ok


                //This is for demonstration purpose. The user should be obtained in a better way.
                //it is usually attached to the request so that might require to inspect properties of
                //parameters passed to a method to extract the user from it.
                var user = {name: 'JS', permissions: [
                    permissionEnum().CanGetCustomer
                    , permissionEnum().CanGetEvent
                    , permissionEnum().CanLogin
                    ]
                };


                decorateFunctions(delegateClass, function(delegateFn) {
                    return function() {
                        console.log("logging from decorator 2");

                        var permissions = getRequestedPermissions(delegateClass, delegateFn);
                        var hasPermission = true;

                        _.forEach(permissions, function (item) {
                            if (!_.contains(user.permissions, item)) {
                                hasPermission = false;
                                return false;
                            }
                        });

                        var args = [].slice.call(arguments);

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
            .register({dependency: '/app/server/Injector/StrategyResolver', name: 'strategyResolver'})
            .register({dependency: '/app/server/Injector/ControllerResolver', name: 'controllerResolver'})
            .register({dependency: '/app/server/controllers/EventController', name: 'EventController', resolutionName: '/events/:event?/:op?'})
            .register({dependency: '/app/server/controllers/CustomerEventController', name: 'EventController', resolutionName: '/customers/:customer/events/:event?/:op?'})
            .register({dependency: '/app/server/services/EventService', name: 'eventService', resolutionName: '/events/:event?/:op?'})
            .register({dependency: '/app/server/services/CustomerEventService', name: 'eventService', resolutionName: '/customers/:customer/events/:event?/:op?'})
            .register({dependency: '/app/server/controllers/test', name: 'test'})
            .register({dependency: '/app/server/controllers/CustomerController', name: 'CustomerController', resolutionName: '/customers/:customer?/:op?'})

    }()
})(lodash, PermissionAnnotation, permissionEnum)