/**
 * Created by jscote on 10/20/13.
 */

(function (util, base, q) {

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

        var deferred = q.defer();

        process.nextTick(function () {
            self.customerService.getCustomer({"customerId": message.data.customerId}).then(function (customerResponse) {
                deferred.resolve([
                    {"eventId": 20, "eventName": 'Event For Customer', "customer": customerResponse.data},
                    {"eventId": 30, "eventName": 'Event For Customer', "customer": customerResponse.data}
                ]);
            });

        })


        return deferred.promise;
    };

    EventService.prototype.getEventForCustomer = function (message) {
        //throw('let us see if there is an error');

        var self = this;
        var dfd = q.defer();


        process.nextTick(function () {
            if (message.data.eventId > 1000) {
                var msg = new self.messaging.ServiceResponse();
                msg.errors.push({error: 'Error from Get Event For a customer - triggered on purpose for testing'});
                msg.isSuccess = false;
                dfd.resolve(msg);
            } else {

                var customerMessage = new self.messaging.ServiceMessage({data: {"customerId": message.data.customerId}});
                self.customerService.getCustomer(customerMessage).then(function (customerResponse) {

                    dfd.resolve({"eventId": message.data.eventId, "eventName": 'Event For Customer', "customer": customerResponse.data});
                });
            }

        });

        return dfd.promise;
    };


    module.exports = EventService;

})(
        require('util'),
        require(Injector.getBasePath() + '/services/baseService'),
        require('q')
    );