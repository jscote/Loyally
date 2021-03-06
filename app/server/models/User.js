/**
 * Created by anil.indlamuri on 2/25/14.
 */

(function (Sequelize, encrypt) {

    module.exports.defineModel = function(sequelize){
        var Model = defineModel(sequelize)
        return Model;
    };

    module.exports.initialize = function (Model) {
        createDefaultUsers(Model);
    };



    function defineModel (sequelize){

         return sequelize.define('User', {
                firstName: {type:Sequelize.STRING, allowNull: false},
                lastName: {type:Sequelize.STRING, allowNull: false},
                username: {type: Sequelize.STRING, allowNull: false, unique: true},
                salt: {type:Sequelize.STRING, allowNull: false},
                hashed_pwd: {type:Sequelize.STRING, allowNull: false},
                permissions: {type: Sequelize.ARRAY(Sequelize.TEXT)}
            },

            {
                instanceMethods: {
                    authenticate: function (passwordToMatch) {
                        return encrypt.hashPwd(this.salt, passwordToMatch) === this.hashed_pwd;
                    },
                    hasRole: function (role) {
                        return this.roles.indexOf(role) > -1;
                    }
                }
            }
        );
    }

    function createDefaultUsers(Model) {

        Model.findAndCountAll().success(function(users){

            if(!(users.count > 0)){

                var salt,
                    hashedPwd;

                salt = encrypt.createSalt();
                hashedPwd = encrypt.hashPwd(salt, 'js');
                Model
                    .create({
                        firstName: 'JS',
                        lastName: 'Cote',
                        username: 'js',
                        salt: salt,
                        hashed_pwd: hashedPwd,
                        permissions: ['CanLogin', 'CanGetEvent', 'CanGetCustomer']
                    });

                salt = encrypt.createSalt();
                hashedPwd = encrypt.hashPwd(salt, 'anil');
                Model
                    .create({
                        firstName: 'Anil',
                        lastName: 'Indlamuri',
                        username: 'anil',
                        salt: salt,
                        hashed_pwd: hashedPwd,
                        permissions: []
                    });

                console.log('Initial users created.');
            }

        })

    }

})(require('sequelize-postgres').sequelize,  require('../Helpers/encryption'));
