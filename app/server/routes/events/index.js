/**
 * Created by jscote on 10/20/13.
 *
 * Although these files are considered to be controllers from 'express-resource-new' module standpoint,
 * they are more route handlers from my point of view. When resources are nested, these so-called controllers
 * are handling the route for both non-nested and nested routes. Therefore, they 'violate' the principle of single
 * responsibility.
 *
 * They are also very limited in terms of ability to inject services. As a result, I think it is better to consider them
 * route handlers. Based on what they are trying to handle, we can inject a proper controller and that controller can take
 * dependencies on all the services it needs.
 *
 * There is an assumption about the way routes are composed  and the way 'strategies' are
 * supported by a route handler. As a result, when a route changes, the strategy resolver needs to change. It would be good if we
 * could create a generic strategyResolver that takes the route as a parameter and figures out which strategy name to return in order
 * to resolve the proper controller. We could then simply change which controller gets injected for a specific route by modifying
 * the configuration.
 *
 * Another note is that it is an assumption that the controller being injected supports the method of the route. For instance,
 * there is no guarantee that the injected controller has an edit method while the route does have one. This could be an acceptable
 * trade-off that most javascript programs has since interfaces aren't supported. Although there are ways to solve this problem, such as
 * verifying that the injected object does indeed have the expected functions on it.
 */

(function (controllerResolver) {

    'use strict'

    module.exports = (function eventsRouteHandler () {
        var targetController = 'EventController';
        var controller = null;

         var all = function (request, response, next) {
            controller = controllerResolver.getController({targetController: targetController, parameters: request});
            next();
        }

        var index = function (request, response) {

            var f = Injector.resolve({target: 'fs'});
            f.myFunction();

            controller.index(request, response);

        }

        return {
            all: all,
            index: index
        }
    })();
})(Injector.resolve({target: 'controllerResolver', resolutionName: 'EventsController'}))
