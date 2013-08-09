'use strict';

controllers.checkinCtrl = function($scope, dataService){
    controllers.BaseController.call(this, {scope: $scope});
    var self = this;

    $scope.clicked = function() {
        self.doSomething();
        alert('checkedIn ');
        dataService.doSomething();
    };
}
controllers.checkinCtrl.inherits(controllers.BaseController);

/*checkinCtrl.prototype.doSomething = function() {
    this.callBaseMethod('doSomething');
    alert('hello from here');
}*/

controllers
    .controller ('checkinCtrl',
        ['$scope', 'dataService',controllers.checkinCtrl]
    );
