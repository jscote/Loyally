/**
 * Created by jscote on 10/20/13.
 */

var EventForCustomerController = function() {

}

EventForCustomerController.prototype.index = function(request, response){
    console.log('From Customer Event controller');
    var customerId = request.params.customer;
    response.send({"data": [{"eventId": 20, "eventName": 'Event For Customer', "customerId": customerId}]})
}

module.exports = EventForCustomerController;
