/**
 * Created by jscote on 2/14/14.
 */
(function(util, apiController){

    'use strict'

    function permissionApiController() {
        Object.defineProperty(this, "identity", {writable: true, value: null});
    }

    util.inherits(permissionApiController, apiController);

    module.exports = permissionApiController;

})(require('util'), require(Injector.getBasePath() + '/controllers/apiController'));