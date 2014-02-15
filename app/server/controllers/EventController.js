/**
 * Created by jscote on 10/20/13.
 */

(function (util, base, Permission, PermissionAnnotation, permissionEnum) {

    'use strict';

    function EventController(eventService, fs) {

        if (!(this instanceof EventController)) return new EventController(eventService, fs);


        base.call(this);

        //Example of injecting a function/object of our own and a node module
        //while constructing an object/function
        //Remember that the fs module was decorated in our configuration
        //so we can call our deoorated method
        fs.myFunction();
        this.eventService = eventService;

    }

    util.inherits(EventController, base);

    EventController.prototype.index = function (request, response) {
        return {"statusCode": '200', "data": this.eventService.getEvents()};
    };

    EventController.prototype.index.annotations = [];

    EventController.prototype.get = function (request, response) {
        var eventId = request.params.event;
        return {"statusCode": '200', "data": this.eventService.getEvent(eventId)};
    };


    module.exports = EventController;

})(require('util'),
        require(Injector.getBasePath() + '/controllers/permissionApiController'),
        require(Injector.getBasePath() + '/Security/Permissions'),
        require(Injector.getBasePath() + '/Security/PermissionAnnotation'),
        require(Injector.getBasePath() + '/Security/permissionEnum'));
