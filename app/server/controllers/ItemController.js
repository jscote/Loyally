/**
 * Created by jscote on 10/20/13.
 */

(function (util, base, Permission, PermissionAnnotation, permissionEnum, NoAuthRequiredAnnotation) {

    'use strict';

    function ItemController(itemService, fs) {

        if (!(this instanceof ItemController)) return new ItemController(eventService, fs);


        base.call(this);

        this.itemService = itemService;

    }

    util.inherits(ItemController, base);

    //If we want the entire controller methods to not require authentication, we would use the annotation at this level
    //ItemController.prototype.annotations = [new NoAuthRequiredAnnotation()];

    ItemController.prototype.index = function (request, response) {
        return this.itemService.getItems();
    };

    ItemController.prototype.index.annotations = [new NoAuthRequiredAnnotation()];

    ItemController.prototype.get = function (request, response) {
        var itemId = request.params.item;
        return this.itemService.getItem(itemId);
    };


    module.exports = ItemController;

})(require('util'),
        require(Injector.getBasePath() + '/controllers/apiController'),
        require(Injector.getBasePath() + '/Security/Permissions'),
        require(Injector.getBasePath() + '/Security/PermissionAnnotation'),
        require(Injector.getBasePath() + '/Security/permissionEnum'),
        require(Injector.getBasePath() + '/Security/NoAuthRequiredAnnotation'));
