/**
 * Created by jscote on 3/8/14.
 */

var p = require('path');

var Predicate = require(p.resolve(__dirname + '../../../server/Predicate/Predicate/')).Predicate;
var predicateFactory = require(p.resolve(__dirname + '../../../server/Predicate/Predicate/')).predicateFactory;
var PredicateSpecification = require(p.resolve(__dirname + '../../../server/Predicate/Specification/')).PredicateSpecification;
var Specification = require(p.resolve(__dirname + '../../../server/Predicate/Specification/')).Specification;
var Rule = require(p.resolve(__dirname + '../../../server/Rule/Rule/')).Rule;
var BusinessRule = require(p.resolve(__dirname + '../../../server/Rule/Rule/')).BusinessRule;
var RuleCondition = require(p.resolve(__dirname + '../../../server/Rule/Rule/')).RuleCondition;
var RuleEvaluator = require(p.resolve(__dirname + '../../../server/RuleEvaluator/RuleEvaluator/')).RuleEvaluator;
var BusinessRuleEvaluator = require(p.resolve(__dirname + '../../../server/RuleEvaluator/RuleEvaluator/')).BusinessRuleEvaluator;
var EventEmitter = require('events').EventEmitter

module.exports = {
    setUp: function (callback) {
        callback();
    },
    tearDown: function (callback) {
        // clean up
        callback();
    },
    testRuleEvaluatorCanCreateRuleEvaluator: function (test) {


        var re = new RuleEvaluator();

        test.ok(re instanceof EventEmitter);

        test.done();

        /* c.evaluateCondition(new Person(30, 'F')).then(function(result) {
         test.ok(result);
         test.done();
         });*/

    },
    testRuleEvaluatorCanAddRule: function (test) {
        var re = new RuleEvaluator();
        var r = new Rule({ruleName: 'HasAName', condition: new RuleCondition(function (item) {
            return item.value;
        })});
        re.addRule(r).then(function (result) {
            test.equal(r, result);
            test.done();
        });
    },
    testRuleEvaluatorCannotAddRuleWhenItsNotARule: function (test) {
        var re = new RuleEvaluator();
        var r = {};
        re.addRule(r).then(function (result) {

        }).fail(function (result) {
                test.equal(result, 'The rule to evaluate is not a rule object.');
                test.done();
            });
    },
    testRuleEvaluatorCannotAddNullRule: function (test) {
        var re = new RuleEvaluator();

        re.addRule(null).then(function (result) {

        }).fail(function (result) {
                test.equal(result, 'The rule should be specified for evaluation.');
                test.done();
            });
    },
    testRuleEvaluatorCannotAddUndefinedRule: function (test) {
        var re = new RuleEvaluator();

        re.addRule().then(function (result) {

        }).fail(function (result) {
                test.equal(result, 'The rule should be specified for evaluation.');
                test.done();
            });
    },
    testBusinessRuleEvaluatorCanCreateRuleEvaluator: function (test) {


        var re = new BusinessRuleEvaluator();

        test.ok(re instanceof EventEmitter);
        test.ok(re instanceof RuleEvaluator);

        test.done();

        /* c.evaluateCondition(new Person(30, 'F')).then(function(result) {
         test.ok(result);
         test.done();
         });*/

    },
    testBusinessRuleEvaluatorCanNotAddRule: function (test) {
        var re = new BusinessRuleEvaluator();
        var r = new Rule({ruleName: 'HasAName', condition: new RuleCondition(function (item) {
            return item.value;
        })});
        re.addRule(r).then(function (result) {

        }).fail(function (result) {
                test.equal(result, 'The rule to evaluate is not a rule object.');
                test.done();
            });
    },
    testBusinessRuleEvaluatorCanAddBusinessRule: function (test) {
        var re = new BusinessRuleEvaluator();
        var r = new BusinessRule({ruleName: 'HasAName', condition: new RuleCondition(function (item) {
            return item.value;
        })});
        re.addRule(r).then(function (result) {
            test.equal(result, r);
            test.done();
        });
    },
    testBusinessRuleEvaluatorCannotAddRuleWhenItsNotARule: function (test) {
        var re = new BusinessRuleEvaluator();
        var r = {};
        re.addRule(r).then(function (result) {

        }).fail(function (result) {
                test.equal(result, 'The rule to evaluate is not a rule object.');
                test.done();
            });
    },
    testBusinessRuleEvaluatorCannotAddNullRule: function (test) {
        var re = new BusinessRuleEvaluator();

        re.addRule(null).then(function (result) {

        }).fail(function (result) {
                test.equal(result, 'The rule should be specified for evaluation.');
                test.done();
            });
    },
    testBusinessRuleEvaluatorCannotAddUndefinedRule: function (test) {
        var re = new BusinessRuleEvaluator();

        re.addRule().then(function (result) {

        }).fail(function (result) {
                test.equal(result, 'The rule should be specified for evaluation.');
                test.done();
            });
    }

};