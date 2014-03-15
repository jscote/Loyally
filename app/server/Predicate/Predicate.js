(function () {

    'use strict';

    function Predicate(fn, type) {

        this.type = type;
        this.fn = fn;

        this.getEvaluationFn = function (item) {
            if (type) {
                if (typeof(item) == 'object') {
                    if (!(item instanceof type)) {
                        throw Error("The item passed to the predicate is the wrong type.");
                    }
                } else {
                    if (!(typeof(item) == type)) {
                        throw Error("The item passed to the predicate is the wrong type.");
                    }
                }
            }
            return fn;
        };

    }

    function predicateFactory(fn, type) {
        if (!fn) {
            throw Error("The predicate function is not specified.");
        }

        if (!fn instanceof Function) {
            throw Error("The predicate constructor expects a function that returns a boolean.");
        }
        return new Predicate(fn, type);

    }


    exports.predicateFactory = predicateFactory;
    exports.Predicate = Predicate;

})();