(function (controllerResolver, baseRoute) {

    'use strict';

    module.exports = (function itemsRouteHandler() {
        var targetController = 'ItemController';
        var controller = null;

        var all = function (request, response, next) {
            controller = controllerResolver.getController({targetController: targetController, parameters: request});
            next();
        };

        var index = function (request, response) {
            var result = controller.index(request, response);
            response.send(result.statusCode, result.data);
        };

        var get = function (request, response) {
            var result = controller.get(request, response);
            response.send(result.statusCode, result.data);
        };

        return baseRoute.createRoutes({
            all: all,
            index: index,
            show: get,
            edit: get
        });
    })();
})(Injector.resolve({target: 'controllerResolver', resolutionName: 'ItemsController'}), require(Injector.getBasePath() + '/routes/baseRoute'));
