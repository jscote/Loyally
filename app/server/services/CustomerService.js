/**
 * Created by jscote on 10/20/13.
 */

(function (util, base, q) {

    'use strict';

    function CustomerService(serviceMessage) {
        if (!(this instanceof CustomerService)) return new CustomerService(serviceMessage);
        base.call(this);

        this.messaging = serviceMessage;
    }

    util.inherits(CustomerService, base);

    CustomerService.prototype.getCustomers = function () {

        var dfd = q.defer();

        process.nextTick(function () {
            dfd.resolve([
                {"customerId": 20, "customerName": 'A very important Customer', "Address": 'Somewhere around here'},
                {"customerId": 30, "customerName": 'An even more important Customer', "Address": 'Somewhere around there'}
            ]);
        });

        return dfd.promise;
    };

    CustomerService.prototype.getCustomer = function (message) {

        var dfd = q.defer();

        process.nextTick(function () {

            //For testing purposes
            if (message.data.customerId > 1000) {
                dfd.reject('beurk');
            }
            dfd.resolve(
                new this.messaging.ServiceResponse({data: {"customerId": message.data.customerId, "customerName": 'An even more important Customer', "Address": 'Somewhere around there'}}));
        }.bind(this));

        return dfd.promise;
    };

    module.exports = CustomerService;

})(
        require('util'),
        require(Injector.getBasePath() + '/services/baseService'),
        require('q')
    );
