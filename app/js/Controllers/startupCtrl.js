(function () {
    'use strict';


    var controllerId = 'startupCtrl';

    var startupCtrl = function ($scope, $rootScope, lyOfflineDetect) {
        var self = this;

        $scope.offlineDetection = lyOfflineDetect;

    }


    _$.controllers
        .controller(controllerId,
            ['$scope', '$rootScope', 'lyOfflineDetect', startupCtrl]
        );
})();
