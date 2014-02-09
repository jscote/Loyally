/**
 * Created by jscote on 2/2/14.
 */


(function () {

    'use strict';

    module.exports = function (baseDir) {

        global.Injector = require(baseDir + '/Injector/Injector');
        global.Injector.setBasePath(baseDir);
        require(baseDir + '/Injector/Configuration');
        require(baseDir + '/config/DependencyInjection')();
    };

})();