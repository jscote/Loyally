'use strict';

controllers.checkinCtrl = function($scope){
    controllers.BaseController.call(this, {scope: $scope});
    var self = this;

    $scope.clicked = function() {
        self.doSomething();
        alert('checkedIn ');
    };
}
controllers.checkinCtrl.inherits(controllers.BaseController);

/*checkinCtrl.prototype.doSomething = function() {
    this.callBaseMethod('doSomething');
    alert('hello from here');
}*/

controllers
    .controller ('checkinCtrl',
        ['$scope',controllers.checkinCtrl]
    );
