/**
 * Created by jscote on 10/20/13.
 */

(function (util, base) {

    'use strict';

    function EventService(customerService) {
        if (!(this instanceof EventService)) return new EventService();

        base.call(this);

        this.customerService = customerService;
    }

    util.inherits(EventService, base);

    EventService.prototype.getEvents = function () {
        console.log('From events service');
        return [
            {"eventId": 10, "eventName": 'General Events'},
            {"eventId": 10, "eventName": 'General Events'}
        ];
    };

    EventService.prototype.getEvent = function (eventId) {
        return {"eventId": eventId, "eventName": 'General Events'};
    };

    EventService.prototype.getEventsForCustomer = function (customerId) {
        var customer = this.customerService.getCustomer(customerId);
        return [
            {"eventId": 20, "eventName": 'Event For Customer', "customer": customer},
            {"eventId": 30, "eventName": 'Event For Customer', "customer": customer}
        ];

    };

    EventService.prototype.getEventForCustomer = function (customerId, eventId) {
        var customer = this.customerService.getCustomer(customerId);
        return {"eventId": eventId, "eventName": 'Event For Customer', "customer": customer};
    };


    module.exports = EventService;

})(
        require('util'),
        require(Injector.getBasePath() + '/services/baseService')
    );