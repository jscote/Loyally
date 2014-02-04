/**
 * Created by jscote on 2/2/14.
 */

//TODO: review file structure to make it compliant with revealing module pattern
//TODO: review mechanism to work with injected controllers

(function (auth) {

    //TODO: instead of going to controllers folder, we would go to routes folder. The function there would simply be
    //TODO: calling a real injected controller
    //TODO: figure out how to get the authentication in that chain
    //TODO: Figure a way to specify a starting path such as /api to use with resources.
    //users = require('../controllers/users'),

    module.exports = function (app) {

        //app.get('/api/users', auth.requiresRole('admin'), users.getUsers);
        //app.post('/api/users', users.createUser);
        // app.put('/api/users', users.updateUser);


        /*app.get('/partials/*', function(req, res) {
         res.render('../../public/app/' + req.params);
         });*/
        app.post('/login', auth.authenticate);

        app.post('/logout', function (req, res) {
            req.logout();
            res.end();
        });


        app.resource('events');
        app.resource('customers', function () {
            app.resource('events')
        });

        app.get('*', function (req, res) {
            res.render('index', {
                bootstrappedUser: req.user
            });
        });

        app.all('/api/*', function (req, res) {
            res.send(404);
        });
    };

})(require('../Security/auth'));



