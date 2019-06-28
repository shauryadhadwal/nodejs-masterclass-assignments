// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');
const numCPUs = require('os').cpus().length;
const cluster = require('cluster');

function init() {
    // HTTP server

    if (cluster.isMaster) {
        console.log(`Master ${process.pid} is running`);



        for (let index = 0; index < numCPUs; index++) {
            cluster.fork();
        }
    } else {
        console.log(`Fork ${process.pid} is running`);

        httpServer = http.createServer(function (req, res) {
            unifiedServer(req, res);
        });

        httpServer.listen(config.httpPort, function () {
            console.log('The HTTP server is running on port ' + config.httpPort);
        });

        // HTTPS server
        const httpsServerOptions = {
            'key': fs.readFileSync('./https/key.pem'),
            'cert': fs.readFileSync('./https/cert.pem')
        };
        httpsServer = https.createServer(httpsServerOptions, function (req, res) {
            unifiedServer(req, res);
        });

        httpsServer.listen(config.httpsPort, function () {
            console.log('The HTTPS server is running on port ' + config.httpsPort);
        });
    }
}

init();



// Server logic
const unifiedServer = function (req, res) {

    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    const queryStringObject = parsedUrl.query;
    const method = req.method.toLowerCase();
    const headers = req.headers;

    const decoder = new StringDecoder('utf-8');
    let buffer = '';
    req.on('data', function (data) {
        buffer += decoder.write(data);
    });
    req.on('end', function () {
        buffer += decoder.end();

        const chosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        const data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'payload': buffer
        };

        chosenHandler(data, function (statusCode, payload) {

            statusCode = typeof (statusCode) == 'number' ? statusCode : 200;

            payload = typeof (payload) == 'object' ? payload : {};

            const payloadString = JSON.stringify(payload);

            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
            console.log(trimmedPath, statusCode);
        });
    });
};

// Handlers
const handlers = {};

// Ping handler
handlers.ping = function (data, callback) {
    callback(200);
};

handlers.hello = function (data, callback) {
    console.log(`Handled by ${process.pid} `);
    callback(200, {
        message: "Welcome to Shaurya's API "
    })
}

// Not-Found handler
handlers.notFound = function (data, callback) {
    callback(404, {
        message: "Not Found Request"
    });
};

// Router
const router = {
    'ping': handlers.ping,
    'hello': handlers.hello
};