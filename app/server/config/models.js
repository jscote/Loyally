/**
 * Created by anil.indlamuri on 2/21/14.
 */

(function(Sequelize, postgres, fs){

    'use strict';

    module.exports = function(config) {


        //Define Models
        fs.readdirSync(config.rootPath + '/models').forEach(function(file) {
            var modelDependency = require(config.rootPath + '/models/' + file);
            var schema = modelDependency.defineModel(global.sequelize);
            modelDependency.initialize(schema);
        });

        //Sync the Schema
        //TODO: Figure out a better way to sync models to db, may be use migrations.
/*
        global.sequelize.sync({ force: false })
            .complete(function(err) {
                if (!!err) {
                    console.log('An error occurred while creating the models:', err);
                } else {
                    console.log('All the models are synced to the database!');

                }
            });
*/

    }

})(require('sequelize-postgres').sequelize, require('sequelize-postgres').postgres, require('fs'));