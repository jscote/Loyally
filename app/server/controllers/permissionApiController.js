/**
 * Created by jscote on 2/14/14.
 */
(function(util, apiController){

    'use strict'

    function permissionApiController() {

    }

    util.inherits(permissionApiController, apiController);

    module.exports = permissionApiController;

})(require('util'), require(Injector.getBasePath() + '/controllers/apiController'));