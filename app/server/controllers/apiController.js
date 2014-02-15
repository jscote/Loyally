/**
 * Created by jscote on 2/14/14.
 */

(function(util, baseController){

    'use strict'

    function apiController() {

    }

    util.inherits(apiController, baseController);

    module.exports = apiController;

})(require('util'), require(Injector.getBasePath() + '/controllers/baseController'));