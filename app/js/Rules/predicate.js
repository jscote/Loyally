var Predicate = (function() {
    function Predicate(fn, type) {

    if (!fn) {
        throw Error("The predicate function is not specified.");
    }

    if (!fn instanceof Function) {
        throw Error("The predicate constructor expects a function that returns a boolean.");
    }
    return function(item) {
        if (type) {
            if (typeof(item) == "Function") {
                if (!(item instanceof type)) {
                    throw Error("The item passed to the predicate is the wrong type.");
                }
            } else {
                if (!typeof(item) == type) {
                    throw Error("The item passed to the predicate is the wrong type.");
                }
            }
        }
        return fn;
    };

};
    return Predicate;
})();