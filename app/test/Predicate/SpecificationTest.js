/**
 * Created by jscote on 3/8/14.
 */

var p = require('path');

var Predicate = require(p.resolve(__dirname + '../../../server/Predicate/Predicate/')).Predicate;
var predicateFactory = require(p.resolve(__dirname + '../../../server/Predicate/Predicate/')).predicateFactory;
var PredicateSpecification = require(p.resolve(__dirname + '../../../server/Predicate/Specification/')).PredicateSpecification;
var Specification = require(p.resolve(__dirname + '../../../server/Predicate/Specification/')).Specification;
var q = require('q');

module.exports = {
    setUp: function (callback) {
        callback();
    },
    tearDown: function (callback) {
        // clean up
        callback();
    },


    testSpecificationIsSatisfiedWithPredicate: function (test) {
        test.expect(1);

        var klass = function () {
            this.value = true;
        }

        var o = new klass();

        var sp = new PredicateSpecification(predicateFactory(function (item) {

            var dfd = q.defer();

            process.nextTick(function () {
                dfd.resolve(item.value);
            });
            return dfd.promise
        }, klass));

        try {
            sp.isSatisfiedBy(o).then(function (result) {
                    test.ok(result);

                }
            ).fin(function () {
                    test.done()
                });
        } catch (e) {
            console.log('error ' + e);
        }

    },

    testSpecificationIsSatisfiedWithFunctionAndClass: function (test) {
        test.expect(1);
        var klass = function () {
            this.value = true;
        }

        var o = new klass();

        var sp = new PredicateSpecification(function (item) {

            var dfd = q.defer();

            process.nextTick(function () {
                dfd.resolve(item.value);
            });
            return dfd.promise
        }, klass);


        try {
            sp.isSatisfiedBy(o).then(function (result) {
                    test.ok(result);

                }
            ).fin(function () {
                    test.done()
                });
        } catch (e) {
            console.log('error ' + e);
        }

    },

    testSpecificationThrowsWhenFunctionAndTypeDontMatch: function (test) {

        var klass = function () {
            this.value = true;
        }

        var klass1 = function () {
            this.value = true;
        }

        var o = new klass();

        var sp = new PredicateSpecification(function (item) {
            return item.value
        }, klass1);


        var result = sp.isSatisfiedBy(o);

        result.then(function (r) {
            test.ok(false, 'expected to fail');
        }).catch(function (error) {
                test.ok(true, 'expected to fail');

            }).fin(test.done());


    },

    testSpecificationIsSatisfiedWithFunction: function (test) {

        var sp = new PredicateSpecification(function (item) {
            return true
        });

        sp.isSatisfiedBy({}).then(function (result) {
            test.ok(result);
            test.done();
        });


    },

    testNotSpecificationIsSatisfiedWithFunction: function (test) {

        var isGreaterThan5 = new Predicate(function (item) {
            return item > 5;
        });

        var sp = new PredicateSpecification(isGreaterThan5);

        var notSpec = Specification.not(sp);

        notSpec.isSatisfiedBy(5).then(function (result) {
            test.ok(result);
            test.done();
        });


    },

    testAndSpecificationIsSatisfiedWithFunction: function (test) {

        var spLeft = new PredicateSpecification(function (item) {
            return item.value;
        });
        var spRight = new PredicateSpecification(function (item) {
            return item.value;
        });


        Specification.and(spLeft, spRight).isSatisfiedBy({value: true}).then(function (result) {
            test.ok(result);
            test.done();
        });
    },

    testAndSpecificationIsNotSatisfiedWithFunction: function (test) {

        var spLeft = new PredicateSpecification(function (item) {
            return item.value;
        });
        var spRight = new PredicateSpecification(function (item) {
            return !item.value;
        });


        Specification.and(spLeft, spRight).isSatisfiedBy({value: true}).then(function (result) {
            test.ok(!result);
            test.done();
        });

    },

    testOrSpecificationIsSatisfiedWithFunction: function (test) {

        var spLeft = new PredicateSpecification(function (item) {
            return item.value;
        });
        var spRight = new PredicateSpecification(function (item) {
            return !item.value;
        });


        Specification.or(spLeft, spRight).isSatisfiedBy({value: true}).then(function (result) {
            test.ok(result);
            test.done();
        });

    },

    testOrSpecificationIsNotSatisfiedWithFunction: function (test) {

        var spLeft = new PredicateSpecification(function (item) {
            return !item.value;
        });
        var spRight = new PredicateSpecification(function (item) {
            return !item.value;
        });


        Specification.or(spLeft, spRight).isSatisfiedBy({value: true}).then(function (result) {
            test.ok(!result);
            test.done();
        });

    },

    testCombineSpecificationAreSatisfied: function (test) {

        var Person = function (age, gender) {
            this.age = age;
            this.gender = gender;
        }

        var genderSpec = new PredicateSpecification(function (item) {
            return item.gender == 'M';
        }, Person);

        var ageGreaterThanOrEqual20Spec = new PredicateSpecification(function (item) {
            return item.age >= 20;
        }, Person);

        var ageLessThanOrEqual40Spec = new PredicateSpecification(function (item) {
            return item.age <= 40;
        }, Person);

        var ageBetween20And40Spec = new PredicateSpecification(function (item) {
            return Specification.and(ageGreaterThanOrEqual20Spec, ageLessThanOrEqual40Spec).isSatisfiedBy(item);
        }, Person);


        var notMale = Specification.not(genderSpec);

        var femaleBetweenAge20And40Spec = new PredicateSpecification(function (item) {

            return Specification.and(ageBetween20And40Spec, notMale).isSatisfiedBy(item);
        }, Person);

        femaleBetweenAge20And40Spec.isSatisfiedBy(new Person(30, 'F')).then(function (result) {
            test.ok(result);
            test.done();
        });



        /*test.ok(!femaleBetweenAge20And40Spec.isSatisfiedBy(new Person(30, 'M')));
        test.ok(!femaleBetweenAge20And40Spec.isSatisfiedBy(new Person(19, 'M')));
        test.ok(!femaleBetweenAge20And40Spec.isSatisfiedBy(new Person(19, 'F')));
        test.ok(!femaleBetweenAge20And40Spec.isSatisfiedBy(new Person(41, 'F')));
        test.ok(!femaleBetweenAge20And40Spec.isSatisfiedBy(new Person(41, 'M')));
        test.done();*/
    },
    testAnotherCombineSpecificationAreSatisfied: function (test) {

        var Person = function (age, gender) {
            this.age = age;
            this.gender = gender;
        }

        var genderSpec = new PredicateSpecification(function (item) {
            return item.gender == 'M';
        }, Person);

        var ageGreaterThanOrEqual20Spec = new PredicateSpecification(function (item) {
            return item.age >= 20;
        }, Person);

        var ageLessThanOrEqual40Spec = new PredicateSpecification(function (item) {
            return item.age <= 40;
        }, Person);

        var ageBetween20And40Spec = new PredicateSpecification(function (item) {
            return Specification.and(ageGreaterThanOrEqual20Spec, ageLessThanOrEqual40Spec).isSatisfiedBy(item);
        }, Person);


        var notMale = Specification.not(genderSpec);

        var femaleBetweenAge20And40Spec = new PredicateSpecification(function (item) {

            return Specification.and(ageBetween20And40Spec, notMale).isSatisfiedBy(item);
        }, Person);

        femaleBetweenAge20And40Spec.isSatisfiedBy(new Person(30, 'M')).then(function (result) {
            test.ok(!result);
            test.done();
        });
    },
    testAnotherOneCombineSpecificationAreSatisfied: function (test) {

        var Person = function (age, gender) {
            this.age = age;
            this.gender = gender;
        }

        var genderSpec = new PredicateSpecification(function (item) {
            return item.gender == 'M';
        }, Person);

        var ageGreaterThanOrEqual20Spec = new PredicateSpecification(function (item) {
            return item.age >= 20;
        }, Person);

        var ageLessThanOrEqual40Spec = new PredicateSpecification(function (item) {
            return item.age <= 40;
        }, Person);

        var ageBetween20And40Spec = new PredicateSpecification(function (item) {
            return Specification.and(ageGreaterThanOrEqual20Spec, ageLessThanOrEqual40Spec).isSatisfiedBy(item);
        }, Person);


        var notMale = Specification.not(genderSpec);

        var femaleBetweenAge20And40Spec = new PredicateSpecification(function (item) {

            return Specification.and(ageBetween20And40Spec, notMale).isSatisfiedBy(item);
        }, Person);

        femaleBetweenAge20And40Spec.isSatisfiedBy(new Person(19, 'F')).then(function (result) {
            test.ok(!result);
            test.done();
        });
    }
};