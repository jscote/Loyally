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

module.exports = EventController;

