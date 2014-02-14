/**
 * Created by jscote on 10/20/13.
 */

(function (util, base) {

    'use strict';

    function ItemService() {
        if (!(this instanceof ItemService)) return new ItemService();

        base.call(this);
    }

    util.inherits(ItemService, base);

    ItemService.prototype.getItems = function () {
        console.log('From items service');
        return {"data": [
            {"itemId": 10, "itemName": 'General Item'},
            {"itemId": 20, "itemName": 'General Item'}
        ]};
    };

    ItemService.prototype.getItem = function (itemId) {
        return {"data": [
            {"itemId": itemId, "itemName": 'General Item'}
        ]};
    };

    module.exports = ItemService;

})(
        require('util'),
        require(Injector.getBasePath() + '/services/baseService')
    );