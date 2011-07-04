
/*!
 * Express - HTTPServer
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var qs = require('qs')
  , connect = require('connect')
  , router = require('./router')
  , Router = require('./router')
  , view = require('./view')
  , toArray = require('./utils').toArray
  , methods = router.methods.concat('del', 'all')
  , url = require('url')
  , utils = connect.utils;

/**
 * Expose `HTTPServer`.
 */

exports = module.exports = HTTPServer;

/**
 * Server proto.
 */

var app = HTTPServer.prototype;

/**
 * Initialize a new `HTTPServer` with optional `middleware`.
 *
 * @param {Array} middleware
 * @api public
 */

function HTTPServer(middleware){
  connect.HTTPServer.call(this, []);
  this.init(middleware);
};

/**
 * Inherit from `connect.HTTPServer`.
 */

app.__proto__ = connect.HTTPServer.prototype;

/**
 * Initialize the server.
 *
 * @param {Array} middleware
 * @api private
 */

app.init = function(middleware){
  var self = this;
  this.cache = {};
  this.settings = {};
  this.redirects = {};
  this.isCallbacks = {};
  this._locals = {};
  this.dynamicViewHelpers = {};
  this.errorHandlers = [];

  this.set('home', '/');
  this.set('env', process.env.NODE_ENV || 'development');

  // expose objects to each other
  this.use(function(req, res, next){
    req.query = req.query || {};
    res.setHeader('X-Powered-By', 'Express');
    req.app = res.app = self;
    req.res = res;
    res.req = req;
    req.next = next;
    // assign req.query
    if (req.url.indexOf('?') > 0) {
      var query = url.parse(req.url).query;
      req.query = qs.parse(query);
    }
    next();
  });

  // apply middleware
  if (middleware) middleware.forEach(self.use.bind(self));

  // router
  this.routes = new Router(this);
  this.__defineGetter__('router', function(){
    this.__usedRouter = true;
    return self.routes.middleware;
  });

  // default locals
  this.locals({
      settings: this.settings
    , app: this
  });

  // default development configuration
  this.configure('development', function(){
    this.enable('hints');
  });

  // default production configuration
  this.configure('production', function(){
    this.enable('view cache');
  });

  // register error handlers on "listening"
  // so that they disregard definition position.
  this.on('listening', this.registerErrorHandlers.bind(this));

  // route manipulation methods
  methods.forEach(function(method){
    self.lookup[method] = function(path){
      return self.routes.lookup(method, path);
    };

    self.match[method] = function(path){
      return self.routes.match(method, path);
    };

    self.remove[method] = function(path){
      return self.routes.lookup(method, path).remove();
    };
  });

  // del -> delete
  self.lookup.del = self.lookup.delete;
  self.match.del = self.match.delete;
  self.remove.del = self.remove.delete;
};

/**
 * Remove routes matching the given `path`.
 *
 * @param {Route} path
 * @return {Boolean}
 * @api public
 */

app.remove = function(path){
  return this.routes.lookup('all', path).remove();
};

/**
 * Lookup routes defined with a path
 * equivalent to `path`.
 *
 * @param {Stirng} path
 * @return {Array}
 * @api public
 */

app.lookup = function(path){
  return this.routes.lookup('all', path);
};

/**
 * Lookup routes matching the given `url`.
 *
 * @param {Stirng} url
 * @return {Array}
 * @api public
 */

app.match = function(url){
  return this.routes.match('all', url);
};

/**
 * When using the vhost() middleware register error handlers.
 */

app.onvhost = function(){
  this.registerErrorHandlers();
};

/**
 * Register error handlers.
 *
 * @return {Server} for chaining
 * @api public
 */

app.registerErrorHandlers = function(){
  this.errorHandlers.forEach(function(fn){
    this.use(function(err, req, res, next){
      fn.apply(this, arguments);
    });
  }, this);
  return this;
};

/**
 * Proxy `connect.HTTPServer#use()` to apply settings to
 * mounted applications.
 *
 * @param {String|Function|Server} route
 * @param {Function|Server} middleware
 * @return {Server} for chaining
 * @api public
 */

app.use = function(route, middleware){
  var app, home, handle;

  if ('string' != typeof route) {
    middleware = route, route = '/';
  }

  // express app
  if (middleware.handle && middleware.set) app = middleware;

  // restore .app property on req and res
  if (app) {
    app.route = route;
    middleware = function(req, res, next) {
      var orig = req.app;
      app.handle(req, res, function(err){
        req.app = res.app = orig;
        next(err);
      });
    };
  }

  connect.HTTPServer.prototype.use.call(this, route, middleware);

  // mounted an app, invoke the hook
  // and adjust some settings
  if (app) {
    home = app.set('home');
    if ('/' == home) home = '';
    app.set('home', app.route + home);
    app.parent = this;
    if (app.__mounted) app.__mounted.call(app, this);
  }

  return this;
};

/**
 * Assign a callback `fn` which is called
 * when this `Server` is passed to `Server#use()`.
 *
 * Examples:
 *
 *    var app = express.createServer()
 *      , blog = express.createServer();
 *
 *    blog.mounted(function(parent){
 *      // parent is app
 *      // "this" is blog
 *    });
 *
 *    app.use(blog);
 *
 * @param {Function} fn
 * @return {Server} for chaining
 * @api public
 */

app.mounted = function(fn){
  this.__mounted = fn;
  return this;
};

/**
 * See: view.register.
 *
 * @return {Server} for chaining
 * @api public
 */

app.register = function(){
  view.register.apply(this, arguments);
  return this;
};

/**
 * Register the given view helpers `obj`. This method
 * can be called several times to apply additional helpers.
 *
 * @param {Object} obj
 * @return {Server} for chaining
 * @api public
 */

app.helpers =
app.locals = function(obj){
  utils.merge(this._locals, obj);
  return this;
};

/**
 * Register the given dynamic view helpers `obj`. This method
 * can be called several times to apply additional helpers.
 *
 * @param {Object} obj
 * @return {Server} for chaining
 * @api public
 */

app.dynamicHelpers = function(obj){
  utils.merge(this.dynamicViewHelpers, obj);
  return this;
};

/**
 * Map the given param placeholder `name`(s) to the given callback `fn`.
 *
 * Param mapping is used to provide pre-conditions to routes
 * which us normalized placeholders. This callback has the same
 * signature as regular middleware, for example below when ":userId"
 * is used this function will be invoked in an attempt to load the user.
 *
 *      app.param('userId', function(req, res, next, id){
 *        User.find(id, function(err, user){
 *          if (err) {
 *            next(err);
 *          } else if (user) {
 *            req.user = user;
 *            next();
 *          } else {
 *            next(new Error('failed to load user'));
 *          }
 *        });
 *      });
 *
 * @param {String|Array|Function} name
 * @param {Function} fn
 * @return {Server} for chaining
 * @api public
 */

app.param = function(name, fn){
  // array
  if (Array.isArray(name)) {
    name.forEach(function(name){
      this.param(name, fn);
    }, this);
  // param logic
  } else if ('function' == typeof name) {
    this.routes.param(name);
  // single
  } else {
    if (':' == name[0]) name = name.substr(1);
    this.routes.param(name, fn);
  }

  return this;
};

/**
 * Assign a custom exception handler callback `fn`.
 * These handlers are always _last_ in the middleware stack.
 *
 * @param {Function} fn
 * @return {Server} for chaining
 * @api public
 */

app.error = function(fn){
  this.errorHandlers.push(fn);
  return this;
};

/**
 * Register the given callback `fn` for the given `type`.
 *
 * @param {String} type
 * @param {Function} fn
 * @return {Server} for chaining
 * @api public
 */

app.is = function(type, fn){
  if (!fn) return this.isCallbacks[type];
  this.isCallbacks[type] = fn;
  return this;
};

/**
 * Assign `setting` to `val`, or return `setting`'s value.
 * Mounted servers inherit their parent server's settings.
 *
 * @param {String} setting
 * @param {String} val
 * @return {Server|Mixed} for chaining, or the setting value
 * @api public
 */

app.set = function(setting, val){
  if (val === undefined) {
    if (this.settings.hasOwnProperty(setting)) {
      return this.settings[setting];
    } else if (this.parent) {
      return this.parent.set(setting);
    }
  } else {
    this.settings[setting] = val;
    return this;
  }
};

/**
 * Check if `setting` is enabled.
 *
 * @param {String} setting
 * @return {Boolean}
 * @api public
 */

app.enabled = function(setting){
  return !!this.set(setting);
};

/**
 * Check if `setting` is disabled.
 *
 * @param {String} setting
 * @return {Boolean}
 * @api public
 */

app.disabled = function(setting){
  return !this.set(setting);
};

/**
 * Enable `setting`.
 *
 * @param {String} setting
 * @return {Server} for chaining
 * @api public
 */

app.enable = function(setting){
  return this.set(setting, true);
};

/**
 * Disable `setting`.
 *
 * @param {String} setting
 * @return {Server} for chaining
 * @api public
 */

app.disable = function(setting){
  return this.set(setting, false);
};

/**
 * Redirect `key` to `url`.
 *
 * @param {String} key
 * @param {String} url
 * @return {Server} for chaining
 * @api public
 */

app.redirect = function(key, url){
  this.redirects[key] = url;
  return this;
};

/**
 * Configure callback for zero or more envs,
 * when no env is specified that callback will
 * be invoked for all environments. Any combination
 * can be used multiple times, in any order desired.
 *
 * Examples:
 *
 *    app.configure(function(){
 *      // executed for all envs
 *    });
 *
 *    app.configure('stage', function(){
 *      // executed staging env
 *    });
 *
 *    app.configure('stage', 'production', function(){
 *      // executed for stage and production
 *    });
 *
 * @param {String} env...
 * @param {Function} fn
 * @return {Server} for chaining
 * @api public
 */

app.configure = function(env, fn){
  var envs = 'all'
    , args = toArray(arguments);
  fn = args.pop();
  if (args.length) envs = args;
  if ('all' == envs || ~envs.indexOf(this.settings.env)) fn.call(this);
  return this;
};

/**
 * Delegate `.VERB(...)` calls to `.route(VERB, ...)`.
 */

methods.forEach(function(method){
  app[method] = function(path){
    if (1 == arguments.length) return this.routes.lookup(method, path);
    var args = [method].concat(toArray(arguments));
    if (!this.__usedRouter) this.use(this.router);
    return this.routes._route.apply(this.routes, args);
  }
});

/**
 * Special-cased "all" method, applying the given route `path`,
 * middleware, and callback to _every_ HTTP method.
 *
 * @param {String} path
 * @param {Function} ...
 * @return {Server} for chaining
 * @api public
 */

app.all = function(path){
  var args = arguments;
  if (1 == args.length) return this.routes.lookup('all', path);
  methods.forEach(function(method){
    if ('all' == method) return;
    app[method].apply(this, args);
  }, this);
  return this;
};

// del -> delete alias

app.del = app.delete;

