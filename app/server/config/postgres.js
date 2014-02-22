/**
 * Created by anil.indlamuri on 2/21/14.
 */

(function (Sequelize, postgres) {

    module.exports = function (config) {

        //TODO: Should be reading all the values from the config
        //TODO: Figure out how to connect with a different user than superadmin
        global.sequelize = new Sequelize('loyally', 'postgres', 'anil', {
            host: 'localhost',
            port: 5432,
            dialect: 'postgres'
        });



        global.sequelize
            .authenticate()
            .complete(function(err) {
                if (!!err) {
                    console.log('Unable to connect to the database:', err)
                } else {
                    console.log('Connection has been established successfully.')
                }
            });

        var Project = global.sequelize.define('Project', {
            title: Sequelize.STRING,
            description: Sequelize.TEXT
        });

          global.sequelize
            .sync({ force: true })
            .complete(function(err) {
                if (!!err) {
                    console.log('An error occurred while create the table:', err)
                } else {
                    console.log('It worked!')
                }
            });

//        var project = Project.build({
//            title: 'my awesome project',
//            description: 'woot woot. this will make me a rich man'
//        });
//
//        project
//            .save()
//            .success(function(newProject) {
//                console.log('Project successfully saved');
//            }).error(function(error) {
//                console.log('Error saving Project');
//            })




    };

})(require('sequelize-postgres').sequelize, require('sequelize-postgres').postgres);