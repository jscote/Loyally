'use strict';

/* Directives */

_$.directives.AppVersion = function (version) {
    return function(scope, elm, attrs) {
        elm.text(version);
    }
}

_$.directives
    .directive('appVersion',
        ['version', _$.directives.AppVersion]) ;

