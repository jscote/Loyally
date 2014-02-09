/**
 * Created by jscote on 2/2/14.
 */

(function (mongoose/*, userModel*/) {

    module.exports = function (config) {
        mongoose.connect(config.db);
        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error...'));
        db.once('open', function callback() {
            console.log('db opened');
        });


    };

})(require('mongoose'));