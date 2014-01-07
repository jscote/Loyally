/**
 * Created by jscote on 10/20/13.
 */

var EventsController = function() {

}

EventsController.prototype.index = function(request, response){
    console.log('From events controller');
    response.send({"data": [{"eventId": 10, "eventName": 'General Events'}]})
}

module.exports = EventsController;

