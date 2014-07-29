/**
 * Module dependencies.
 */

var finalhandler = require('finalhandler');
var mixin = require('utils-merge');
var Router = require('./router');
var methods = require('methods');
var debug = require('debug')('express:application');
var View = require('./view');
var http = require('http');
var compileETag = require('./utils').compileETag;
var compileQueryParser = require('./utils').compileQueryParser;
var compileTrust = require('./utils').compileTrust;
var deprecate = require('depd')('express');
var resolve = require('path').resolve;

/**
 * Application prototype.
 */

var app = exports = module.exports = {};

/**
 * Initialize the server.
 *
 *   - setup default configuration
 *   - setup default middleware
 *   - setup route reflection methods
 *
 * @api private
 */

app.init = function(){
  var router = null;

  this.cache = {};
  this.engines = {};

  this.settings = new Settings();

  this.defaultConfiguration();

  // Setup getting to lazily add base router
  Object.defineProperty(this, 'router', {
    configurable: true,
    enumerable: true,
    get: function getrouter() {
      if (router === null) {
        router = new Router({
          caseSensitive: this.enabled('case sensitive routing'),
          strict: this.enabled('strict routing')
        });
      }

      return router;
    }
  });
};

/**
 * Initialize application configuration.
 *
 * @api private
 */

app.defaultConfiguration = function(){
  // default settings
  this.enable('x-powered-by');
  this.settings.set('etag', 'weak');
  var env = process.env.NODE_ENV || 'development';
  this.settings.set('env', env);
  this.settings.set('query parser', 'extended');
  this.settings.set('subdomain offset', 2);
  this.settings.set('trust proxy', false);

  debug('booting in %s mode', env);

  // inherit protos
  this.on('mount', function(parent){
    this.request.__proto__ = parent.request;
    this.response.__proto__ = parent.response;
    this.engines.__proto__ = parent.engines;
    this.settings.__proto__ = parent.settings;
  });

  // setup locals
  this.locals = Object.create(null);

  // top-most app is mounted at /
  this.mountpath = '/';

  // default locals
  this.locals.settings = new Settings(this.settings());

  // default configuration
  this.settings.set('view', View);
  this.settings.set('views', resolve('views'));
  this.settings.set('jsonp callback name', 'callback');

  if (env === 'production') {
    this.enable('view cache');
  }
};

/**
 * Dispatch a req, res pair into the application. Starts pipeline processing.
 *
 * If no _done_ callback is provided, then default error handlers will respond
 * in the event of an error bubbling through the stack.
 *
 * @api private
 */

app.handle = function(req, res, done) {
  // final handler
  done = done || finalhandler(req, res, {
    env: this.settings.get('env'),
    onerror: logerror.bind(this)
  });

  // set powered by header
  if (this.enabled('x-powered-by')) {
    res.setHeader('X-Powered-By', 'Express');
  }

  // set circular references
  req.res = res;
  res.req = req;

  // alter the prototypes
  req.__proto__ = this.request;
  res.__proto__ = this.response;

  // setup locals
  if (!res.locals) {
    res.locals = Object.create(null);
  }

  this.router.handle(req, res, done);
};

/**
 * Proxy `Router#use()` to add middleware to the app router.
 * See Router#use() documentation for details.
 *
 * If the _fn_ parameter is an express app, then it will be
 * mounted at the _route_ specified.
 *
 * @api public
 */

app.use = function use(path, fn) {
  var mount_app;
  var mount_path;

  // check for .use(path, app) or .use(app) signature
  if (arguments.length <= 2) {
    mount_path = typeof path === 'string'
      ? path
      : '/';
    mount_app = typeof path === 'function'
      ? path
      : fn;
  }

  // get router
  var router = this.router;

  // express app
  if (mount_app && mount_app.handle && mount_app.settings) {
    debug('.use app under %s', mount_path);
    mount_app.mountpath = mount_path;
    mount_app.parent = this;

    mount_app.settings = new Settings(mount_app.settings(), this.settings());

    // restore .app property on req and res
    router.use(mount_path, function mounted_app(req, res, next) {
      var orig = req.app;
      mount_app.handle(req, res, function(err) {
        req.__proto__ = orig.request;
        res.__proto__ = orig.response;
        next(err);
      });
    });

    // mounted an app
    mount_app.emit('mount', this);

    return this;
  }

  // pass-through use
  router.use.apply(router, arguments);

  return this;
};

/**
 * Proxy to the app `Router#route()`
 * Returns a new `Route` instance for the _path_.
 *
 * Routes are isolated middleware stacks for specific paths.
 * See the Route api docs for details.
 *
 * @api public
 */

app.route = function route(path) {
  return this.router.route(path);
};

/**
 * Register the given template engine callback `fn`
 * as `ext`.
 *
 * By default will `require()` the engine based on the
 * file extension. For example if you try to render
 * a "foo.jade" file Express will invoke the following internally:
 *
 *     app.engine('jade', require('jade').__express);
 *
 * For engines that do not provide `.__express` out of the box,
 * or if you wish to "map" a different extension to the template engine
 * you may use this method. For example mapping the EJS template engine to
 * ".html" files:
 *
 *     app.engine('html', require('ejs').renderFile);
 *
 * In this case EJS provides a `.renderFile()` method with
 * the same signature that Express expects: `(path, options, callback)`,
 * though note that it aliases this method as `ejs.__express` internally
 * so if you're using ".ejs" extensions you dont need to do anything.
 *
 * Some template engines do not follow this convention, the
 * [Consolidate.js](https://github.com/visionmedia/consolidate.js)
 * library was created to map all of node's popular template
 * engines to follow this convention, thus allowing them to
 * work seamlessly within Express.
 *
 * @param {String} ext
 * @param {Function} fn
 * @return {app} for chaining
 * @api public
 */

app.engine = function(ext, fn){
  if ('function' != typeof fn) throw new Error('callback function required');
  if ('.' != ext[0]) ext = '.' + ext;
  this.engines[ext] = fn;
  return this;
};

/**
 * Proxy to `Router#param()` with one added api feature. The _name_ parameter
 * can be an array of names.
 *
 * See the Router#param() docs for more details.
 *
 * @param {String|Array} name
 * @param {Function} fn
 * @return {app} for chaining
 * @api public
 */

app.param = function param(name, fn) {
  if (Array.isArray(name)) {
    for (var i = 0; i < name.length; i++) {
      this.param(name[i], fn);
    }
    return this;
  }

  this.router.param(name, fn);
  return this;
};

/**
 *
 * @param {Object} set1 - Setting object to use as default
 * @param {Object} set2 - Setting object to merge into the prior
 * @returns {method} - Setter and getter functions
 * @constructor
 */
var Settings = function (set1, set2) {
  var $settings = (arguments.length > 1) ? mixin(Object.create(set2) || {}, Object.create(set1) || {}) : set1 || {},

  method = function () {
    if (arguments.length === 1) return method.get.apply(this, arguments);
    else if (arguments.length === 2) return method.set.apply(this, arguments);
    else return $settings;
  };

  method.set = function (name, value) {
    $settings[name] = value;

    // FIXME This should be decoupled from the setter
    switch (name) {
      case 'etag':
        debug('compile etag %s', value);
        method.set('etag fn', compileETag(value));
        break;
      case 'query parser':
        debug('compile query parser %s', value);
        method.set('query parser fn', compileQueryParser(value));
        break;
      case 'trust proxy':
        debug('compile trust proxy %s', value);
        method.set('trust proxy fn', compileTrust(value));
        break;
    }

    return $settings;
  };

  method.get = function (name) {
    return $settings[name];
  };

  return method;
};


/**
 * Return the app's absolute pathname
 * based on the parent(s) that have
 * mounted it.
 *
 * For example if the application was
 * mounted as "/admin", which itself
 * was mounted as "/blog" then the
 * return value would be "/blog/admin".
 *
 * @return {String}
 * @api private
 */

app.path = function(){
  return this.parent
    ? this.parent.path() + this.mountpath
    : '';
};

/**
 * Check if `setting` is enabled (truthy).
 *
 *    app.enabled('foo')
 *    // => false
 *
 *    app.enable('foo')
 *    app.enabled('foo')
 *    // => true
 *
 * @param {String} setting
 * @return {Boolean}
 * @api public
 */

app.enabled = function(setting){
  return !!this.settings.get(setting);
};

/**
 * Check if `setting` is disabled.
 *
 *    app.disabled('foo')
 *    // => true
 *
 *    app.enable('foo')
 *    app.disabled('foo')
 *    // => false
 *
 * @param {String} setting
 * @return {Boolean}
 * @api public
 */

app.disabled = function(setting){
  return !this.settings.get(setting);
};

/**
 * Enable `setting`.
 *
 * @param {String} setting
 * @return {app} for chaining
 * @api public
 */

app.enable = function(setting){
  return this.settings.set(setting, true);
};

/**
 * Disable `setting`.
 *
 * @param {String} setting
 * @return {app} for chaining
 * @api public
 */

app.disable = function(setting){
  return this.settings.set(setting, false);
};

/**
 * Delegate `.VERB(...)` calls to `router.VERB(...)`.
 */

methods.forEach(function(method){
  app[method] = function(path){
    var route = this.route(path);
    route[method].apply(route, [].slice.call(arguments, 1));
    return this;
  };
});

/**
 * Special-cased "all" method, applying the given route `path`,
 * middleware, and callback to _every_ HTTP method.
 *
 * @param {String} path
 * @param {Function} ...
 * @return {app} for chaining
 * @api public
 */

app.all = function(path){
  var route = this.route(path);
  var args = [].slice.call(arguments, 1);
  methods.forEach(function(method){
    route[method].apply(route, args);
  });

  return this;
};

// del -> delete alias

app.del = deprecate.function(app.delete, 'app.del: Use app.delete instead');

/**
 * Render the given view `name` name with `options`
 * and a callback accepting an error and the
 * rendered template string.
 *
 * Example:
 *
 *    app.render('email', { name: 'Tobi' }, function(err, html){
 *      // ...
 *    })
 *
 * @param {String} name
 * @param {String|Function} options or fn
 * @param {Function} fn
 * @api public
 */

app.render = function(name, options, fn){
  var opts = {};
  var cache = this.cache;
  var engines = this.engines;
  var view;

  // support callback function as second arg
  if ('function' == typeof options) {
    fn = options, options = {};
  }

  // merge app.locals
  mixin(opts, this.locals);

  // merge options._locals
  if (options._locals) mixin(opts, options._locals);

  // merge options
  mixin(opts, options);

  // set .cache unless explicitly provided
  opts.cache = null == opts.cache
    ? this.enabled('view cache')
    : opts.cache;

  // primed cache
  if (opts.cache) view = cache[name];

  // view
  if (!view) {
    view = new (this.settings.get('view'))(name, {
      defaultEngine: this.settings.get('view engine'),
      root: this.settings.get('views'),
      engines: engines
    });

    if (!view.path) {
      var err = new Error('Failed to lookup view "' + name + '" in views directory "' + view.root + '"');
      err.view = view;
      return fn(err);
    }

    // prime the cache
    if (opts.cache) cache[name] = view;
  }

  // render
  try {
    view.render(opts, fn);
  } catch (err) {
    fn(err);
  }
};

/**
 * Listen for connections.
 *
 * A node `http.Server` is returned, with this
 * application (which is a `Function`) as its
 * callback. If you wish to create both an HTTP
 * and HTTPS server you may do so with the "http"
 * and "https" modules as shown here:
 *
 *    var http = require('http')
 *      , https = require('https')
 *      , express = require('express')
 *      , app = express();
 *
 *    http.createServer(app).listen(80);
 *    https.createServer({ ... }, app).listen(443);
 *
 * @return {http.Server}
 * @api public
 */

app.listen = function(){
  var server = http.createServer(this);
  return server.listen.apply(server, arguments);
};

/**
* Log error using console.error.
*
* @param {Error} err
* @api public
*/

function logerror(err){
  if (this.settings.get('env') !== 'test') console.error(err.stack || err.toString());
}
