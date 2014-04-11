/**
 * Created by jscote on 4/5/2014.
 */

var fs = require('fs');
var readline = require('readline');
var util = require('util');


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
                    methodDefinition = 'get{methodName}By{fieldName}'.supplant({methodName: definition.pluralizedObjectName.capitalize(), fieldName: definition.attributes[att].referenceField.capitalize()});
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

        //Create the default methods
        var defaultGetByIdMethodName = 'get{objectName}ById'.supplant({objectName: definition.objectName.capitalize()});
        methodDefinitions[defaultGetByIdMethodName] = {cardinality: 'single', returnType: definition.objectName, parameters: [definition.identity], dbProcedure: {name: defaultGetByIdMethodName, parameters: [definition.identity]}};

        var methodDefinition = "";
        var domainParameters = "";

        //Build a list of parameters for constructor of domain object
        //and a list of methods to automatically create based on the references
        for (var att in definition.attributes) {

            //Currently only creating domain objects with primary data type. references will never get loaded like this
            //They should be loaded on demand only (this should be done in the calling code, probably not in the repository as it would require to use the repository of the reference as well)
            //Child relationship can be loaded but would have to be specified so that we can do lazy loading of them. Child should belong in the repository as the root.
            if (!(definition.attributes[att])) {
                domainParameters = domainParameters + att + " : row." + att + ", ";
            } else {

                if(definition.attributes[att].relationship == 'reference') {
                    methodDefinition = 'get{methodName}By{fieldName}'.supplant({methodName: definition.pluralizedObjectName.capitalize(), fieldName: definition.attributes[att].referenceField.capitalize()});
                    methodDefinitions[methodDefinition] = {cardinality: 'multiple', returnType: definition.objectName, parameters: [definition.attributes[att].referenceField], dbProcedure: {name: methodDefinition, parameters: [definition.attributes[att].referenceField]}}
                } else if((definition.attributes[att].relationship == 'child') && (!(definition.attributes[att].childIsInParentStructure) || (definition.attributes[att].cardinality == 'multiple'))){
                    methodDefinition = 'get{childName}By{parent}{identity}'.supplant({childName: att.capitalize(), parent: definition.objectName.capitalize(), identity: definition.identity.capitalize()});
                    methodDefinitions[methodDefinition] = {cardinality: definition.attributes[att].cardinality, returnType: definition.objectName, parameters: [definition.identity],  dbProcedure: {name: methodDefinition, parameters: [definition.identity]}};
                }

            }
        }
        domainParameters = domainParameters.substring(0, domainParameters.lastIndexOf(','));

        for (var prop in  methodDefinitions) {
            var pa = "";
            var methodDef = methodDefinitions[prop];
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

            var methodTemplate = fs.readFileSync(__dirname + (methodDef.cardinality == 'single' ? '/dataAccessMethodTemplate.txt' : '/dataAccessMultiMethodTemplate.txt'), {encoding: 'utf8'});
            var methodName = prop;
            var methodParameters = pa;
            var method = methodTemplate.supplant({methodName: methodName, methodParameters: methodParameters, dbProcedureName: methodDef.dbProcedure.name, dbProcedureParameters: dbProcParameters, dbProcedureParameterValues: dbProcParameterValues, domainObjectConstructorParameters: domainParameters});


            methods = methods + method;
        }

        var RepositoryData = util.format(data, definition.objectName.capitalize(), definition.objectName, methods, definition.objectName)
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

        var properties = "";
        var proto = "";
        var methods = "";

        var propertyTemplate = fs.readFileSync(__dirname + '/domainObjectPrimitivePropertyTemplate.txt', {encoding: 'utf8'});
        var propertyReferenceTemplate = fs.readFileSync(__dirname + '/domainObjectReferencePropertyTemplate.txt', {encoding: 'utf8'});
        var propertyChildTemplate = fs.readFileSync(__dirname + '/domainObjectChildPropertyTemplate.txt', {encoding: 'utf8'});

        //to add the identity as part of the attributes
        definition.attributes[definition.identity] = null;

        var methodDefinition = "";

        for (var prop in definition.attributes) {
            if(!(definition.attributes[prop])) {
                properties = properties + propertyTemplate.supplant({propertyName: prop});
            } else{

                if (definition.attributes[prop].relationship == 'reference') {
                    methodDefinition = 'get{methodName}By{fieldName}'.supplant({methodName: definition.pluralizedObjectName.capitalize(), fieldName: definition.attributes[prop].referenceField.capitalize()});
                    properties = properties + propertyReferenceTemplate.supplant({propertyName: prop, methodToLoad: methodDefinition, methodParameters: definition.identity})
                } else if ((definition.attributes[prop].relationship == 'child') && (!(definition.attributes[prop].childIsInParentStructure) || (definition.attributes[prop].cardinality == 'multiple'))) {
                    methodDefinition = 'get{childName}By{parent}{identity}'.supplant({childName: prop.capitalize(), parent: definition.objectName.capitalize(), identity: definition.identity.capitalize()});
                    properties = properties + propertyChildTemplate.supplant({propertyName: prop, methodToLoad: methodDefinition, methodParameters: definition.identity})
                } else {
                    properties = properties + propertyTemplate.supplant({propertyName: prop});
                }



            }
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

        var domainObjectData = data.supplant({objectName: definition.objectName, properties: properties, businessMethods: methods, proto: proto});

        fs.writeFile(definition.objectName + 'DomainObject.js', domainObjectData, function (err) {
            if (err) console.log("Unable to create Domain Object file");
            console.log("Domain Object generated for: " + definition.objectName);
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


rl.question("Provide definition filename: ", function (answer) {

    var definition = require(__dirname + '/definitions/' + answer);

    createProviderFile(definition);

    createRepositoryFile(definition);

    createDomainObjectFile(definition);


    rl.close();
});


