/**
 * Created by jscote on 3/1/14.
 */
(function(_){

    module.exports = (function() {

        var index = function(request, response) {
            response.send("501", {error: "This type of request is not supported for the requested resource"});
        };
        var create = function(request, response){
            response.send("501", {error: "This type of request is not supported for the requested resource"});
        };
        var show = function(request, response) {
            response.send("501", {error: "This type of request is not supported for the requested resource"});
        };
        var edit = function(request, response) {
            response.send("501", {error: "This type of request is not supported for the requested resource"});
        };
        var update = function(request, response) {
            response.send("501", {error: "This type of request is not supported for the requested resource"});
        };
        var destroy = function(request, response) {
            response.send("501", {error: "This type of request is not supported for the requested resource"});
        };

        var baseRoute = {
            index: index,
            create: create,
            show: show,
            edit: edit,
            update: update,
            destroy: destroy
        };

        var createRoutes = function(route) {
            for(var prop in baseRoute){
                //don't copy if we have a function for it in the route
                if(_.isUndefined(route[prop]) && prop !== 'createRoutes') {
                    route[prop] = baseRoute[prop];
                }
            }
            return route;
        };

        return {
            createRoutes: createRoutes
        };

    })();

}) (
        require('lodash')
    );