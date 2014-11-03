/**
 * Created by jean-sebastiencote on 11/1/14.
 */
(function(util, _, q) {

    /*
    Expected hierarchy of objects to deal with in the execution of a process. It all starts with a BlockNode, which will
    contain one or more child nodes.

    Node is an abstract class and has a successor. If successor is Null, no more processing forward. It also has a default
    ^    implementation of Execute, which just calls the successor if present
    |
    |
    |--TaskNode - has a HandleRequest method or something like that to do actual work
    |--ConditionNode - has a true successor, which is mandatory and a false successor, which is optional. The
    |                  regular successor is where process resumes after the condition block is evaluated
    |--BlockNode - has ChildNodes that are executed in sequence. It also has a compensator so that errors are handled
    |              at that level. Errors are rethrown so that any compensator can catch them and do something (for nested blocks)
    |--LoopNode - has a condition, which is evaluated by a rule set and a loopBlock, which is a BlockNode that has child nodes.
    |             the successor is where process resumes after the loop exits.
    |--IteratorNode - has an iterator to loop through until all items are iterated. For each item, the loopBlock will be called, which is a BlockNode

     */

    function Node(serviceMessage) {

        var _successor;
        Object.defineProperty(this, "successor", {
            get: function () {
                return _successor;
            },
            set: function (value) {
                if(!value) return;
                if(value instanceof Node) {
                    _successor = value;
                } else {
                    throw Error('Successor is not of type Node or one of its descendant');
                }
            }
        });

        this.messaging = serviceMessage;

        return this;
    }

    Node.copyResponseIntoAnother = function(response, successorResponse) {
        response.errors = response.errors.concat(successorResponse.errors);

        if(Array.isArray(response.data) && Array.isArray(successorResponse.data)) {
            response.data = response.data.concat(successorResponse.data);
        } else {
            for (var prop in successorResponse.data) {


                if (Array.isArray(response.data[prop]) && Array.isArray(successorResponse.data[prop])) {
                    response.data = response.data[prop].concat(successorResponse.data[prop]);
                } else {
                    response.data[prop] = successorResponse.data[prop];
                }
            }

        }
        response.isSuccess = !response.isSuccess ? response.isSuccess : successorResponse.isSuccess;

    };

    Node.prototype.initialize = function(params) {
        params = params || {};
        this.successor = params.successor;
    };

    Node.prototype.execute = function(request) {
        var response;
        var self = this;
        var dfd = q.defer();
        try {
            response = self.handleRequest(request);

            if(!response instanceof self.messaging.ServiceResponse) {
                response = new self.messaging.ServiceResponse();
                response.isSuccess = false;
                response.errors.push("Invalid response type");
                return response;
            }

            if(response.errors.length > 0) {
                response.isSuccess = false;
                dfd.resolve(response);
                return;

            }
        } catch (e) {
            response = new self.messaging.ServiceResponse();
            response.isSuccess = false;
            response.errors.push(e.message);
            dfd.resolve(response);
            return dfd.promise;
        }

        if(response.isSuccess && self.successor) {
            //Next tick will give a chance to other process to get a slice of the CPU
            process.nextTick(function() {
            var successorPromise = q.fcall(self.successor.execute.bind(self.successor), request);

                successorPromise.then(function(successorResponse){

                    if(!successorResponse instanceof self.messaging.ServiceResponse) {
                        response = new self.messaging.ServiceResponse();
                        response.isSuccess = false;
                        response.errors.push("Invalid response type");
                        return response;
                    }

                    Node.copyResponseIntoAnother(response, successorResponse);

                    dfd.resolve(response);
                    return;
                });
            });
        } else {
            dfd.resolve(response);
            return dfd.promise;
        }

        return dfd.promise;
    };

    Node.prototype.handleRequest = function(request) {

        throw Error("HandleRequest is not implemented");

    };


    function TaskNode(serviceMessage) {

        Node.call(this, serviceMessage);

        return this;
    }

    util.inherits(TaskNode, Node);

    TaskNode.prototype.initialize = function(params) {
        params = params || {};
        TaskNode.super_.prototype.initialize.call(this, params);
    };





    function ConditionNode(serviceMessage) {
        Node.call(this, serviceMessage);

        this.serviceMessage = serviceMessage;

        var _trueSuccessor;
        Object.defineProperty(this, "trueSuccessor", {
            get: function () {
                return _trueSuccessor;
            },
            set: function (value) {
                if(value && (value instanceof Node)) {
                    _trueSuccessor = value;
                } else {
                    throw Error('True Successor is not of type Node or one of its descendant');
                }
            }
        });


        var _falseSuccessor;
        Object.defineProperty(this, "falseSuccessor", {
            get: function () {
                return _falseSuccessor;
            },
            set: function (value) {
                if(!value) return;
                if(value instanceof Node) {
                    _falseSuccessor = value;
                } else {
                    throw Error('False Successor is not of type Node or one of its descendant');
                }
            }
        });

        var _condition;
        Object.defineProperty(this, "condition", {
            get: function () {
                return _condition;
            },
            set: function (value) {
                if(_.isUndefined(value)) throw Error("A condition must be provided");
                //if(value instanceof Node) {
                    _condition = value;
                //} else {
                //    throw Error('Condition is not of type XXX or one of its descendant');
                //}
            }
        });


        return this;
    }

    util.inherits(ConditionNode, Node);

    ConditionNode.prototype.initialize = function(params) {
        params = params || {};
        ConditionNode.super_.prototype.initialize.call(this, params);
        this.condition = params.condition;
        this.trueSuccessor = params.trueSuccessor;
        this.falseSuccessor = params.falseSuccessor;
    };

    ConditionNode.prototype.execute = function (request) {
        var dfd = q.defer();
        var self = this;
        if(this.condition) {
            this.trueSuccessor.execute(request).then(function(response) {

                if(self.successor && response.isSuccess) {
                    ConditionNode.super_.prototype.execute.call(self.successor, request).then(function(successorResponse){
                        Node.copyResponseIntoAnother(response, successorResponse);
                        dfd.resolve(response);
                        return;
                    });
                } else {
                    dfd.resolve(response);
                    return;
                }
            });
        } else {
            if (this.falseSuccessor) {
                this.falseSuccessor.execute(request).then(function (response) {

                    if (self.successor && response.isSuccess) {
                        ConditionNode.super_.prototype.execute.call(self.successor, request).then(function (successorResponse) {
                            Node.copyResponseIntoAnother(response, successorResponse);
                            dfd.resolve(response);
                            return;
                        });
                    } else {
                        dfd.resolve(response);
                        return;
                    }
                });
            } else {
                if (self.successor) {
                    ConditionNode.super_.prototype.execute.call(self.successor, request).then(function (successorResponse) {
                        dfd.resolve(successorResponse);
                        return;
                    });
                } else {
                    var response = new self.serviceMessage.ServiceResponse();
                    dfd.resolve(response);
                    return;
                }
            }
        }
        return dfd.promise;
    };

    function BlockNode(serviceMessage) {
        Node.call(this, serviceMessage);

        return this;
    }

    util.inherits(BlockNode, Node);

    BlockNode.prototype.initialize = function(params) {
        params = params || {};
        BlockNode.super_.prototype.initialize.call(this, params);
    };

    BlockNode.prototype.execute = function (request) {
        var result = BlockNode.super_.prototype.execute(request);
        return result + ' from TaskNode';
    };


    function LoopNode(serviceMessage) {
        Node.call(this, serviceMessage);

        var _condition;
        Object.defineProperty(this, "condition", {
            get: function () {
                return _condition;
            },
            set: function (value) {
                if(!value) throw Error("A condition must be provided");
                //if(value instanceof Node) {
                _condition = value;
                //} else {
                //    throw Error('Condition is not of type XXX or one of its descendant');
                //}
            }
        });

        return this;
    }

    util.inherits(LoopNode, Node);

    LoopNode.prototype.initialize = function(params) {
        params = params || {};
        LoopNode.super_.prototype.initialize.call(this, params);
        this.condition = params.condition;
    };

    LoopNode.prototype.execute = function (request) {
        var result = LoopNode.super_.prototype.execute(request);
        return result + ' from TaskNode';
    };


    function NodeFactory() {

    }

    NodeFactory.create = function(nodeType, params, resolutionName) {
        var node = Injector.resolve({target: nodeType, resolutionName: resolutionName});
        if(node) {
            node.initialize(params);
        }
        return node;
    };

    function Processor() {

    }

    exports.Processor = Processor;
    exports.TaskNode = TaskNode;
    exports.ConditionNode = ConditionNode;
    exports.BlockNode = BlockNode;
    exports.NodeFactory = NodeFactory;

})
(
    require('util'),
    require('lodash'),
    require('q')
);