/**
 * Created by jscote on 10/20/13.
 */

var GeneralEventController = function(eventService, fs) {
    fs.myFunction();
    this.eventService = eventService;
}

GeneralEventController.prototype.index = function(request, response){
    this.eventService.index(request, response);
}

module.exports = GeneralEventController;

