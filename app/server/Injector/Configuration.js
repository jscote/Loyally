/**
 * Created by jscote on 10/20/13.
 */
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
        }, 'CustomerEvent')
       .decorator('GeneralEventController', function(delegate) {
            console.log('decorating GeneralEventController')
            var fn = delegate.index;
            delegate.index = function() {
                console.log("logging from decorator");
                var args = [].slice.call(arguments);
                fn.apply(delegate, args)
            };
            return delegate;
        }, 'CustomerEvent')
        .decorator('fs', function(delegate) {
            delegate.myFunction = function() {
                console.log("from fs myFunction");};
            return delegate;
        })
        .register({dependency : '/app/server/Injector/ControllerResolver', name: 'controllerResolver', resolutionName: 'EventsController'})
        .register({dependency : '/app/server/controllers/strategies/eventControllerStrategyResolver', name: 'strategyResolver', resolutionName: 'EventsController'})
        .register({dependency : '/app/server/controllers/GeneralEventController', name: 'GeneralEventController', resolutionName: 'GeneralEvent'})
        .register({dependency : '/app/server/controllers/GeneralEventController', name: 'GeneralEventController', resolutionName: 'CustomerEvent'})
        .register({dependency : '/app/server/services/EventsController', name: 'eventService', resolutionName: 'GeneralEvent'})
        .register({dependency : '/app/server/services/eventForCustomerController', name: 'eventService', resolutionName: 'CustomerEvent'})
        .register({dependency : '/app/server/controllers/test', name: 'test'});

}()
