'use strict';

_$.controllers.checkinCtrl = function($scope, dataService){
    _$.controllers.BaseController.call(this, {scope: $scope});
    var self = this;

    $scope.data = {name: 'toto'};

    $scope.clicked = function() {
        self.doSomething();
        alert($scope.data.name);
        dataService.doSomething();
    };
}

_$.controllers.checkinCtrl.inherits(_$.controllers.BaseController);

/*checkinCtrl.prototype.doSomething = function() {
    this.callBaseMethod('doSomething');
    alert('hello from here');
}*/

_$.controllers
    .controller ('checkinCtrl',
        ['$scope', 'dataService',_$.controllers.checkinCtrl]
    );
