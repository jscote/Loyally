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
        Injector
        .register({dependency: '/Processors/Processor::TaskNode', name: 'TaskNode'})
            .register({dependency: '/Processors/Processor::ConditionNode', name: 'ConditionNode'})
            .register({dependency: '/Processors/TestClasses::TestTaskNode', name: 'TestTaskNode'})
            .register({dependency: '/Processors/TestClasses::Test2TaskNode', name: 'Test2TaskNode'})
            .register({dependency: '/Processors/TestClasses::Test3TaskNode', name: 'Test3TaskNode'})
            .register({dependency: '/Processors/TestClasses::Test4TaskNode', name: 'Test4TaskNode'});
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

        var request = {data: []};

        taskNode.execute(request).then(function(response) {
            test.ok(response.data.length == 1);
            test.ok(response.data[0] == "executed 1");

            test.ok(request.data.length == 1, "Unexpected number of items in request data");
            test.ok(request.data[0] == "request data 1");
            test.done();
        });
    },
    testTaskCanExecuteSequence: function (test) {
        var taskNode = NodeFactory.create("TestTaskNode",{successor: NodeFactory.create('Test2TaskNode')});

        var request = {data: []};

        taskNode.execute(request).then(function(response) {
            test.ok(response.data.length == 2);
            test.ok(response.data[0] == "executed 1");
            test.ok(response.data[1] == "executed 2");

            test.ok(request.data.length == 2, "Unexpected number of items in request data");
            test.ok(request.data[0] == "request data 1");
            test.ok(request.data[1] == "request data 2");

            test.done();
        });

    },
    testTaskCanExecuteLongerSequence: function (test) {
        var taskNode = NodeFactory.create("TestTaskNode",
            {successor: NodeFactory.create('Test2TaskNode',
                {successor: NodeFactory.create('Test3TaskNode')})});

        var request = {data: []};

        taskNode.execute(request).then(function(response) {
            test.ok(response.data.length == 3);
            test.ok(response.data[0] == "executed 1");
            test.ok(response.data[1] == "executed 2");
            test.ok(response.data[2] == "executed 3");

            test.ok(request.data.length == 3, "Unexpected number of items in request data");
            test.ok(request.data[0] == "request data 1");
            test.ok(request.data[1] == "request data 2");
            test.ok(request.data[2] == "request data 3");

            console.log(response.data.join(', '));

            test.done();
        });

    },
    testTaskCanTrapErrors: function (test) {
        var taskNode = NodeFactory.create("Test4TaskNode");

        var request = {data: []};

        taskNode.execute(request).then(function(response) {
            test.ok(response.errors.length == 1);
            test.ok(response.errors[0] == "Test Error");
            test.ok(response.isSuccess == false);

            test.ok(request.data.length == 0, "Unexpected number of items in request data");

            test.done();
        });

    },
    testTaskCanTrapErrorsInLongSequence: function (test) {
        var taskNode = NodeFactory.create("TestTaskNode",
            {successor: NodeFactory.create('Test2TaskNode',
                {successor: NodeFactory.create('Test3TaskNode', {successor: NodeFactory.create('Test4TaskNode')})})});

        var request = {data: []};

        taskNode.execute(request).then(function(response) {
            test.ok(response.errors.length == 1, "Errors doesn't have expected number of items");
            test.ok(response.errors[0] == "Test Error", "Didn't get expected error message");
            test.ok(response.isSuccess == false, "isSuccess should be false");

            test.ok(response.data.length == 3);
            test.ok(response.data[0] == "executed 1");
            test.ok(response.data[1] == "executed 2");
            test.ok(response.data[2] == "executed 3");

            test.ok(request.data.length == 3, "Unexpected number of items in request data");
            test.ok(request.data[0] == "request data 1");
            test.ok(request.data[1] == "request data 2");
            test.ok(request.data[2] == "request data 3");

            console.log(response.data.join(', '));

            test.done();
        });

    }


};