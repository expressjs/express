
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
    utils = require('connect/utils'),
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
    // Allow status as second arg
    if (typeof headers === 'number') {
        status = headers,
        headers = null;
    }

    // Defaults
    status = status || 200;
    headers = headers || {};

    // Determine content type
    switch (typeof body) {
        case 'number':
            if (!this.headers['Content-Type']) {
                this.contentType('.txt');
            }
            body = http.STATUS_CODES[status = body];
            break;
        case 'string':
            if (!this.headers['Content-Type']) {
                this.contentType('.html');
            }
            break;
        case 'object':
            if (!this.headers['Content-Type']) {
                this.contentType('.json');
            }
            body = JSON.stringify(body);
            break;
    }

    // Populate Content-Length
    if (!this.headers['Content-Length']) {
        this.header('Content-Length', Buffer.byteLength(body));
    }

    // Merge headers passed
    utils.merge(this.headers, headers);

    // Respond
    this.writeHead(status, this.headers);
    this.end(body);
};

/**
 * Set _Content-Type_ response header passed through `mime.type()`.
 *
 * Examples:
 *
 *     var filename = 'path/to/image.png';
 *     res.contentType(filename);
 *     // res.headers['Content-Type'] is now "image/png"
 *
 * @param {String} type
 * @return {String} the resolved mime type
 * @api public
 */

http.ServerResponse.prototype.contentType = function(type){
    return this.header('Content-Type', mime.type(type));
};

/**
 * Set or get response header `name` with optional `val`.
 *
 * @param {String} name
 * @param {String} val
 * @return {String}
 * @api public
 */

http.ServerResponse.prototype.header = function(name, val){
    return val === undefined
        ? this.headers[name]
        : this.headers[name] = val;
};