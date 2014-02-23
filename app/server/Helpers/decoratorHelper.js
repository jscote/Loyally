/**
 * Created by jscote on 1/31/14.
 */

(function (_, argumentListAnnotation, annotationHelper) {

    'use strict';

    function validateDecorateFunctionParameters(delegate, copyToFunction) {
        if (!_.isFunction(copyToFunction)) {
            throw("The decorator is not a valid function.");
        }

        if (!_.isObject(delegate)) {
            throw("The delegate is not a valid object.");
        }
    }

    function decorateFunction(delegate, copyFromFunction, copyToFunction) {

        validateDecorateFunctionParameters(delegate, copyToFunction);

        var fn = delegate[copyFromFunction];


        if (fn === undefined || fn === null) {
            throw("The function to decorate doesn't exist on the object to be decorated.");
        }



        var annotations = delegate[copyFromFunction].annotations;
        var identity = delegate[copyFromFunction].identity;
        /*
        var argsList = annotationHelper.getFunctionAnnotations(delegate[copyFromFunction], argumentListAnnotation);
        var args;

        if (argsList.length === 0) {

            var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
            var FN_ARG_SPLIT = /,/;

            var text = fn.toString();
            args = text.match(FN_ARGS)[1].split(FN_ARG_SPLIT).map(function (value) {
                return value.trim()
            });

            if (_.isUndefined(annotations)) {
                annotations = [];
            }

            var argumentList = new argumentListAnnotation(args);
            annotations.push(argumentList);
            args = argumentList.argumentList;

        } else {
            args = argsList[0].argumentList;
        }

*/
        delegate[copyFromFunction] = copyToFunction(fn, copyFromFunction);
        delegate[copyFromFunction].annotations = annotations;
        delegate[copyFromFunction].identity = identity;
    }

    function decorateFunctions(delegate, copyToFunction) {

        validateDecorateFunctionParameters(delegate, copyToFunction);

        var functions = [];
        for (var prop in delegate.__proto__) {
            if (_.isFunction(delegate[prop])) {
                functions.push(prop);

            }
        }
        decorateSpecificFunctions(delegate, functions, copyToFunction);
    }

    function decorateSpecificFunctions(delegate, listOfFunctions, copyToFunction) {

        validateDecorateFunctionParameters(delegate, copyToFunction);

        for (var i = 0; i < listOfFunctions.length; i++) {
            decorateFunction(delegate, listOfFunctions[i], copyToFunction);
        }
    }

    module.exports = {
        decorateSpecificFunctions: decorateSpecificFunctions,
        decorateFunctions: decorateFunctions,
        decorateFunction: decorateFunction
    }

})(require('lodash'), require(Injector.getBasePath() + '/Helpers/argumentListAnnotation'), require(Injector.getBasePath() + '/Helpers/annotationHelper'));