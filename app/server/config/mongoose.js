/**
 * Created by jscote on 2/2/14.
 */

//TODO: Change the way schemas are being configured. The user schema is instantiated because the method is called on the User object.
//TODO: because in other require, the model is directly requested from mongoose module but the schema hasn't been instantiated yet.

(function (mongoose/*, userModel*/) {

    module.exports = function (config) {
        mongoose.connect(config.db);
        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error...'));
        db.once('open', function callback() {
            console.log('db opened');
        });

        //userModel.createDefaultUsers();
    };

})(require('mongoose')/*, require('../models/User')*/);