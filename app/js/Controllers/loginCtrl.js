/**
 * Created by jscote on 2/2/14.
 */

'use strict';

_$.controllers
    .controller('lyNavBarLoginCtrl',
        [
            '$scope',
            'lyIdentity',
            'lyNotifier',
            'lyAuth',
            '$location',
            function ($scope, lyIdentity, lyNotifier, lyAuth, $location) {
                $scope.identity = lyIdentity;
                $scope.signin = function (username, password) {
                    lyAuth.authenticateUser(username, password).then(function (success) {
                        if (success) {
                            lyNotifier.notify('You have successfully signed in!');
                        } else {
                            lyNotifier.error('Username/Password combination incorrect');
                        }
                    }).catch(function (reason) {
                            lyNotifier.error(reason);
                        });
                };

                $scope.signout = function () {
                    lyAuth.logoutUser().then(function () {
                        $scope.username = "";
                        $scope.password = "";
                        lyNotifier.notify('You have successfully signed out!');
                        $location.path('/');
                    })
                }
            }]);