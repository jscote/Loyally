/**
 * Created with JetBrains WebStorm.
 * User: jscote
 * Date: 8/8/13
 * Time: 9:37 PM
 * This file contains top base classes for controllers and services. A directive or a filter should probably not be
 * inherited (or have a base class) as the constructor function is returning a different object.
 */



/* Add functionality to base controller here */

controllers.BaseController = function (options) {
    options = options || {};
    this.scope = options.scope || null;
}

controllers.BaseController.prototype.doSomething = function() {
    alert("scope name is " + this.scope.name);
}


/* Add functionality to base service here */

services.BaseService = function (options) {
    this.options = options || {};
}

services.BaseService.prototype.doSomething = function() {
    alert('I do something');
}