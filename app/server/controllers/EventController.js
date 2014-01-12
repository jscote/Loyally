/**
 * Created by jscote on 10/20/13.
 */

var EventController = function(eventService, fs) {
    fs.myFunction();
    this.eventService = eventService;
}

EventController.prototype.index = function(request, response){
    response.send(this.eventService.getEvents());
}

EventController.prototype.get = function(request, response){
    var eventId = request.params.event;
    response.send(this.eventService.getEvent(eventId));
}

module.exports = EventController;

