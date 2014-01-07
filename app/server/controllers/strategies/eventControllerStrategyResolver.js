/**
 * Created by jscote on 1/6/14.
 */
(function () {
    'use strict'

    module.exports = function () {


        var getStrategy = function (parameters) {
            var args = [].slice.apply(arguments);
            var strategy = 'GeneralEvent';
            if (args[0].params.customer !== undefined) {
                strategy = 'CustomerEvent';
            }

            return strategy;
        }

        return {
            getStrategyName: getStrategy
        }
    }
})();