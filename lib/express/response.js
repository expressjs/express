
/*!
 * Express - response
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var fs = require('fs'),
    http = require('http'),
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
            if (body instanceof Buffer) {
                if (!this.headers['Content-Type']) {
                    this.contentType('.bin');
                }
            } else {
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
 * Transfer the file at the given `path`. Automatically sets 
 * the _Content-Type_ response header via `res.contentType()`. 
 *
 * The given callback `fn` is invoked when an error occurs,
 * passing it as the first argument, or when the file is transferred,
 * passing the path as the second argument.
 *
 * @param {String} path
 * @param {Function} fn
 * @api public
 */

http.ServerResponse.prototype.sendfile = function(path, fn){
    var self = this;
    fs.readFile(path, function(err, buf){
        if (err) {
            if (fn) {
                fn(err, path);
            } else {
                self.req.next(err);
            }
        } else {
            self.contentType(path);
            self.send(buf);
            fn && fn(null, path);
        }
    });
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
 * Transfer the file at the given `path`, with optional 
 * `filename` as an attachment. Once transferred, or if an
 * error occurs `fn` is called with the error and path.
 *
 * @param {String} path
 * @param {String} filename
 * @param {Function} fn
 * @return {Type}
 * @api public
 */

http.ServerResponse.prototype.download = function(path, filename, fn){
    this.attachment(filename || path).sendfile(path, fn);
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

/**
 * Redirect to the given `url` with optional response `status`
 * defauling to 302.
 *
 * The given `url` can also be the name of a mapped url, for
 * example by default express supports "back" which redirects
 * to the _Referrer_ or _Referer_ headers or the application's
 * "home" setting. Express also supports "home" out of the box,
 * which can be set via `app.set('home', '/blog');`, and defaults
 * to '/'.
 *
 * Redirect Mapping:
 * 
 *  To extend the redirect mapping capabilities that Express provides,
 *  we may use the `app.redirect()` method:
 * 
 *     app.redirect('google', 'http://google.com');
 * 
 *  Now in a route we may call:
 *
 *     res.redirect('google');
 *
 *  We may also map dynamic redirects:
 *
 *      app.redirect('comments', function(req, res){
 *          return '/post/' + req.params.id + '/comments';
 *      });
 *
 *  So now we may do the following, and the redirect will dynamically adjust to
 *  the context of the request. If we called this route with _GET /post/12_ our
 *  redirect _Location_ would be _/post/12/comments_.
 *
 *      app.get('/post/:id', function(req, res){
 *          res.redirect('comments');
 *      });
 *
 * @param {String} url
 * @param {Number} code
 * @api public
 */

http.ServerResponse.prototype.redirect = function(url, status){
    var basePath = this.app.set('home') || '/';

    // Setup redirect map
    var map = {
        back: this.req.headers.referrer || this.req.headers.referer || basePath,
        home: basePath
    };

    // Support custom redirect map
    map.__proto__ = this.app.redirects;

    // Attempt mapped redirect
    var mapped = typeof map[url] === 'function'
        ? map[url](this.req, this)
        : map[url];

    // Perform redirect
    this.writeHead(status || 302, { 'Location': mapped || url });
    this.end();
};
