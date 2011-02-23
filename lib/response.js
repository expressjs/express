
/*!
 * Express - response
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var fs = require('fs')
  , http = require('http')
  , path = require('path')
  , utils = require('connect').utils
  , parseRange = require('./utils').parseRange
  , res = http.ServerResponse.prototype
  , mime = require('mime');

/**
 * Header fields supporting multiple values.
 * 
 * @type Array
 */

var multiple = ['Set-Cookie'];

/**
 * Send a response with the given `body` and optional `headers` and `status` code.
 *
 * Examples:
 *
 *     res.send();
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

res.send = function(body, headers, status){
  // Allow status as second arg
  if (typeof headers === 'number') {
    status = headers,
    headers = null;
  }

  // Defaults
  status = status || 200;

  // Allow 0 args as 204
  if (!arguments.length) {
    body = status = 204;
  }

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
        if (this.req.query.callback && this.app.settings['jsonp callback']) {
          this.header('Content-Type', 'text/javascript');
          body = this.req.query.callback.replace(/[^\w$.]/g, '') + '(' + body + ');';
        }
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
  if (headers) {
    var fields = Object.keys(headers);
    for (var i = 0, len = fields.length; i < len; ++i) {
      var field = fields[i];
      this.header(field, headers[field]);
    }
  }

  // Strip irrelevant headers
  if (204 === status) {
    delete this.headers['Content-Type'];
    delete this.headers['Content-Length'];
  }

  // Respond
  this.writeHead(status, this.headers);
  this.end('HEAD' == this.req.method ? undefined : body);
};

/**
 * Transfer the file at the given `path`. Automatically sets 
 * the _Content-Type_ response header via `res.contentType()`. 
 *
 * Accepts an optional callback `fn(err, path, stream)`.
 *
 * @param {String} path
 * @param {Function} fn
 * @api public
 */

res.sendfile = function(path, fn){
  var self = this
    , ranges = self.req.headers.range
    , head = 'HEAD' == self.req.method;

  if (~path.indexOf('..')) return this.send(403);

  function error(err) {
    delete self.headers['Content-Disposition'];
    if (fn) {
      fn(err, path);
    } else {
      self.req.next(err);
    }
  }

  fs.stat(path, function(err, stat){
    if (err) return error(err);
    var status = 200;

    // We have a Range request
    if (ranges) {
      ranges = parseRange(stat.size, ranges);
      // Valid
      if (ranges) {
        var stream = fs.createReadStream(path, ranges[0])
          , start = ranges[0].start
          , end = ranges[0].end;
        status = 206;
        self.header('Content-Range', 'bytes '
          + start
          + '-'
          + end
          + '/'
          + stat.size);
      // Invalid
      } else {
        return self.send(416);
      }
    // Stream the entire file
    } else {
      var stream = fs.createReadStream(path);
      self.header('Content-Length', stat.size);
    }

    // Transfer
    self.contentType(path);
    self.header('Accept-Ranges', 'bytes');
    self.writeHead(status, self.headers);
    if (head) return self.end();
    stream.pipe(self);
    fn && fn(null, path, stream);
  });
};

/**
 * Set _Content-Type_ response header passed through `mime.lookup()`.
 *
 * Examples:
 *
 *     var filename = 'path/to/image.png';
 *     res.contentType(filename);
 *     // res.headers['Content-Type'] is now "image/png"
 *
 *     res.contentType('.html');
 *     res.contentType('html');
 *     res.contentType('json');
 *     res.contentType('png');
 *
 * @param {String} type
 * @return {String} the resolved mime type
 * @api public
 */

res.contentType = function(type){
  return this.header('Content-Type', mime.lookup(type));
};

/**
 * Set _Content-Disposition_ header to _attachment_ with optional `filename`.
 *
 * @param {String} filename
 * @return {ServerResponse}
 * @api public
 */

res.attachment = function(filename){
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

res.download = function(path, filename, fn){
  this.attachment(filename || path).sendfile(path, fn);
};

/**
 * Set or get response header `name` with optional `val`.
 *
 * Headers that may be set multiple times (as indicated by the `multiple` array)
 * can be called with a value several times, for example:
 *
 *    res.header('Set-Cookie', '...');
 *    res.header('Set-Cookie', '...');
 *
 * @param {String} name
 * @param {String} val
 * @return {String}
 * @api public
 */

res.header = function(name, val){
  if (val === undefined) {
    return this.headers[name];
  } else {
    return ~multiple.indexOf(name)
      ? (this.headers[name] = this.headers[name] || []).push(val)
      : this.headers[name] = val;
  }
};

/**
 * Clear cookie `name`.
 *
 * @param {String} name
 * @api public
 */

res.clearCookie = function(name){
  this.cookie(name, '', { expires: new Date(1) });
};

/**
 * Set cookie `name` to `val`.
 *
 * Examples:
 *
 *    // "Remember Me" for 15 minutes
 *    res.cookie('rememberme', '1', { expires: new Date(Date.now() + 900000), httpOnly: true });
 *
 * @param {String} name
 * @param {String} val
 * @param {Options} options
 * @api public
 */

res.cookie = function(name, val, options){
  var cookie = utils.serializeCookie(name, val, options);
  this.header('Set-Cookie', cookie);
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

res.redirect = function(url, status){
  var basePath = this.app.set('home') || '/'
    , status = status || 302
    , body;

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
  url = mapped || url;

  // Support text/{plain,html} by default
  if (this.req.accepts('html')) {
    body = '<p>' + http.STATUS_CODES[status] + '. Redirecting to <a href="' + url + '">' + url + '</a></p>';
    this.header('Content-Type', 'text/html');
  } else {
    body = http.STATUS_CODES[status] + '. Redirecting to ' + url;
    this.header('Content-Type', 'text/plain');
  }

  // Respond
  this.send(body, { Location: url }, status);
};

/**
 * Assign the view local variable `name` to `val` or return the
 * local previously assigned to `name`.
 *
 * @param {String} name
 * @param {Mixed} val
 * @return {Mixed} val
 * @api public
 */

res.local = function(name, val){
  this.locals = this.locals || {};
  return undefined === val
    ? this.locals[name]
    : this.locals[name] = val;
};

