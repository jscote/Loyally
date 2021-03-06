/**
 * Created by jscote on 10/27/13.
 */
(function () {
    'use strict';

    var app = angular.module('loyuly');

    // Configure Toastr
    //toastr.options.timeOut = 4000;
    //toastr.options.positionClass = 'toast-bottom-right';

    // For use with the HotTowel-Angular-Breeze add-on that uses Breeze
    //var remoteServiceName = 'breeze/Breeze';

    var events = {
        controllerActivateSuccess: 'controller.activateSuccess',
        spinnerToggle: 'spinner.toggle'
    };

    var config = {
        appErrorPrefix: '[HT Error] ', //Configure the exceptionHandler decorator
        docTitle: 'HotTowel: ',
        events: events,
        version: '2.0.0'
    };

    app.value('config', config);

    //app.config(['$logProvider', function ($logProvider) {
    //    // turn debugging off/on (no info or warn)
    //    if ($logProvider.debugEnabled) {
    //        $logProvider.debugEnabled(true);
    //    }
    //}]);

    //#region Configure the common services via commonConfig
    /*app.config(['commonConfigProvider', function (cfg) {
        cfg.config.controllerActivateSuccessEvent = config.events.controllerActivateSuccess;
        cfg.config.spinnerToggleEvent = config.events.spinnerToggle;
    }]);
    //#endregion

    //#region Configure the bootstrap common services via bsConfig
    app.config(['bsDialogConfigProvider', function (cfg) {
        cfg.config = {
            templatePath: '/app/common/bootstrap'
        };
    }]);*/
    //#endregion
})();