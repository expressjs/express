
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
 * Examples:
 *
 *     res.send(new Buffer('wahoo'));
 *     res.send({ some: 'json' });
 *     res.send('<p>some html</p>');
 *     res.send('Sorry, cant find that', 404);
 *     res.send('text', { 'Content-Type': 'text/plain' }, 201);
 *     res.send(404);
 *
 * @param {String|Object|Number|Buffer} body or status
 * @param {Object|Number} headers or status
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
            if (!(body instanceof Buffer)) {
                if (!this.headers['Content-Type']) {
                    this.contentType('.json');
                }
                body = JSON.stringify(body);
            }
            break;
    }

    // Populate Content-Length
    if (!this.headers['Content-Length']) {
        this.header('Content-Length', body instanceof Buffer
            ? body.length
            : Buffer.byteLength(body));
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
 * Set _Content-Disposition_ header to _attachment_ with optional `filename`.
 *
 * @param {String} filename
 * @return {ServerResponse}
 * @api public
 */

http.ServerResponse.prototype.attachment = function(filename){
    this.header('Content-Disposition', filename
        ? 'attachment; filename="' + path.basename(filename) + '"'
        : 'attachment');
    return this;
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

http.ServerResponse.prototype.redirect = function(url, code){
    var home = this.app.set('home') || '/',
        basePath = this.app.set('basepath');

    // Setup redirect map
    var map = {
        back: req.headers.referrer || req.headers.referer || home,
        home: home
    };

    // Perform redirect
    this.writeHead(code || 302, {
        'Location': map[url] || basePath || url
    });
    this.end();
};
