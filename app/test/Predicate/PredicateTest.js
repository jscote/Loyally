/**
 * Created by jscote on 3/8/14.
 */

var p = require('path');
var util = require('util');

var predicate = require(p.resolve(__dirname + '../../../server/Predicate/Predicate/')).Predicate;

module.exports = {
    setUp: function (callback) {
        callback();
    },
    tearDown: function (callback) {
        // clean up
        callback();
    },
    testTypeIsNotRequired: function (test) {

        test.doesNotThrow(function(){
            var p = predicate(function() {return true;});
        });

        test.done();
    },

    testPredicateReturnsAFunction: function (test) {
        var p = predicate(function(item) {return true;});

        test.equal(typeof(p), 'function');
        test.done();
    },

    testPredicateExpectsAFunction: function (test) {

        test.throws(function(){
            var p = predicate();
        });

        test.done();
    },

    testPredicateExpectsAFunctionNotAString: function (test) {

        test.throws(function(){
            var p = predicate('');
        });

        test.done();
    },

    testPredicateReturnsAFunctionWithProperItem: function(test) {

        var klass = function() {
            this.value = true;
        }

        var o = new klass();

        var p = predicate(function(item) {return item.value}, klass);

        var result = p(o)(o);

        test.ok(result);
        test.done();

    },

    testPredicateReturnsAFunctionWithProperInheritedItem: function(test) {

        var Klass = function() {
            this.value = true;
        }

        var ChildKlass = function() {
            Klass.call(this);
            this.somethingElse = true;
        }

        util.inherits(Klass, ChildKlass);

        var o = new Klass();

        var p = predicate(function(item) {return item.value}, Klass);

        var result = p(o)(o);

        test.ok(result);
        test.done();

    },

    testPredicateReturnsAFunctionWithUsingInheritedItem: function(test) {

        var Klass = function() {
            this.value = true;
        }

        var ChildKlass = function() {
            Klass.call(this);
            this.somethingElse = true;
        }

        util.inherits(Klass, ChildKlass);

        var o = new Klass();

        var p = predicate(function(item) {return item.value}, ChildKlass);

        var result = p(o)(o);

        test.ok(result);
        test.done();

    },

    testPredicateReturnsAFunctionWithWrongItemType: function(test) {

        var klass = function() {
            this.value = true;
        }

        var o = '';

        var p = predicate(function(item) {return item.value}, klass);

        test.throws(function(){
            var result = p(o)(o);
        });

        test.done();

    }
};