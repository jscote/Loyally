#!/usr/bin/env node

/**
 * Server module exports method returning new instance of app.
 *
 * @param {Object} params - compound/express webserver initialization params.
 * @returns express powered express webserver
 *
 * Postgre is listening on the default installation port which is 5432
 */


var cluster = require('cluster');
var numCpus = require('os').cpus().length;

global.Injector = require(__dirname + '/app/server/Injector/Injector');
global.Injector.setBasePath(__dirname);
require(__dirname + '/app/server/Injector/Configuration');

var RouteRegistration = Injector.resolve({target: 'RouteRegistration'});


var app = module.exports = function getServerInstance(params) {
    params = params || {};
    // specify current dir as default root of server
    params.root = params.root || __dirname;

    var express =  require('express');
    var Resource = require('express-resource-new');
    var app = express();

    app.configure(function() {
       app.set('controllers', __dirname + '/app/server/routes');
    });


    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.static(__dirname + '/app'));
    app.use(express.static(__dirname + '/app/server/partials'))


    //TODO: Think of injecting routeRegistration and use it for a generic strategy resolver to inject proper controller in our route handler
    app.resource(RouteRegistration.registerRoute({route: {}, routeName: 'events'}), {id: 'id'});
    app.resource((function() {return 'customers';})(), function() {app.resource('events')});


    app.use(function(err, req, res, next) {
        console.error(err.stack);
        next(err);
    }) ;

    return app;
};

var startListening = function(server){
    server.listen(port, host, function () {
        console.log(
            'Web server listening on %s:%d within %s environment',
            host, port, server.set('env')
        );
    });
}  ;

if (!module.parent) {
    var port = process.env.PORT || 8000;
    var host = process.env.HOST || '0.0.0.0';

    var server = app();

    //using only one core while developing as it is not debuggable with multiple core running
    if (server.set('env') !== 'development') {
        if (cluster.isMaster) {
            // Fork workers.
            for (var i = 0; i < numCpus; i++) {
                cluster.fork();
            }

            cluster.on('exit', function (worker, code, signal) {
                console.log('worker ' + worker.process.pid + ' died');
            });
        } else {
            // Workers can share any TCP connection
            // In this case its a HTTP server
            startListening(server);
        }
    } else {
        startListening(server);
    }
}
