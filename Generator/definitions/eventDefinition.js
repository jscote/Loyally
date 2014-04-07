module.exports = {
    "objectName": "event",
    "uppercaseObjectName": "Event",
    "identity": "id",
    "attributes": {
        "customer": {"relationship": "reference", "cardinality": "single"},
        "name": null,
        "startDate": null,
        "endDate": null,
        "location": {"relationship": "child", "cardinality": "single"}
    },
    "repositoryMethods": {
        "getEventByIdentity": {"cardinality": "single", "returnType": "event", "parameters": ["id"], "dbProcedure": {"name": "getEventById", parameters: ["id"]}},
        "getEventByCustomerId": {"cardinality": "multiple", "returnType": "event", "parameters": ["customerId"], "dbProcedure": {"name": "getEventByCustomerId", parameters: ["customerId"]}},
        "getEventByDateRange": {"cardinality": "multiple", "returnType": "event", "parameters": ["startDate", "endDate"], "dbProcedure": {"name": "getEventByDateRange", parameters: ["startDate", "endDate"]}}
    },
    "businessMethods": {
        "setBasicInfo": {parameters: ["name", "startDate", "endDate"], "propertiesToSetFromParameter": [{paramName: "name", "propName": "name"}, {paramName: "startDate", "propName": "startDate"},  {paramName: "endDate", "propName": "endDate"}]},
        "setLocation": {parameters: ["parameters"], "propertiesToSetFromParameter": [ {paramName: "parameters.location", "propName": "location"}]}
    }


};