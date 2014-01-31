/**
 * Created by jscote on 10/20/13.
 */

(function (Permission, PermissionAnnotation, permissionEnum) {

    'use strict'


    function CustomerEventController(eventService, fs) {
        if (!(this instanceof CustomerEventController)) return new CustomerEventController(eventService, fs);

        fs.myFunction();
        this.eventService = eventService;
    }

    CustomerEventController.prototype.annotations =
        [new PermissionAnnotation()
            .addRequiredPermission(new Permission(permissionEnum().CanLogin))
            ];

    CustomerEventController.prototype.index = function (request, response) {
        var customerId = request.params.customer;
        response.send(this.eventService.getEventsForCustomer(customerId));
    };

    CustomerEventController.prototype.index.annotations =
        [new PermissionAnnotation()
            .addRequiredPermission(new Permission(permissionEnum().CanGetEvent))
            .addRequiredPermission(new Permission(permissionEnum().CanGetCustomer))];

    CustomerEventController.prototype.get = function (request, response) {
        var customerId = request.params.customer;
        var eventId = request.params.event;
        response.send(this.eventService.getEvent(customerId, eventId));
    };

    module.exports = CustomerEventController;
})(require(Injector.getBasePath() + '/app/server/Security/Permissions'), require(Injector.getBasePath() + '/app/server/Security/PermissionAnnotation'), require(Injector.getBasePath() + '/app/server/Security/permissionEnum'));

