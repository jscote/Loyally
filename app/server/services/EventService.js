/**
 * Created by jscote on 10/20/13.
 */

var EventService = function () {

}

EventService.prototype.getEvents = function () {
    console.log('From events service');
    return {"data": [
        {"eventId": 10, "eventName": 'General Events'},
        {"eventId": 10, "eventName": 'General Events'}
    ]};
}

EventService.prototype.getEvent = function (eventId) {
    return {"data": [
        {"eventId": eventId, "eventName": 'General Events'}
    ]};
}

module.exports = EventService;

