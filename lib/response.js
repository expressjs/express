/**
 * Module dependencies.
 */

var http = require('http')
  , path = require('path')
  , connect = require('connect')
  , utils = connect.utils
  , sign = require('cookie-signature').sign
  , normalizeType = require('./utils').normalizeType
  , normalizeTypes = require('./utils').normalizeTypes
  , etag = require('./utils').etag
  , statusCodes = http.STATUS_CODES
  , cookie = require('cookie')
  , send = require('send')
  , mime = connect.mime
  , resolve = require('url').resolve
  , basename = path.basename
  , extname = path.extname;

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
  var link = this.get('Link') || '';
  if (link) link += ', ';
  return this.set('Link', link + Object.keys(links).map(function(rel){
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
  var req = this.req;
  var head = 'HEAD' == req.method;
  var len;

  // settings
  var app = this.app;

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
  if (app.settings.etag && len && 'GET' == req.method) {
    if (!this.get('ETag')) {
      this.set('ETag', etag(body));
    }
  }

  // freshness
  if (req.fresh) this.statusCode = 304;

  // strip irrelevant headers
  if (204 == this.statusCode || 304 == this.statusCode) {
    this.removeHeader('Content-Type');
    this.removeHeader('Content-Length');
    this.removeHeader('Transfer-Encoding');
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
  var app = this.app;
  var replacer = app.get('json replacer');
  var spaces = app.get('json spaces');
  var body = JSON.stringify(obj, replacer, spaces);

  // content-type
  this.charset = this.charset || 'utf-8';
  this.get('Content-Type') || this.set('Content-Type', 'application/json');

  return this.send(body);
};

/**
 * Send JSON response with JSONP callback support.
 *
 * Examples:
 *
 *     res.jsonp(null);
 *     res.jsonp({ user: 'tj' });
 *     res.jsonp(500, 'oh noes!');
 *     res.jsonp(404, 'I dont have that');
 *
 * @param {Mixed} obj or status
 * @param {Mixed} obj
 * @return {ServerResponse}
 * @api public
 */

res.jsonp = function(obj){
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
  var app = this.app;
  var replacer = app.get('json replacer');
  var spaces = app.get('json spaces');
  var body = JSON.stringify(obj, replacer, spaces)
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
  var callback = this.req.query[app.get('jsonp callback name')];

  // content-type
  this.charset = this.charset || 'utf-8';
  this.set('Content-Type', 'application/json');

  // fixup callback
  if (Array.isArray(callback)) {
    callback = callback[0];
  }

  // jsonp
  if (callback && 'string' === typeof callback) {
    this.set('Content-Type', 'text/javascript');
    var cb = callback.replace(/[^\[\]\w$.]/g, '');
    body = 'typeof ' + cb + ' === \'function\' && ' + cb + '(' + body + ');';
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
    , options = options || {}
    , done;

  // support function as second arg
  if ('function' == typeof options) {
    fn = options;
    options = {};
  }

  // socket errors
  req.socket.on('error', error);

  // errors
  function error(err) {
    if (done) return;
    done = true;

    // clean up
    cleanup();
    if (!self.headerSent) self.removeHeader('Content-Disposition');

    // callback available
    if (fn) return fn(err);

    // list in limbo if there's no callback
    if (self.headerSent) return;

    // delegate
    next(err);
  }

  // streaming
  function stream(stream) {
    if (done) return;
    cleanup();
    if (fn) stream.on('end', fn);
  }

  // cleanup
  function cleanup() {
    req.socket.removeListener('error', error);
  }

  // transfer
  var file = send(req, path);
  if (options.root) file.root(options.root);
  file.maxage(options.maxAge || 0);
  file.on('error', error);
  file.on('directory', next);
  file.on('stream', stream);
  file.pipe(this);
  this.on('finish', cleanup);
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
  var req = this.req
    , next = req.next;

  var fn = obj.default;
  if (fn) delete obj.default;
  var keys = Object.keys(obj);

  var key = req.accepts(keys);

  this.vary("Accept");

  if (key) {
    var type = normalizeType(key).value;
    var charset = mime.charsets.lookup(type);
    if (charset) type += '; charset=' + charset;
    this.set('Content-Type', type);
    obj[key](req, this, next);
  } else if (fn) {
    fn();
  } else {
    var err = new Error('Not Acceptable');
    err.status = 406;
    err.types = normalizeTypes(keys).map(function(o){ return o.value });
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
 *    res.set('Foo', ['bar', 'baz']);
 *    res.set('Accept', 'application/json');
 *    res.set({ Accept: 'text/plain', 'X-API-Key': 'tobi' });
 *
 * Aliased as `res.header()`.
 *
 * @param {String|Object|Array} field
 * @param {String} val
 * @return {ServerResponse} for chaining
 * @api public
 */

res.set =
res.header = function(field, val){
  if (2 == arguments.length) {
    if (Array.isArray(val)) val = val.map(String);
    else val = String(val);
    this.setHeader(field, val);
  } else {
    for (var key in field) {
      this.set(key, field[key]);
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
  options = utils.merge({}, options);
  var secret = this.req.secret;
  var signed = options.signed;
  if (signed && !secret) throw new Error('connect.cookieParser("secret") required for signed cookies');
  if ('number' == typeof val) val = val.toString();
  if ('object' == typeof val) val = 'j:' + JSON.stringify(val);
  if (signed) val = 's:' + sign(val, secret);
  if ('maxAge' in options) {
    options.expires = new Date(Date.now() + options.maxAge);
    options.maxAge /= 1000;
  }
  if (null == options.path) options.path = '/';
  this.set('Set-Cookie', cookie.serialize(name, String(val), options));
  return this;
};


/**
 * Set the location header to `url`.
 *
 * The given `url` can also be "back", which redirects
 * to the _Referrer_ or _Referer_ headers or "/".
 *
 * Examples:
 *
 *    res.location('/foo/bar').;
 *    res.location('http://example.com');
 *    res.location('../login'); // /blog/post/1 -> /blog/login
 *
 * Mounting:
 *
 *   When an application is mounted and `res.location()`
 *   is given a path that does _not_ lead with "/" it becomes
 *   relative to the mount-point. For example if the application
 *   is mounted at "/blog", the following would become "/blog/login".
 *
 *      res.location('login');
 *
 *   While the leading slash would result in a location of "/login":
 *
 *      res.location('/login');
 *
 * @param {String} url
 * @api public
 */

res.location = function(url){
  var app = this.app
    , req = this.req
    , path;

  // "back" is an alias for the referrer
  if ('back' == url) url = req.get('Referrer') || '/';

  // relative
  if (!~url.indexOf('://') && 0 != url.indexOf('//')) {
    // relative to path
    if ('.' == url[0]) {
      path = req.originalUrl.split('?')[0];
      path = path + ('/' == path[path.length - 1] ? '' : '/');
      url = resolve(path, url);
      // relative to mount-point
    } else if ('/' != url[0]) {
      path = app.path();
      url = path + '/' + url;
    }
  }

  // Respond
  this.set('Location', url);
  return this;
};

/**
 * Redirect to the given `url` with optional response `status`
 * defaulting to 302.
 *
 * The resulting `url` is determined by `res.location()`, so
 * it will play nicely with mounted apps, relative paths,
 * `"back"` etc.
 *
 * Examples:
 *
 *    res.redirect('/foo/bar');
 *    res.redirect('http://example.com');
 *    res.redirect(301, 'http://example.com');
 *    res.redirect('http://example.com', 301);
 *    res.redirect('../login'); // /blog/post/1 -> /blog/login
 *
 * @param {String} url
 * @param {Number} code
 * @api public
 */

res.redirect = function(url){
  var head = 'HEAD' == this.req.method
    , status = 302
    , body;

  // allow status / url
  if (2 == arguments.length) {
    if ('number' == typeof url) {
      status = url;
      url = arguments[1];
    } else {
      status = arguments[1];
    }
  }

  // Set location header
  this.location(url);
  url = this.get('Location');

  // Support text/{plain,html} by default
  this.format({
    text: function(){
      body = statusCodes[status] + '. Redirecting to ' + encodeURI(url);
    },

    html: function(){
      var u = utils.escape(url);
      body = '<p>' + statusCodes[status] + '. Redirecting to <a href="' + u + '">' + u + '</a></p>';
    },

    default: function(){
      body = '';
    }
  });

  // Respond
  this.statusCode = status;
  this.set('Content-Length', Buffer.byteLength(body));
  this.end(head ? null : body);
};

/**
 * Add `field` to Vary. If already present in the Vary set, then
 * this call is simply ignored.
 *
 * @param {Array|String} field
 * @param {ServerResponse} for chaining
 * @api public
 */

res.vary = function(field){
  var self = this;

  // nothing
  if (!field) return this;

  // array
  if (Array.isArray(field)) {
    field.forEach(function(field){
      self.vary(field);
    });
    return;
  }

  var vary = this.get('Vary');

  // append
  if (vary) {
    vary = vary.split(/ *, */);
    if (!~vary.indexOf(field)) vary.push(field);
    this.set('Vary', vary.join(', '));
    return this;
  }

  // set
  this.set('Vary', field);
  return this;
};

/**
 * Render `view` with the given `options` and optional callback `fn`.
 * When a callback function is given a response will _not_ be made
 * automatically, otherwise a response of _200_ and _text/html_ is given.
 *
 * Options:
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

  // merge res.locals
  options._locals = self.locals;

  // default callback to respond
  fn = fn || function(err, str){
    if (err) return req.next(err);
    self.send(str);
  };

  // render
  app.render(view, options, fn);
};
