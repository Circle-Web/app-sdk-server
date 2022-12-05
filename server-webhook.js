const secret = "填github配置的secret";
const repo = "/project/app-server-list/app-platform-server";

const http = require('http');
const crypto = require('crypto');
const exec = require('child_process').exec;

http.createServer(function (req, res) {
    req.on('data', function (chunk) {
        let sig = "sha1=" + crypto.createHmac('sha1', secret).update(chunk.toString()).digest('hex');

        if (req.headers['x-hub-signature'] == sig) {
            exec('cd ' + repo + ' && sh ./start.sh');
            console.log('webhook triggered, try git pull && start.')
        }
    });
    res.end();
}).listen(1000);