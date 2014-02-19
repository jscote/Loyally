/**
 * Created by jscote on 10/20/13.
 */

(function (util, base, Permission, PermissionAnnotation, permissionEnum, httpApiResponse) {

    'use strict';


    function CustomerController(customerService, serviceMessage) {
        if (!(this instanceof CustomerController)) return new CustomerController(customerService, serviceMessage);

        base.call(this);

        this.customerService = customerService;
        this.messaging = serviceMessage;

    }

    util.inherits(CustomerController, base);


    CustomerController.prototype.annotations =
        [new PermissionAnnotation()
            .addRequiredPermission(new Permission(permissionEnum().CanLogin))
        ];

    CustomerController.prototype.index = function (request, response) {
        //This demonstrate that if we want, we can return an object that has the shape of what the route handler is expecting
        //That would allow having more control on the status code when needed

        return httpApiResponse.createHttpApiResponse('200', this.customerService.getCustomers().data);
    };

    CustomerController.prototype.index.annotations =
        [new PermissionAnnotation()
            .addRequiredPermission(new Permission(permissionEnum().CanGetCustomer))];

    CustomerController.prototype.get = function (request, response) {
        //This demonstrate that if we want, we can return an object that has the shape of what the route handler is expecting
        //That would allow having more control on the status code when needed

        var message = new this.messaging.ServiceMessage({data: {customerId: request.params.customer}});
        var result = this.customerService.getCustomer(message);

        if (result.isSuccess) {
            return httpApiResponse.createHttpApiResponse('201', this.customerService.getCustomer(message).data);
        } else {
            return httpApiResponse.createHttpApiResponse('400', result.errors);
        }

    };


    module.exports = CustomerController;

})(require('util'),
        require(Injector.getBasePath() + '/controllers/permissionApiController'),
        require(Injector.getBasePath() + '/Security/Permissions'),
        require(Injector.getBasePath() + '/Security/PermissionAnnotation'),
        require(Injector.getBasePath() + '/Security/permissionEnum'),
        require(Injector.getBasePath() + '/Helpers/httpApiResponse')
    );

