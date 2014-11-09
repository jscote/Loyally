/**
 * Created by jscote on 2/8/14.
 */
/**
 * Created by jscote on 10/20/13.
 */

var lodash = require('lodash');
var decoratorHelper = require(Injector.getBasePath() + '/Helpers/decoratorHelper');

(function (_, decoratorHelper) {

    module.exports = function () {
        Injector
            .decorator('eventService', function (delegateClass) {

                decoratorHelper.decorateFunctions(delegateClass/*, 'getEventsForCustomer'*/, function (delegateFn) {
                    return function () {
                        console.log("logging from decorator for EventService");
                        var args = [].slice.call(arguments);
                        return delegateFn.apply(delegateClass, args)
                    };
                });
                return delegateClass;

            })//, '/:id/customers/:customer/events/:event?/:op?')
            .decorator('customerService', function (delegateClass) {

                decoratorHelper.decorateFunctions(delegateClass/*, 'getEventsForCustomer'*/, function (delegateFn) {
                    return function () {
                        console.log("logging from decorator for CustomerService");
                        var args = [].slice.call(arguments);
                        return delegateFn.apply(delegateClass, args)
                    };
                });
                return delegateClass;

            })//, '/:id/customers/:customer/events/:event?/:op?')
            .decorator('EventController', function (delegateClass) {

                decoratorHelper.decorateFunction(delegateClass, 'index', function (delegateFn) {
                    return function () {
                        console.log("logging from decorator 1");
                        var args = [].slice.call(arguments);
                        return delegateFn.apply(delegateClass, args)
                    };
                });

                return delegateClass;
            }, '/:id/customers/:customer/events/:event?/:op?', 2)


            .decorator('EventController', function (delegateClass) {

                decoratorHelper.decorateFunction(delegateClass, 'index', function (delegateFn) {
                    return function () {
                        console.log("logging from EventController pre decorator 1");
                        var args = [].slice.call(arguments);
                        return delegateFn.apply(delegateClass, args)
                    };
                });

                return delegateClass;
            }, '/:id/events/:event?/:op?', 1)
            .decorator('EventController', function (delegateClass) {

                decoratorHelper.decorateFunction(delegateClass, 'index', function (delegateFn) {
                    return function () {
                        console.log("logging from EventController pre decorator 2");
                        var args = [].slice.call(arguments);
                        return delegateFn.apply(delegateClass, args)
                    };
                });

                return delegateClass;
            }, '/:id/events/:event?/:op?', 2)
            .decorator('EventController', function (delegateClass) {

                decoratorHelper.decorateFunction(delegateClass, 'index', function (delegateFn) {
                    return function () {

                        var args = [].slice.call(arguments);
                        var result = delegateFn.apply(delegateClass, args);

                        console.log("logging from EventController post decorator 1");
                        return result;
                    };
                });

                return delegateClass;
            }, '/:id/events/:event?/:op?', 4)
            .decorator('EventController', function (delegateClass) {

                decoratorHelper.decorateFunction(delegateClass, 'index', function (delegateFn, delegateFnName) {
                    return function () {

                        var args = [].slice.call(arguments);
                        var result = delegateFn.apply(delegateClass, args);

                        console.log("logging from EventController post decorator 2 " + delegateFnName);
                        return result;
                    };
                });

                return delegateClass;
            }, '/:id/events/:event?/:op?', 3)


            .decorator('fs', function (delegateClass) {
                delegateClass.myFunction = function () {
                    console.log("from fs myFunction");
                };
                return delegateClass;
            })
            .register({dependency: '/controllers/EventController', name: 'EventController', resolutionName: '/:id/events/:event?/:op?'})
            .register({dependency: '/controllers/CustomerEventController', name: 'EventController', resolutionName: '/:id/customers/:customer/events/:event?/:op?'})
            .register({dependency: '/services/EventService', name: 'eventService'})
            .register({dependency: '/services/CustomerService', name: 'customerService'})
            .register({dependency: '/services/CustomerService', name: 'customerService', resolutionName: '/:id/customers/:customer?/:op?'})


            //Use this if you want to inject the same service only to specific resolution name. It makes more sense to use that to inject a different service for the same
            //parameter with a different resolution name. If you are going to inject the same implementation anyway, there is no need to specify a resolution name.
            //.register({dependency: '/services/EventService', name: 'eventService', resolutionName: '/:id/events/:event?/:op?'})
            //.register({dependency: '/services/EventService', name: 'eventService', resolutionName: '/:id/customers/:customer/events/:event?/:op?'})
            .register({dependency: '/controllers/test', name: 'test'})
            .register({dependency: '/controllers/CustomerController', name: 'CustomerController', resolutionName: '/:id/customers/:customer?/:op?'})
            .register({dependency: '/controllers/ItemController', name: 'ItemController', resolutionName: '/:id/items/:item?/:op?'})
            .register({dependency: '/services/ItemService', name: 'itemService', resolutionName: '/:id/items/:item?/:op?'})

            .register({dependency: '/Processors/Processor::TaskNode', name: 'TaskNode'})
            .register({dependency: '/Processors/Processor::ConditionNode', name: 'ConditionNode'})
            .register({dependency: '/Processors/Processor::CompensatedNode', name: 'CompensatedNode'})
            .register({dependency: '/Processors/Processor::LoopNode', name: 'LoopNode'})

            .register({dependency: '/Processors/TestClasses::TestTaskNode', name: 'TestTaskNode'})
            .register({dependency: '/Processors/TestClasses::Test2TaskNode', name: 'Test2TaskNode'})
            .register({dependency: '/Processors/TestClasses::Test3TaskNode', name: 'Test3TaskNode'})
            .register({dependency: '/Processors/TestClasses::Test4TaskNode', name: 'Test4TaskNode'})
            .register({dependency: '/Processors/TestClasses::TestLoopTaskNode', name: 'TestLoopTaskNode'})
            .register({dependency: '/Processors/TestClasses::Test2LoopTaskNode', name: 'Test2LoopTaskNode'})
            .register({dependency: '/Processors/TestClasses::TestPredecessorToLoopTaskNode', name: 'TestPredecessorToLoopTaskNode'})
            .register({dependency: '/Processors/TestClasses::TestSuccessorToLoopTaskNode', name: 'TestSuccessorToLoopTaskNode'})
            .register({dependency: '/Processors/TestClasses::TestCompensationToLoopTaskNode', name: 'TestCompensationToLoopTaskNode'})
        ;
    }
})(lodash, decoratorHelper);