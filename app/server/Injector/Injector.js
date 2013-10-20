/**
 * Created by jscote on 10/20/13.
 */

var util = require('util');

module.exports = {

    dependencies: {},
    _path: '',

    construct: function (constructor, args, resolutionName) {
        var self = this;

        function F() {
            var c = constructor.apply(this, self.getDependencies(args, resolutionName));
            return c;
        }
        F.prototype = constructor.prototype;
        var f = new F();
        f.constructor = constructor;
        return f;
    },

    resolve: function (target, resolutionName) {



        if(typeof target === 'string') {
            console.log("Resolving dependency: " + target);
            //todo: hardened the code if the dependencies aren't defined
            target = this.getDependencies([target], resolutionName)[0];
        } else {
            console.log("Resolving dependency on a function");
        }

        var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
        var FN_ARG_SPLIT = /,/;
        var FN_ARG = /^\s*(_?)(\S+?)\1\s*$/;
        var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
        var text = target.toString();
        var args = text.match(FN_ARGS)[1].split(',');

        var obj = this.construct(target, args, resolutionName);
        return obj;
    },

    getDependencies: function (arr, resolutionName) {
        var self = this;

        if(resolutionName === undefined) {
            resolutionName = 'defaultDependency'
        }

        return arr.map(function (value) {
            //TODO, when getting dependencies, we should check if we need to "new" it or just return it
            var item = self.dependencies[value];
            if(util.isArray(item)) {
                for(var i = 0; i < item.length ; i++ ) {
                    if(item[i].resolutionName == resolutionName) {
                        return item[i].dependency;
                    }
                }
                return null;
            }
            return item;
        });
    },

    register: function (dependency, name, resolutionName) {

        if(resolutionName !== undefined) {
            console.log('registering dependency with name: ' + name + ' and resolutionName: ' + resolutionName)


            //if we already have a dependency for this name, let's move it to an object and make the current
            //dependency the default one.
            if(this.dependencies[name] !== undefined){
                //We need to check if it is an array. If not, we need to move the current dependency into an array.
                if(!util.isArray(this.dependencies[name])) {
                    var defaultDependency = {resolutionName: 'defaultDependency', dependency: this.dependencies[name]};
                    this.dependencies[name] = [];
                    this.dependencies[name].push(defaultDependency);
                }
                this.dependencies[name].push({resolutionName: resolutionName, dependency: dependency});
            } else {
                //dependency is not defined.
                this.dependencies[name] = [];
                this.dependencies[name].push({resolutionName: resolutionName, dependency: dependency});
            }


        } else {
            console.log('registering dependency with name: ' + name);
            this.dependencies[name] = dependency;
            //this.dependencies.push({name: name, resolutionName: '', dependency: dependency});
        }


    },

    setBasePath: function(basePath){
        _path = basePath;
    },

    getBasePath: function(){
        return _path;
    }

};
