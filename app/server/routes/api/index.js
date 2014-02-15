(function () {

    'use strict'

    module.exports = (function eventsRouteHandler() {

        var all = function (request, response, next) {
            next()
        }

        var index = function (request, response) {
            response.send({message: 'from index'});

        }

        return {
            options: {root: true},
            index: index,
            get: index
        }
    })();
})();
