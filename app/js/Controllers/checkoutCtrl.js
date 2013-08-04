'use strict';

controllers
    .controller ('checkoutCtrl',
        ['$scope', function ($scope) {
            $scope.clicked = function() {
                //console.log(softwareVersion);
                alert('checkedOut ');
            };
        }]
    );