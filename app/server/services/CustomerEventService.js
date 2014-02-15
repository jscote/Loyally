/**
 * Created by jscote on 10/20/13.
 */

(function (util, base) {

    'use strict';

    function CustomerEventService(test) {
        if (!(this instanceof CustomerEventService)) return new CustomerEventService(test);
        base.call(this);

        //Example of injecting a simple function with the default resolutionName
        this.test = test;

    }

    util.inherits(CustomerEventService, base);

    CustomerEventService.prototype.getEventsForCustomer = function (customerId) {
        console.log('From Customer Event Service');
        this.test.log();
        return [
            {"eventId": 20, "eventName": 'Event For Customer', "customerId": customerId},
            {"eventId": 30, "eventName": 'Event For Customer', "customerId": customerId}
        ];

    };

    CustomerEventService.prototype.getEvent = function (customerId, eventId) {
        return {"eventId": eventId, "eventName": 'Event For Customer', "customerId": customerId};
    };

    module.exports = CustomerEventService;

})(
        require('util'),
        require(Injector.getBasePath() + '/services/baseService')
    );
