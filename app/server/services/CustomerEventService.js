/**
 * Created by jscote on 10/20/13.
 */

function CustomerEventService(test) {
    if(!(this instanceof CustomerEventService)) return new CustomerEventService(test);

    //Example of injecting a simple function with the default resolutionName
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
