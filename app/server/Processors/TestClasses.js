/**
 * Created by jean-sebastiencote on 11/2/14.
 */
(function (q, util, base) {

    function TestTaskNode(serviceMessage) {
        base.TaskNode.call(this, serviceMessage)
    }

    util.inherits(TestTaskNode, base.TaskNode);

    TestTaskNode.prototype.handleRequest = function (request) {
        var dfd = q.defer();
        var self = this;

        process.nextTick(function () {

            var response = new self.messaging.ServiceResponse();

            if (!Array.isArray(response.data)) response.data = [];
            response.data.push("executed 1");

            request.data.push("request data 1");


            dfd.resolve(response);
        });


        return dfd.promise;

    };

    function Test2TaskNode(serviceMessage) {
        base.TaskNode.call(this, serviceMessage)
    }

    util.inherits(Test2TaskNode, base.TaskNode);

    Test2TaskNode.prototype.handleRequest = function (request) {
        var response = new this.messaging.ServiceResponse();

        if (!Array.isArray(response.data)) response.data = [];
        response.data.push("executed 2");

        request.data.push("request data 2");

        return response;

    };

    function Test3TaskNode(serviceMessage) {
        base.TaskNode.call(this, serviceMessage)
    }

    util.inherits(Test3TaskNode, base.TaskNode);

    Test3TaskNode.prototype.handleRequest = function (request) {
        var response = new this.messaging.ServiceResponse();

        if (!Array.isArray(response.data)) response.data = [];
        response.data.push("executed 3");

        request.data.push("request data 3");

        return response;

    };

    function Test4TaskNode(serviceMessage) {
        base.TaskNode.call(this, serviceMessage)
    }

    util.inherits(Test4TaskNode, base.TaskNode);

    Test4TaskNode.prototype.handleRequest = function (request) {
        var dfd = q.defer();
        var self = this;

        process.nextTick(function () {

            try{
                throw Error("Test Error");

                request.data.push("request data 4");
            }
            catch(e) {
                dfd.reject(e);
                return;
            }

            dfd.resolve();

        });


        return dfd.promise;


    };

    function TestLoopTaskNode(serviceMessage) {
        base.TaskNode.call(this, serviceMessage)
    }

    util.inherits(TestLoopTaskNode, base.TaskNode);

    TestLoopTaskNode.prototype.handleRequest = function (request) {

        var self = this;
        var dfd = q.defer();

        process.nextTick(function() {
            var response = new self.messaging.ServiceResponse();

            request.data.index++;

            if (!Array.isArray(response.data)) response.data = [];
            response.data.push("executed in loop");

            return dfd.resolve(response);
        });

        return dfd.promise;

    };


    module.exports.TestTaskNode = TestTaskNode;
    module.exports.Test2TaskNode = Test2TaskNode;
    module.exports.Test3TaskNode = Test3TaskNode;
    module.exports.Test4TaskNode = Test4TaskNode;
    module.exports.TestLoopTaskNode = TestLoopTaskNode;

})(
    require('q'),
    require('util'),
    require(Injector.getBasePath() + '/Processors/Processor')
);