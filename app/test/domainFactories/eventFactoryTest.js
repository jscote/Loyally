/**
 * Created by jscote on 3/8/14.
 */

var p = require('path');
var pg = require('pg');

require(p.resolve(__dirname + '../../../server/config/injection'))(p.resolve(__dirname + '../../../server/'));
var factory = require(p.resolve(__dirname + '../../../server/domainFactories/eventFactory'));


module.exports = {
    setUp: function (callback) {
        callback();
    },
    tearDown: function (callback) {
        // clean up
        callback();
    },
    testSomething: function (test) {

        pg.connect("pg://postgres:postgres@localhost:5432/loyally", function(error, client, done) {

            if(error) {
                console.log(error);
            }

            client.query('SELECT GetUsers()', function(error, results){
                if(error) {
                    console.log(error);
                }
                console.log('we got results');
                done();
            });

        });

        var f = new factory();

        var ev = f.create({name: "my event", startDate: Date(), endDate: Date()});

        test.ok(ev.name == "my event");

        ev.setBasicInfo("my event is changed");

        test.ok(ev.state == 1);
        test.ok(ev.name == "my event is changed");

        test.ok(ev);

        test.done();
    }
};