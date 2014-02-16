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

(function (_, decoratorHelper, permissionHelper, permissionEnum, annotationHelper, NoAuthRequiredAnnotation, httpApiResponse) {

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

                        if(annotations.length > 0) {
                            defaultStatusCode = annotations[0].statusCode;
                        }

                        if (!(result instanceof httpApiResponse.HttpApiResponse)) {
                            result = httpApiResponse.createHttpApiResponse(defaultStatusCode, result);
                        }

                        result.statusCode = defaultStatusCode;

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

                        console.log("logging from decorator 2");

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
                decoratorHelper.decorateFunctions(delegateClass, function (delegateFn) {
                    return function () {
                        console.log("logging from decorator for all services");
                        var args = [].slice.call(arguments);
                        return delegateFn.apply(delegateClass, args)
                    };
                });
                return delegateClass;
            })
            .register({dependency: '/Injector/StrategyResolver', name: 'strategyResolver'})
            .register({dependency: '/Injector/ControllerResolver', name: 'controllerResolver'})
    }()
})(lodash, decoratorHelper, permissionHelper, permissionEnum, annotationHelper, NoAuthRequiredAnnotation, httpApiResponse);