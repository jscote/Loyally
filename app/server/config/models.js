/**
 * Created by jscote on 2/2/14.
 */

(function(fs){

    'use strict';

    module.exports = function(config) {
        fs.readdirSync(config.rootPath + '/models').forEach(function(file) {
            require(config.rootPath + '/models/' + file).initialize();
        })
    }

})(require('fs'));
