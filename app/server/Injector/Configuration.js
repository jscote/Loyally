/**
 * Created by jscote on 10/20/13.
 */


(function (_, decoratorHelper, apiControllerTransformResultDecorator, controllerPermissionDecorator, serviceDecorator) {

    module.exports = function () {
        console.log('Configuring the injection container');
        console.log('dirname is: ' + Injector.getBasePath());
        Injector
            .decorator(require(Injector.getBasePath() + '/controllers/apiController'), function (delegateClass) {
                decoratorHelper.decorateFunctions(delegateClass, apiControllerTransformResultDecorator(delegateClass));
                return delegateClass;
            })
            .decorator(require(Injector.getBasePath() + '/controllers/permissionApiController'), function (delegateClass) {
                decoratorHelper.decorateFunctions(delegateClass, controllerPermissionDecorator(delegateClass));
                return delegateClass;
            })
            .decorator(require(Injector.getBasePath() + '/services/baseService'), function (delegateClass) {
                decoratorHelper.decorateFunctions(delegateClass, serviceDecorator(delegateClass));
                return delegateClass;
            }
        )
            .register({dependency: '/Injector/StrategyResolver', name: 'strategyResolver'})
            .register({dependency: '/Injector/ControllerResolver', name: 'controllerResolver'})
    }
})
    (
        require('lodash'),
        require(Injector.getBasePath() + '/Helpers/decoratorHelper'),
        require(Injector.getBasePath() + '/decorators/apiControllerTransformResultDecorator'),
        require(Injector.getBasePath() + '/decorators/controllerPermissionDecorator'),
        require(Injector.getBasePath() + '/decorators/serviceLayerDecorator')
    );