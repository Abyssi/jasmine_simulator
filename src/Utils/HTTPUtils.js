#!/usr/bin/env node

const http = require("http");
const https = require("https");
const url = require('url');

exports.send = function (options, onResult) {
    const port = options.port === 443 ? https : http;
    const req = port.request(options, function (res) {
        let output = '';
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function () {
            onResult(res.statusCode, output);
        });
    });

    req.on('error', function (err) {
        console.log('error: ' + err.message);
    });

    req.end();
};

exports.get = function (urlString, onResult) {
    const parsedUrl = url.parse(urlString);
    const options = {
        host: parsedUrl.hostname,
        port: parsedUrl.port != null ? parsedUrl.port : (parsedUrl.protocol === "https:" ? 443 : 80),
        path: parsedUrl.path,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    this.send(options, function (statusCode, result) {
        onResult(statusCode, result);
    });
};

exports.put = function (urlString, onResult) {
    const parsedUrl = url.parse(urlString);
    const options = {
        host: parsedUrl.hostname,
        port: parsedUrl.port != null ? parsedUrl.port : (parsedUrl.protocol === "https:" ? 443 : 80),
        path: parsedUrl.path,
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    this.send(options, function (statusCode, result) {
        onResult(statusCode, result);
    });
};


exports.getJSON = function (url, onResult) {
    this.get(url, function (statusCode, result) {
        onResult(statusCode, JSON.parse(result));
    });
};