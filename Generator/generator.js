/**
 * Created by jscote on 4/5/2014.
 */

var fs = require('fs');
var readline = require('readline');
var util = require('util');
var inflection = require('inflection');


var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function createProviderFile(def) {
    fs.readFile(__dirname + '/providerTemplate.txt', {encoding: 'utf8'}, function (err, data) {

        if (err) {
            console.log(err);
            return;
        }

        var definition = clone(def);

        var methodDefinitions = definition.repositoryMethods || {};

        //Create the default methods
        var defaultGetByIdMethodName = 'get{objectName}ById'.supplant({objectName: definition.objectName.capitalize()});
        methodDefinitions[defaultGetByIdMethodName] = {cardinality: 'single', returnType: definition.objectName, parameters: [definition.identity], dbProcedure: {name: defaultGetByIdMethodName, parameters: [definition.identity]}};

        var methodDefinition = "";

        //Build a list of parameters for constructor of domain object
        //and a list of methods to automatically create based on the references
        for (var att in definition.attributes) {
            if (definition.attributes[att]) {
                if (definition.attributes[att].relationship == 'reference') {
                    methodDefinition = 'get{methodName}By{fieldName}'.supplant({methodName: inflection.pluralize(definition.objectName.capitalize()), fieldName: definition.attributes[att].referenceField.capitalize()});
                    methodDefinitions[methodDefinition] = {cardinality: definition.attributes[att].cardinality, returnType: definition.objectName, parameters: [definition.attributes[att].referenceField]};
                } else if ((definition.attributes[att].relationship == 'child') && (!(definition.attributes[att].childIsInParentStructure) || (definition.attributes[att].cardinality == 'multiple'))) {
                    methodDefinition = 'get{childName}By{parent}{identity}'.supplant({childName: att.capitalize(), parent: definition.objectName.capitalize(), identity: definition.identity.capitalize()});
                    methodDefinitions[methodDefinition] = {cardinality: definition.attributes[att].cardinality, returnType: definition.objectName, parameters: [definition.identity]};
                }
            }
        }

        var methods = "";
        for (var prop in  methodDefinitions) {
            var pa = "";
            var methodDef = methodDefinitions[prop];
            for (var p = 0; p < methodDef.parameters.length; p++) {
                pa = pa + methodDef.parameters[p] + ( p == methodDef.parameters.length - 1 ? '' : ', ');
            }

            var methodTemplate = fs.readFileSync(__dirname + '/providerGetMethodTemplate.txt', {encoding: 'utf8'});
            var methodName = prop;
            var methodParameters = pa;
            var method = methodTemplate.supplant({methodName: methodName, parameters: methodParameters});


            methods = methods + method;
        }


        var providerData = data.supplant({objectName: definition.objectName, getterMethods: methods});

        fs.writeFile(definition.objectName + 'Provider.js', providerData, function (err) {
            if (err) console.log("Unable to create provider file");
            console.log("Provider generated for: " + definition.objectName);

        });
    });
}

function createRepositoryFile(def) {
    fs.readFile(__dirname + '/dataAccessTemplate.txt', {encoding: 'utf8'}, function (err, data) {

        if (err) {
            console.log(err);
            return;
        }

        var definition = clone(def);

        var methods = "";

        var methodDefinitions = definition.repositoryMethods || {};

        var providers = [];
        var providerVar = "";
        var providerConstructor = "";

        var providerVarTemplate = "\t\t\tvar _{providerName} = Injector.resolve({target: '{providerName}'});\r\n";
        providers.push('{objectName}Provider'.supplant({objectName: definition.objectName}));


        for (var attribute in definition.attributes) {
            if ((definition.attributes[attribute]) && (definition.attributes[attribute].cardinality == 'single') && (definition.attributes[attribute].relationship == 'reference')) {
                providers.push('{objectName}Provider'.supplant({objectName: attribute}));
            }
        }

        for (var idx = 0; idx < providers.length; idx++) {
            providerConstructor = providerConstructor + providers[idx] + ( idx == providers.length - 1 ? '' : ', ');
            providerVar = providerVar + providerVarTemplate.supplant({providerName: providers[idx]});
        }

        //Create the default methods
        var defaultGetByIdMethodName = 'get{objectName}ById'.supplant({objectName: definition.objectName.capitalize()});
        methodDefinitions[defaultGetByIdMethodName] = {relationship: "primitive" ,cardinality: 'single', returnType: "DomainObject", parameters: [definition.identity], dbProcedure: {name: defaultGetByIdMethodName, parameters: [definition.identity]}};

        var methodDefinition = "";
        var domainParameters = "";

        //Build a list of parameters for constructor of domain object
        //and a list of methods to automatically create based on the references
        for (var att in definition.attributes) {


            if (definition.attributes[att].relationship == 'reference') {
                methodDefinition = 'get{methodName}By{fieldName}'.supplant({methodName: inflection.pluralize(definition.objectName.capitalize()), fieldName: definition.attributes[att].referenceField.capitalize()});
                methodDefinitions[methodDefinition] = {relationship: definition.attributes[att].relationship ,cardinality: 'multiple', returnType: "DomainObject", parameters: [definition.attributes[att].referenceField], dbProcedure: {name: methodDefinition, parameters: [definition.attributes[att].referenceField]}}
            } else if ((definition.attributes[att].relationship == 'child') && (!(definition.attributes[att].childIsInParentStructure) || (definition.attributes[att].cardinality == 'multiple'))) {
                methodDefinition = 'get{childName}By{parent}{identity}'.supplant({childName: att.capitalize(), parent: definition.objectName.capitalize(), identity: definition.identity.capitalize()});
                methodDefinitions[methodDefinition] = {relationship: definition.attributes[att].relationship, cardinality: definition.attributes[att].cardinality, returnType: att.capitalize(), parameters: [definition.identity], dbProcedure: {name: methodDefinition, parameters: [definition.identity]}};
            } else if (definition.attributes[att].relationship == 'primitive') {
                domainParameters = domainParameters + att + " : row." + att + ", ";
            }


        }
        domainParameters = domainParameters.substring(0, domainParameters.lastIndexOf(','));

        for (var prop in  methodDefinitions) {
            var pa = "";
            var methodDef = methodDefinitions[prop];

            //TODO: Parameters need to change if we are calling a method to get a child object.
            for (var p = 0; p < methodDef.parameters.length; p++) {
                pa = pa + methodDef.parameters[p] + ( p == methodDef.parameters.length - 1 ? '' : ', ');
            }

            var dbProcedure = "";
            var dbProcParameters = "";
            var dbProcParameterValues = "";

            if (methodDef.dbProcedure) {
                dbProcedure = methodDef.dbProcedure.name;

                if (methodDef.dbProcedure.parameters) {
                    for (var dbp = 0; dbp < methodDef.dbProcedure.parameters.length; dbp++) {
                        dbProcParameters = dbProcParameters + " $" + (dbp + 1) + ( dbp == methodDef.dbProcedure.parameters.length - 1 ? '' : ', ');
                        dbProcParameterValues = dbProcParameterValues + methodDef.dbProcedure.parameters[dbp] + ( dbp == methodDef.dbProcedure.parameters.length - 1 ? '' : ', ');
                    }
                    dbProcParameterValues = "[" + dbProcParameterValues + "],";
                }

            }


            var fileName = methodDef.cardinality == 'single' ? '/dataAccessMethod{forChild}Template.txt' : '/dataAccessMultiMethod{forChild}Template.txt';
            //TODO: If it is a reference, we would need to inject the providers of the reference, which we can't really know yet. We need to figure a way to do this
            //TODO: If a child has a reference, we need to also inject the provider to get the child
            fileName = fileName.supplant({forChild: methodDef.relationship == 'child' ? 'forChild': ''});

            var methodTemplate = fs.readFileSync(__dirname + fileName, {encoding: 'utf8'});
            var methodName = prop;
            var methodParameters = pa;
            var domainObjectDef = methodDef.returnType == undefined ? "DomainObject" : methodDef.returnType;
            var method = methodTemplate.supplant({methodName: methodName, methodParameters: methodParameters, dbProcedureName: methodDef.dbProcedure.name, dbProcedureParameters: dbProcParameters, dbProcedureParameterValues: dbProcParameterValues, domainObjectConstructorParameters: domainParameters, providers: providerConstructor, providerVars: providerVar, domainObject: domainObjectDef});


            methods = methods + method;
        }

        var RepositoryData = data.supplant({proto: methods, objectName: definition.objectName});
        //Create the RepositoryFile
        fs.writeFile(definition.objectName + 'Repository.js', RepositoryData, function (err) {
            if (err) console.log("Unable to create data access file");
            console.log("Repository generated for: " + definition.objectName);
        });
    });
}
function createDomainObjectFile(def) {
    fs.readFile(__dirname + '/domainObjectTemplate.txt', {encoding: 'utf8'}, function (err, data) {

        if (err) {
            console.log(err);
            return;
        }

        var definition = clone(def);

        var providers = [];
        var providerVar = "";
        var providerConstructor = "";

        var providerVarTemplate = "\tvar _{providerName} = {providerName};\r\n";
        providers.push('{objectName}Provider'.supplant({objectName: definition.objectName}));

        var properties = "";
        var proto = "";
        var methods = "";

        var propertyTemplate = fs.readFileSync(__dirname + '/domainObjectPrimitivePropertyTemplate.txt', {encoding: 'utf8'});
        var propertyReferenceTemplate = fs.readFileSync(__dirname + '/domainObjectReferencePropertyTemplate.txt', {encoding: 'utf8'});
        var propertyChildTemplate = fs.readFileSync(__dirname + '/domainObjectChildPropertyTemplate.txt', {encoding: 'utf8'});

        //to add the identity as part of the attributes
        definition.attributes[definition.identity] = {relationship: 'primitive'};

        var methodDefinition = "";

        var childDefinitions = [];

        var saveTmpl = "\tthis.save = function() {\r\n\t\t//TODO: Consider if we want to run pre-save validation\r\n\t\t\t_{defaultProvider}.save(this);\r\n\t\t}\r\n";

        for (var prop in definition.attributes) {
            //if (!(definition.attributes[prop])) {
            //    properties = properties + propertyTemplate.supplant({propertyName: prop});
            //} else {

            if (definition.attributes[prop].relationship == 'child') {
                if (definition.attributes[prop] && definition.attributes[prop].attributes) {
                    var childDef = {objectName: prop, identity: "id", attributes: definition.attributes[prop].attributes, isChildObjectOf: definition.objectName};
                    childDefinitions.push(childDef);
                }
            }

            if (definition.attributes[prop].relationship == 'reference') {
                methodDefinition = 'get{methodName}By{fieldName}'.supplant({methodName: prop.capitalize(), fieldName: definition.identity.capitalize()});
                properties = properties + propertyReferenceTemplate.supplant({propertyName: prop, methodToLoad: methodDefinition, methodParameters: definition.identity, providerName: '_{providerName}Provider'.supplant({providerName: prop})})

                if (definition.attributes[prop].cardinality == 'single') {
                    providers.push('{objectName}Provider'.supplant({objectName: prop}));
                }

            } else if ((definition.attributes[prop].relationship == 'child') && (!(definition.attributes[prop].childIsInParentStructure) || (definition.attributes[prop].cardinality == 'multiple'))) {
                methodDefinition = 'get{childName}By{parent}{identity}'.supplant({childName: prop.capitalize(), parent: definition.objectName.capitalize(), identity: definition.identity.capitalize()});
                properties = properties + propertyChildTemplate.supplant({propertyName: prop, methodToLoad: methodDefinition, methodParameters: definition.identity, providerName: '_' + definition.objectName + 'Provider'})
            } else {
                properties = properties + propertyTemplate.supplant({propertyName: prop});
            }
//            }
        }

        for (var m in definition.businessMethods) {
            var pa = "";
            var setProp = "";
            for (var p = 0; p < definition.businessMethods[m].parameters.length; p++) {

                pa = pa + definition.businessMethods[m].parameters[p] + ( p == definition.businessMethods[m].parameters.length - 1 ? '' : ', ');
            }

            if (definition.businessMethods[m].propertiesToSetFromParameter) {
                for (var i = 0; i < definition.businessMethods[m].propertiesToSetFromParameter.length; i++) {
                    var map = definition.businessMethods[m].propertiesToSetFromParameter[i];
                    setProp = setProp + "\t_" + map.propName + " = " + map.paramName + " || _" + map.propName + ";\r\n";

                }

                setProp = setProp + "\r\n\tthis.state = entity.EntityState.modified;";
            }
            setProp = setProp + "";

            methods = methods + "\tthis." + m + " = function (" + pa + ") {\r\n\t " + setProp + "\r\n};\r\n";
        }


        for (var idx = 0; idx < providers.length; idx++) {
            providerConstructor = providerConstructor + providers[idx] + ( idx == providers.length - 1 ? '' : ', ');
            providerVar = providerVar + providerVarTemplate.supplant({providerName: providers[idx]});
        }

        var saveMethod = saveTmpl.supplant({defaultProvider: providers[0]});

        var domainObjectData = data.supplant({objectName: definition.objectName, properties: properties, businessMethods: methods, proto: proto, providerConstructor: providerConstructor, providerVar: providerVar, defaultProvider: providers[0], saveMethod: definition.isChildObjectOf == undefined? saveMethod: ""});

        fs.writeFile(definition.objectName + 'DomainObject.js', domainObjectData, function (err) {
            if (err) console.log("Unable to create Domain Object file");
            console.log("Domain Object generated for: " + definition.objectName);
        });

        for (var d = 0; d < childDefinitions.length; d++) {
            processDefinition(childDefinitions[d]);
        }
    });
}

function createTable(def) {
    fs.readFile(__dirname + '/createTableTemplate.txt', {encoding: 'utf8'}, function (err, data) {

        if (err) {
            console.log(err);
            return;
        }

        var definition = clone(def);

        var columns = "";
        var constraints = "";

        //TODO: Generate FK constraints

        //to add the identity as part of the attributes
        definition.attributes[definition.identity] = {relationship: 'primitive', required: true, dbType: "SERIAL"};

        var requiredStr = "NOT NULL";
        var notRequiredStr = "";
        var requiredRst = "";
        var sqlDecTmpl = "{columnName} {type} {required},\r\n";
        var colDec = "";

        var uniqueTmpl = 'CONSTRAINT "{ukey}" UNIQUE ({uField}),\r\n';
        var uniqueStr;

        var pkey = 'CONSTRAINT "{pkeyName}" PRIMARY KEY ({pkField}),'.supplant({pkeyName: definition.objectName.capitalize() + "_pkey", pkField: definition.identity});
        constraints = constraints + pkey + '\r\n';

        var fKey = 'CONSTRAINT "{fkeyName}" FOREIGN KEY ({fkField}) REFERENCES {pTable} ({pkField}),'.supplant({fkeyName: definition.objectName.capitalize() + "_fkey_" + definition.isChildObjectOf + "_id", pkField: "id", fkField: definition.isChildObjectOf + "Id", pTable: definition.isChildObjectOf});

        if(definition.isChildObjectOf) {
            definition.attributes[definition.isChildObjectOf + "Id"] = {relationship: 'primitive', required: true, dbType: "int"};
            constraints = constraints + fKey +'\r\n';
        }


        for (var prop in definition.attributes) {

            if (definition.attributes[prop].required) {
                requiredRst = requiredStr;
            } else {
                requiredRst = notRequiredStr;
            }

            if (definition.attributes[prop].unique) {
                uniqueStr = uniqueTmpl.supplant({ukey: definition.objectName.capitalize() + "_" + prop + "_ukey", uField: prop});
                constraints = constraints + uniqueStr;
            }

            if (definition.attributes[prop].relationship == 'reference') {
                colDec = sqlDecTmpl.supplant({columnName: prop + "Id", type: "INT", required: requiredRst});
                columns = columns + colDec;

                fKey = 'CONSTRAINT "{fkeyName}" FOREIGN KEY ({fkField}) REFERENCES {pTable} ({pkField}),'.supplant({fkeyName: definition.objectName.capitalize() + "_fkey_" + prop, pkField: "id", fkField: prop + "Id", pTable: prop});
                constraints = constraints + fKey +'\r\n';
            }
            //TODO: Discuss this. I think it is not necessary to keep a reference to child object within the parent table as child can't exist with their parents. At this point, the reference to the parent is saved in the child table instead
            /*else if ((definition.attributes[prop].relationship == 'child') && (((definition.attributes[prop].childIsInParentStructure !== undefined)) && (definition.attributes[prop].childIsInParentStructure == false) && (definition.attributes[prop].cardinality == 'single'))) {

                colDec = sqlDecTmpl.supplant({columnName: prop + "Id", type: "INT", required: requiredRst});
                columns = columns + colDec;
            } */else if (definition.attributes[prop].relationship == 'primitive') {
                colDec = sqlDecTmpl.supplant({columnName: prop, type: definition.attributes[prop].dbType, required: requiredRst});
                columns = columns + colDec;
            }
        }

        columns = columns.substring(0, columns.length - 3);
        constraints = constraints.substring(0, constraints.length - 3);

        var scriptData = data.supplant({objectName: definition.objectName.capitalize(), columns: columns, constraints: constraints});

        fs.writeFile(definition.objectName + 'CreateTable.sql', scriptData, function (err) {
            if (err) console.log("Unable to create table creation script");
            console.log("Create Table Script generated for: " + definition.objectName);
        });
    });
}

if (!String.prototype.supplant) {
    String.prototype.supplant = function (o) {
        return this.replace(/\{([^{}]*)\}/g,
            function (a, b) {
                var r = o[b];
                return typeof r === 'string' || typeof r === 'number' ? r : a;
            });
    };
}
if (!String.prototype.capitalize) {
    String.prototype.capitalize = function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
    };
}

function clone(obj) {
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        var copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

function processDefinition(definition) {
    if(definition.isChildObjectOf == undefined) {
        createProviderFile(definition);
    }

    if(definition.isChildObjectOf == undefined) {
        createRepositoryFile(definition);
    }

    createDomainObjectFile(definition);

    createTable(definition);
}


rl.question("Provide definition filename: ", function (answer) {

    var definition = require(__dirname + '/definitions/' + answer);

    processDefinition(definition);

    rl.close();
});


