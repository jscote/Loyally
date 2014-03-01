/**
 * Created by jscote on 2/2/14.
 */

(function (path) {

    'use strict';

    var rootPath = path.normalize(__dirname + '/../');

    module.exports = {
        development: {
            rootPath: rootPath,
            port: process.env.PORT || 8000,

            //db
            dbhost: 'localhost',
            dbPort: 5432,
            dbName:'loyally',
            dbUserName:'postgres',
            dbPassword:'postgres'
        },
        production: {
            rootPath: rootPath,
            port: process.env.PORT || 80,

            //db
            dbhost: 'localhost',
            dbPort: 5432,
            dbName:'loyally',
            dbUserName:'postgres',
            dbPassword:'postgres'
        }
    }
})(require('path'));