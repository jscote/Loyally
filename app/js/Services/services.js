'use strict';

/* Services */

_$.services.dataService = function() {
    _$.services.BaseService.call(this);
    return this;
}

_$.services.dataService.inherits(_$.services.BaseService);


// Demonstrate how to register services
// In this case it is a simple value service.
_$.services
    .value('version', '0.1');

_$.services.service('dataService', _$.services.dataService);
