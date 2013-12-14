(function() {
    'use strict';


    var controllerId = 'checkinCtrl';

    var checkinCtrl = function($scope, dataService){
        _$.controllers.BaseController.call(this, {scope: $scope});
        var self = this;

        $scope.data = {name: 'toto'};

        $scope.clicked = function() {
            self.doSomething();
            alert($scope.data.name);
            dataService.doSomething();
        };
    }

    checkinCtrl.inherits(_$.controllers.BaseController);

/*checkinCtrl.prototype.doSomething = function() {
    this.callBaseMethod('doSomething');
    alert('hello from here');
}*/

_$.controllers
    .controller (controllerId,
        ['$scope', 'dataService',checkinCtrl]
    );
})();
