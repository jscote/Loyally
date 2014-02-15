/**
 * Created by jscote on 10/20/13.
 */

(function (util, base) {

    'use strict';

    function EventService() {
        if (!(this instanceof EventService)) return new EventService();

        base.call(this);
    }

    util.inherits(EventService, base);

    EventService.prototype.getEvents = function () {
        console.log('From events service');
        return [
            {"eventId": 10, "eventName": 'General Events'},
            {"eventId": 10, "eventName": 'General Events'}
        ];
    };

    EventService.prototype.getEvent = function (eventId) {
        return {"eventId": eventId, "eventName": 'General Events'};

    };

    module.exports = EventService;

})(
        require('util'),
        require(Injector.getBasePath() + '/services/baseService')
    );