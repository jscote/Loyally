/**
 * Created by jscote on 4/5/2014.
 */
(function () {
    'use strict';

    var Entity = function () {
        var _state = Entity.EntityState.unchanged;
        Object.defineProperty(this, 'state', {
            enumerable: true,
            get: function () {
                return _state;
            },
            set: function (value) {

                if (_state == Entity.EntityState.inserted && value == Entity.EntityState.deleted) {
                    _state = Entity.EntityState.unchanged;
                } else {

                    if ((_state == Entity.EntityState.deleted || _state == Entity.EntityState.inserted) && value != Entity.EntityState.unchanged) {
                        //Leave the state as deleted or inserted
                        _state = _state;
                    } else {
                        _state = value;
                    }
                }
            }
        });
    }

    Entity.EntityState = {
        unchanged: 0,
        inserted: 1,
        modified: 2,
        deleted: 3
    }

    module.exports = Entity;
})();