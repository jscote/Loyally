/**
 * Created by jscote on 10/20/13.
 */

var lodash = require('lodash');
var permissionEnum = require(Injector.getBasePath() + '/Security/permissionEnum');
var decoratorHelper = require(Injector.getBasePath() + '/Helpers/decoratorHelper');
var permissionHelper = require(Injector.getBasePath() + '/Helpers/permissionHelper');

(function (_, decoratorHelper, permissionHelper, permissionEnum) {

    module.exports = function () {
        console.log('Configuring the injection container');
        console.log('dirname is: ' + Injector.getBasePath());
        Injector
              .decorator(require(Injector.getBasePath() + '/controllers/baseController'), function(delegateClass) {
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
            })
            .decorator(require(Injector.getBasePath() + '/services/baseService'), function(delegateClass) {
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
})(lodash, decoratorHelper, permissionHelper, permissionEnum);