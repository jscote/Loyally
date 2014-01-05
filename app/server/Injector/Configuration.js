/**
 * Created by jscote on 10/20/13.
 */
module.exports = function() {
    console.log('Configuring the injection container');
    console.log('dirname is: ' + Injector.getBasePath());
    Injector.register('/app/server/controllers/GeneralEventController', 'GeneralEventController', 'GeneralEvent');
    Injector.register('/app/server/controllers/GeneralEventController', 'GeneralEventController', 'CustomerEvent');
    Injector.register('/app/server/controllers/EventsController', 'getEventService', 'GeneralEvent');
    Injector.register('/app/server/controllers/eventForCustomerController', 'getEventService', 'CustomerEvent');
    Injector.register('/app/server/controllers/test', 'test');

}()
