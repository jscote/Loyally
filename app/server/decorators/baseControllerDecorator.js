/**
 * Created by jscote on 2/17/14.
 */

(function (_, baseController, baseService) {

    'use strict';

    function copyIdentity(owner) {

        for (var prop in owner) {
            if (owner.hasOwnProperty(prop) && owner[prop] != owner) {
                if ((owner[prop] instanceof baseService) || (owner[prop] instanceof baseController)) {
                    if (owner[prop].hasOwnProperty('identity')) {
                        owner[prop].identity = owner.identity;

                    }
                    copyIdentity(owner[prop]);
                }
            }
        }
    }

    module.exports = function (delegateClass) {
        return function (delegateFn, delegateFnName) {

            //TODO: Consider refactoring to extract the way we obtain the method to know if a user is authenticated
            //TODO: consider refactoring to extract the way we obtain the current permissions of a user
            //      This would allow to decouple the method to verify permissions from the fact that it is obtained from a request, in effect, allowing to use this mechanism in other places

            return function () {

                var args = [].slice.call(arguments);

                var req = args[0];
                var user = req.user;

                if (delegateClass.hasOwnProperty("identity")) {
                    delegateClass.identity = user;
                    copyIdentity(delegateClass);
                }

                return delegateFn.apply(delegateClass, args);

            };
        }
    }
})(
        require('lodash'),
        require(Injector.getBasePath() + '/controllers/baseController'),
        require(Injector.getBasePath() + '/services/baseService')
    );