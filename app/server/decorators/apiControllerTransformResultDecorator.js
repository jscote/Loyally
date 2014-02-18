/**
 * Created by jscote on 2/17/14.
 */
(function (_, annotationHelper, httpApiResponse) {

    'use strict';

    module.exports = function (delegateClass) {
        return function (delegateFn, delegateFnName) {
            //Decorate the class with a tail decoration to modify the returned object if it is not in the expected format

            return function () {
                var args = [].slice.call(arguments);
                var result = delegateFn.apply(delegateClass, args);
                var defaultStatusCode = '200';

                if (_.isUndefined(result)) {
                    result = null;
                } else {
                    result = result.data || result;
                }

                var annotations = annotationHelper.getCombinedAnnotations(delegateClass, delegateFn, httpApiResponse.HttpStatusCode);

                if (annotations.length > 0) {
                    defaultStatusCode = annotations[0].statusCode;
                }

                if (!(result instanceof httpApiResponse.HttpApiResponse)) {
                    result = httpApiResponse.createHttpApiResponse(defaultStatusCode, result);
                }

                result.statusCode = defaultStatusCode;

                console.log("logging from response transformation decorator");

                return result;

            }
        }
    }

})(
        require('lodash'),
        require(Injector.getBasePath() + '/Helpers/annotationHelper'),
        require(Injector.getBasePath() + '/Helpers/httpApiResponse')
    );