/**
 * Created by jscote on 1/15/14.
 */
(function () {
    'use strict'

    module.exports = function () {


        var getStrategy = function (parameters) {
            var args = [].slice.apply(arguments);
            var strategy = undefined;
            if (args[0].route !== undefined) {
                strategy = args[0].route.path;
            }

            return strategy;
        }

        return {
            getStrategyName: getStrategy
        }
    }
})();