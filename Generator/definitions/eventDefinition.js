module.exports = {
    "objectName": "event",
    "uppercaseObjectName": "Event",
    "identity": "id",
    "attributes": {
        //TODO: if reference, and cardinality is single, we should automatically generate a property for the id of the reference
        "customer": {"relationship": "reference", "cardinality": "single"},
        "name": null,
        "startDate": null,
        "endDate": null,
        // If the cardinality is single, should we let creating additional table or just assume the same? I think we should
        // assume different table by default. If configured to use the same table, then we will act accordingly
        // Multiple cardinality will always go in a different table.
        //TODO Determine how to retrieve the data. If in a different table, should we do lazy loading and determine how to apply and when
        "location": {"relationship": "child", "cardinality": "single"}
    },
    "repositoryMethods": {
        "getEventByIdentity": {"cardinality": "single", "returnType": "event", "parameters": ["id"], "dbProcedure": {"name": "getEventById", parameters: ["id"]}},
        "getEventByCustomerId": {"cardinality": "multiple", "returnType": "event", "parameters": ["customerId"], "dbProcedure": {"name": "getEventByCustomerId", parameters: ["customerId"]}},
        "getEventByDateRange": {"cardinality": "multiple", "returnType": "event", "parameters": ["startDate", "endDate"], "dbProcedure": {"name": "getEventByDateRange", parameters: ["startDate", "endDate"]}}
    },
    "businessMethods": {
        //TODO: basic method can be generated based on the same rule that determine which parameters are passed to the constructor.
        "setBasicInfo": {parameters: ["name", "startDate", "endDate"], "propertiesToSetFromParameter": [{paramName: "name", "propName": "name"}, {paramName: "startDate", "propName": "startDate"},  {paramName: "endDate", "propName": "endDate"}]},
        //TODO: methods on attributes of the business objects can be generated automatically without needing to be defined
        "setLocation": {parameters: ["parameters"], "propertiesToSetFromParameter": [ {paramName: "parameters.location", "propName": "location"}]}
    }
    //TODO: Determine methods that don't directly belong to the domain object but operates on a set of it to be part of a "service" related to the factory
    //e.g.: mass updates on a business object, or conditional update (apply specification then updates if it matches). Additional services
    // will not be generated as they are too specific. For instance, sendTestEmail method (where does it go?)


};