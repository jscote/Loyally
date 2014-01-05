/**
 * Created by jscote on 10/20/13.
 */


module.exports = {
    index: function(request, response) {

        var f = Injector.resolve({target: 'fs'});
        var strategy = 'GeneralEvent';
        if(request.params.customer !== undefined) {
            strategy = 'CustomerEvent';
        }

        var ctrl = Injector.resolve({target: 'GeneralEventController', resolutionName: strategy});
        ctrl.index(request, response);

    }
}

