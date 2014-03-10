/**
 * Created by jscote on 3/8/14.
 */

var p = require('path');

var Predicate = require(p.resolve(__dirname + '../../../server/Predicate/Predicate/')).Predicate;
var predicateFactory = require(p.resolve(__dirname + '../../../server/Predicate/Predicate/')).predicateFactory;
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

        var sp =  new PredicateSpecification(predicateFactory(function(item) {return item.value}, klass));

        var result = sp.isSatisfiedBy(o);

        test.ok(result);
        test.done();

    },

    testSpecificationIsSatisfiedWithFunctionAndClass: function(test) {

        var klass = function() {
            this.value = true;
        }

        var o = new klass();

        var sp =  new PredicateSpecification(function(item) {
            return item.value
        }, klass);

        var result = sp.isSatisfiedBy(o);

        test.ok(result);
        test.done();

    },

    testSpecificationThrowsWhenFunctionAndTypeDontMatch: function(test) {

        var klass = function() {
            this.value = true;
        }

        var klass1 = function() {
            this.value = true;
        }

        var o = new klass();

        var sp =  new PredicateSpecification(function(item) {
            return item.value
        }, klass1);

        test.throws(function() {
            var result =  sp.isSatisfiedBy(o);
        });

        test.done();

    },

    testSpecificationIsSatisfiedWithFunction: function(test) {

        var sp =  new PredicateSpecification(function(item) {return true});

        var result = sp.isSatisfiedBy({});

        test.ok(result);
        test.done();

    },

    testNotSpecificationIsSatisfiedWithFunction: function(test) {

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

    },

    testCombineSpecificationAreSatisfied: function(test){

        var Person = function(age, gender){
            this.age = age;
            this.gender = gender;
        }

        var genderSpec = new PredicateSpecification(function(item){
            return item.gender == 'M';
        }, Person);

        var ageGreaterThanOrEqual20Spec = new PredicateSpecification(function(item) {
           return item.age >= 20;
        }, Person);

        var ageLessThanOrEqual40Spec = new PredicateSpecification(function(item){
           return item.age <= 40;
        }, Person);

        var ageBetween20And40Spec = new PredicateSpecification(function(item) {
           return Specification.and(ageGreaterThanOrEqual20Spec, ageLessThanOrEqual40Spec).isSatisfiedBy(item);
        }, Person);


        var femaleBetweenAge20And40Spec = new PredicateSpecification(function(item){
            return Specification.and(ageBetween20And40Spec, Specification.not(genderSpec)).isSatisfiedBy(item);
        }, Person);

        test.ok(femaleBetweenAge20And40Spec.isSatisfiedBy(new Person(30, 'F')));
        test.ok(!femaleBetweenAge20And40Spec.isSatisfiedBy(new Person(30, 'M')));
        test.ok(!femaleBetweenAge20And40Spec.isSatisfiedBy(new Person(19, 'M')));
        test.ok(!femaleBetweenAge20And40Spec.isSatisfiedBy(new Person(19, 'F')));
        test.ok(!femaleBetweenAge20And40Spec.isSatisfiedBy(new Person(41, 'F')));
        test.ok(!femaleBetweenAge20And40Spec.isSatisfiedBy(new Person(41, 'M')));
        test.done();
    }
};