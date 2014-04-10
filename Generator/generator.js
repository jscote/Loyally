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

function createFactoryFile(definition) {
    fs.readFile(__dirname + '/factoryTemplate.txt', {encoding: 'utf8'}, function (err, data) {

        if (err) {
            console.log(err);
            return;
        }

        //Create the factory file

        var methods = "";

        var factoryData = util.format(data, definition.objectName, definition.objectName, definition.uppercaseObjectName, definition.uppercaseObjectName, methods, definition.objectName);

        fs.writeFile(definition.objectName + 'Factory.js', factoryData, function (err) {
            if (err) console.log("Unable to create factory file");
            console.log("Factory generated for: " + definition.objectName);

        });
    });
}

function createRepositoryFile(definition) {
    fs.readFile(__dirname + '/dataAccessTemplate.txt', {encoding: 'utf8'}, function (err, data) {

        if (err) {
            console.log(err);
            return;
        }

        var methods = "";

        var methodDefinitions = definition.repositoryMethods || {};

        //Create the default methods
        var defaultGetByIdMethodName = 'get{objectName}ById'.supplant({objectName: definition.uppercaseObjectName});
        methodDefinitions[defaultGetByIdMethodName] = {cardinality: 'single', returnType: definition.objectName, parameters: [definition.identity], dbProcedure: {name: defaultGetByIdMethodName, parameters : [definition.identity]}};

        var methodDefinition = "";
        var domainParameters = "";

        //Build a list of parameters for constructor of domain object
        //and a list of methods to automatically create based on the references
        for (var att in definition.attributes) {

            //Currently only creating domain objects with primary data type. references will never get loaded like this
            //They should be loaded on demand only (this should be done in the calling code, probably not in the repository as it would require to use the repository of the reference as well)
            //Child relationship can be loaded but would have to be specified so that we can do lazy loading of them. Child should belong in the repository as the root.
            if(!(definition.attributes[att])) {
                domainParameters = domainParameters + att + " : row." + att + ", ";
            } else if((definition.attributes[att].cardinality == 'single') && (definition.attributes[att].relationship == 'reference')){
                methodDefinition = 'get{methodName}By{fieldName}'.supplant({methodName: definition.pluralizedUppercaseObjectName, fieldName: definition.attributes[att].referenceField});
                methodDefinitions[methodDefinition] = {cardinality: 'multiple', returnType: definition.objectName, parameters: [definition.attributes[att].referenceField], dbProcedure: {name: methodDefinition, parameters : [definition.attributes[att].referenceField]}}
            }
        }
        domainParameters = domainParameters.substring(0, domainParameters.lastIndexOf(','));

        for (var prop in  definition.repositoryMethods) {
            var pa = "";
            var methodDef = definition.repositoryMethods[prop];
            for (var p = 0; p < methodDef.parameters.length; p++) {
                pa = pa + methodDef.parameters[p] + ( p == methodDef.parameters.length - 1 ? '' : ', ');
            }

            var dbProcedure = "";
            var dbProcParameters = "";
            var dbProcParameterValues = "";

            if(methodDef.dbProcedure) {
                dbProcedure = methodDef.dbProcedure.name;

                if(methodDef.dbProcedure.parameters) {
                    for (var dbp = 0; dbp < methodDef.dbProcedure.parameters.length; dbp++) {
                        dbProcParameters = dbProcParameters +  " $" + (dbp + 1) + ( dbp == methodDef.dbProcedure.parameters.length - 1 ? '': ', ');
                        dbProcParameterValues = dbProcParameterValues + methodDef.dbProcedure.parameters[dbp] + ( dbp == methodDef.dbProcedure.parameters.length - 1 ? '': ', ');
                    }
                    dbProcParameterValues = "[" + dbProcParameterValues + "],";
                }

            }

            var methodTemplate = fs.readFileSync(__dirname + (methodDef.cardinality == 'single' ? '/dataAccessMethodTemplate.txt' : '/dataAccessMultiMethodTemplate.txt'), {encoding: 'utf8'});
            var methodName = prop;
            var methodParameters= pa;
            var method = methodTemplate.supplant({methodName: methodName, methodParameters: methodParameters, dbProcedureName: methodDef.dbProcedure.name, dbProcedureParameters: dbProcParameters, dbProcedureParameterValues: dbProcParameterValues, domainObjectConstructorParameters: domainParameters});


            methods = methods + method;
        }

        var RepositoryData = util.format(data, definition.uppercaseObjectName, definition.objectName, methods, definition.objectName)
        //Create the RepositoryFile
        fs.writeFile(definition.objectName + 'Repository.js', RepositoryData, function (err) {
            if (err) console.log("Unable to create data access file");
            console.log("Repository generated for: " + definition.objectName);
        });
    });
}
function createDomainObjectFile(definition) {
    fs.readFile(__dirname + '/domainObjectTemplate.txt', {encoding: 'utf8'}, function (err, data) {

        if (err) {
            console.log(err);
            return;
        }

        var properties = ""
        var proto = "";
        var methods = "";

        var propertyTemplate = fs.readFileSync(__dirname + '/domainObjectPropertyTemplate.txt', {encoding: 'utf8'});


        for (var prop in definition.attributes) {
            properties = properties + propertyTemplate.supplant({propertyName: prop});
        }

        for(var m in definition.businessMethods) {
            var pa = "";
            var setProp = "";
            for (var p = 0; p < definition.businessMethods[m].parameters.length; p++) {

                pa = pa + definition.businessMethods[m].parameters[p] + ( p == definition.businessMethods[m].parameters.length - 1 ? '' : ', ');
            }

            if(definition.businessMethods[m].propertiesToSetFromParameter) {
                for(var i = 0; i < definition.businessMethods[m].propertiesToSetFromParameter.length; i++) {
                    var map =  definition.businessMethods[m].propertiesToSetFromParameter[i];
                    setProp = setProp + "\t_" +  map.propName + " = " +  map.paramName + " || _" + map.propName + ";\r\n";



                }

                setProp = setProp + "\r\n\tthis.state = entity.EntityState.modified;";
            }
            setProp = setProp + "";

            methods = methods + "\tthis." + m + " = function (" + pa + ") {\r\n\t "+ setProp +"\r\n};\r\n";
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

rl.question("Provide definition filename: ", function (answer) {

    var definition = require (__dirname + '/definitions/' +  answer );

        createFactoryFile(definition);

        createRepositoryFile(definition);

        createDomainObjectFile(definition);


    rl.close();
});


