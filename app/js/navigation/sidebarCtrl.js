/**
 * Created by jscote on 10/27/13.
 */
(function () {
    'use strict';

    var controllerId = 'll-sidebar';


    _$.controllers.sidebar = function($route, $scope, config, routes) {
        _$.controllers.BaseController.call(this);
        var vm = this;

        vm.isCurrent = isCurrent;

        activate();

        function activate() { getNavRoutes(); }

        function getNavRoutes() {
            vm.navRoutes = routes.filter(function(r) {
                return r.config.settings && r.config.settings.nav;
            }).sort(function(r1, r2) {
                    return r1.config.settings.nav > r2.config.settings.nav;
                });
        }

        function isCurrent(route) {
            if (!route.config.title || !$route.current || !$route.current.title) {
                return '';
            }
            var menuName = route.config.title;
            return $route.current.title.substr(0, menuName.length) === menuName ? 'current' : '';
        }
    };


    _$.controllers.sidebar.inherits(_$.controllers.BaseController);

    _$.controllers.controller(controllerId,
        ['$route', '$scope', 'config', 'routes', _$.controllers.sidebar]);

})();