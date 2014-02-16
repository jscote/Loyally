/**
 * Created by jscote on 10/20/13.
 */

(function (util, base) {

    'use strict';

    function CustomerEventService() {
        if (!(this instanceof CustomerEventService)) return new CustomerEventService(test);
        base.call(this);
    }

    util.inherits(CustomerEventService, base);

    CustomerEventService.prototype.getCustomers = function () {
        return [
            {"customerId": 20, "customerName": 'A very important Customer', "Address": 'Somewhere around here'},
            {"customerId": 30, "customerName": 'An even more important Customer', "Address": 'Somewhere around there'}
        ];

    };

    CustomerEventService.prototype.getCustomer = function (customerId) {
        return  {"customerId": customerId, "customerName": 'An even more important Customer', "Address": 'Somewhere around there'};
    };

    module.exports = CustomerEventService;

})(
        require('util'),
        require(Injector.getBasePath() + '/services/baseService')
    );
