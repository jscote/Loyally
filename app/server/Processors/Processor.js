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

    function Node(params) {
        params = params || {};
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

        this.successor = params.successor;

        return this;
    }

    Node.prototype.execute = function(request) {
        return 'executed';
    };

    function TaskNode(params) {
        params = params || {};
        Node.call(this, {successor: params.successor});

        return this;
    }

    util.inherits(TaskNode, Node);


    TaskNode.prototype.execute = function (request) {
        var result = TaskNode.super_.prototype.execute(request);
        return result + ' from TaskNode';
    };

    function ConditionNode(params) {
        params = params || {};
        Node.call(this, {successor: params.successor});

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
        this.trueSuccessor = params.trueSuccessor;

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
        this.falseSuccessor = params.falseSuccessor;

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
        this.condition = params.condition;


        return this;
    }

    util.inherits(ConditionNode, Node);


    ConditionNode.prototype.execute = function (request) {
        var result = TaskNode.super_.prototype.execute(request);
        return result + ' from TaskNode';
    };

    function BlockNode(params) {
        params = params || {};
        Node.call(this, {successor: params.successor});

        return this;
    }

    util.inherits(BlockNode, Node);


    BlockNode.prototype.execute = function (request) {
        var result = TaskNode.super_.prototype.execute(request);
        return result + ' from TaskNode';
    };

    function LoopNode(params) {
        params = params || {};
        Node.call(this, {successor: params.successor});

        return this;
    }

    util.inherits(LoopNode, Node);


    LoopNode.prototype.execute = function (request) {
        var result = TaskNode.super_.prototype.execute(request);
        return result + ' from TaskNode';
    };


    function Processor() {

    }

    exports.Processor = Processor;
    exports.TaskNode = TaskNode;
    exports.ConditionNode = ConditionNode;
    exports.BlockNode = BlockNode;

})
(
    require('util'),
    require('lodash'),
    require('q')
);