/**
 * Created by jscote on 10/20/13.
 */

(function (util, base, Permission, PermissionAnnotation, permissionEnum, httpHelper) {

    'use strict';

    function EventController(eventService, fs, serviceMessage) {

        if (!(this instanceof EventController)) return new EventController(eventService, fs, serviceMessage);


        base.call(this);

        //Example of injecting a function/object of our own and a node module
        //while constructing an object/function
        //Remember that the fs module was decorated in our configuration
        //so we can call our deoorated method
        fs.myFunction();
        this.eventService = eventService;
        this.messaging = serviceMessage;

    }

    util.inherits(EventController, base);

    EventController.prototype.index = function (request, response) {
        console.log('from the controller itself')
        return this.eventService.getEvents().data;
    };
    EventController.prototype.index.annotations = [new httpHelper.HttpStatusCode('200')];

    EventController.prototype.get = function (request, response) {
        var message = new this.messaging.ServiceMessage({data: {eventId:  request.params.event}});
        return this.eventService.getEvent(message);
    };
    EventController.prototype.get.annotations = [new httpHelper.HttpErrorStatusCode('401')];

    module.exports = EventController;

})(require('util'),
        require(Injector.getBasePath() + '/controllers/permissionApiController'),
        require(Injector.getBasePath() + '/Security/Permissions'),
        require(Injector.getBasePath() + '/Security/PermissionAnnotation'),
        require(Injector.getBasePath() + '/Security/permissionEnum'),
        require(Injector.getBasePath() + '/Helpers/httpApiResponse')
     );
