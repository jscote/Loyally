'use strict';

controllers
    .controller ('checkinCtrl',
        ['$scope', function ($scope) {
            $scope.clicked = function() {
                alert('checkedIn ');
            };
        }]
    );

