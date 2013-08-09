'use strict';

/* Services */

services.dataService = function() {
    services.BaseService.call(this);
}

services.dataService.inherits(services.BaseService);


// Demonstrate how to register services
// In this case it is a simple value service.
services
    .value('version', '0.1');

services.service('dataService', [, services.dataService]);
