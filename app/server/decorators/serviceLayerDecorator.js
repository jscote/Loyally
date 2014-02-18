/**
 * Created by jscote on 2/17/14.
 */


(function (_, baseService, message, CorrelationHandle) {

    'use strict';

    var correlationHandle = new CorrelationHandle();

    function initializeMessage(msg, args) {
        var parameters = {};

        //Check if the arguments are of type ServiceMessage. If not, then create a service message

        if (_.isUndefined(msg)) {
            msg = new message.ServiceMessage();
/*            for (var i = 0; i < argsName.length; i++) {
                //and copy original arguments to the data object of the message
                if (!_.isUndefined(args[i])) {
                    parameters[argsName[i]] = args[i];
                }
            }

            msg.data = parameters;
 */
        }

        return msg;
    }

    function getServiceMessage(args, argsName) {

        var msg = _.find(args, function (item) {
            return item instanceof message.ServiceMessage
        });

        return initializeMessage(msg, args, argsName);

    }

    function setCorrelationId(service, msg) {

        //Check if the serviceMessage has a correlationId, if not, give it one
        //by first checking if the service has one, if not, create a new one
        //and also assign to the service

        //if message has a correlationId, let's use this one
        if(_.isUndefined(msg.correlationId) || _.isNull(msg.correlationId)) {
            if(_.isUndefined(service.correlationId) || _.isNull(service.correlationId)) {
                msg.correlationId = correlationHandle.generateUUID();
                service.correlationId = msg.correlationId;
            }
            msg.correlationId = service.correlationId;
        }

        //Set the correlationId of all injected services to this service so that they share the same correlationId
        for(var prop in service) {
            if(service.hasOwnProperty(prop)) {
                if(service[prop] instanceof baseService) {
                    service[prop].correlationId = service.correlationId;
                }
            }
        }

    }

    module.exports = function (delegateClass) {
        return function (delegateFn, delegateFnName, argsName) {
            return function () {

                console.log("logging from decorator for all services:: function Name: " + delegateFnName);
                var args = [].slice.call(arguments);

                var msg = getServiceMessage(args, argsName);

                setCorrelationId(delegateClass, msg);

                //TODO - Check if the method has annotations to validate the message.
                //TODO - If so, execute the validation method.
                //TODO - If the message is not valid, return a response with the validation errors

                //surround call with a try catch

                //TODO - Log before Call
                try {
                    var result = delegateFn.call(delegateClass, msg);
                } catch (exception) {

                    //TODO - if there is an error, make sure to create a response and set the errors based on the exception
                    //TODO - Log Error while calling
                }

                //TODO - Log after call

                //TODO - check if the result is of type ServiceResponse.


                return result;
            };
        }
    }
})(
        require('lodash'),
        require(Injector.getBasePath() + '/services/baseService'),
        require(Injector.getBasePath() + '/services/serviceMessage'),
        require(Injector.getBasePath() + '/services/CorrelationHandle')
    );