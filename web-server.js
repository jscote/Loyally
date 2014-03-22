#!/usr/bin/env node

/**
 * Server module exports method returning new instance of app.
 *
 * @param {Object} params - compound/express webserver initialization params.
 * @returns express powered express webserver
 *
 * Postgre is listening on the default installation port which is 5432
 */

/*require('nodetime').profile({
    accountKey: 'd6fdfec48ef06e090eb24ed7bb2d6b1e0c423b83',
    appName: 'Node.js Application',
    debug: true
});*/



var cluster = require('cluster');
var numCpus = require('os').cpus().length;


//Configure environment
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

//DONE: No need to determine an interface to call all the task in a config folder as the order in which the files need to be executed is important.
//      Writing something to do this would add complexity without bringing much benefit. The intent would have been to avoid missing a config task
//      but since it may require configuration of ordering, it is more complex and less explicit than calling each file one after another, in the order
//      that is desired./

//Get configuration file based on environment
var config = require('./app/server/config/config')[env];

//Configure Injection
require('./app/server/config/injection')(config.rootPath);

//Configure postgres
require('./app/server/config/db')(config);

//Configure all models
require('./app/server/config/models')(config);


//Configure Express
var app = require('./app/server/config/express')({root: config.rootPath});

//Configure Passport
require('./app/server/config/passport')();

//Configure Routes
require('./app/server/config/routes')(app);

var startListening = function (server) {
    server.listen(config.port, host, function () {
        console.log(
            'Web server listening on %s:%d within %s environment',
            host, config.port, server.set('env')
        );
    });
};

if (!module.parent) {
    //var port = process.env.PORT || 8000;
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

setInterval(function () {
    if (global.gc) {
        console.log('garbage collection');
        //Injector = null;
       global.gc();

    }
}, 25000)