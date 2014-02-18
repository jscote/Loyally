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
        if (_.isUndefined(msg.correlationId) || _.isNull(msg.correlationId)) {
            if (_.isUndefined(service.correlationId) || _.isNull(service.correlationId)) {
                msg.correlationId = correlationHandle.generateUUID();
                service.correlationId = msg.correlationId;
            }
            msg.correlationId = service.correlationId;
        }

        //Set the correlationId of all injected services to this service so that they share the same correlationId
        for (var prop in service) {
            if (service.hasOwnProperty(prop)) {
                if (service[prop] instanceof baseService) {
                    service[prop].correlationId = service.correlationId;
                }
            }
        }

    }

    function logExecution(msg, delegateFnName, eventName) {
        console.log("%s, %s, correlationId: %s, message payload: %j", eventName, delegateFnName, msg.correlationId, msg.data);
    }

    function logExecutionError(msg, delegateFnName, eventName, error) {
        console.log("%s, %s, correlationId: %s, message payload: %j, with error: %s", eventName, delegateFnName, msg.correlationId, msg.data, error);
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

                //Log before Call
                logExecution(msg, delegateFnName, "Before Execution");
                var result = {data: null};
                try {
                    result = delegateFn.call(delegateClass, msg);
                } catch (exception) {

                    //TODO - if there is an error, make sure to create a response and set the errors based on the exception
                    //Log Error while calling
                    logExecutionError(msg, delegateFnName, "Error Executing", exception);
                    var errorResponse;
                    if (!(result instanceof message.ServiceResponse)) {
                        errorResponse = new message.ServiceResponse({data: result});
                        errorResponse.isSuccess = false;
                    } else {
                        errorResponse = result;
                        errorResponse.isSuccess = false;
                    }

                    errorResponse.errors.push(exception);

                    logExecution(msg, delegateFnName, "After Execution");

                    return errorResponse;
                }

                //Log after call
                logExecution(msg, delegateFnName, "After Execution");

                //TODO - check if the result is of type ServiceResponse.
                var response;
                if (!(result instanceof message.ServiceResponse)) {
                    response = new message.ServiceResponse({data: result});
                    response.isSuccess = true;
                } else {
                    response = result;
                    response.isSuccess = true;
                }


                response.correlationId = msg.correlationId;
                return response;
            };
        }
    }
})(
        require('lodash'),
        require(Injector.getBasePath() + '/services/baseService'),
        require(Injector.getBasePath() + '/services/serviceMessage'),
        require(Injector.getBasePath() + '/services/CorrelationHandle')
    );