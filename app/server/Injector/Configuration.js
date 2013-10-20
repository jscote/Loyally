/**
 * Created by jscote on 10/20/13.
 */
module.exports = function() {
    console.log('Configuring the injection container');
    console.log('dirname is: ' + Injector.getBasePath());
    Injector.register(require(Injector.getBasePath() + '/app/server/controllers/GeneralEventController'), 'GeneralEventController', 'GeneralEvent');
    Injector.register(require(Injector.getBasePath() + '/app/server/controllers/GeneralEventController'), 'GeneralEventController', 'CustomerEvent');
    Injector.register(require(Injector.getBasePath() + '/app/server/controllers/EventsController'), 'getEventService', 'GeneralEvent');
    Injector.register(require(Injector.getBasePath() + '/app/server/controllers/eventForCustomerController'), 'getEventService', 'CustomerEvent');
    Injector.register(require(Injector.getBasePath() + '/app/server/controllers/test'), 'test');

}()
