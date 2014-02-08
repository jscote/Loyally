/**
 * Created by jscote on 2/2/14.
 */
_$.services.offlineDetect = function($window, $rootScope) {

    this.online = navigator.onLine;

    var self = this;

    $window.addEventListener("offline", function () {

        $rootScope.$apply(function() {
            self.online = false;
        })


    }, false);
    $window.addEventListener("online", function () {
        $rootScope.$apply(function() {
            self.online = true;
        })

    }, false);
    return this;
}
_$.services.service('lyOfflineDetect', ['$window', '$rootScope', _$.services.offlineDetect]);