/**
 * Created by jscote on 1/31/14.
 */


(function(_, annotation, permissionAnnotation){

    'use strict';

    function getRequestedPermissions(delegateClass, delegateFn) {

        var permissions =
            annotation.getCombinedAnnotations(delegateClass,
                delegateFn,
                permissionAnnotation,
                function (item) {
                    return item.requiredPermissions
                });

        var p = [];

        _.forEach(permissions, function (item) {
            _.forEach(item, function (i) {
                p.push(i.value);
            });
        });
        return p;
    }

    module.exports = {
        getRequestedPermissions: getRequestedPermissions
    }

})(require('lodash'), require(Injector.getBasePath() + '/Helpers/annotationHelper'), require(Injector.getBasePath() + '/Security/PermissionAnnotation'));