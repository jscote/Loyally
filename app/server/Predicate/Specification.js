﻿var Predicate = require('./Predicate.js').Predicate;
var util = require('util');
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
        return left.isSatisfiedBy(item) && right.isSatisfiedBy(item);
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
        return left.isSatisfiedBy(item) || right.isSatisfiedBy(item);
    }));
};

Specification.not = function (spec) {
    if (!(spec instanceof Specification)) {
        throw Error('The left side of the condition is not a specification.');
    }

    return new PredicateSpecification(new Predicate(function (item) {
        return !spec.isSatisfiedBy(item);
    }));
};


var PredicateSpecification = function PredicateSpecification(fn, type) {
    Specification.call(this);
    if (!fn) {
        throw Error("The predicate must be specified.");
    }

    if (fn && !(fn instanceof Function)) {
        throw Error("The predicate should be a function that returns a boolean.");
    }

    this.predicate = fn;
    return this;
};

util.inherits(PredicateSpecification, Specification);

PredicateSpecification.prototype.isSatisfiedBy = function (item) {
    if (item === undefined) {
        throw Error("You must specify an item to evaluate the predicate");
    }

    var result = this.predicate(item);

    if(result instanceof Function){
        return result(item);}
    else {
        return result;
    }

};

exports.PredicateSpecification = PredicateSpecification;

exports.Specification = Specification;