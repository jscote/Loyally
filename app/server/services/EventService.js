/**
 * Created by jscote on 10/20/13.
 */

(function (util, base) {

    'use strict';

    function EventService(customerService, serviceMessage) {
        if (!(this instanceof EventService)) return new EventService(customerService, serviceMessage);

        base.call(this);

        this.customerService = customerService;
        this.messaging = serviceMessage;
    }

    util.inherits(EventService, base);

    EventService.prototype.getEvents = function () {
        console.log('From events service');
        return [
            {"eventId": 10, "eventName": 'General Events'},
            {"eventId": 10, "eventName": 'General Events'}
        ];
    };

    EventService.prototype.getEvent = function (message) {
        return {"eventId": message.data.eventId, "eventName": 'General Events'};
    };

    EventService.prototype.getEventsForCustomer = function (message) {

        var customerMessage = new this.messaging.ServiceMessage({data: {"customerId": message.data.customerId}});

        var customer = this.customerService.getCustomer(customerMessage).data;
        return [
            {"eventId": 20, "eventName": 'Event For Customer', "customer": customer},
            {"eventId": 30, "eventName": 'Event For Customer', "customer": customer}
        ];

    };

    EventService.prototype.getEventForCustomer = function (message) {
        throw('let us see if there is an error');

        var customerMessage = new this.messaging.ServiceMessage({data: {"customerId": message.data.customerId}});
        var customer = this.customerService.getCustomer(customerMessage).data;

        return {"eventId": message.data.eventId, "eventName": 'Event For Customer', "customer": customer};
    };


    module.exports = EventService;

})(
        require('util'),
        require(Injector.getBasePath() + '/services/baseService')
    );