/**
 * Created by jscote on 10/20/13.
 */

var EventForCustomerController = function(test) {
    this.test = test;
}

EventForCustomerController.prototype.index = function(request, response){
    console.log('From Customer Event controller');
    this.test.log();
    var customerId = request.params.customer;
    response.send({"data": [{"eventId": 20, "eventName": 'Event For Customer', "customerId": customerId}]});

}

module.exports = EventForCustomerController;
