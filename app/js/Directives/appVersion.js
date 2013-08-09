'use strict';

/* Directives */

directives.AppVersion = function (version) {
    return function(scope, elm, attrs) {
        elm.text(version);
    };
}

directives
    .directive('appVersion',
        ['version', directives.AppVersion]) ;

