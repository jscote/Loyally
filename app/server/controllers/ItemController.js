/**
 * Created by jscote on 10/20/13.
 */

(function (util, base, Permission, PermissionAnnotation, permissionEnum) {

    'use strict';

    function ItemController(itemService, fs) {

        if (!(this instanceof ItemController)) return new ItemController(eventService, fs);


        base.call(this);

        this.itemService = itemService;

    }

    util.inherits(ItemController, base);

    ItemController.prototype.index = function (request, response) {
        response.send(this.itemService.getItems());
    };

    ItemController.prototype.index.annotations = [];

    ItemController.prototype.get = function (request, response) {
        var itemId = request.params.item;
        response.send(this.itemService.getItem(itemId));
    };


    module.exports = ItemController;

})(require('util'),
        require(Injector.getBasePath() + '/controllers/baseController'),
        require(Injector.getBasePath() + '/Security/Permissions'),
        require(Injector.getBasePath() + '/Security/PermissionAnnotation'),
        require(Injector.getBasePath() + '/Security/permissionEnum'));
