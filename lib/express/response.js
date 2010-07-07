
/*!
 * Express - response
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var http = require('http'),
    path = require('path'),
    mime = require('connect/utils').mime,
    Buffer = require('buffer').Buffer;

/**
 * Send a response with the given `body` and optional `headers` and `status` code.
 *
 * Currently supports:
 *
 *   - html
 *   - json
 *
 * @param {String|Object} body
 * @param {Object} headers
 * @param {Number} status
 * @return {ServerResponse}
 * @api public
 */

http.ServerResponse.prototype.send = function(body, headers, status){
    status = status || 200;
    headers = headers || {};
    switch (typeof body) {
        case 'string':
            headers['Content-Type'] = 'text/html; charset=utf8';
            break;
        case 'object':
            headers['Content-Type'] = 'application/json; charset=utf8';
            body = JSON.stringify(body);
            break;
    }
    headers['Content-Length'] = Buffer.byteLength(body);
    this.writeHead(status, headers);
    this.end(body);
};

/**
 * Set _Content-Type_ response header passed through `mime.type()`.
 *
 * Examples:
 *
 *     var filename = 'path/to/image.png';
 *     res.contentType(filename);
 *     // => "image/png"
 *
 * @param {String} type
 * @return {String} the resolved mime type
 * @api public
 */

http.ServerResponse.prototype.contentType = function(type){
    return this.headers['Content-Type'] = mime.type(type);
};
