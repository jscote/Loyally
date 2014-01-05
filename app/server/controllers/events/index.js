/**
 * Created by jscote on 10/20/13.
 */


module.exports = {
    index: function(request, response) {

        var f = Injector.resolve('fs');
        var strategy = 'GeneralEvent';
        if(request.params.customer !== undefined) {
            strategy = 'CustomerEvent';
        }

        var ctrl = Injector.resolve('GeneralEventController', strategy);
        ctrl.index(request, response);

    }
}

