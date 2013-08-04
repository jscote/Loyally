'use strict';

/* Controllers */

controllers
    .controller ('checkinCtrl',
        ['$scope', function ($scope) {
            $scope.clicked = function() {
                //console.log(softwareVersion);
                alert('checkedIn ');
            };
        }]
    );


controllers
    .controller ('checkoutCtrl',
        ['$scope', function ($scope) {
            $scope.clicked = function() {
                //console.log(softwareVersion);
                alert('checkedOut ');
            };
        }]
    );