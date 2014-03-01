/**
 * Created by jscote on 2/2/14.
 */

(function (express, passport, Sequelize, postgres, LocalStrategy) {

    'use strict';

    var User = global.sequelize.model('User');

    module.exports = function () {
        passport.use
            (new LocalStrategy(
                function (username, password, done) {
                    User.find({username: username}).done(function (err, user) {
                        if (user && user.authenticate(password)) {
                            return done(null, user);
                        } else {
                            return done(null, false);
                        }
                    })
                }
            ));

        passport.serializeUser(function (user, done) {
            if (user) {
                done(null, user.id);
            }
        });

        passport.deserializeUser(function (id, done) {
            User.find({id: id}).done(function (err, user) {
                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            })
        })

    };

})(
        require('express'),
        require('passport'),
        require('sequelize-postgres').sequelize,
        require('sequelize-postgres').postgres,
        require('passport-local').Strategy
    );