/**
 * Created by jscote on 2/2/14.
 */

(function (path) {

    'use strict';

    var rootPath = path.normalize(__dirname + '/../');

    module.exports = {
        development: {
            db: 'mongodb://localhost/loyally',
            rootPath: rootPath,
            port: process.env.PORT || 8000
        },
        production: {
            rootPath: rootPath,
            db: 'mongodb://localhost/loyally',
            port: process.env.PORT || 80
        }
    }
})(require('path'));