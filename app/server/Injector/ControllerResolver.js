/**
 * Created by jscote on 1/6/14.
 *
 */
(function () {
    'use strict'

    module.exports = function (strategyResolver) {


        var getController = function (args) {
            var strategyName = strategyResolver.getStrategyName(args.parameters);

            return Injector.resolve({target: args.targetController, resolutionName: strategyName});
        }

        return {
            getController: getController
        }
    }
})();