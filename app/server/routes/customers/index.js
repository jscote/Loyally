/**
 * Created by jscote on 10/20/13.
 */

(function () {
    "use strict"
    module.exports = (function customerRouteHandler() {
        var targetController = 'GeneralEventController';
        var controller = null;

        var all = function (request, response, next) {
            //controller = controllerResolver.getController({targetController: targetController, parameters: request});
            next();
        }

        var index = function (request, response) {
            //response.send('events index');
            response.send({"data": [
                {"customerId": 1, "customerName": 'My Address'}
            ]});
        }

        return {
            all: all,
            index: index
        }
    })();
})()