/**
 * Created by jcote on 1/28/14.
 */

(function(Permission){
    'use strict'

    function PermissionAnnotation() {
        this.requiredPermissions = [];
    }

    PermissionAnnotation.prototype.addRequiredPermission = function(permission) {

        if(!(permission instanceof Permission)) throw ('Invalid Permission Type');

        this.requiredPermissions.push(permission);

        return this;
    }

    module.exports = PermissionAnnotation;
}) (require(Injector.getBasePath() + '/app/server/Security/Permissions'))