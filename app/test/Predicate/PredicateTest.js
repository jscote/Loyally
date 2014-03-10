/**
 * Created by jscote on 3/8/14.
 */

var p = require('path');
var util = require('util');

var Predicate = require(p.resolve(__dirname + '../../../server/Predicate/Predicate/')).Predicate;
var predicateFactory = require(p.resolve(__dirname + '../../../server/Predicate/Predicate/')).predicateFactory;

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
            var p = predicateFactory(function() {return true;});
        });

        test.done();
    },

    testPredicateFactoryReturnsAPredicate: function (test) {
        var p = predicateFactory(function(item) {return true;});

        test.ok(p instanceof Predicate);
        test.done();
    },

    testPredicateExpectsAFunction: function (test) {

        test.throws(function(){
            var p = predicateFactory();
        });

        test.done();
    },

    testPredicateExpectsAFunctionNotAString: function (test) {

        test.throws(function(){
            var p = predicateFactory('');
        });

        test.done();
    },

    testPredicateReturnsAFunctionWithProperItem: function(test) {

        var klass = function() {
            this.value = true;
        }

        var o = new klass();

        var p = predicateFactory(function(item) {return item.value}, klass);

        var result = p.getEvaluationFn(o)(o);

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

        var p = predicateFactory(function(item) {return item.value}, Klass);

        var result = p.getEvaluationFn(o)(o);

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

        var p = predicateFactory(function(item) {return item.value}, ChildKlass);

        var result = p.getEvaluationFn(o)(o);

        test.ok(result);
        test.done();

    },

    testPredicateReturnsAFunctionWithWrongItemType: function(test) {

        var klass = function() {
            this.value = true;
        }

        var o = '';

        var p = predicateFactory(function(item) {return item.value}, klass);

        test.throws(function(){
            var result = p.getEvaluationFn(o)(o);
        });

        test.done();

    }
};