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

function createFactoryFile(data, definition) {


    //Create the factory file

    var methods = "";

    var factoryData = util.format(data, definition.objectName, definition.objectName, definition.uppercaseObjectName, definition.uppercaseObjectName, methods, definition.objectName);

    fs.writeFile(definition.objectName + 'Factory.js', factoryData, function (err) {
        if (err) console.log("Unable to create factory file");
        console.log("Factory generated for: " + definition.objectName);

    });
}
function createDataAccessFile(definition) {
    fs.readFile(__dirname + '/dataAccessTemplate.txt', {encoding: 'utf8'}, function (err, data) {

        if (err) {
            console.log(err);
            return;
        }

        var methods = "";

        for (var prop in  definition.repositoryMethods) {
            var pa = "";
            for (var p = 0; p < definition.repositoryMethods[prop].parameters.length; p++) {
                pa = pa + definition.repositoryMethods[prop].parameters[p] + ( p == definition.repositoryMethods[prop].parameters.length - 1 ? '' : ', ');
            }
            methods = methods + '\tDataAccess.prototype.' + prop + ' = function (' + pa + ') {\r\n\t};\r\n\r\n';
        }

        var dataAccessData = util.format(data, definition.uppercaseObjectName, definition.objectName, definition.uppercaseObjectName, methods, definition.objectName)
        //Create the dataAccessFile
        fs.writeFile(definition.objectName + 'DataAccess.js', dataAccessData, function (err) {
            if (err) console.log("Unable to create data access file");
            console.log("DataAccess generated for: " + definition.objectName);
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

    fs.readFile(__dirname + '/factoryTemplate.txt', {encoding: 'utf8'}, function (err, data) {

        if(err) {
            console.log(err);
            return;
        }
        createFactoryFile(data, definition);

        createDataAccessFile(definition);

        createDomainObjectFile(definition);
    });

    rl.close();
});


