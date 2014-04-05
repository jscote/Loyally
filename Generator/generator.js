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

rl.question("Provide definition filename: ", function (answer) {

    var definition = require (__dirname + '/definitions/' +  answer );

    fs.readFile(__dirname + '/factoryTemplate.txt', {encoding: 'utf8'}, function (err, data) {

        if(err) {
            console.log(err);
            return;
        }

        var factoryData = util.format(data, definition.objectName, definition.objectName, definition.uppercaseObjectName, definition.uppercaseObjectName, definition.objectName)

        //Create the factory file
        fs.writeFile(definition.objectName + 'Factory.js', factoryData, function (err) {
            if (err) console.log("Unable to create factory file");
            console.log("Factory generated for: " + definition.objectName);

        });

        fs.readFile(__dirname + '/dataAccessTemplate.txt', {encoding: 'utf8'}, function (err, data) {

            if (err) {
                console.log(err);
                return;
            }

            var methods =  "";

            for(var i = 0; i < definition.repositoryMethods.length; i++){
                var pa = "";
                for(var p=0; p < definition.repositoryMethods[i].options.parameters.length; p++) {
                    pa = pa + definition.repositoryMethods[i].options.parameters[p] + ( p == definition.repositoryMethods[i].options.parameters.length - 1? '' :  ', ');
                }
                methods = methods + '\tDataAccess.prototype.' +  definition.repositoryMethods[i].methodName + ' = function ('+ pa +') {\r\n\t};\r\n\r\n' ;
            }

            var dataAccessData = util.format(data, definition.uppercaseObjectName, definition.objectName, definition.uppercaseObjectName, methods, definition.objectName)
            //Create the dataAccessFile
            fs.writeFile(definition.objectName + 'DataAccess.js', dataAccessData, function (err) {
                if (err) console.log("Unable to create data access file");
                console.log("DataAccess generated for: " + definition.objectName);
            });
        });

        fs.readFile(__dirname + '/domainObjectTemplate.txt', {encoding: 'utf8'}, function (err, data) {

            if (err) {
                console.log(err);
                return;
            }

            var at =  "";
            var pat = "";
            var proto = "";

            for(var a = 0; a < definition.attributes.length; a++){

                pat = pat + '\tvar _' + definition.attributes[a].attributeName + ' = parameters.' + definition.attributes[a].attributeName + ' || null;\r\n';
                at = at + "\tObject.defineProperty(this, '"+ definition.attributes[a].attributeName  +"', {enumerable: true, get: function(){\r\nreturn _"+ definition.attributes[a].attributeName +";\r\n}} );\r\n";
            }

            var domainObjectData = util.format(data, definition.objectName, pat, at, definition.objectName, definition.objectName, proto)
            //Create the dataAccessFile
            fs.writeFile(definition.objectName + 'DomainObject.js', domainObjectData, function (err) {
                if (err) console.log("Unable to create Domain Object file");
                console.log("Domain Object generated for: " + definition.objectName);
            });
        });
    });

    rl.close();
});


