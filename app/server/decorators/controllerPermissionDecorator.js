/**
 * Created by jscote on 2/17/14.
 */

(function (_, permissionHelper, permissionEnum, annotationHelper, NoAuthRequiredAnnotation, httpApiResponse) {

    'use strict';

    module.exports = function (delegateClass) {
        return function (delegateFn, delegateFnName) {

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
        }
    }
})(
        require('lodash'),
        require(Injector.getBasePath() + '/Helpers/permissionHelper'),
        require(Injector.getBasePath() + '/Security/permissionEnum'),
        require(Injector.getBasePath() + '/Helpers/annotationHelper'),
        require(Injector.getBasePath() + '/Security/NoAuthRequiredAnnotation'),
        require(Injector.getBasePath() + '/Helpers/httpApiResponse')
    );