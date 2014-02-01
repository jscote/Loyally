/**
 * Created by jscote on 10/20/13.
 */

var util = require('util');
var lodash = require('lodash');

module.exports = (function (util, _) {

    var _dependencies = {},
        _decorators = {},
        _path = '',
        defaultDependency = 'defaultDependency';

    var construct = function (parameters) {
        var constructor = parameters.constructor;
        var args = parameters.args;
        var resolutionName = parameters.resolutionName;

        function F() {

            var arguments = getDependencies({arr: args, resolutionName: resolutionName});
            var resolvedArguments = [];
            for (var i = 0; i < arguments.length; i++) {
                var ar = resolve({target: arguments[i].dependency, resolutionName: resolutionName});

                var obj = ar;
                var current = arguments[i].decorators;

                if (!_.isUndefined(current) && current !== null) {
                    if (_.isArray(current) && current.length > 0) {
                        for (var j = 0; j < current.length; j++) {
                            obj = current[j](obj);
                        }
                    }
                    else {
                        obj = current(obj);
                    }
                } else {

                    obj = ar;
                }

                resolvedArguments.push(obj);
            }


            var c = constructor.apply(this, resolvedArguments);
            return c;
        }

        F.prototype = constructor.prototype;
        var f = new F();
        f.constructor = constructor;
        return f;
    }

    var getDecorators = function (parameters) {

        _.extend({resolutionName: defaultDependency}, parameters)

        var target = parameters.target;
        var resolutionName = parameters.resolutionName;

        if (_decorators[target]) {
            var item = _decorators[target];

            var decorators = [];

            resolutionName = resolutionName || defaultDependency;

            if (util.isArray(item)) {

                decorators = _.map(
                    _.sortBy(
                        _.filter(item, {resolutionName: resolutionName}), 'priority'),function (item) {
                        return item.target
                    }).reverse();

                if (decorators.length > 0) return decorators;
                return null;
                /*                for(var i = 0; i < item.length ; i++ ) {
                 if(item[i].resolutionName == resolutionName) {
                 return item[i].target;
                 }
                 }
                 return null;*/

            }

            return item;
        }
    }

    var resolve = function (parameters) {
        var target = parameters.target;
        var resolutionName = parameters.resolutionName;

        //We are calling resolve recursively on the arguments of a method.
        //When we reached the last level, we have no target then just return
        if (target === undefined) {
            return;
        }

        var newTarget = target;


        if (_.isString(target)) {

            console.log("Resolving dependency: " + target);

            newTarget = getDependencies({arr: [target], resolutionName: resolutionName})[0];

            if (!_.isFunction(newTarget.dependency)) {
                //to make sure to call the decorator on node modules
                if (newTarget.decorators) {
                    if (_.isArray(newTarget.decorators) && newTarget.decorators.length > 0) {
                        for (var i = 0; i < newTarget.decorators.length; i++) {
                            newTarget.dependency = newTarget.decorators[i](newTarget.dependency);
                        }
                    }
                    else {
                        newTarget.dependency = newTarget.decorators(newTarget.dependency);
                    }
                }
                return newTarget.dependency;
            }

        } else {
            //if the target is an object, no need to try to resolve anything
            if (!_.isFunction(target)) {
                return target;
            }

            newTarget.dependency = target;

            console.log("Resolving dependency on a function");
        }

        var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
        var FN_ARG_SPLIT = /,/;

        var text = newTarget.dependency.toString();
        var args = text.match(FN_ARGS)[1].split(FN_ARG_SPLIT).map(function (value) {
            return value.trim()
        });

        var obj = construct({constructor: newTarget.dependency, args: args, resolutionName: resolutionName});

        //Call the decorator if it exists
        /*        if (newTarget.decorators && newTarget.decorators.length > 0) {
         obj = newTarget.decorators[0](obj);
         }*/

        //to make sure to call the decorator on node modules
        if (newTarget.decorators) {
            if (_.isArray(newTarget.decorators) && newTarget.decorators.length > 0) {
                for (var i = 0; i < newTarget.decorators.length; i++) {
                    obj.dependency = newTarget.decorators[i](obj);
                }
            }
            else {
                obj.dependency = newTarget.decorators(obj);
            }
        }

        return obj;
    }

    var getDependencies = function (parameters) {

        _.extend({resolutionName: defaultDependency}, parameters)

        var arr = parameters.arr;
        var resolutionName = parameters.resolutionName;


        var m = arr.map(function (value) {

            //Get the dependency
            var item = _dependencies[value];
            var decorators = getDecorators({target: value, resolutionName: resolutionName});
            if (util.isArray(item)) {
                for (var i = 0; i < item.length; i++) {
                    if (item[i].resolutionName == resolutionName) {

                        var convertedItem = null;
                        try {
                            convertedItem = require(item[i].target);
                        } catch (e) {
                            convertedItem = item[i].target;
                        }

                        return {dependency: convertedItem, decorators: decorators};
                    }
                }
                return {dependency: null, decorators: null};

            }

            if (_.isUndefined(item)) {
                try {
                    item = require(value);
                } catch (e) {
                    return {dependency: item, decorators: decorators};
                }
            }
            return {dependency: item, decorators: decorators};
        });

        return m;
    }


    function makeCollection(parameters) {
        var collection = parameters.collection;
        var resolutionName = parameters.resolutionName;
        var name = parameters.name;
        var target = parameters.target;
        var priority = parameters.priority || 1;

        if (_.isUndefined(resolutionName)) {
            console.log('registering target with name: ' + name);
            collection[name] = target;
        } else {
            console.log('registering target with name: ' + name + ' and resolutionName: ' + resolutionName)

            //if we already have a dependency for this name, let's move it to an object and make the current
            //dependency the default one.
            if (_.isUndefined(collection[name])) {
                //collection is not defined.
                collection[name] = [];
                collection[name].push({resolutionName: resolutionName, target: target, priority: priority});
            } else {
                //We need to check if it is an array. If not, we need to move the current dependency into an array.
                if (!util.isArray(collection[name])) {
                    var defaultTarget = {resolutionName: defaultDependency, target: collection[name], priority: priority};
                    collection[name] = [];
                    collection[name].push(defaultTarget);
                }
                collection[name].push({resolutionName: resolutionName, target: target, priority: priority});
            }
        }
    }

    var register = function (parameters) {
        var dependency = parameters.dependency;
        var name = parameters.name;
        var resolutionName = parameters.resolutionName;

        if (_.isEmpty(dependency)) {
            console.error('The dependency cannot be undefined');
            throw('The dependency cannot be undefined');
        }

        if (_.isString(dependency)) {
            dependency = require(getBasePath() + dependency);
        }
        makeCollection({collection: _dependencies, resolutionName: resolutionName, name: name, target: dependency});
        return this;
    }

    var decorator = function (name, decorator, resolutionName, priority) {
        if (_.isEmpty(name) || (!_.isString(name))) {
            console.error("Name must be defined, not null and have a value");
            throw("Name must be defined, not null and have a value");
        }

        if (_.isUndefined(decorator) || !_.isFunction(decorator)) {
            console.error("Decorator must be a valid function");
            throw("Decorator must be a valid function");
        }

        makeCollection({collection: _decorators, resolutionName: resolutionName, name: name, target: decorator, priority: priority});

        return this;
    }

    var setBasePath = function (basePath) {
        _path = basePath;
    }

    var getBasePath = function () {
        return _path;
    }

    return {
        resolve: resolve,
        register: register,
        setBasePath: setBasePath,
        getBasePath: getBasePath,
        decorator: decorator
    }

})
    (util, lodash);
