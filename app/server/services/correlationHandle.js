/**
 * Created by jscote on 2/16/14.
 */
(function () {

    'use strict';

    var CorrelationHandle = function CorrelationHandle() {
        Object.defineProperty(this, "activityId", { writable: true });
    };


    CorrelationHandle.prototype.generateUUID = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    module.exports = CorrelationHandle;

})();