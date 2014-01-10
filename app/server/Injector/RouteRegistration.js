/**
 * Created by jcote on 1/7/14.
 */
var RouteRegistration = function () {

}

RouteRegistration.Routes = [];

RouteRegistration.prototype.registerRoute = function (parameters) {
    RouteRegistration.Routes.push(parameters.route);
    return parameters.routeName;
}

RouteRegistration.prototype.registerNestedRoute = function (parameters) {
    RouteRegistration.Routes.push(parameters.route);

    return function () {
        parameters.app.resource(parameters.routeName);
    };
}

module.exports = RouteRegistration;

