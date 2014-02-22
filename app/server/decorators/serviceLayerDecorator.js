/**
 * Created by jscote on 2/17/14.
 */


(function (_, baseService, message, CorrelationHandle, q) {

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


             */

            if (!_.isUndefined(args[0])) {
                if (!_.isUndefined(args[0].data)) {
                    msg.data = args[0].data;
                } else {
                    msg.data = args[0];
                }
            }
            else {
                msg.data = {};
            }

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
        copyPropertiesToInjectedService(service, ['correlationId']);
    }

    function copyErrorsFromInjectedService(owner) {
        for (var prop in owner) {
            if (owner.hasOwnProperty(prop)) {
                if (owner[prop] instanceof baseService) {
                    if (owner.errors.length == 0) {
                        owner.errors = owner[prop].errors;
                    }
                }
            }
        }
    }

    function copyPropertiesToInjectedService(owner, propNameList) {
        for (var prop in owner) {
            if (owner.hasOwnProperty(prop)) {
                if (owner[prop] instanceof baseService) {
                    for (var i = 0; i < propNameList.length; i++) {
                        owner[prop][propNameList[i]] = owner[propNameList[i]];
                    }
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

    function setErrorsInPipeline(klass, response) {
        //Set the errors from the response into the current service
        klass.errors = klass.errors.concat(response.errors);

        //Copy errors from services injected into the service
        copyErrorsFromInjectedService(klass, ['errors']);
        response.errors = klass.errors;
        response.isSuccess = response.errors.length == 0;
    }

    function createResponseFromResult(result, response, isSuccess) {
        if (!(result instanceof message.ServiceResponse)) {
            response = new message.ServiceResponse({data: result});
            response.isSuccess = isSuccess;
        } else {
            response = result;
            response.isSuccess = response.isSuccess == false ? false : isSuccess;
        }
        return response;
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

                //Log before Call
                logExecution(msg, delegateFnName, "Before Execution");

                var result = {data: null};
                var dfd = q.defer();
                var response;
                try {
                    result = delegateFn.call(delegateClass, msg);

                    if (q.isPromise(result)) {
                        result.then(function (promiseResult) {

                            response = createResponseFromResult(promiseResult, response, true);
                            logExecution(msg, delegateFnName, "After Execution");

                            //TODO -Revise this... most likely won't work in async code
                            setErrorsInPipeline(delegateClass, response);

                            response.correlationId = msg.correlationId;

                            dfd.resolve(response);
                        }).fail(function (error) {
                                logExecutionError(msg, delegateFnName, "Error Executing", exception);
                                response = createResponseFromResult(error, response, false);
                                response.errors.push(error);
                                dfd.reject(response);

                            }
                        );
                    } else {
                        response = createResponseFromResult(result, response, true);
                        logExecution(msg, delegateFnName, "After Execution");

                        setErrorsInPipeline(delegateClass, response);

                        response.correlationId = msg.correlationId;
                    }

                } catch (exception) {

                    //if there is an error, make sure to create a response and set the errors based on the exception
                    //Log Error while calling
                    logExecutionError(msg, delegateFnName, "Error Executing", exception);


                    response = createResponseFromResult(result, response, false);

                    response.errors.push(exception);
                }

                //Log after call

                //return response;
                return dfd.promise;
            };
        }
    }
})(
        require('lodash'),
        require(Injector.getBasePath() + '/services/baseService'),
        require(Injector.getBasePath() + '/services/serviceMessage'),
        require(Injector.getBasePath() + '/services/CorrelationHandle'),
        require('q')
    );