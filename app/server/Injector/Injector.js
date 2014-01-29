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
                var ar = resolve({target: arguments[i].dependency , resolutionName: resolutionName});
                resolvedArguments.push(_.isUndefined(arguments[i].decorator) ?  ar : arguments[i].decorator(ar));
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

        var newTarget = target;



        if(_.isString(target)) {

            console.log("Resolving dependency: " + target);

            newTarget = getDependencies({arr: [target], resolutionName: resolutionName})[0];

            if(!_.isFunction(newTarget.dependency)) {
                //to make sure to call the decorator on node modules
                if(newTarget.decorator) {
                    newTarget.dependency = newTarget.decorator(newTarget.dependency);
                }
                return newTarget.dependency;
            }

        } else {
            //if the target is an object, no need to try to resolve anything
            if(!_.isFunction(target)) {
                return target;
            }

            newTarget.dependency = target;

            console.log("Resolving dependency on a function");
        }

        var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
        var FN_ARG_SPLIT = /,/;

        var text = newTarget.dependency.toString();
        var args = text.match(FN_ARGS)[1].split(FN_ARG_SPLIT).map(function(value) {return value.trim()});

        var obj = construct({constructor: newTarget.dependency, args: args, resolutionName: resolutionName});

         //Call the decorator if it exists
        if(newTarget.decorator) {
            obj = newTarget.decorator(obj);
        }

        return obj;
    }

    var getDependencies = function (parameters) {

        _.extend( {resolutionName: defaultDependency}, parameters)

        var arr = parameters.arr;
        var resolutionName = parameters.resolutionName;


        var m = arr.map(function (value) {

            //Get the dependency
            var item = _dependencies[value];
            var decorator = getDecorator({target: value, resolutionName: resolutionName});
            if(util.isArray(item)) {
                for(var i = 0; i < item.length ; i++ ) {
                    if(item[i].resolutionName == resolutionName) {

                        var convertedItem = null;
                        try{
                            convertedItem = require(item[i].target);
                            //if(decorator) {
                            //    convertedItem = decorator(convertedItem);
                            //}
                        }catch(e){
                            convertedItem = item[i].target;
                        }

                        return {dependency: convertedItem, decorator: decorator};
                    }
                }
                return {dependency: null, decorator: null};

            }

            if(_.isUndefined(item)) {
                try{
                    item = require(value);
                } catch (e) {
                    return {dependency :item, decorator: decorator};
                }
            }
            return {dependency: item, decorator: decorator};
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

        if(_.isEmpty(dependency)) {
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
        if(_.isEmpty(name) || (! _.isString(name))) {
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
