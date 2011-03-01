
/*!
 * Express - HTTPSServer
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var connect = require('connect')
  , HTTPServer = require('./http')
  , https = require('https');

/**
 * Initialize a new `HTTPSServer` with the 
 * given `options`, and optional `middleware`.
 *
 * @param {Object} options
 * @param {Array} middleware
 * @api public
 */

var Server = exports = module.exports = function HTTPSServer(options, middleware){
  var self = this;
  this.settings = {};
  this.redirects = {};
  this.isCallbacks = {};
  this.viewHelpers = {};
  this.dynamicViewHelpers = {};
  this.errorHandlers = [];
  connect.HTTPSServer.call(this, options, []);

  // Default "home" to / 
  this.set('home', '/');

  // Set "env" to NODE_ENV, defaulting to "development"
  this.set('env', process.env.NODE_ENV || 'development');

  // Expose objects to each other
  this.use(function(req, res, next){
    req.query = req.query || {};
    res.headers = { 'X-Powered-By': 'Express' };
    req.app = res.app = self;
    req.res = res;
    res.req = req;
    req.next = next;
    // Assign req.params.get
    if (req.url.indexOf('?') > 0) {
      var query = url.parse(req.url).query;
      req.query = exports.parseQueryString(query);
    }
    next();
  });

  // Apply middleware
  if (middleware) {
    middleware.forEach(function(fn){
      self.use(fn);
    });
  }

  // Use router, expose as app.get(), etc
  var fn = router(function(app){ self.routes = app; });
  this.__defineGetter__('router', function(){
    this.__usedRouter = true;
    return fn;
  });

  // Default production configuration
  this.configure('production', function(){
    this.enable('cache views');
  });
};

/**
 * Inherit from `connect.HTTPSServer`.
 */

Server.prototype.__proto__ = connect.HTTPSServer.prototype;

/**
 * Support swappable querystring parsers.
 */

exports.parseQueryString = queryString.parse;

// mixin HTTPServer methods

Object.keys(HTTPServer.prototype).forEach(function(method){
  Server.prototype[method] = HTTPServer.prototype[method];
});
