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

        request.data.push("request data 1");

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

        request.data.push("request data 2");

        return response;

    };

    function Test3TaskNode(serviceMessage) {
        base.TaskNode.call(this, serviceMessage)
    }

    util.inherits(Test3TaskNode, base.TaskNode);

    Test3TaskNode.prototype.handleRequest = function(request) {
        var response = new this.messaging.ServiceResponse();

        if(!Array.isArray(response.data)) response.data = [];
        response.data.push("executed 3");

        request.data.push("request data 3");

        return response;

    };

    function Test4TaskNode(serviceMessage) {
        base.TaskNode.call(this, serviceMessage)
    }

    util.inherits(Test4TaskNode, base.TaskNode);

    Test4TaskNode.prototype.handleRequest = function(request) {
        throw Error("Test Error");

        request.data.push("request data 4");
    };

    module.exports.TestTaskNode = TestTaskNode;
    module.exports.Test2TaskNode = Test2TaskNode;
    module.exports.Test3TaskNode = Test3TaskNode;
    module.exports.Test4TaskNode = Test4TaskNode;

})(
    require('util'),
    require(Injector.getBasePath() + '/Processors/Processor')
);