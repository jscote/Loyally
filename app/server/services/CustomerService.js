/**
 * Created by jscote on 10/20/13.
 */

(function (util, base) {

    'use strict';

    function CustomerService(serviceMessage) {
        if (!(this instanceof CustomerService)) return new CustomerService(serviceMessage);
        base.call(this);

        this.messaging = serviceMessage;
    }

    util.inherits(CustomerService, base);

    CustomerService.prototype.getCustomers = function () {
        return [
            {"customerId": 20, "customerName": 'A very important Customer', "Address": 'Somewhere around here'},
            {"customerId": 30, "customerName": 'An even more important Customer', "Address": 'Somewhere around there'}
        ];

    };

    CustomerService.prototype.getCustomer = function (message) {

        //For testing purposes
        if (message.data.customerId > 1000) {
            throw('beurk')
        }
        return new this.messaging.ServiceResponse({data: {"customerId": message.data.customerId, "customerName": 'An even more important Customer', "Address": 'Somewhere around there'}});
    };

    module.exports = CustomerService;

})(
        require('util'),
        require(Injector.getBasePath() + '/services/baseService')
    );
