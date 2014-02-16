/**
 * Created by jscote on 10/20/13.
 */

(function (util, base) {

    'use strict';

    function EventService(test) {
        if (!(this instanceof EventService)) return new EventService();

        base.call(this);

        this.test = test;
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
        console.log('From Customer Event Service');
        this.test.log();
        return [
            {"eventId": 20, "eventName": 'Event For Customer', "customerId": customerId},
            {"eventId": 30, "eventName": 'Event For Customer', "customerId": customerId}
        ];

    };

    EventService.prototype.getEventForCustomer = function (customerId, eventId) {
        return {"eventId": eventId, "eventName": 'Event For Customer', "customerId": customerId};
    };


    module.exports = EventService;

})(
        require('util'),
        require(Injector.getBasePath() + '/services/baseService')
    );