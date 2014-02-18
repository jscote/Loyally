/**
 * Created by jscote on 2/16/14.
 */
(function (util) {

    'use strict';

    var MessageBase = function MessageBase(options) {
        options = options || { };
        Object.defineProperty(this, "data", { writable: true, value: options.data || {} });
        Object.defineProperty(this, "correlationId", {writable: true, value: null});
    };

    var ServiceMessage = function ServiceMessage(options) {
        MessageBase.call(this, options);
    };

    util.inherits(ServiceMessage, MessageBase);

    var ServiceResponse = function ServiceResponse(options) {
        MessageBase.call(this, options);
        Object.defineProperty(this, "isSuccess", { writable: true, value: false });
        Object.defineProperty(this, "errors", { writable: true, value: [] });
    };

    util.inherits(ServiceResponse, MessageBase);

    module.exports.ServiceMessage = ServiceMessage;
    module.exports.ServiceResponse = ServiceResponse;

})(require('util'));