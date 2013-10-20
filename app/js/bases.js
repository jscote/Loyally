/**
 * Created with JetBrains WebStorm.
 * User: jscote
 * Date: 8/8/13
 * Time: 9:37 PM
 * This file contains top base classes for controllers and services. A directive or a filter should probably not be
 * inherited (or have a base class) as the constructor function is returning a different object.
 */



/* Add functionality to base controller here */

_$.controllers.BaseController = function (options) {
    options = options || {};
    var self = this;
    this.scope = options.scope || null;

    this.scope.definitions = [{fieldName: 'name'}];

    this.scope.getModel = function(fieldName) {
        return self.getModel(fieldName);
    }
}

_$.controllers.BaseController.prototype.doSomething = function() {
    alert("scope name is " + this.scope.data.name);
}

_$.controllers.BaseController.prototype.getModel = function(fieldName) {
    return 'data.' + fieldName;
}

/* Add functionality to base service here */

_$.services.BaseService = function (options) {
    this.options = options || {};
}

_$.services.BaseService.prototype.doSomething = function() {
    alert('I do something');
}