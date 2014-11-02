/**
 * Created by jean-sebastiencote on 11/1/14.
 */
(function(lodash, q) {

    /*
    Expected hierarchy of objects to deal with in the execution of a process. It all starts with a BlockNode, which will
    contain one or more child nodes.

    Node is an abstract class and has a successor. If successor is Null, no more processing forward. It also has a default
    ^    implementation of Execute, which just calls the successor if present
    |
    |
    |--ProcessNode - has a HandleRequest method or something like that to do actual work
    |--ConditionNode - has a true successor, which is mandatory and a false successor, which is optional. The
    |                  regular successor is where process resumes after the condition block is evaluated
    |--BlockNode - has ChildNodes that are executed in sequence. It also has a compensator so that errors are handled
    |              at that level. Errors are rethrown so that any compensator can catch them and do something (for nested blocks)
    |--LoopNode - has a condition, which is evaluated by a rule set and a loopBlock, which is a BlockNode that has child nodes.
    |             the successor is where process resumes after the loop exits.
    |--IteratorNode - has an iterator to loop through until all items are iterated. For each item, the loopBlock will be called, which is a BlockNode

     */


    function Processor() {

    }

    exports.Processor = Processor;
})
(
    require('lodash'),
    require('q')
);