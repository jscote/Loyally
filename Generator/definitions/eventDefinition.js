module.exports = {
    "objectName": "event",
    "uppercaseObjectName": "Event",
    "identity": "id",
    "attributes": [
        {"relationship": "reference", "cardinality": "single", "attributeName": "customer"},
        {"attributeName": "name"},
        {"relationship": "child", "cardinality": "single", "attributeName": "location"}
    ],
    "repositoryMethods": [
        {"methodName": "getEventByCustomerId", "options" : {"cardinality": "multiple", "returnType": "event", "parameters": ["customerId"], "dbProcedure": "getEventByCustomerId"}},
        {"methodName": "getEventByDateRange", "options" : {"cardinality": "multiple", "returnType": "event", "parameters": ["startDate", "endDate"], "dbProcedure": "getEventByDateRange"}}
    ]
}