/**
 * Created by jscote on 2/2/14.
 */
angular.module('loyuly').factory('lyAuth', function ($http, lyIdentity, $q, lyUser) {
    return {
        authenticateUser: function (username, password) {
            var dfd = $q.defer();
            $http.post('/login', {username: username, password: password})
                .success(
                function (response) {
                    if (response.success) {
                        var user = new lyUser();
                        angular.extend(user, response.user);
                        lyIdentity.currentUser = user;
                        dfd.resolve(true);
                    } else {
                        dfd.resolve(false);
                    }
                }).error(
                function (reason) {
                    dfd.reject(reason)
                });
            return dfd.promise;
        },

        createUser: function (newUserData) {
            var newUser = new lyUser(newUserData);
            var dfd = $q.defer();

            newUser.$save().then(function () {
                mvIdentity.currentUser = newUser;
                dfd.resolve();
            }, function (response) {
                dfd.reject(response.data.reason);
            });

            return dfd.promise;
        },

        updateCurrentUser: function (newUserData) {
            var dfd = $q.defer();

            var clone = angular.copy(lyIdentity.currentUser);
            angular.extend(clone, newUserData);
            clone.$update().then(function () {
                mvIdentity.currentUser = clone;
                dfd.resolve();
            }, function (response) {
                dfd.reject(response.data.reason);
            });
            return dfd.promise;
        },

        logoutUser: function () {
            var dfd = $q.defer();
            $http.post('/logout', {logout: true}).then(function () {
                lyIdentity.currentUser = undefined;
                dfd.resolve();
            });
            return dfd.promise;
        },
        authorizeCurrentUserForRoute: function (role) {
            if (lyIdentity.isAuthorized(role)) {
                return true;
            } else {
                return $q.reject('not authorized');
            }

        },
        authorizeAuthenticatedUserForRoute: function () {
            if (lyIdentity.isAuthenticated()) {
                return true;
            } else {
                return $q.reject('not authorized');
            }
        }
    }
});