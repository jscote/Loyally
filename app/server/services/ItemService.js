/**
 * Created by jscote on 10/20/13.
 */

(function (util, base) {

    'use strict';

    function ItemService(serviceMessage) {
        if (!(this instanceof ItemService)) return new ItemService(serviceMessage);

        base.call(this);
        this.messaging = serviceMessage;
    }

    util.inherits(ItemService, base);

    ItemService.prototype.getItems = function () {
        console.log('From items service');
        return [
            {"itemId": 10, "itemName": 'General Item'},
            {"itemId": 20, "itemName": 'General Item'}
        ];
    };

    ItemService.prototype.getItem = function (message) {
        return {"itemId": message.data.itemId, "itemName": 'General Item'};
    };

    module.exports = ItemService;

})(
        require('util'),
        require(Injector.getBasePath() + '/services/baseService')
    );