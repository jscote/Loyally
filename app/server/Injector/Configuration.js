/**
 * Created by jscote on 10/20/13.
 */

var lodash = require('lodash');
var permissionEnum = require(Injector.getBasePath() + '/Security/permissionEnum');
var decoratorHelper = require(Injector.getBasePath() + '/Helpers/decoratorHelper');
var permissionHelper = require(Injector.getBasePath() + '/Helpers/permissionHelper');
var annotationHelper = require(Injector.getBasePath() + '/Helpers/annotationHelper');
var httpApiResponse = require(Injector.getBasePath() + '/Helpers/httpApiResponse');
var NoAuthRequiredAnnotation = require(Injector.getBasePath() + '/Security/NoAuthRequiredAnnotation');

(function (_, decoratorHelper, permissionHelper, permissionEnum, annotationHelper, NoAuthRequiredAnnotation, httpApiResponse, message) {

    module.exports = function () {
        console.log('Configuring the injection container');
        console.log('dirname is: ' + Injector.getBasePath());
        Injector
            .decorator(require(Injector.getBasePath() + '/controllers/apiController'), function (delegateClass) {
                decoratorHelper.decorateFunctions(delegateClass, function (delegateFn) {
                    //Decorate the class with a tail decoration to modify the returned object if it is not in the expected format

                    return function () {
                        var args = [].slice.call(arguments);
                        var result = delegateFn.apply(delegateClass, args);
                        var defaultStatusCode = '200';

                        if (_.isUndefined(result)) {
                            result = null;
                        } else {
                            result = result.data || result;
                        }

                        var annotations = annotationHelper.getCombinedAnnotations(delegateClass, delegateFn, httpApiResponse.HttpStatusCode);

                        if (annotations.length > 0) {
                            defaultStatusCode = annotations[0].statusCode;
                        }

                        if (!(result instanceof httpApiResponse.HttpApiResponse)) {
                            result = httpApiResponse.createHttpApiResponse(defaultStatusCode, result);
                        }

                        result.statusCode = defaultStatusCode;

                        console.log("logging from response transformation decorator");

                        return result;

                    }
                });

                return delegateClass;
            })
            .decorator(require(Injector.getBasePath() + '/controllers/permissionApiController'), function (delegateClass) {
                decoratorHelper.decorateFunctions(delegateClass, function (delegateFn) {

                    //TODO: Consider refactoring to extract the way we obtain the method to know if a user is authenticated
                    //TODO: consider refactoring to extract the way we obtain the current permissions of a user
                    //      This would allow to decouple the method to verify permissions from the fact that it is obtained from a request, in effect, allowing to use this mechanism in other places

                    return function () {

                        var isAuthRequired = annotationHelper.getCombinedAnnotations(delegateClass, delegateFn, NoAuthRequiredAnnotation).length === 0;

                        var args = [].slice.call(arguments);

                        var req = args[0];
                        var user = req.user;

                        if (isAuthRequired && !req.isAuthenticated()) {
                            return (function (request, response) {
                                return httpApiResponse.createHttpApiResponse('403', {"error": 'Not Authenticated'});
                            }).apply(delegateClass, args);
                        }

                        console.log("logging from permission decorator");

                        var hasPermission = true;

                        if (isAuthRequired) {

                            var permissions = permissionHelper.getRequestedPermissions(delegateClass, delegateFn);

                            _.forEach(permissions, function (item) {
                                if (!_.contains(user.permissions, item)) {
                                    hasPermission = false;
                                    return false;
                                }
                            });
                        }

                        if (!isAuthRequired || hasPermission) {
                            return delegateFn.apply(delegateClass, args);
                        } else {
                            return (function (request, response) {
                                return httpApiResponse.createHttpApiResponse('401', {"error": 'Permission Denied'});
                            }).apply(delegateClass, args);
                        }
                    };
                });

                return delegateClass;
            })
            .decorator(require(Injector.getBasePath() + '/services/baseService'), function (delegateClass) {
                decoratorHelper.decorateFunctions(delegateClass, function (delegateFn, delegateFnName, argsName) {
                        return function () {
                            //TODO - Move this code in some other places so it is easier to maintain and refactor in smaller methods
                            console.log("logging from decorator for all services:: function Name: " + delegateFnName);
                            var args = [].slice.call(arguments);

                            //Check if the arguments are of type ServiceMessage. If not, then create a service message
                            //TODO - Move this in its own helper method.
                            var parameters = {};

                            var msg = _.find(args, function (item) {
                                return item instanceof message.ServiceMessage
                            });

                            if (_.isUndefined(msg)) {
                                msg = new message.ServiceMessage();
                                for (var i = 0; i < argsName.length; i++) {
                                    if (!_.isUndefined(args[i])) {
                                        parameters[argsName[i]] = args[i];
                                    }
                                }

                                msg.data = parameters;
                            }

                            //TODO - Check if the serviceMessage has a correlationId, if not, give it one
                            //TODO - by first checking if the service has one, if not, create a new one
                            //TODO - and also assign to the service

                            //TODO - Check if the method has annotations to validate the message.
                            //TODO - If so, execute the validation method.
                            //TODO - If the message is not valid, return a response with the validation errors

                            //surround call with a try catch
                            //TODO - if there is an error, make sure to create a response and set the errors based on the exception
                            try {
                                var result = delegateFn.apply(delegateClass, args);
                            } catch (exception) {

                            }

                            //TODO - check if the result is of type ServiceResponse.


                            return result;
                        };
                    }
                )
                ;
                return delegateClass;
            }
        )
            .register({dependency: '/Injector/StrategyResolver', name: 'strategyResolver'})
            .register({dependency: '/Injector/ControllerResolver', name: 'controllerResolver'})
    }
        ()
})
    (lodash, decoratorHelper, permissionHelper, permissionEnum, annotationHelper, NoAuthRequiredAnnotation, httpApiResponse, require(Injector.getBasePath() + '/services/serviceMessage'));