/**
 * Created by jscote on 2/17/14.
 */
(function (_, annotationHelper, httpApiResponse, messaging, q) {

    'use strict';

    module.exports = function (delegateClass) {
        return function (delegateFn, delegateFnName) {
            //Decorate the class with a tail decoration to modify the returned object if it is not in the expected format

            return function () {
                var args = [].slice.call(arguments);
                var promise = delegateFn.apply(delegateClass, args);
                var defaultStatusCode = '200';
                var defaultErrorStatusCode = '400';

                var dfd = q.defer();

                promise.then(function (result) {

                    if (_.isUndefined(result)) {
                        result = null;
                    }

                    var statusCodeAnnotations = annotationHelper.getCombinedAnnotations(delegateClass, delegateFn, httpApiResponse.HttpStatusCode);
                    var errorStatusCodeAnnotations = annotationHelper.getCombinedAnnotations(delegateClass, delegateFn, httpApiResponse.HttpErrorStatusCode);

                    if (statusCodeAnnotations.length > 0) {
                        defaultStatusCode = statusCodeAnnotations[0].statusCode;
                    }

                    if (errorStatusCodeAnnotations.length > 0) {
                        defaultErrorStatusCode = errorStatusCodeAnnotations[0].statusCode;
                    }

                    var response = {};
                    if (result instanceof messaging.ServiceResponse) {
                        if (result.isSuccess) {
                            response = httpApiResponse.createHttpApiResponse(defaultStatusCode, result.data);
                        }
                        else {
                            response = httpApiResponse.createHttpApiResponse(defaultErrorStatusCode, result.errors);
                        }

                        result = response;
                    } else {
                        if (!(result instanceof httpApiResponse.HttpApiResponse)) {
                            result = httpApiResponse.createHttpApiResponse(defaultStatusCode, result.data || result);
                        } else {
                            defaultStatusCode = result.statusCode;
                        }

                        result.statusCode = defaultStatusCode;
                    }


                    console.log("logging from response transformation decorator");

                    dfd.resolve(result);
                });

                return dfd.promise;
            }
        }
    }

})(
        require('lodash'),
        require(Injector.getBasePath() + '/Helpers/annotationHelper'),
        require(Injector.getBasePath() + '/Helpers/httpApiResponse'),
        require(Injector.getBasePath() + '/services/serviceMessage'),
        require('q')
    );