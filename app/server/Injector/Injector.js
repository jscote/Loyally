/**
 * Created by jscote on 10/20/13.
 */

var util = require('util');
var lodash = require('lodash');

module.exports = (function(util, _){

    var _dependencies = {},
        _decorators = {},
        _path = '',
        defaultDependency= 'defaultDependency';

    var construct = function (parameters) {
        var constructor = parameters.constructor;
        var args = parameters.args;
        var resolutionName = parameters.resolutionName;

        function F() {

            var arguments = getDependencies({arr: args, resolutionName: resolutionName});
            var resolvedArguments = [];
            for(var i = 0; i < arguments.length; i++ ) {
                var ar = resolve({target: arguments[i], resolutionName: resolutionName});
                resolvedArguments.push(ar);
            }

            var c = constructor.apply(this, resolvedArguments);
            return c;
        }
        F.prototype = constructor.prototype;
        var f = new F();
        f.constructor = constructor;
        return f;
    }

    var getDecorator = function(parameters) {

        _.extend( {resolutionName: defaultDependency}, parameters)

        var target = parameters.target;
        var resolutionName = parameters.resolutionName;

        if(_decorators[target]) {
            var item = _decorators[target];

            resolutionName = resolutionName || defaultDependency;

            if(util.isArray(item)) {
                for(var i = 0; i < item.length ; i++ ) {
                    if(item[i].resolutionName == resolutionName) {
                        return item[i].target;
                    }
                }
                return null;

            }

            return item;
        }
    }

    var resolve = function (parameters) {
        var target = parameters.target;
        var resolutionName = parameters.resolutionName;

        //We are calling resolve recursively on the arguments of a method.
        //When we reached the last level, we have no target then just return
        if(target === undefined) {
            return;
        }

        var decorator = null;

        if(_.isString(target)) {
            console.log("Resolving dependency: " + target);

            //find decorator, if any
            decorator = getDecorator({target: target, resolutionName: resolutionName});

            //check first if it is a node module
            try {
                target = require(target.trim());
                if(decorator) {
                    target = decorator(target);
                }
                return target;
            } catch(e) {

                //todo: hardened the code if the dependencies aren't defined
                target = getDependencies({arr: [target], resolutionName: resolutionName})[0];
            }

        } else {
            //if the target is an object, no need to try to resolve anything
            if(!_.isFunction(target)) {
                return target;
            }
            console.log("Resolving dependency on a function");
        }

        var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
        var FN_ARG_SPLIT = /,/;
        var text = target.toString();
        var args = text.match(FN_ARGS)[1].split(FN_ARG_SPLIT);

        var obj = construct({constructor: target, args: args, resolutionName: resolutionName});

         //Call the decorator if it exists
        if(decorator) {
            obj = decorator(obj);
        }

        return obj;
    }

    var getDependencies = function (parameters) {

        _.extend( {resolutionName: defaultDependency}, parameters)

        var arr = parameters.arr;
        var resolutionName = parameters.resolutionName;

        var m = arr.map(function (value) {
            //TODO, when getting dependencies, we should check if we need to "new" it or just return it
            var item = _dependencies[value.trim()];
            if(util.isArray(item)) {
                for(var i = 0; i < item.length ; i++ ) {
                    if(item[i].resolutionName == resolutionName) {
                        return item[i].target;
                    }
                }
                return null;

            }

            if(_.isUndefined(item)) {
                try{
                    item = require(value.trim());
                } catch (e) {
                    return item;
                }
            }
            return item;
        });

        return m;
    }


    function makeCollection(parameters) {
        var collection = parameters.collection;
        var resolutionName = parameters.resolutionName;
        var name = parameters.name;
        var target = parameters.target;

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
                collection[name].push({resolutionName: resolutionName, target: target});
            } else {
                //We need to check if it is an array. If not, we need to move the current dependency into an array.
                if (!util.isArray(collection[name])) {
                    var defaultTarget = {resolutionName: defaultDependency, target: collection[name]};
                    collection[name] = [];
                    collection[name].push(defaultTarget);
                }
                collection[name].push({resolutionName: resolutionName, target: target});
            }
        }
    }

    var register = function (parameters) {
        var dependency = parameters.dependency;
        var name = parameters.name;
        var resolutionName = parameters.resolutionName;

        if(_.isEmpty(dependency)) { //dependency === undefined || dependency === null || dependency === '') {
            console.error('The dependency cannot be undefined');
            throw('The dependency cannot be undefined');
        }

        if(_.isString(dependency)){
            dependency = require(getBasePath() + dependency);
        }
        makeCollection({collection: _dependencies, resolutionName: resolutionName, name: name, target: dependency});
        return this;
    }

    var decorator = function(name, decorator, resolutionName ){
        if(_.isEmpty(name) || ! _.isString(name)) {
            console.error("Name must be defined, not null and have a value");
            throw("Name must be defined, not null and have a value");
        }

        if(_.isUndefined(decorator) || !_.isFunction(decorator)) {
            console.error("Decorator must be a valid function");
            throw("Decorator must be a valid function");
        }

        makeCollection({collection: _decorators, resolutionName: resolutionName, name: name, target: decorator});

        return this;
    }

     var setBasePath = function(basePath){
        _path = basePath;
    }

    var getBasePath = function(){
        return _path;
    }

    return {
        resolve: resolve,
        register: register,
        setBasePath: setBasePath,
        getBasePath: getBasePath,
        decorator: decorator
    }

})(util, lodash);
