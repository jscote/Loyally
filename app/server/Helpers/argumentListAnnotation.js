/**
 * Created by jscote on 2/16/14.
 */

(function (_) {

    'use strict';

    module.exports = function (argumentList) {

        this.argumentList = _.filter(argumentList, function (item) {
            return item.trim() !== ''
        });
    };

})(require('lodash'));
