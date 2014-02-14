(function (controllerResolver) {

    'use strict'

    module.exports = (function itemsRouteHandler() {
        var targetController = 'ItemController';
        var controller = null;

        var all = function (request, response, next) {
            controller = controllerResolver.getController({targetController: targetController, parameters: request});
            next();
        }

        var index = function (request, response) {
            controller.index(request, response);
        }

        var get = function (request, response) {
            controller.get(request, response);
        }


        return {
            all: all,
            index: index,
            show: get,
            edit: get
        }
    })();
})(Injector.resolve({target: 'controllerResolver', resolutionName: 'ItemsController'}));
