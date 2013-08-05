#!/usr/bin/env node

/**
 * Server module exports method returning new instance of app.
 *
 * @param {Object} params - compound/express webserver initialization params.
 * @returns express powered express webserver
 */

var cluster = require('cluster');
var numCpus = require('os').cpus().length;

var app = module.exports = function getServerInstance(params) {
    params = params || {};
    // specify current dir as default root of server
    params.root = params.root || __dirname;

    var express =  require('express');
    var app = express();

    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.static(__dirname + '/app'));
    app.use(express.static(__dirname + '/app//partials'))
    app.use(function(err, req, res, next) {
        console.error(err.stack);
        next(err);
    }) ;

    return app;
};

var startListening = function(server){
    server.listen(port, host, function () {
        console.log(
            'Compound server listening on %s:%d within %s environment',
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
