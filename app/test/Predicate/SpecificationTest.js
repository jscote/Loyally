/**
 * Created by jscote on 3/8/14.
 */

var p = require('path');

var Predicate = require(p.resolve(__dirname + '../../../server/Predicate/Predicate/')).Predicate;
var PredicateSpecification = require(p.resolve(__dirname + '../../../server/Predicate/Specification/')).PredicateSpecification;
var Specification = require(p.resolve(__dirname + '../../../server/Predicate/Specification/')).Specification;

module.exports = {
    setUp: function (callback) {
        callback();
    },
    tearDown: function (callback) {
        // clean up
        callback();
    },


    testSpecificationIsSatisfiedWithPredicate: function(test) {

        var klass = function() {
            this.value = true;
        }

        var o = new klass();

        var sp =  new PredicateSpecification(new Predicate(function(item) {return item.value}, klass));

        var result = sp.isSatisfiedBy(o);

        test.ok(result);
        test.done();

    },

    testSpecificationIsSatisfiedWithFunctionAndClass: function(test) {

        var klass = function() {
            this.value = true;
        }

        var o = new klass();

        var sp =  new PredicateSpecification(Predicate(function(item) {
            return item.value
        }, klass));

        var result = sp.isSatisfiedBy(o);

        test.ok(result);
        test.done();

    },

    testSpecificationIsSatisfiedWithFunction: function(test) {

        var sp =  new PredicateSpecification(function(item) {return true});

        var result = sp.isSatisfiedBy({});

        test.ok(result);
        test.done();

    },

    testNotSpecificationIsStatisfiedWithFunction: function(test) {

        var isGreaterThan5 = new Predicate(function(item) {
            return item > 5;
        });

        var sp =  new PredicateSpecification(isGreaterThan5);

        var notSpec = Specification.not(sp);

        var result = notSpec.isSatisfiedBy(5);

        test.ok(result);
        test.done();

    },

    testAndSpecificationIsSatisfiedWithFunction: function(test) {

        var spLeft =  new PredicateSpecification(function(item) {return item.value;});
        var spRight =  new PredicateSpecification(function(item) {return item.value;});


        var result = Specification.and(spLeft, spRight).isSatisfiedBy({value: true});

        test.ok(result);
        test.done();

    },

    testAndSpecificationIsNotSatisfiedWithFunction: function(test) {

        var spLeft =  new PredicateSpecification(function(item) {return item.value;});
        var spRight =  new PredicateSpecification(function(item) {return !item.value;});


        var result = Specification.and(spLeft, spRight).isSatisfiedBy({value: true});

        test.ok(!result);
        test.done();

    },

    testOrSpecificationIsSatisfiedWithFunction: function(test) {

        var spLeft =  new PredicateSpecification(function(item) {return item.value;});
        var spRight =  new PredicateSpecification(function(item) {return !item.value;});


        var result = Specification.or(spLeft, spRight).isSatisfiedBy({value: true});

        test.ok(result);
        test.done();

    },

    testOrSpecificationIsNotSatisfiedWithFunction: function(test) {

        var spLeft =  new PredicateSpecification(function(item) {return !item.value;});
        var spRight =  new PredicateSpecification(function(item) {return !item.value;});


        var result = Specification.or(spLeft, spRight).isSatisfiedBy({value: true});

        test.ok(!result);
        test.done();

    }
};