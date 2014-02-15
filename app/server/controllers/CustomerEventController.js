/**
 * Created by jscote on 10/20/13.
 */

(function (util, base, Permission, PermissionAnnotation, permissionEnum) {

    'use strict';


    function CustomerEventController(eventService, fs) {
        if (!(this instanceof CustomerEventController)) return new CustomerEventController(eventService, fs);

        base.call(this);

        fs.myFunction();
        this.eventService = eventService;

    }

    util.inherits(CustomerEventController, base);

    CustomerEventController.prototype.annotations =
        [new PermissionAnnotation()
            .addRequiredPermission(new Permission(permissionEnum().CanLogin))
        ];

    CustomerEventController.prototype.index = function (request, response) {
        var customerId = request.params.customer;
        return {"statusCode": '200', "data": this.eventService.getEventsForCustomer(customerId)};
    };

    CustomerEventController.prototype.index.annotations =
        [new PermissionAnnotation()
            .addRequiredPermission(new Permission(permissionEnum().CanGetEvent))
            .addRequiredPermission(new Permission(permissionEnum().CanGetCustomer))];

    CustomerEventController.prototype.get = function (request, response) {
        var customerId = request.params.customer;
        var eventId = request.params.event;
        return {"statusCode": '200', "data": this.eventService.getEvent(customerId, eventId)};
    };


    module.exports = CustomerEventController;

})(require('util'),
        require(Injector.getBasePath() + '/controllers/permissionApiController'),
        require(Injector.getBasePath() + '/Security/Permissions'),
        require(Injector.getBasePath() + '/Security/PermissionAnnotation'),
        require(Injector.getBasePath() + '/Security/permissionEnum'));

