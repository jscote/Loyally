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

        var dtMultiTemplate = "\tvar entityList = [];\r\n" +
        "\tvar dfd = q.defer();\r\n\r\n" +
        "\tpg.connect(function(error, client, done){\r\n" +
        "\t\tif(error) {\r\n" +
        "\t\t\tdfd.reject(error);\r\n" +
        "\t\t\t\tdone();\r\n" +
            "\t\t\t\treturn;\r\n" +
            "\t\t\t}\r\n\r\n" +
            "\t\t\tclient.query('SELECT %s() %s', %s function(error, result){\r\n" +
        "\t\t\t\tif(error) {\r\n" +
            "\t\t\t\t\tdfd.reject(error);\r\n" +
            "\t\t\t\t\tdone();\r\n" +
            "\t\t\t\treturn;\r\n" +
            "\t\t\t}\r\n\r\n" +
            "\t\t\t\tif(result) {\r\n" +
            "\t\t\t\t\tfor(var i = 0; i < result.rows.length; i++){\r\n" +
            "\t\t\t\t\t\tvar row = result.rows[i];\r\n" +
            "\t\t\t\t\t\tvar entity = new DomainObject({%s});\r\n" +
            "\t\t\t\t\t\tentityList.push(entity);\r\n" +
            "\t\t\t\t\t}\r\n" +
            "\t\t\t\t}\r\n\r\n" +
            "\t\t\tdfd.resolve(entityList);\r\n\r\n" +
            "\t\t\});\r\n" +
            "\t\});\r\n" +
            "\treturn dfd.promise;\r\n";

        var dtTemplate = "\tvar entity = null;\r\n" +
            "\tvar dfd = q.defer();\r\n\r\n" +
            "\tpg.connect(function(error, client, done){\r\n" +
            "\t\tif(error) {\r\n" +
            "\t\t\tdfd.reject(error);\r\n" +
            "\t\t\t\tdone();\r\n" +
            "\t\t\t\treturn;\r\n" +
            "\t\t\t}\r\n\r\n" +
            "\t\t\tclient.query('SELECT %s() %s', %s function(error, result){\r\n" +
            "\t\t\t\tif(error) {\r\n" +
            "\t\t\t\t\tdfd.reject(error);\r\n" +
            "\t\t\t\t\tdone();\r\n" +
            "\t\t\t\treturn;\r\n" +
            "\t\t\t}\r\n\r\n" +
            "\t\t\t\tif(result) {\r\n" +
            "\t\t\t\t\tfor(var i = 0; i < result.rows.length; i++){\r\n" +
            "\t\t\t\t\t\tvar row = result.rows[i];\r\n" +
            "\t\t\t\t\t\tvar entity = new DomainObject({%s});\r\n" +
            "\t\t\t\t\t}\r\n" +
            "\t\t\t\t}\r\n\r\n" +
            "\t\t\tdfd.resolve(entity);\r\n\r\n" +
            "\t\t\});\r\n" +
            "\t\});\r\n" +
            "\treturn dfd.promise;\r\n";

        for (var prop in  definition.repositoryMethods) {
            var pa = "";
            var methodDef = definition.repositoryMethods[prop];
            for (var p = 0; p < methodDef.parameters.length; p++) {
                pa = pa + methodDef.parameters[p] + ( p == methodDef.parameters.length - 1 ? '' : ', ');
            }

            var dbProcedure = "";
            var dbProcParameters = "";
            var dbProcParameterValues = "";
            var domainParameters = "";
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


            for (var att in definition.attributes) {
                //Currently only creating domain objects with primary data type. references will never get loaded like this
                //They should be loaded on demand only (this should be done in the calling code, probably not in the repository as it would require to use the repository of the reference as well)
                //Child relationship can be loaded but would have to be specified so that we can do lazy loading of them. Child should belong in the repository as the root.
                if(!(definition.attributes[att])) {
                    domainParameters = domainParameters + att + " : row." + att + ", ";
                }
            }

            domainParameters = domainParameters.substring(0, domainParameters.lastIndexOf(','));


            var method = util.format((methodDef.cardinality == 'single' ? dtTemplate : dtMultiTemplate), methodDef.dbProcedure.name,  dbProcParameters, dbProcParameterValues, domainParameters);

            methods = methods + '\tRepository.prototype.' + prop + ' = function (' + pa + ') {\r\n\t' + method + '};\r\n\r\n';
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

        var at = "";
        var pat = "";
        var proto = "";
        var methods = "";

        for (var prop in definition.attributes) {
            pat = pat + '\tvar _' + prop + ' = parameters.' + prop + ' || null;\r\n';
            at = at + "\tObject.defineProperty(this, '" + prop + "', {\r\n\t\tenumerable: true, get:\r\n\tfunction() {\r\n\treturn _" + prop + ";\r\n}\r\n});\r\n\r\n";
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

        var domainObjectData = util.format(data, definition.objectName, pat, at, methods, definition.objectName, proto, definition.objectName)

        fs.writeFile(definition.objectName + 'DomainObject.js', domainObjectData, function (err) {
            if (err) console.log("Unable to create Domain Object file");
            console.log("Domain Object generated for: " + definition.objectName);
        });
    });
}
rl.question("Provide definition filename: ", function (answer) {

    var definition = require (__dirname + '/definitions/' +  answer );

        createFactoryFile(definition);

        createRepositoryFile(definition);

        createDomainObjectFile(definition);


    rl.close();
});


