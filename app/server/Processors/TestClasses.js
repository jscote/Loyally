/**
 * Created by jean-sebastiencote on 11/2/14.
 */
(function(util, base) {

    function TestTaskNode(serviceMessage) {
        base.TaskNode.call(this, serviceMessage)
    }

    util.inherits(TestTaskNode, base.TaskNode);

    TestTaskNode.prototype.handleRequest = function(request) {
        var response = new this.messaging.ServiceResponse();

        if(!Array.isArray(response.data)) response.data = [];
        response.data.push("executed 1");

        return response;

    };

    function Test2TaskNode(serviceMessage) {
        base.TaskNode.call(this, serviceMessage)
    }

    util.inherits(Test2TaskNode, base.TaskNode);

    Test2TaskNode.prototype.handleRequest = function(request) {
        var response = new this.messaging.ServiceResponse();

        if(!Array.isArray(response.data)) response.data = [];
        response.data.push("executed 2");

        return response;

    };

    module.exports.TestTaskNode = TestTaskNode;
    module.exports.Test2TaskNode = Test2TaskNode;

})(
    require('util'),
    require(Injector.getBasePath() + '/Processors/Processor')
);