/**
 * Created by jscote on 10/20/13.
 */
module.exports = {
    index: function(request, response) {
        //response.send('events index');
        response.send({"data": [{"customerId": 1, "customerName": 'My Address'}]});
    }
}