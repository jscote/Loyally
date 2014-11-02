/**
 * Created by jean-sebastiencote on 11/1/14.
 */

var p = require('path');

require(p.resolve(__dirname + '../../../server/config/injection'))(p.resolve(__dirname + '../../../server/'));


var Processor = require(p.resolve(__dirname + '../../../server/Processors/Processor')).Processor;
var NodeFactory = require(p.resolve(__dirname + '../../../server/Processors/Processor')).NodeFactory;
var TaskNode = require(p.resolve(__dirname + '../../../server/Processors/Processor')).TaskNode;
var ConditionNode = require(p.resolve(__dirname + '../../../server/Processors/Processor')).ConditionNode;
var LoopNode = require(p.resolve(__dirname + '../../../server/Processors/Processor')).LoopNode;


module.exports = {
    setUp: function (callback) {
        callback();
    },
    tearDown: function (callback) {
        // clean up
        callback();
    },
    testCanInstantiateProcessor: function (test) {
        var processor = new Processor();

        test.ok(processor, "Processor is not properly created");
        test.done();
    },
    testTaskNodeCanOnlyHaveANodeObjectSuccessor: function(test) {
        test.doesNotThrow(function() {
            var taskNode = NodeFactory.create('TaskNode', {successor: NodeFactory.create('TaskNode')});
        });

        test.throws(function() {
            var taskNode = NodeFactory.create('TaskNode', {successor: "something"});
        });

        test.done();
    },
    testConditionNodeHasMinimumRequirements: function (test) {

        test.doesNotThrow(function() {
            var conditionTask = NodeFactory.create('ConditionNode', {
                condition: {},
                trueSuccessor: NodeFactory.create('TaskNode')
            });
        });

        test.doesNotThrow(function() {
            var conditionTask = NodeFactory.create('ConditionNode', {
                condition: {},
                trueSuccessor: NodeFactory.create('TaskNode'),
                successor: NodeFactory.create('TaskNode')
            });

        });

        test.throws(function() {
            var conditionTask = NodeFactory.create('ConditionNode', {
                condition: {}
            });
        });

        test.throws(function() {
            var conditionTask = NodeFactory.create('ConditionNode');
        });
        test.done();
    },
    testCanInjectTaskNode: function(test) {

        var taskNode = Injector.resolve({target: 'TaskNode'});

        test.ok(taskNode);
        test.ok(taskNode instanceof TaskNode);

        test.done();
    },
    testCanInjectConditionNode: function(test) {
        var conditionNode = Injector.resolve({target: 'ConditionNode'})
        test.done();
    },
    testTaskCanExecute: function (test) {
        var taskNode = NodeFactory.create("TestTaskNode");
        var result = taskNode.execute();

        test.ok(result.data.length == 1);
        test.ok(result.data[0] == "executed 1");
        test.done();
    },
    testTaskCanExecuteSequence: function (test) {
        var taskNode = NodeFactory.create("TestTaskNode",{successor: NodeFactory.create('Test2TaskNode')});
        var result = taskNode.execute();

        test.ok(result.data.length == 2);
        test.ok(result.data[0] == "executed 1");
        test.ok(result.data[1] == "executed 2");
        test.done();
    }
};