/**
 * Created by jscote on 10/20/13.
 */

(function (controllerResolver) {
    "use strict";
    module.exports = (function customerRouteHandler() {
        var targetController = 'CustomerController';
        var controller = null;

        var all = function (request, response, next) {
            controller = controllerResolver.getController({targetController: targetController, parameters: request});
            next();
        };

        var index = function (request, response) {
            var result = controller.index(request, response);
            response.send(result.data);
        };

        var get = function (request, response) {
            var result = controller.get(request, response);
            response.send(result.data);
        };


        return {
            all: all,
            index: index,
            show: get,
            edit: get
        }
    })();
})(Injector.resolve({target: 'controllerResolver', resolutionName: 'CustomerController'}));