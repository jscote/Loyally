/**
 * Created by jscote on 10/20/13.
 */

//TODO: Make this file ENV dependent
module.exports = function() {
    console.log('Configuring the injection container');
    console.log('dirname is: ' + Injector.getBasePath());
    Injector
        .decorator('getEventService', function(delegate) {
            console.log('decorating getEventService')
            var fn = delegate.index;
            var instance = delegate;
            delegate.index = function() {
                console.log("logging from decorator for getEventService");
                var args = [].slice.call(arguments);
                fn.apply(instance, args)
            };
            return delegate;
        }, '/customers/:customer/events/:event?/:op?')
       .decorator('EventController', function(delegate) {
            console.log('decorating GeneralEventController')
            var fn = delegate.index;
            delegate.index = function() {
                console.log("logging from decorator");
                var args = [].slice.call(arguments);
                fn.apply(delegate, args)
            };
            return delegate;
        }, '/customers/:customer/events/:event?/:op?')
        .decorator('fs', function(delegate) {
            delegate.myFunction = function() {
                console.log("from fs myFunction");};
            return delegate;
        })
        .register({dependency : '/app/server/Injector/StrategyResolver', name: 'strategyResolver'})
        .register({dependency : '/app/server/Injector/ControllerResolver', name: 'controllerResolver', resolutionName: 'EventsController'})
        .register({dependency : '/app/server/controllers/EventController', name: 'EventController', resolutionName: '/events/:event?/:op?'})
        .register({dependency : '/app/server/controllers/CustomerEventController', name: 'EventController', resolutionName: '/customers/:customer/events/:event?/:op?'})
        .register({dependency : '/app/server/services/EventService', name: 'eventService', resolutionName: '/events/:event?/:op?'})
        .register({dependency : '/app/server/services/CustomerEventService', name: 'eventService', resolutionName: '/customers/:customer/events/:event?/:op?'})
        .register({dependency : '/app/server/controllers/test', name: 'test'});

}()
