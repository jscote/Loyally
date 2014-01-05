/**
 * Created by jscote on 10/20/13.
 */

var util = require('util');

module.exports = (function(util){

    var _dependencies = {},
        _decorators = {},
        _path = '',
        defaultDependency= 'defaultDependency';

    var construct = function (constructor, args, resolutionName) {
        function F() {

            var arguments = getDependencies(args, resolutionName);
            var resolvedArguments = [];
            for(var i = 0; i < arguments.length; i++ ) {
                var ar = resolve(arguments[i], resolutionName);
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

    var resolve = function (target, resolutionName) {

        //We are calling resolve recursively on the arguments of a method.
        //When we reached the last level, we have no target then just return
        if(target === undefined) {
            return;
        }



        if(typeof target === 'string') {
            console.log("Resolving dependency: " + target);

            //check first if it is a node module
            try {
                target = require(target.trim());
                return target;
            } catch(e) {

                //todo: hardened the code if the dependencies aren't defined
                target = getDependencies([target], resolutionName)[0];
            }

        } else {
            //if the target is an object, no need to try to resolve anything
            if(typeof(target) !== 'function') {
                return target;
            }
            console.log("Resolving dependency on a function");
        }

        var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
        var FN_ARG_SPLIT = /,/;
        var FN_ARG = /^\s*(_?)(\S+?)\1\s*$/;
        var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
        var text = target.toString();
        var args = text.match(FN_ARGS)[1].split(FN_ARG_SPLIT);

        var obj = construct(target, args, resolutionName);
        return obj;
    }

    var getDependencies = function (arr, resolutionName) {

        if(resolutionName === undefined) {
            resolutionName = defaultDependency;
        }

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

            if(item === undefined) {
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

        if (resolutionName !== undefined) {
            console.log('registering target with name: ' + name + ' and resolutionName: ' + resolutionName)


            //if we already have a dependency for this name, let's move it to an object and make the current
            //dependency the default one.
            if (collection[name] !== undefined) {
                //We need to check if it is an array. If not, we need to move the current dependency into an array.
                if (!util.isArray(collection[name])) {
                    var defaultTarget = {resolutionName: defaultDependency, target: collection[name]};
                    collection[name] = [];
                    collection[name].push(defaultTarget);
                }
                collection[name].push({resolutionName: resolutionName, target: target});
            } else {
                //collection is not defined.
                collection[name] = [];
                collection[name].push({resolutionName: resolutionName, target: target});
            }


        } else {
            console.log('registering target with name: ' + name);
            collection[name] = target;
        }
    }

    var register = function (dependency, name, resolutionName) {

        if(dependency === undefined || dependency === null || dependency === '') {
            console.error('The dependency cannot be undefined');
            throw('The dependency cannot be undefined');
        }

        if( typeof(dependency) === 'string'){
            dependency = require(getBasePath() + dependency);
        }
        makeCollection({collection: _dependencies, resolutionName: resolutionName, name: name, target: dependency});
        return this;
    }

    var decorator = function(name, decorator, resolutionName ){
        if(name === undefined || name === null || name === '' || typeof(name) !== 'string') {
            console.error("Name must be defined, not null and have a value");
            throw("Name must be defined, not null and have a value");
        }

        if(decorator === undefined || typeof(decorator) !== "Function") {
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

})(util);
