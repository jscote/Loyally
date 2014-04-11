module.exports = {
    "objectName": "event",
    "pluralizedObjectName": "events",
    "identity": "id",
    "attributes": {
        "customer": {"relationship": "reference", "cardinality": "single", "referenceField": "customerId"},
        "name": null,
        "startDate": null,
        "endDate": null,
        //childIsInParentStructure means that the data is saved in the same structure as the parent instead of its own structure
        "location": {"relationship": "child", "cardinality": "single", "childIsInParentStructure": true},
        "venue": {"relationship": "child", "cardinality": "single", "childIsInParentStructure": false},
        "eventSettings" : {"relationship": "child", "cardinality": "multiple"}
    },
    "repositoryMethods": {
        "getEventByDateRange": {"cardinality": "multiple", "returnType": "event", "parameters": ["startDate", "endDate"], "dbProcedure": {"name": "getEventByDateRange", "parameters": ["startDate", "endDate"]}}
    },
    "businessMethods": {
        //TODO: basic method can be generated based on the same rule that determine which parameters are passed to the constructor.
        "setBasicInfo": {parameters: ["name", "startDate", "endDate"], "propertiesToSetFromParameter": [{paramName: "name", "propName": "name"}, {paramName: "startDate", "propName": "startDate"},  {paramName: "endDate", "propName": "endDate"}]},
        //TODO: methods on attributes of the business objects can be generated automatically without needing to be defined
        //If we apply these principles, then what's left is what cannot really be generated (other than a stub for the method).
        //TODO: child object should get parameters that represent the properties of the object. We don't have a definition for the child object yet!
        "setLocation": {parameters: ["parameters"], "propertiesToSetFromParameter": [ {paramName: "parameters.location", "propName": "location"}]}
    }
    //TODO: Determine methods that don't directly belong to the domain object but operates on a set of it to be part of a "service" related to the factory
    //e.g.: mass updates on a business object, or conditional update (apply specification then updates if it matches). Additional services
    // will not be generated as they are too specific. For instance, sendTestEmail method (where does it go?)


};