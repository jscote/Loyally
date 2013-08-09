(function () {
    'use strict';

    /***************************************************************
     * Helper functions for older browsers
     ***************************************************************/
    if (!Object.hasOwnProperty('create')) {
        Object.create = function (parentObj) {
            function tmpObj() {}
            tmpObj.prototype = parentObj;
            return new tmpObj();
        };
    }
    if (!Object.hasOwnProperty('defineProperties')) {
        Object.defineProperties = function (obj, props) {
            for (var prop in props) {
                Object.defineProperty(obj, prop, props[prop]);
            }
        };
    }

    Function.prototype.inherits = function (superCtor) {

        this.prototype = Object.create(superCtor.prototype);
        this.prototype.constructor = this;
        this.prototype.super_ = superCtor.prototype;

        this.prototype.callBaseMethod = function(method, parameters) {
            debugger;
            var p = this.super_;


            while (p[method] == this[method]) {
                p = p.super_;
            }

            if (p[method] && typeof p[method] === 'function') {

                return p[method].apply(this, parameters);
            }
        }
    }

 })()

