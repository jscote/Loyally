/**
 * Created by jscote on 2/2/14.
 */

(function (express, passport) {


    'use strict';

    module.exports = function getServerInstance(params) {
        params = params || {};
        // specify current dir as default root of server
        params.root = params.root || __dirname;

        var app = express();

        app.configure(function () {
            app.set('controllers', params.root + '/routes');

            app.use(express.static(params.root + '../'));

            //TODO: Determine if we want to use static to render partials. If we want to apply security on it, it will be better to use regular routes
            app.use(express.static(root + '/partials'));

            app.use(express.cookieParser());
            app.use(express.bodyParser());
            app.use(express.methodOverride());
            app.use(express.session({secret: 'multi vision unicorns'}));
            app.use(passport.initialize());
            app.use(passport.session());
            app.use(app.router);


            app.use(function (err, req, res, next) {
                console.error(err.stack);
                next(err);
            });
        });

        return app;
    };

})(require('express'), require('passport'), require('express-resource-new'));