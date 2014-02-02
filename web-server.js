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


//Configure environment
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

//TODO: determine an interface for config tasks and call all the tasks in the config folder

//Get configuration file based on environment
var config = require('./app/server/config/config')[env];

//Configure Injection
require('./app/server/config/injection')(config.rootPath);

//Configure mongoose
require('./app/server/config/mongoose')(config);

//Configure Express
var app = require('./app/server/config/express')({root: config.rootPath});

//Configure Passport
require('./app/server/config/passport')();

//Configure Routes
require('./app/server/config/routes')(app);

var startListening = function (server) {
    server.listen(port, host, function () {
        console.log(
            'Web server listening on %s:%d within %s environment',
            host, port, server.set('env')
        );
    });
};

if (!module.parent) {
    var port = process.env.PORT || 8000;
    var host = process.env.HOST || '0.0.0.0';



    //using only one core while developing as it is not debuggable with multiple core running
    if (env !== 'development') {
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
            startListening(app);
        }
    } else {
        startListening(app);
    }
}
