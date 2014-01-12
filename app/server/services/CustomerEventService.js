/**
 * Created by jscote on 10/20/13.
 */

var CustomerEventService = function (test) {
    this.test = test;
}

CustomerEventService.prototype.getEventsForCustomer = function (customerId) {
    console.log('From Customer Event Service');
    this.test.log();
    return ({"data": [
        {"eventId": 20, "eventName": 'Event For Customer', "customerId": customerId},
        {"eventId": 30, "eventName": 'Event For Customer', "customerId": customerId}
    ]});

};

CustomerEventService.prototype.getEvent = function (customerId, eventId) {
    return ({"data":
        {"eventId": eventId, "eventName": 'Event For Customer', "customerId": customerId}
    });

};

module.exports = CustomerEventService;