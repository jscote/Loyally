/**
 * Created by jscote on 10/20/13.
 */

(function (util, base, Permission, PermissionAnnotation, permissionEnum, httpApiResponse, q) {

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

    CustomerEventController.prototype.index = function (request) {
        var message = new this.messaging.ServiceMessage({data: {customerId: request.params.customer}});

        var dfd = q.defer();

        this.eventService.getEventsForCustomer(message).then(function (result) {

            if (result.isSuccess) {
                dfd.resolve(result.data);
            } else {
                dfd.resolve(httpApiResponse.createHttpApiResponse('400', result.errors));
            }
        });

        return dfd.promise;
    };

    CustomerEventController.prototype.index.annotations =
        [new PermissionAnnotation()
            .addRequiredPermission(new Permission(permissionEnum().CanGetEvent))
            .addRequiredPermission(new Permission(permissionEnum().CanGetCustomer))];

    CustomerEventController.prototype.get = function (request) {
        var message = new this.messaging.ServiceMessage({data: {customerId: request.params.customer, eventId: request.params.event}});
        var dfd = q.defer();

        this.eventService.getEventForCustomer(message).then(function(result) {
            dfd.resolve(result);
        });

        return dfd.promise;
    };


    module.exports = CustomerEventController;

})(
        require('util'),
        require(Injector.getBasePath() + '/controllers/permissionApiController'),
        require(Injector.getBasePath() + '/Security/Permissions'),
        require(Injector.getBasePath() + '/Security/PermissionAnnotation'),
        require(Injector.getBasePath() + '/Security/permissionEnum'),
        require(Injector.getBasePath() + '/Helpers/httpApiResponse'),
        require('q')
    );

