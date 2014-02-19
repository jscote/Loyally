/**
 * Created by jscote on 10/20/13.
 */

(function (util, base, Permission, PermissionAnnotation, permissionEnum, httpApiResponse) {

    'use strict';


    function CustomerEventController(eventService, fs, serviceMessage) {
        if (!(this instanceof CustomerEventController)) return new CustomerEventController(eventService, fs, serviceMessage);

        base.call(this);

        fs.myFunction();
        this.eventService = eventService;
        this.messaging = serviceMessage;

    }

    util.inherits(CustomerEventController, base);

    CustomerEventController.prototype.annotations =
        [new PermissionAnnotation()
            .addRequiredPermission(new Permission(permissionEnum().CanLogin))
        ];

    CustomerEventController.prototype.index = function (request, response) {
        var message = new this.messaging.ServiceMessage({data: {customerId: request.params.customer}});

        var result = this.eventService.getEventsForCustomer(message);

        if (result.isSuccess) {
            return result.data;
        }
        return httpApiResponse.createHttpApiResponse('400', result.errors);

    };

    CustomerEventController.prototype.index.annotations =
        [new PermissionAnnotation()
            .addRequiredPermission(new Permission(permissionEnum().CanGetEvent))
            .addRequiredPermission(new Permission(permissionEnum().CanGetCustomer))];

    CustomerEventController.prototype.get = function (request, response) {
        var message = new this.messaging.ServiceMessage({data: {customerId: request.params.customer, eventId: request.params.event}});
        return this.eventService.getEventForCustomer(message);

    };


    module.exports = CustomerEventController;

})(
        require('util'),
        require(Injector.getBasePath() + '/controllers/permissionApiController'),
        require(Injector.getBasePath() + '/Security/Permissions'),
        require(Injector.getBasePath() + '/Security/PermissionAnnotation'),
        require(Injector.getBasePath() + '/Security/permissionEnum'),
        require(Injector.getBasePath() + '/Helpers/httpApiResponse')
    );

