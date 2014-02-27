/**
 * Created by anil.indlamuri on 2/21/14.
 */

(function(Sequelize, postgres, fs){

    'use strict';

    module.exports = function(config) {

        //Define Models
        var model = require(config.rootPath + '/models/' + 'postgresUsers');


        //Sync the Schema
        //TODO: Figure out a better way to sync models to db, may be use migrations.

         global.sequelize.sync({ force: false })
                    .complete(function(err) {
                        if (!!err) {
                            console.log('An error occurred while creating the models:', err);
                        } else {
                            console.log('All the models are synced to the database!');

                            model.initialize();
                        }
                    });



/**
        fs.readdirSync(config.rootPath + '/models').forEach(function(file) {
            require(config.rootPath + '/models/' + file).initialize();
        });
*/

    }

})(require('sequelize-postgres').sequelize, require('sequelize-postgres').postgres, require('fs'));