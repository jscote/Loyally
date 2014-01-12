/**
 * Created by jscote on 10/20/13.
 */

function CustomerEventController(eventService, fs) {
    if(!(this instanceof CustomerEventController)) return new CustomerEventController(eventService, fs);

    fs.myFunction();
    this.eventService = eventService;
}

CustomerEventController.prototype.index = function(request, response){
    var customerId = request.params.customer;
    response.send(this.eventService.getEventsForCustomer(customerId));
}

CustomerEventController.prototype.get = function(request, response){
    var customerId = request.params.customer;
    var eventId = request.params.event;
    response.send(this.eventService.getEvent(customerId, eventId));
}

module.exports = CustomerEventController;

