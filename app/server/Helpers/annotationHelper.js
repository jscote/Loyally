/**
 * Created by jscote on 1/31/14.
 */


var lodash = require('lodash');


(function(_){

    'use strict'

    function getTypeAnnotations(delegateClass, type, mapFunction) {

        //if the class is not defined or null, assume the caller didn't need it so return an empty array
        if(_.isUndefined(delegateClass) || _.isNull(delegateClass)) return [];


        if(!_.isObject(delegateClass)) {
            throw("getTypeAnnotations:: The delegateClass is not valid.");
        }

        if(_.isUndefined(mapFunction) || _.isNull(mapFunction)) {
            mapFunction = function(item) {return item;};
        }

        if(!_.isFunction(mapFunction)) {
            throw("getTypeAnnotations:: The map function is not a valid function");
        }

        if(_.isUndefined(type) || !_.isFunction(type)){
            throw("The type of annotation is not valid.");
        }

        var typeAnnotations = delegateClass.constructor.prototype.annotations;

        return _.map(
            _.filter(typeAnnotations, function (item) {
                return item instanceof type
            }), mapFunction);
    }

    function getFunctionAnnotations(delegateFn, type, mapFunction) {

        //if the function is not defined or null, assume the caller didn't need it so return an empty array
        if(_.isUndefined(delegateFn) || _.isNull(delegateFn)) return [];

        if(!_.isFunction(delegateFn)) {
            throw("getTypeAnnotations:: The delegateClass is not valid.");
        }

        if(_.isUndefined(mapFunction) || _.isNull(mapFunction)) {
            mapFunction = function(item) {return item;};
        }

        if(!_.isFunction(mapFunction)) {
            throw("getTypeAnnotations:: The map function is not a valid function");
        }

        if(_.isUndefined(type) || !_.isFunction(type)){
            throw("The type of annotation is not valid.");
        }

        var fnAnnotations = delegateFn.annotations;

        return _.map(
            _.filter(fnAnnotations, function (item) {
                return item instanceof type
            }), mapFunction);
    }

    function getCombinedAnnotations(delegateClass, delegateFn, type, mapFunction) {

        return  _.union(
            getTypeAnnotations(delegateClass, type, mapFunction),
            getFunctionAnnotations(delegateFn, type, mapFunction));

    }


    module.exports = {
        getCombinedAnnotations: getCombinedAnnotations,
        getTypeAnnotiations: getTypeAnnotations,
        getFunctionAnnotations: getFunctionAnnotations
    }

})(lodash);