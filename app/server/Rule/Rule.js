
var util = require('util');
var PredicateSpecification = require('../Predicate/Specification.js').PredicateSpecification;
var Predicate = require('../Predicate/Predicate.js').Predicate;

var Rule = function Rule(options) {
    options = options || {};

    if (!options.ruleName) throw Error("A ruleName must be specified");

    var _isTrue = false;
    Object.defineProperty(this, "ruleName", { value: options.ruleName, enumerable: true });
    Object.defineProperty(this, "ruleFriendlyName", { value: options.ruleFriendlyName || options.ruleName, enumerable: true});
    Object.defineProperty(this, "isEvaluated", { value: false, writable: true, enumerable: true });
    Object.defineProperty(this, "isTrue", {
        get: function () {
            if (!this.isEvaluated) {
                throw Error("Condition must be evaluated prior to know if it is true or false.");
            }
            return _isTrue;
        },
        set: function (value) {
            _isTrue = value;
            this.isEvaluated = true;
        }
    });

    Object.defineProperty(this, "hasRun", { value: false, writable: true, enumerable: true });

    var _problemState;
    Object.defineProperty(this, "problemState", {
        get: function () {
            return _problemState;
        },
        set: function (value) {
            if (_condition) {
                _condition.problemState = value;
            }

            _problemState = value;
        }
    , enumerable: true
    });

    var _condition = null;
    Object.defineProperty(this, "condition", {
        get: function () {
            return _condition;
        },
        set: function (value) {
            if (value) {
                if (!(value instanceof RuleCondition)) {
                    throw Error("Condition should be of type RuleCondition.");
                }
            }
            _condition = value;

        }
    , enumerable: true
    });

    options.condition = options.condition || {};

    if (options.condition === null)
    //set a condition that returns true all the time
        options.condition = new RuleCondition(new Predicate(function (item) {
            return true;
        }));

    this.condition = options.condition;

    return this;
};

Rule.prototype.evaluateCondition = function () {
    if (this.condition) {
        this.isTrue = this.condition.evaluateCondition();
    } else {
        this.isTrue = true;
    }

    return this.isTrue;
};

Rule.transform = function (o) {

};

Rule.prototype.toJSON = function () {

    var fromStringify;

    if (fromStringify == true) {
        console.log('hey');
        return;

    }

    var r = JSON.stringify(this, function (key, value) {
        fromStringify = true;
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                // Circular reference found, discard key
                return;
            }
            // Store value in our collection
            cache.push(value);
        }
        return value;
    });
    cache = null;

    var o = JSON.parse(r);

    //fromStringify = false;
    return o;

};



var BusinessRule = function BusinessRule(options) {
    Rule.call(this, options);

    Object.defineProperty(this, "businessAction", {
        writable: true
    });

    this.businessAction = new BusinessAction({ problemState: this.problemState, action: options.action, executionContext: options.executionContext });

    return this;
};

util.inherits(BusinessRule, Rule);


var RuleCondition = function RuleCondition(predicate) {
    PredicateSpecification.call(this, predicate);
    Object.defineProperty(this, "problemState", { writable: true });

    return this;
};

util.inherits(RuleCondition, PredicateSpecification);

RuleCondition.prototype.evaluateCondition = function () {
    return this.isSatisfiedBy(this.problemState);
};

var BusinessAction = function BusinessAction(options) {
    options = options || { };

    var _action;
    Object.defineProperty(this, "action", {
        get: function () {
            return _action;
        },
        set: function (value) {
            if (value) {
                if (!(value instanceof Function)) {
                    throw Error("Action should be a function.");
                }
                _action = value;
            }
        }
    });

    this.action = options.action || null;

    var _problemState;
    Object.defineProperty(this, "problemState", {
        get: function () {
            return _problemState;
        },
        set: function (value) {
            _problemState = value;
        }
    });

    this.problemState = options.problemState || null;

    var _executionContext;
    Object.defineProperty(this, "executionContext", {
        get: function () {
            return _executionContext;
        },
        set: function (value) {
            _executionContext = value;
        }
    });

    this.executionContext = options.executionContext || null;
};

BusinessAction.prototype.execute = function () {
    if (this.action) {
        this.action(this.problemState, this.executionContext);
    }
};

//Exports
exports.Rule = Rule;
exports.BusinessRule = BusinessRule;
exports.RuleCondition = RuleCondition;
exports.BusinessAction = BusinessAction;