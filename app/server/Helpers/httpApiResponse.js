/**
 * Created by jscote on 2/14/14.
 */
(function (_, http) {

    function isStatusCodeValid(statusCode) {
        var statusAsNumber = parseInt(statusCode, 10);
        if (_.isNaN(statusAsNumber)) {
            return false;
        }

        return !_.isUndefined(http.STATUS_CODES[statusAsNumber]);
    }

    var HttpResponse = function HttpApiResponse(statusCode, data) {

        if (!isStatusCodeValid(statusCode)) {
            throw('Status Code "' + statusCode.toString() + '" is Invalid.')
        }

        this.statusCode = statusCode;
        this.data = data;
    };

    module.exports.HttpApiResponse = HttpResponse;

    module.exports.createHttpApiResponse = function (statusCode, data) {
        return new HttpResponse(statusCode, data);
    };

    module.exports.HttpStatusCode = function (statusCode) {
        if (!isStatusCodeValid(statusCode)) {
            throw('Status Code "' + statusCode.toString() + '" is Invalid.')
        }

        this.statusCode = statusCode;
    };

    module.exports.HttpErrorStatusCode = function (statusCode) {
        if (!isStatusCodeValid(statusCode)) {
            throw('Status Code "' + statusCode.toString() + '" is Invalid.')
        }

        this.statusCode = statusCode;
    };

})(require('lodash'), require('http'));