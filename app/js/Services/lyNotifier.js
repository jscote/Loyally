/**
 * Created by jscote on 2/2/14.
 */
angular.module('loyuly').value('lyToastr', toastr);

angular.module('loyuly').factory('lyNotifier',
    [
        '$log',
        'lyToastr',
        function ($log, lyToastr) {
            return {
                notify: function (msg) {
                    lyToastr.success(msg);
                    $log.info(msg);
                },
                error: function (msg) {
                    lyToastr.error(msg);
                    $log.error(msg);
                },
                warning: function (msg) {
                    lyToastr.warning(msg);
                    $log.warn(msg);
                }
            }
        }]);