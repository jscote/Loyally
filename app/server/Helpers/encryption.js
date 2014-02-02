/**
 * Created by jscote on 2/2/14.
 */

(function (crypto) {

    'use strict';

    exports.createSalt = function () {
        return crypto.randomBytes(128).toString('base64');
    };

    exports.hashPwd = function (salt, pwd) {
        var hmac = crypto.createHmac('sha1', salt);
        return hmac.update(pwd).digest('hex');
    };

})(require('crypto'));