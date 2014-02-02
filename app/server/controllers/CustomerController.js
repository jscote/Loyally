/**
 * Created by jscote on 10/20/13.
 */

(function (util, base, Permission, PermissionAnnotation, permissionEnum) {

    'use strict';


    function CustomerController() {
        if (!(this instanceof CustomerController)) return new CustomerController();

        base.call(this);

    }

    util.inherits(CustomerController, base);


    CustomerController.prototype.annotations =
        [new PermissionAnnotation()
            .addRequiredPermission(new Permission(permissionEnum().CanLogin))
            ];

    CustomerController.prototype.index = function (request, response) {
        response.send({"data": [
            {"customerId": 10, "customerName": 'My Address'},
            {"customerId": 20, "customerName": 'My Address'}
        ]});
    };

    CustomerController.prototype.index.annotations =
        [new PermissionAnnotation()
            .addRequiredPermission(new Permission(permissionEnum().CanGetCustomer))];

    CustomerController.prototype.get = function (request, response) {
        var customerId = request.params.customer;
        response.send({"data": [
            {"customerId": customerId, "customerName": 'My Address'}
        ]});
    };


    module.exports = CustomerController;

})(require('util'),
        require(Injector.getBasePath() + '/controllers/baseController'),
        require(Injector.getBasePath() + '/Security/Permissions'),
        require(Injector.getBasePath() + '/Security/PermissionAnnotation'),
        require(Injector.getBasePath() + '/Security/permissionEnum'));

