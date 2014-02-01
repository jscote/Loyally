/**
 * Created by jscote on 1/31/14.
 */

var lodash = require('lodash');

(function (_) {

    'use strict'

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
        delegate[copyFromFunction] = copyToFunction(fn);
        delegate[copyFromFunction].annotations = annotations;
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

})(lodash);