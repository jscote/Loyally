/**
 * Created by jscote on 2/2/14.
 */
angular.module('loyuly').value('lyToastr', toastr);

angular.module('loyuly').factory('lyNotifier', function(lyToastr) {
    return {
        notify: function(msg) {
            lyToastr.success(msg);
            console.log(msg);
        },
        error: function(msg) {
            lyToastr.error(msg);
            console.log(msg);
        }
    }
});