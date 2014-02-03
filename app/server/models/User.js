/**
 * Created by jscote on 2/2/14.
 */
var mongoose = require('mongoose'),
    encrypt = require('../Helpers/encryption');

var userSchema = mongoose.Schema({
    firstName: {type:String, required:'{PATH} is required!'},
    lastName: {type:String, required:'{PATH} is required!'},
    username: {
        type: String,
        required: '{PATH} is required!',
        unique:true
    },
    salt: {type:String, required:'{PATH} is required!'},
    hashed_pwd: {type:String, required:'{PATH} is required!'},
    permissions: [String]
});
userSchema.methods = {
    authenticate: function(passwordToMatch) {
        return encrypt.hashPwd(this.salt, passwordToMatch) === this.hashed_pwd;
    },
    hasRole: function(role) {
        return this.roles.indexOf(role) > -1;
    }
};
var User;

module.exports.initialize = function() {
    User = mongoose.model('User', userSchema);
    createDefaultUsers();
};

function createDefaultUsers() {
    User.count(function(err, count) {
        if(count === 0) {
            var salt, hash;
            salt = encrypt.createSalt();
            hash = encrypt.hashPwd(salt, 'js');
            User.create({firstName:'JS',lastName:'Cote',username:'js', salt: salt, hashed_pwd: hash, permissions: ['CanLogin', 'CanGetEvent', 'CanGetCustomer']});
            salt = encrypt.createSalt();
            hash = encrypt.hashPwd(salt, 'anil');
            User.create({firstName:'Anil',lastName:'Indlamuri',username:'anil', salt: salt, hashed_pwd: hash, permissions: []});
            salt = encrypt.createSalt();
            hash = encrypt.hashPwd(salt, 'dan');
            User.create({firstName:'Dan',lastName:'Wahlin',username:'dan', salt: salt, hashed_pwd: hash});

            for(var i=0;i< 10000000; i++) {
                salt = encrypt.createSalt();
                hash = encrypt.hashPwd(salt, 'pwd' + i);
                User.create({firstName: 'fn' + i,lastName:'ln' + i,username:'fn' + i, salt: salt, hashed_pwd: hash, permissions: ['CanLogin', 'CanGetEvent', 'CanGetCustomer']});
            }
        }
    })
}

//exports.createDefaultUsers = createDefaultUsers;