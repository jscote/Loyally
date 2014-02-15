/**
 * Created by jscote on 2/2/14.
 */

//TODO: review mechanism to work with injected controllers for regular routes

(function (auth) {

    module.exports = function (app) {

        app.post('/login', auth.authenticate);

        app.post('/logout', function (req, res) {
            req.logout();
            res.end();
        });

        app.get('/', function (req, res) {
            res.render('index', {
                bootstrappedUser: req.user
            });
        });

        // Put other specific routes for pages or partials here

        app.resource('api', function () {
            this.resource('events');
            this.resource('customers', function () {
                this.resource('events');
                this.resource('items');
            });
            this.resource('items')

        });


        app.all('/*', function (req, res) {
            res.send(404);
        });

    };

})(require('../Security/auth'));



