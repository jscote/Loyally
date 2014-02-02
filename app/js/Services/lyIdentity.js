/**
 * Created by jscote on 2/2/14.
 */
angular.module('loyuly').factory('lyIdentity', function($window, lyUser) {
    var currentUser;
    if(!!$window.bootstrappedUserObject) {
        currentUser = new lyUser();
        angular.extend(currentUser, $window.bootstrappedUserObject);
    }
    return {
        currentUser: currentUser,
        isAuthenticated: function() {
            return !!this.currentUser;
        },
        isAuthorized: function(role) {
            return !!this.currentUser && this.currentUser.roles.indexOf(role) > -1;
        }
    }
});