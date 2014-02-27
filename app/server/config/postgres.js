/**
 * Created by anil.indlamuri on 2/21/14.
 */

(function (Sequelize, postgres) {

    module.exports = function (config) {
        //TODO: Figure out how to connect with a different user than superadmin
        global.sequelize = new Sequelize(config.dbName, config.dbUserName, config.dbPassword, {
            host: config.dbhost,
            port: config.dbPort,
            dialect: 'postgres'
        });
    };

})(require('sequelize-postgres').sequelize, require('sequelize-postgres').postgres);