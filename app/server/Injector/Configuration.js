/**
 * Created by jscote on 10/20/13.
 */

var lodash = require('lodash');
var PermissionAnnotation = require(Injector.getBasePath() + '/app/server/Security/PermissionAnnotation');
var permissionEnum = require(Injector.getBasePath() + '/app/server/Security/permissionEnum');

(function (_, PermissionAnnotation, permissionEnum) {

//TODO: Make this file ENV dependent
    module.exports = function () {
        console.log('Configuring the injection container');
        console.log('dirname is: ' + Injector.getBasePath());
        Injector
            .decorator('getEventService', function (delegate) {
                console.log('decorating getEventService')
                var fn = delegate.index;
                var instance = delegate;
                delegate.index = function () {
                    console.log("logging from decorator for getEventService");
                    var args = [].slice.call(arguments);
                    fn.apply(instance, args)
                };
                return delegate;
            }, '/customers/:customer/events/:event?/:op?')
            /*.decorator('EventController', function (delegate) {
             console.log('decorating GeneralEventController')
             var fn = delegate.index;
             delegate.index = function () {
             console.log("logging from decorator");
             var args = [].slice.call(arguments);
             fn.apply(delegate, args)
             };
             return delegate;
             }, '/customers/:customer/events/:event?/:op?')*/
            .decorator('EventController', function (delegate) {

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
                    , permissionEnum().CanLogin]};

                //Decorating for permissions
                var fn = delegate.index;
                delegate.index = function () {

                    var typeAnnotations = delegate.constructor.prototype.annotations;
                    var fnAnnotations = fn.annotations;

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


                    var hasPermission = true;
                    _.forEach(p, function (item) {
                        if (!_.contains(user.permissions, item)) {
                            hasPermission = false;
                            return false;
                        }
                    });

                    var args = [].slice.call(arguments);

                    if (hasPermission) {
                        fn.apply(delegate, args)
                    } else {
                        (function (request, response) {
                            response.statusCode = 403;
                            response.send({error: 'Permission Denied'});
                        }).apply(delegate, args);
                    }
                };
                return delegate;
            }, '/customers/:customer/events/:event?/:op?')
            .decorator('fs', function (delegate) {
                delegate.myFunction = function () {
                    console.log("from fs myFunction");
                };
                return delegate;
            })
            .register({dependency: '/app/server/Injector/StrategyResolver', name: 'strategyResolver'})
            .register({dependency: '/app/server/Injector/ControllerResolver', name: 'controllerResolver', resolutionName: 'EventsController'})
            .register({dependency: '/app/server/controllers/EventController', name: 'EventController', resolutionName: '/events/:event?/:op?'})
            .register({dependency: '/app/server/controllers/CustomerEventController', name: 'EventController', resolutionName: '/customers/:customer/events/:event?/:op?'})
            .register({dependency: '/app/server/services/EventService', name: 'eventService', resolutionName: '/events/:event?/:op?'})
            .register({dependency: '/app/server/services/CustomerEventService', name: 'eventService', resolutionName: '/customers/:customer/events/:event?/:op?'})
            .register({dependency: '/app/server/controllers/test', name: 'test'})
            .register({dependency: '/app/server/Security/Permissions', name: 'permission'});

    }()
})(lodash, PermissionAnnotation, permissionEnum)