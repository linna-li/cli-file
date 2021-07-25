#!/usr/bin/env node

// cli-file list
// cli-file delete -f 'fileId'
// cli-file uplpad -n 'filename' -p 'filePath'
const program = require('commander');
var request = require('request');
var fs = require('fs');

program
    .version('0.1.0')
    .option('-c, --commandName [command]', 'command')
    .option('-f, --fileId [fileId]', 'File Id')
    .option('-p, --path [path]', 'File Path')
    .parse(process.argv);

switch (program.commandName) {
    case 'list':
        request.get('http://localhost:8080/api/files', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body)
            }
            else {
                console.log("Error " + response.statusCode)
            }
        });
        break;
    case 'delete':
        if (program.fileId) {
            var path = 'http://localhost:8080/api/file/' + program.fileId
            console.log("out put path: " + program.fileId)
            request.delete(path, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(body)
                }
                else {
                    console.log("Error: Delete file failed")
                    console.log("Error " + response.statusCode)
                }
            })
        }
        else {
            console.log("Error: missed fileId, use -f fileId ")
        }
        break;
    case 'upload':
        if (program.path) {
            var req = request.post('http://localhost:8080/api/file/', function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(body)
                }
                else {
                    console.log("Error: Upload file failed")
                    console.log("Error " + response.statusCode)
                }
            });
            var form = req.form();
            form.append('file', fs.createReadStream(program.path));
        }
        else {
            console.log("Error: missed file path, use -f fileId ")
        }
        break;
    default:
        console.error("Not support command type " + program.commandName + "Use list, delete or upload.")
}
