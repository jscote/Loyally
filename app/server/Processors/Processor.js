/**
 * Created by jean-sebastiencote on 11/1/14.
 */
(function (util, _, q) {

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
     |--CompensatedNode - executes all following nodes of the starting node in sequence but if there are any errors, will stop execution and run the compensation nodes.
     |--LoopNode - has a condition, which is evaluated by a rule set and a loopStartNode.
     |             the successor is where process resumes after the loop exits.
     |--IteratorNode - has an iterator to loop through until all items are iterated. For each item, the loopBlock will be called, which is a BlockNode

     */


    function copyResponseIntoAnother(response, successorResponse) {
        response.errors = response.errors.concat(successorResponse.errors);

        if (Array.isArray(response.data) && Array.isArray(successorResponse.data)) {
            response.data = response.data.concat(successorResponse.data);
        } else if (_.isEmpty(response.data) && Array.isArray(successorResponse.data)) {
            response.data = successorResponse.data;
        } else if (_.isObject(response.data) && !_.isEmpty(response.data) && Array.isArray(successorResponse.data)) {
            if (_.isUndefined(response.data.arrays)) response.data.arrays = [];
            response.data.arrays = response.data.arrays.concat(successorResponse.data);
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

    }

    function executeSuccessor(self, response, request, dfd, executeFn) {
        if (response.isSuccess && self.successor) {
            process.nextTick(function () {
                q.fcall(executeFn.bind(self.successor), request).then(function (successorResponse) {

                    if (!successorResponse instanceof self.messaging.ServiceResponse) {
                        response = new self.messaging.ServiceResponse();
                        response.isSuccess = false;
                        response.errors.push("Invalid response type");
                        return response;
                    }
                    copyResponseIntoAnother(response, successorResponse);
                    dfd.resolve(response);
                });
            });
        } else {
            dfd.resolve(response);
        }
    }

    function executeConditionBranch(successorBranch, request, self, dfd) {
        process.nextTick(function () {
            q.fcall(successorBranch.execute.bind(successorBranch), request).then(function (response) {
                executeSuccessor(self, response, request, dfd, Node.prototype.execute);
            });
        });
    }

    function Node(serviceMessage) {

        var _successor;
        Object.defineProperty(this, "successor", {
            get: function () {
                return _successor;
            },
            set: function (value) {
                if (!value) return;
                if (value instanceof Node) {
                    _successor = value;
                } else {
                    throw Error('Successor is not of type Node or one of its descendant');
                }
            }
        });

        this.messaging = serviceMessage;

        return this;
    }

    Node.prototype.initialize = function (params) {
        params = params || {};
        this.successor = params.successor;
    };

    Node.prototype.execute = function (request) {
        var response;
        var self = this;
        var dfd = q.defer();
        try {
            q.fcall(self.handleRequest.bind(self), request).then(function (response) {

                if (!response instanceof self.messaging.ServiceResponse) {
                    response = new self.messaging.ServiceResponse();
                    response.isSuccess = false;
                    response.errors.push("Invalid response type");
                    dfd.resolve(response);
                    return;
                }

                if (response.errors.length > 0) {
                    response.isSuccess = false;
                    dfd.resolve(response);
                    return;

                }


                executeSuccessor(self, response, request, dfd, self.successor ? self.successor.execute : null);
            }, function(error) {
                response = new self.messaging.ServiceResponse();
                response.isSuccess = false;
                response.errors.push(error.message);
                dfd.resolve(response);
                return;
            }).done();
        } catch (e) {
            response = new self.messaging.ServiceResponse();
            response.isSuccess = false;
            response.errors.push(e.message);
            dfd.resolve(response);
            return dfd.promise;
        }
        return dfd.promise;
    };


    Node.prototype.handleRequest = function () {
        throw Error("HandleRequest is not implemented");
    };


    function TaskNode(serviceMessage) {
        Node.call(this, serviceMessage);
        return this;
    }

    util.inherits(TaskNode, Node);

    TaskNode.prototype.initialize = function (params) {
        params = params || {};
        TaskNode.super_.prototype.initialize.call(this, params);
    };


    function ConditionNode(serviceMessage) {
        Node.call(this, serviceMessage);

        var _trueSuccessor;
        Object.defineProperty(this, "trueSuccessor", {
            get: function () {
                return _trueSuccessor;
            },
            set: function (value) {
                if (value && (value instanceof Node)) {
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
                if (!value) return;
                if (value instanceof Node) {
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
                if (_.isUndefined(value)) throw Error("A condition must be provided");
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

    ConditionNode.prototype.initialize = function (params) {
        params = params || {};
        ConditionNode.super_.prototype.initialize.call(this, params);
        this.condition = params.condition;
        this.trueSuccessor = params.trueSuccessor;
        this.falseSuccessor = params.falseSuccessor;
    };


    ConditionNode.prototype.execute = function (request) {
        var dfd = q.defer();
        var self = this;
        if (this.condition) {
            executeConditionBranch.call(this, this.trueSuccessor, request, self, dfd);
        } else {
            if (this.falseSuccessor) {
                executeConditionBranch.call(this, this.falseSuccessor, request, self, dfd);
            } else {
                if (self.successor) {
                    ConditionNode.super_.prototype.execute.call(self.successor, request).then(function (successorResponse) {
                        dfd.resolve(successorResponse);
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

    function CompensatedNode(serviceMessage) {
        Node.call(this, serviceMessage);

        var _startNode;
        Object.defineProperty(this, "startNode", {
            get: function () {
                return _startNode;
            },
            set: function (value) {
                if (_.isUndefined(value)) throw Error("A start node must be provided");
                if (value instanceof Node) {
                    _startNode = value;
                } else {
                    throw Error('StartNode is not of type Node or one of its descendant');
                }
            }
        });

        var _compensationNode;
        Object.defineProperty(this, "compensationNode", {
            get: function () {
                return _compensationNode;
            },
            set: function (value) {
                if (_.isUndefined(value)) throw Error("A compensation node must be provided");
                if (value instanceof Node) {
                    _compensationNode = value;
                } else {
                    throw Error('Compensation Node is not of type Node or one of its descendant');
                }
            }
        });

        return this;
    }

    util.inherits(CompensatedNode, Node);

    CompensatedNode.prototype.initialize = function (params) {
        params = params || {};
        CompensatedNode.super_.prototype.initialize.call(this, params);
        this.startNode = params.startNode;
        this.compensationNode = params.compensationNode;
    };

    CompensatedNode.prototype.execute = function (request) {
        var dfd = q.defer();
        var self = this;

        process.nextTick(function () {
            q.fcall(self.startNode.execute.bind(self.startNode), request).then(function (response) {

                if (!response instanceof self.messaging.ServiceResponse) {
                    response = new self.messaging.ServiceResponse();
                    response.isSuccess = false;
                    response.errors.push("Invalid response type");
                    dfd.resolve(response);
                    return;
                }

                if (response.isSuccess) {
                    //execute successor.... everything is good, let's move on
                    executeSuccessor(self, response, request, dfd, self.successor ? self.successor.execute : null);
                } else {
                    //we need to execute the compensation branch and then let bubble up the chain
                    process.nextTick(function () {
                        q.fcall(self.compensationNode.execute.bind(self.compensationNode), request).then(function (compensationResponse) {
                            if (!compensationResponse instanceof self.messaging.ServiceResponse) {
                                compensationResponse = new self.messaging.ServiceResponse();
                                compensationResponse.isSuccess = false;
                                compensationResponse.errors.push("Invalid response type");
                                dfd.resolve(compensationResponse);
                                return;
                            }

                            copyResponseIntoAnother(response, compensationResponse);

                            dfd.resolve(response);
                        });
                    });

                }
            });
        });

        return dfd.promise;
    };


    function LoopNode(serviceMessage) {
        Node.call(this, serviceMessage);

        var _condition;
        Object.defineProperty(this, "condition", {
            get: function () {
                return _condition;
            },
            set: function (value) {
                if (_.isUndefined(value)) throw Error("A condition must be provided");
                //if(value instanceof Node) {
                _condition = value;
                //} else {
                //    throw Error('Condition is not of type XXX or one of its descendant');
                //}
            }
        });

        var _startNode;
        Object.defineProperty(this, "startNode", {
            get: function () {
                return _startNode;
            },
            set: function (value) {
                if (_.isUndefined(value)) throw Error("A start node must be provided");
                if (value instanceof Node) {
                    _startNode = value;
                } else {
                    throw Error('StartNode is not of type Node or one of its descendant');
                }
            }
        });


        return this;
    }

    util.inherits(LoopNode, Node);

    LoopNode.prototype.initialize = function (params) {
        params = params || {};
        LoopNode.super_.prototype.initialize.call(this, params);
        this.condition = params.condition;
        this.startNode = params.startNode;
    };

    LoopNode.prototype.execute = function (request) {

        var self = this;
        var dfd = q.defer();
        self.loopWhile(request).then(function(response) {
           dfd.resolve(response);
        }).done();

        // The promise
        return dfd.promise;
    };


    LoopNode.prototype.loopWhile = function(request) {
        var self = this;
        var dfd = q.defer();

        var response = new self.messaging.ServiceResponse();

        function loop(loopResponse) {
            // When the result of calling `condition` is no longer true, we are
            // done.

            q.fcall(self.condition.bind(self), request).then(function(conditionResult){

                if(conditionResult) {

                    q.fcall(self.startNode.execute.bind(self.startNode), request).then(function(innerLoopResponse) {
                        copyResponseIntoAnother(loopResponse, innerLoopResponse)
                        loop(loopResponse);
                    }, function(error) {
                        return dfd.reject(error);
                    });
                }
                else
                {
                    return dfd.resolve(loopResponse);
                }

            }, function(error) {
                console.log("there is an error");
            }).done();
        }

        // Start running the loop in the next tick so that this function is
        // completely async. It would be unexpected if `startNode` was called
        // synchronously the first time.
        process.nextTick(function() {
            loop(response);
        });

        // The promise
        return dfd.promise;
    };

    function NodeFactory() {

    }

    NodeFactory.create = function (nodeType, params, resolutionName) {
        var node = Injector.resolve({target: nodeType, resolutionName: resolutionName});
        if (node) {
            node.initialize(params);
        }
        return node;
    };

    function Processor() {

    }

    exports.Processor = Processor;
    exports.TaskNode = TaskNode;
    exports.ConditionNode = ConditionNode;
    exports.CompensatedNode = CompensatedNode;
    exports.NodeFactory = NodeFactory;
    exports.LoopNode = LoopNode;

})
(
    require('util'),
    require('lodash'),
    require('q')
);