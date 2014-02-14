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

                decoratorHelper.decorateFunction(delegateClass, 'getEventsForCustomer', function (delegateFn) {
                    return function () {
                        console.log("logging from decorator for getEventService");
                        var args = [].slice.call(arguments);
                        return delegateFn.apply(delegateClass, args)
                    };
                });
                return delegateClass;

            }, '/:id/customers/:customer/events/:event?/:op?')
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
            .decorator('fs', function (delegateClass) {
                delegateClass.myFunction = function () {
                    console.log("from fs myFunction");
                };
                return delegateClass;
            })
            .register({dependency: '/controllers/EventController', name: 'EventController', resolutionName: '/:id/events/:event?/:op?'})
            .register({dependency: '/controllers/CustomerEventController', name: 'EventController', resolutionName: '/:id/customers/:customer/events/:event?/:op?'})
            .register({dependency: '/services/EventService', name: 'eventService', resolutionName: '/:id/events/:event?/:op?'})
            .register({dependency: '/services/CustomerEventService', name: 'eventService', resolutionName: '/:id/customers/:customer/events/:event?/:op?'})
            .register({dependency: '/controllers/test', name: 'test'})
            .register({dependency: '/controllers/CustomerController', name: 'CustomerController', resolutionName: '/:id/customers/:customer?/:op?'})
            .register({dependency: '/controllers/ItemController', name: 'ItemController', resolutionName: '/:id/items/:item?/:op?'})
            .register({dependency: '/services/ItemService', name: 'itemService', resolutionName: '/:id/items/:item?/:op?'})

    }
})(lodash, decoratorHelper);