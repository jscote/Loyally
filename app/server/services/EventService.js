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
        this.errors.push('Well that did not go well');
        console.log('From events service');
        return [
            {"eventId": 10, "eventName": 'General Events'},
            {"eventId": 10, "eventName": 'General Events'}
        ];
    };

    EventService.prototype.getEvent = function (message) {
        if (message.data.eventId > 1000) {
            var msg = new this.messaging.ServiceResponse();
            msg.errors.push('Error from Get Event For a customer - triggered on purpose for testing');
            msg.isSuccess = false;
            return msg;
        }

        return {"eventId": message.data.eventId, "eventName": 'General Events'};
    };

    EventService.prototype.getEventsForCustomer = function (message) {


        //var customerMessage = new this.messaging.ServiceMessage({data: {"customerId": message.data.customerId}});

        //var customer = this.customerService.getCustomer(customerMessage).data;

        var self = this;

        process.nextTick(function () {
            var customer = self.customerService.getCustomer({"customerId": message.data.customerId}).data;
            return [
                {"eventId": 20, "eventName": 'Event For Customer', "customer": customer},
                {"eventId": 30, "eventName": 'Event For Customer', "customer": customer}
            ];
        })
    };

    EventService.prototype.getEventForCustomer = function (message) {
        //throw('let us see if there is an error');

        if (message.data.eventId > 1000) {
            var msg = new this.messaging.ServiceResponse();
            msg.errors.push('Error from Get Event For a customer - triggered on purpose for testing');
            msg.isSuccess = false;
            return msg;
        }

        var customerMessage = new this.messaging.ServiceMessage({data: {"customerId": message.data.customerId}});
        var customer = this.customerService.getCustomer(customerMessage).data;

        return {"eventId": message.data.eventId, "eventName": 'Event For Customer', "customer": customer};
    };


    module.exports = EventService;

})(
        require('util'),
        require(Injector.getBasePath() + '/services/baseService')
    );