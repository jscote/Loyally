/**
 * Created by jean-sebastiencote on 11/1/14.
 */

var p = require('path');
var Processor = require(p.resolve(__dirname + '../../../server/Processors/Processor')).Processor;
var TaskNode = require(p.resolve(__dirname + '../../../server/Processors/Processor')).TaskNode;

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
    testTaskNodeCallsBaseClass: function (test) {
        var taskNode = new TaskNode();
        var result = taskNode.execute();

        test.ok(result == 'executed from TaskNode');
        test.done();
    },
    testTaskNodeCanOnlyHaveANodeObjectSuccessor: function(test) {
        test.doesNotThrow(function() {
            var taskNode = new TaskNode(new TaskNode());
        });

        test.throws(function() {
            var taskNode = new TaskNode('something');
        });

        test.done();
    }
};