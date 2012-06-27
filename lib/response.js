
/**
 * Module dependencies.
 */

var fs = require('fs')
  , http = require('http')
  , path = require('path')
  , connect = require('connect')
  , utils = connect.utils
  , normalizeType = require('./utils').normalizeType
  , normalizeTypes = require('./utils').normalizeTypes
  , statusCodes = http.STATUS_CODES
  , send = connect.static.send
  , cookie = require('cookie')
  , crc = require('crc')
  , mime = connect.mime
  , basename = path.basename
  , extname = path.extname
  , join = path.join;

/**
 * Response prototype.
 */

var res = module.exports = {
  __proto__: http.ServerResponse.prototype
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
 * Set Link header field with the given `links`.
 *
 * Examples:
 *
 *    res.links({
 *      next: 'http://api.example.com/users?page=2',
 *      last: 'http://api.example.com/users?page=5'
 *    });
 *
 * @param {Object} links
 * @return {ServerResponse}
 * @api public
 */

res.links = function(links){
  return this.set('Link', Object.keys(links).map(function(rel){
    return '<' + links[rel] + '>; rel="' + rel + '"';
  }).join(', '));
};

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
    , head = 'HEAD' == req.method
    , len;

  // allow status / body
  if (2 == arguments.length) {
    // res.send(body, status) backwards compat
    if ('number' != typeof body && 'number' == typeof arguments[1]) {
      this.statusCode = arguments[1];
    } else {
      this.statusCode = body;
      body = arguments[1];
    }
  }


  // convert string objects to primitives
  if (body instanceof String) body = body.toString();

  switch (typeof body) {
    // response status
    case 'number':
      this.get('Content-Type') || this.type('txt');
      this.statusCode = body;
      body = http.STATUS_CODES[body];
      break;
    // string defaulting to html
    case 'string':
      if (!this.get('Content-Type')) {
        this.charset = this.charset || 'utf-8';
        this.type('html');
      }
      break;
    case 'boolean':
    case 'object':
      if (null == body) {
        body = '';
      } else if (Buffer.isBuffer(body)) {
        this.get('Content-Type') || this.type('bin');
      } else {
        return this.json(body);
      }
      break;
  }

  // populate Content-Length
  if (undefined !== body && !this.get('Content-Length')) {
    this.set('Content-Length', len = Buffer.isBuffer(body)
      ? body.length
      : Buffer.byteLength(body));
  }

  // ETag support
  // TODO: W/ support
  if (len > 1024) {
    if (!this.get('ETag')) this.set('ETag', Buffer.isBuffer(body)
      ? crc.buffer.crc32(body)
      : crc.crc32(body));
  }

  // freshness
  if (req.fresh) this.statusCode = 304;

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
    // res.json(body, status) backwards compat
    if ('number' == typeof arguments[1]) {
      this.statusCode = arguments[1];
    } else {
      this.statusCode = obj;
      obj = arguments[1];
    }
  }

  // settings
  var app = this.app
    , jsonp = app.get('jsonp callback')
    , replacer = app.get('json replacer')
    , spaces = app.get('json spaces')
    , body = JSON.stringify(obj, replacer, spaces)
    , callback = this.req.query.callback;

  // content-type
  this.charset = this.charset || 'utf-8';
  this.set('Content-Type', 'application/json');

  // jsonp
  if (callback && jsonp) {
    this.set('Content-Type', 'text/javascript');
    body = callback.replace(/[^[]\w$.]/g, '') + '(' + body + ');';
  }

  return this.send(body);
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
 * Examples:
 *
 *  The following example illustrates how `res.sendfile()` may
 *  be used as an alternative for the `static()` middleware for
 *  dynamic situations. The code backing `res.sendfile()` is actually
 *  the same code, so HTTP cache support etc is identical.
 *
 *     app.get('/user/:uid/photos/:file', function(req, res){
 *       var uid = req.params.uid
 *         , file = req.params.file;
 *     
 *       req.user.mayViewFilesFrom(uid, function(yes){
 *         if (yes) {
 *           res.sendfile('/uploads/' + uid + '/' + file);
 *         } else {
 *           res.send(403, 'Sorry! you cant see that.');
 *         }
 *       });
 *     });
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
      // cast ENOENT
      if ('ENOENT' == err.code) err = utils.error(404);

      // ditch content-disposition to prevent funky responses
      if (!self.headerSent) self.removeHeader('Content-Disposition');

      // woot! callback available
      if (fn) return fn(err);

      // lost in limbo if there's no callback
      if (self.headerSent) return;

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
 * ocurred. Be sure to check `res.headerSent` if you plan to respond.
 *
 * This method uses `res.sendfile()`.
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

  filename = filename || path;
  this.set('Content-Disposition', 'attachment; filename="' + basename(filename) + '"');
  return this.sendfile(path, fn);
};

/**
 * Set _Content-Type_ response header with `type` through `mime.lookup()`
 * when it does not contain "/", or set the Content-Type to `type` otherwise.
 *
 * Examples:
 *
 *     res.type('.html');
 *     res.type('html');
 *     res.type('json');
 *     res.type('application/json');
 *     res.type('png');
 *
 * @param {String} type
 * @return {ServerResponse} for chaining
 * @api public
 */

res.contentType =
res.type = function(type){
  return this.set('Content-Type', ~type.indexOf('/')
    ? type
    : mime.lookup(type));
};

/**
 * Respond to the Acceptable formats using an `obj`
 * of mime-type callbacks.
 *
 * This method uses `req.accepted`, an array of
 * acceptable types ordered by their quality values.
 * When "Accept" is not present the _first_ callback
 * is invoked, otherwise the first match is used. When
 * no match is performed the server responds with
 * 406 "Not Acceptable".
 *
 * Content-Type is set for you, however if you choose
 * you may alter this within the callback using `res.type()`
 * or `res.set('Content-Type', ...)`.
 *
 *    res.format({
 *      'text/plain': function(){
 *        res.send('hey');
 *      },
 *    
 *      'text/html': function(){
 *        res.send('<p>hey</p>');
 *      },
 *    
 *      'appliation/json': function(){
 *        res.send({ message: 'hey' });
 *      }
 *    });
 *
 * In addition to canonicalized MIME types you may
 * also use extnames mapped to these types:
 *
 *    res.format({
 *      text: function(){
 *        res.send('hey');
 *      },
 *    
 *      html: function(){
 *        res.send('<p>hey</p>');
 *      },
 *    
 *      json: function(){
 *        res.send({ message: 'hey' });
 *      }
 *    });
 *
 * By default Express passes an `Error`
 * with a `.status` of 406 to `next(err)`
 * if a match is not made. If you provide
 * a `.default` callback it will be invoked
 * instead.
 *
 * @param {Object} obj
 * @return {ServerResponse} for chaining
 * @api public
 */

res.format = function(obj){
  var keys = Object.keys(obj)
    , req = this.req
    , next = req.next;

  var fn = obj.default;
  if (fn) delete obj.default;

  var key = req.accepts(keys);

  this.set('Vary', 'Accept');

  if (key) {
    this.set('Content-Type', normalizeType(key));
    obj[key](req, this, next);
  } else if (fn) {
    fn();
  } else {
    var err = new Error('Not Acceptable');
    err.status = 406;
    err.types = normalizeTypes(keys);
    next(err);
  }

  return this;
};

/**
 * Set _Content-Disposition_ header to _attachment_ with optional `filename`.
 *
 * @param {String} filename
 * @return {ServerResponse}
 * @api public
 */

res.attachment = function(filename){
  if (filename) this.type(extname(filename));
  this.set('Content-Disposition', filename
    ? 'attachment; filename="' + basename(filename) + '"'
    : 'attachment');
  return this;
};

/**
 * Set header `field` to `val`, or pass
 * an object of header fields.
 *
 * Examples:
 *
 *    res.set('Accept', 'application/json');
 *    res.set({ Accept: 'text/plain', 'X-API-Key': 'tobi' });
 *
 * Aliased as `res.header()`. 
 *
 * @param {String|Object} field
 * @param {String} val
 * @return {ServerResponse} for chaining
 * @api public
 */

res.set = 
res.header = function(field, val){
  if (2 == arguments.length) {
    this.setHeader(field, '' + val);
  } else {
    for (var key in field) {
      this.setHeader(key, '' + field[key]);
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
 * Clear cookie `name`.
 *
 * @param {String} name
 * @param {Object} options
 * @param {ServerResponse} for chaining
 * @api public
 */

res.clearCookie = function(name, options){
  var opts = { expires: new Date(1), path: '/' };
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
 *    - `signed`   sign the cookie
 *    - `path`     defaults to "/"
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
 * @param {String|Object} val
 * @param {Options} options
 * @api public
 */

res.cookie = function(name, val, options){
  options = options || {};
  var secret = this.req.secret;
  var signed = options.signed;
  if (signed && !secret) throw new Error('connect.cookieParser("secret") required for signed cookies');
  if ('object' == typeof val) val = 'j:' + JSON.stringify(val);
  if (signed) val = utils.sign(val, secret);
  if ('maxAge' in options) options.expires = new Date(Date.now() + options.maxAge);
  if (null == options.path) options.path = '/';
  this.set('Set-Cookie', cookie.serialize(name, String(val), options));
  return this;
};

/**
 * Redirect to the given `url` with optional response `status`
 * defaulting to 302.
 *
 * The given `url` can also be the name of a mapped url, for
 * example by default express supports "back" which redirects
 * to the _Referrer_ or _Referer_ headers or "/".
 *
 * Examples:
 *
 *    res.redirect('/foo/bar');
 *    res.redirect('http://example.com');
 *    res.redirect(301, 'http://example.com');
 *    res.redirect('../login'); // /blog/post/1 -> /blog/login
 *
 * Mounting:
 *
 *   When an application is mounted, and `res.redirect()`
 *   is given a path that does _not_ lead with "/". For 
 *   example suppose a "blog" app is mounted at "/blog",
 *   the following redirect would result in "/blog/login":
 *
 *      res.redirect('login');
 *
 *   While the leading slash would result in a redirect to "/login":
 *
 *      res.redirect('/login');
 *
 * @param {String} url
 * @param {Number} code
 * @api public
 */

res.redirect = function(url){
  var app = this.app
    , req = this.req
    , head = 'HEAD' == req.method
    , status = 302
    , body;

  // allow status / url
  if (2 == arguments.length) {
    status = url;
    url = arguments[1];
  }

  // setup redirect map
  var map = { back: req.get('Referrer') || '/' };

  // perform redirect
  url = map[url] || url;

  // relative
  if (!~url.indexOf('://')) {
    var path = app.path();

    // relative to path
    if ('.' == url[0]) {
      url = req.path + '/' + url;
    // relative to mount-point
    } else if ('/' != url[0]) {
      url = path + '/' + url;
    }

    // Absolute
    var host = req.get('Host');
    url = req.protocol + '://' + host + url;
  }

  // Support text/{plain,html} by default
  this.format({
    text: function(){
      body = statusCodes[status] + '. Redirecting to ' + url;
    },

    html: function(){
      body = '<p>' + statusCodes[status] + '. Redirecting to <a href="' + url + '">' + url + '</a></p>';
    },

    default: function(){
      body = '';
    }
  });

  // Respond
  this.statusCode = status;
  this.set('Location', url);
  this.set('Content-Length', Buffer.byteLength(body));
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

    // default callback to respond
    fn = fn || function(err, str){
      if (err) return req.next(err);
      self.send(str);
    };

    // render
    app.render(view, options, fn);
  }

  // invoke view callbacks
  var callbacks = app.viewCallbacks.concat(self.viewCallbacks)
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