
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
  , connect = require('connect')
  , utils = connect.utils
  , statusCodes = http.STATUS_CODES
  , res = http.ServerResponse.prototype
  , send = connect.static.send
  , mime = require('mime')
  , basename = path.basename
  , join = path.join;

/**
 * Send a response.
 *
 * Examples:
 *
 *     res.send(new Buffer('wahoo'));
 *     res.send({ some: 'json' });
 *     res.send('<p>some html</p>');
 *     res.send(404, 'Sorry, cant find that');
 *     res.send(404);
 *
 * @param {Mixed} body or status
 * @param {Mixed} body
 * @return {ServerResponse}
 * @api public
 */

res.send = function(body){
  var req = this.req
    , head = 'HEAD' == req.method;

  // allow status / body
  if (2 == arguments.length) {
    this.statusCode = body;
    body = arguments[1];
  }

  switch (typeof body) {
    // response status
    case 'number':
      this.header('Content-Type') || this.contentType('.txt');
      this.statusCode = body;
      body = http.STATUS_CODES[body];
      break;
    // string defaulting to html
    case 'string':
      if (!this.header('Content-Type')) {
        this.charset = this.charset || 'utf-8';
        this.contentType('.html');
      }
      break;
    case 'boolean':
    case 'object':
      if (null == body) {
        body = '';
      } else if (Buffer.isBuffer(body)) {
        this.header('Content-Type') || this.contentType('.bin');
      } else {
        return this.json(body);
      }
      break;
  }

  // populate Content-Length
  if (undefined !== body && !this.header('Content-Length')) {
    this.header('Content-Length', Buffer.isBuffer(body)
      ? body.length
      : Buffer.byteLength(body));
  }

  // strip irrelevant headers
  if (204 == this.statusCode || 304 == this.statusCode) {
    this.removeHeader('Content-Type');
    this.removeHeader('Content-Length');
    body = '';
  }

  // respond
  this.end(head ? null : body);
  return this;
};

/**
 * Send JSON response.
 *
 * Examples:
 *
 *     res.json(null);
 *     res.json({ user: 'tj' });
 *     res.json(500, 'oh noes!');
 *     res.json(404, 'I dont have that');
 *
 * @param {Mixed} obj or status
 * @param {Mixed} obj
 * @return {ServerResponse}
 * @api public
 */

res.json = function(obj){
  // allow status / body
  if (2 == arguments.length) {
    this.statusCode = obj;
    obj = arguments[1];
  }

  var body = JSON.stringify(obj)
    , callback = this.req.query.callback
    , jsonp = this.app.enabled('jsonp callback');

  this.charset = this.charset || 'utf-8';
  this.header('Content-Type', 'application/json');

  if (callback && jsonp) {
    this.header('Content-Type', 'text/javascript');
    body = callback.replace(/[^\w$.]/g, '') + '(' + body + ');';
  }

  return this.send(body);
};

/**
 * Set status `code`.
 *
 * @param {Number} code
 * @return {ServerResponse}
 * @api public
 */

res.status = function(code){
  this.statusCode = code;
  return this;
};

/**
 * Transfer the file at the given `path`.
 * 
 * Automatically sets the _Content-Type_ response header field.
 * The callback `fn(err)` is invoked when the transfer is complete
 * or when an error occurs. Be sure to check `res.sentHeader`
 * if you wish to attempt responding, as the header and some data
 * may have already been transferred.
 *
 * Options:
 *
 *   - `maxAge` defaulting to 0
 *   - `root`   root directory for relative filenames
 *
 * @param {String} path
 * @param {Object|Function} options or fn
 * @param {Function} fn
 * @api public
 */

res.sendfile = function(path, options, fn){
  var self = this
    , req = self.req
    , next = this.req.next
    , options = options || {};

  // support function as second arg
  if ('function' == typeof options) {
    fn = options;
    options = {};
  }

  // callback
  options.callback = function(err){
    if (err) {
      // ditch content-disposition to prevent funky responses
      if (!self.headerSent) self.removeHeader('Content-Disposition');

      // not found
      if ('ENOENT' == err.code) return req.next();

      // lost in limbo if there's no callback
      if (self.headerSent) return fn && fn(err);

      // callback available
      if (fn) return fn(err);

      return req.next(err);
    }

    fn && fn();
  };

  // transfer
  options.path = encodeURIComponent(path);
  send(this.req, this, next, options);
};

/**
 * Transfer the file at the given `path` as an attachment.
 *
 * Optionally providing an alternate attachment `filename`,
 * and optional callback `fn(err)`. The callback is invoked
 * when the data transfer is complete, or when an error has
 * ocurred. Be sure to check `res.sendHeader` if you plan to respond.
 *
 * @param {String} path
 * @param {String|Function} filename or fn
 * @param {Function} fn
 * @api public
 */

res.download = function(path, filename, fn){
  // support function as second arg
  if ('function' == typeof filename) {
    fn = filename;
    filename = null;
  }

  return this.attachment(filename || path).sendfile(path, fn);
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
 *     res.type('png');
 *
 * @param {String} type
 * @return {ServerResponse} for chaining
 * @api public
 */

res.contentType =
res.type = function(type){
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
  if (filename) this.type(filename);
  this.header('Content-Disposition', filename
    ? 'attachment; filename="' + basename(filename) + '"'
    : 'attachment');
  return this;
};

/**
 * Set header `field` to `val`, or pass
 * an object of of header fields.
 *
 * Examples:
 *
 *    res.set('Accept', 'application/json');
 *    res.set({ Accept: 'text/plain', 'X-API-Key': 'tobi' });
 *
 * @param {String|Object} field
 * @param {String} val
 * @return {ServerResponse} for chaining
 * @api public
 */

res.set = function(field, val){
  if (2 == arguments.length) {
    this.setHeader(field, val);
  } else {
    for (var key in field) {
      this.setHeader(key, field[key]);
    }
  }
  return this;
};

/**
 * Get value for header `field`.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */

res.get = function(field){
  return this.getHeader(field);
};

/**
 * Set or get response header `field` with optional `val`.
 *
 * @param {String} name
 * @param {String} val
 * @return {ServerResponse} for chaining
 * @api public
 */

res.header = function(field, val){
  if (1 == arguments.length) return this.getHeader(field);
  this.setHeader(field, val);
  return this;
};

/**
 * Clear cookie `name`.
 *
 * @param {String} name
 * @param {Object} options
 * @param {ServerResponse} for chaining
 * @api public
 */

res.clearCookie = function(name, options){
  var opts = { expires: new Date(1), path: this.app.get('root') };
  return this.cookie(name, '', options
    ? utils.merge(opts, options)
    : opts);
};

/**
 * Set cookie `name` to `val`, with the given `options`.
 *
 * Options:
 *
 *    - `maxAge`   max-age in milliseconds, converted to `expires`
 *    - `path`     defaults to the "root" setting which is typically "/"
 *
 * Examples:
 *
 *    // "Remember Me" for 15 minutes
 *    res.cookie('rememberme', '1', { expires: new Date(Date.now() + 900000), httpOnly: true });
 *
 *    // save as above
 *    res.cookie('rememberme', '1', { maxAge: 900000, httpOnly: true })
 *
 * @param {String} name
 * @param {String} val
 * @param {Options} options
 * @api public
 */

res.cookie = function(name, val, options){
  options = options || {};
  if ('maxAge' in options) options.expires = new Date(Date.now() + options.maxAge);
  if (undefined === options.path) options.path = this.app.set('root');
  var cookie = utils.serializeCookie(name, val, options);
  this.header('Set-Cookie', cookie);
  return this;
};

/**
 * Redirect to the given `url` with optional response `status`
 * defaulting to 302.
 *
 * The given `url` can also be the name of a mapped url, for
 * example by default express supports "back" which redirects
 * to the _Referrer_ or _Referer_ headers or the application's
 * "root" setting. Express also supports "root" out of the box,
 * which can be set via `app.set('root', '/blog');`.
 *
 * Examples:
 *
 *    res.redirect('/foo/bar');
 *    res.redirect('http://example.com');
 *    res.redirect(301, 'http://example.com');
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
 *        res.redirect('comments');
 *      });
 *
 *  Unless an absolute `url` is given, the app's mount-point
 *  will be respected. For example if we redirect to `/posts`,
 *  and our app is mounted at `/blog` we will redirect to `/blog/posts`.
 *
 * @param {String} url
 * @param {Number} code
 * @api public
 */

res.redirect = function(url){
  var app = this.app
    , req = this.req
    , root = app.get('root')
    , head = 'HEAD' == req.method
    , status = 302
    , body;

  // allow status / url
  if (2 == arguments.length) {
    status = url;
    url = arguments[1];
  }

  // Setup redirect map
  var map = {
      back: req.header('Referrer', root)
    , home: root
  };

  // Support custom redirect map
  map.__proto__ = app.redirects;

  // Attempt mapped redirect
  var mapped = 'function' == typeof map[url]
    ? map[url](req, this)
    : map[url];

  // Perform redirect
  url = mapped || url;

  // Relative
  if (!~url.indexOf('://')) {
    // Respect mount-point
    if (0 != url.indexOf(app.route)) url = app.route + url;

    // Absolute
    var host = req.header('Host')
      , tls = false // TODO: req.secure;

    url = 'http' + (tls ? 's' : '') + '://' + host + url;
  }

  // Support text/{plain,html} by default
  if (req.accepts('html')) {
    body = '<p>' + statusCodes[status] + '. Redirecting to <a href="' + url + '">' + url + '</a></p>';
    this.header('Content-Type', 'text/html');
  } else {
    body = statusCodes[status] + '. Redirecting to ' + url;
    this.header('Content-Type', 'text/plain');
  }

  // Respond
  this.statusCode = status;
  this.header('Location', url);
  this.end(head ? null : body);
};

/**
 * Render `view` with the given `options` and optional callback `fn`.
 * When a callback function is given a response will _not_ be made
 * automatically, otherwise a response of _200_ and _text/html_ is given.
 *
 * Options:
 *  
 *  - `status`    Response status code (`res.statusCode`)
 *  - `charset`   Set the charset (`res.charset`)
 *
 * Reserved locals:
 *
 *  - `cache`     boolean hinting to the engine it should cache
 *  - `filename`  filename of the view being rendered
 *
 * @param  {String} view
 * @param  {Object|Function} options or callback function
 * @param  {Function} fn
 * @api public
 */

res.render = function(view, options, fn){
  var self = this
    , options = options || {}
    , req = this.req
    , app = req.app;

  // support callback function as second arg
  if ('function' == typeof options) {
    fn = options, options = {};
  }

  function render() {
    // merge res.locals
    options.locals = self.locals;

    // status option
    if (options.status) self.statusCode = options.status;

    // charset option
    if (options.charset) self.charset = options.charset;

    // default callback to respond
    fn = fn || function(err, str){
      if (err) return req.next(err);
      self.send(str);
    };

    // render
    app.render(view, options, fn);
  }

  // invoke view callbacks
  var callbacks = app.viewCallbacks
    , pending = callbacks.length
    , len = pending
    , done;

  if (len) {
    for (var i = 0; i < len; ++i) {
      callbacks[i](req, self, function(err){
        if (done) return;

        if (err) {
          req.next(err);
          done = true;
          return;
        }

        --pending || render();
      });
    }
  } else {
    render();
  }
};