/**
 * Created by jscote on 10/20/13.
 */

(function (controllerResolver, q) {
    "use strict";
    module.exports = (function customerRouteHandler() {
        var targetController = 'CustomerController';
        var controller = null;

        var all = function (request, response, next) {
            controller = controllerResolver.getController({targetController: targetController, parameters: request});
            next();
        };

        var index = function (request, response) {
            controller.index(request).then(function (result) {
                response.send(result.statusCode, result.data);
            })
        };

        var get = function (request, response) {
            controller.get(request).then(function (result) {
                response.send(result.statusCode, result.data);
            });

        };

        return {
            all: all,
            index: index,
            show: get,
            edit: get
        }
    })();
})(
        Injector.resolve({target: 'controllerResolver', resolutionName: 'CustomerController'}),
        require('q')
    );