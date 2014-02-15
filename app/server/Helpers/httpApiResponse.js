/**
 * Created by jscote on 2/14/14.
 */
(function(_, http) {

    function isStatusCodeValid(statusCode) {
        var statusAsNumber = parseInt(statusCode, 10);
        if(_.isNaN(statusAsNumber)) {
            return false;
        }

        if(_.isUndefined(http.STATUS_CODES[statusAsNumber])) {
            return false;
        }

        return true;
    }

    var HttpResponse = function HttpApiResponse(statusCode, data){

        if(!isStatusCodeValid(statusCode)) {
            throw('Status Code "' + stautsCode.toString() + '" is Invalid.')
        }

        this.statusCode = statusCode;
        this.data = data;
    }

    module.exports.HttpApiResponse = HttpResponse;

    module.exports.createHttpApiResponse = function(statusCode, data) {
        return new HttpResponse(statusCode, data);
    }

}) (require('lodash'), require('http'));