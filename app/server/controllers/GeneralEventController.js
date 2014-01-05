/**
 * Created by jscote on 10/20/13.
 */

var GeneralEventController = function(getEventService, fs) {
    fs.myFunction();
    this.getEventService = getEventService;
}

GeneralEventController.prototype.index = function(request, response){
    this.getEventService.index(request, response);
}

module.exports = GeneralEventController;

