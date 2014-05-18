module.exports = {
    "objectName": "event",
    "identity": "id",
    "attributes": {
        "customer": {"relationship": "reference", "cardinality": "single", "referenceField": "customerId", "required": true},
        "name": {"relationship": "primitive", "dbType": "varchar(255)", "require": true, "unique": true},
        "startDate": {"relationship": "primitive", "dbType": "timestamp with time zone", "required": true},
        "endDate": {"relationship": "primitive", "dbType": "timestamp with time zone", "required": false},
        //childIsInParentStructure means that the data is saved in the same structure as the parent instead of its own structure
        //TODO: Handle properties of child object with single cardinality
        "location": {"relationship": "child", "cardinality": "single", "childIsInParentStructure": true, required: false},
        "venue": {"relationship": "child", "cardinality": "single", "childIsInParentStructure": false, required: false},
        //TODO: Handle properties of child object with multiple cardinality as well as generating Add/Remove/Update methods
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
    //TODO: generate tables and stored procedures.


};