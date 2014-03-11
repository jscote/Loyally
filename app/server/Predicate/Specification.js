var Predicate = require('./Predicate.js').Predicate;
var predicateFactory = require('./Predicate.js').predicateFactory;
var util = require('util');
var q = require('q');
//var PredicateSpecification = require('./PredicateSpecification.js').PredicateSpecification;

var Specification = function Specification() {
    return this;
};

Specification.and = function (left, right) {
    if (!left || !right) {
        throw Error('You must specify a left and right side for this specifications.');
    }

    if (!(left instanceof Specification)) {
        throw Error('The left side of the condition is not a specification.');
    }

    if (!(right instanceof Specification)) {
        throw Error('The left side of the condition is not a specification.');
    }

    return new PredicateSpecification(new Predicate(function (item) {
        var dfd = q.defer();

        q.spread([left.isSatisfiedBy(item), right.isSatisfiedBy(item)], function(l, r) {
            dfd.resolve(l && r);
        });

        return dfd.promise;
    }));
};

Specification.or = function (left, right) {
    if (!left || !right) {
        throw Error('You must specify a left and right side for this specifications.');
    }

    if (!(left instanceof Specification)) {
        throw Error('The left side of the condition is not a specification.');
    }

    if (!(right instanceof Specification)) {
        throw Error('The left side of the condition is not a specification.');
    }

    return new PredicateSpecification(new Predicate(function (item) {

        var dfd = q.defer();

        q.spread([left.isSatisfiedBy(item), right.isSatisfiedBy(item)], function(l, r) {
            dfd.resolve(l || r);
        });

        return dfd.promise;
    }));
};

Specification.not = function (spec) {
    if (!(spec instanceof Specification)) {
        throw Error('The left side of the condition is not a specification.');
    }

    return new PredicateSpecification(new Predicate(function (item) {
        var dfd = q.defer();

        spec.isSatisfiedBy(item).then(function(result){
           dfd.resolve(!result);
        });

        return dfd.promise;
    }));
};


var PredicateSpecification = function PredicateSpecification(fn, type) {
    Specification.call(this);
    if (!fn) {
        throw Error("The predicate must be specified.");
    }

    if (fn && !(fn instanceof Predicate)) {
        fn = predicateFactory(fn, type);
    }

    this.predicate = fn;
    return this;
};

util.inherits(PredicateSpecification, Specification);

PredicateSpecification.prototype.isSatisfiedBy = function (item) {
    if (item === undefined) {
        throw Error("You must specify an item to evaluate the predicate");
    }

    var dfd = q.defer();

    try {
        q.when(this.predicate.getEvaluationFn(item)(item), function (result) {
            dfd.resolve(result);
        }, function (error) {
            dfd.reject(error);
        });
    } catch (e) {
        dfd.reject(e);
    }

    return dfd.promise;

    //return this.predicate.getEvaluationFn(item)(item);

};

exports.PredicateSpecification = PredicateSpecification;

exports.Specification = Specification;