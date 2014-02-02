/**
 * Created by jscote on 2/2/14.
 */

(function (express, passport, mongoose, LocalStrategy) {

    'use strict';

    var User = mongoose.model('User');

    module.exports = function () {
        passport.use
            (new LocalStrategy(
                function (username, password, done) {
                    User.findOne({username: username}).exec(function (err, user) {
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
                done(null, user._id);
            }
        });

        passport.deserializeUser(function (id, done) {
            User.findOne({_id: id}).exec(function (err, user) {
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
        require('mongoose'),
        require('passport-local').Strategy
    );