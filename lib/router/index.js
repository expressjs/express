/*!
 * Express - Router
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var Route = require('./route')
  , utils = require('../utils')
  , debug = require('debug')('express:router')
  , parse = require('url').parse;

/**
 * Expose `Router` constructor.
 */

exports = module.exports = Router;

/**
 * Expose HTTP methods.
 */

var methods = exports.methods = require('./methods');

/**
 * Initialize a new `Router` with the given `options`.
 * 
 * @param {Object} options
 * @api private
 */

function Router(options) {
  options = options || {};
  var self = this;
  this.map = {};
  this.params = {};
  this._params = [];
  this.caseSensitive = options.caseSensitive;
  this.strict = options.strict;

  this.middleware = function router(req, res, next){
    self._dispatch(req, res, next);
  };
}

/**
 * Register a param callback `fn` for the given `name`.
 *
 * @param {String|Function} name
 * @param {Function} fn
 * @return {Router} for chaining
 * @api public
 */

Router.prototype.param = function(name, fn){
  // param logic
  if ('function' == typeof name) {
    this._params.push(name);
    return;
  }

  // apply param functions
  var params = this._params
    , len = params.length
    , ret;

  for (var i = 0; i < len; ++i) {
    if (ret = params[i](name, fn)) {
      fn = ret;
    }
  }

  // ensure we end up with a
  // middleware function
  if ('function' != typeof fn) {
    throw new Error('invalid param() call for ' + name + ', got ' + fn);
  }

  (this.params[name] = this.params[name] || []).push(fn);
  return this;
};

/**
 * Route dispatcher aka the route "middleware".
 *
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 * @param {Function} next
 * @api private
 */

Router.prototype._dispatch = function(req, res, next){
  var params = this.params
    , self = this;

  debug('dispatching %s %s', req.method, req.url);

  // route dispatch
  (function pass(i, err){
    var paramCallbacks
      , paramIndex = 0
      , paramVal
      , route
      , keys
      , key
      , ret;

    // match next route
    function nextRoute(err) {
      pass(req._route_index + 1, err);
    }

    // match route
    req.route = route = self.match(req, i);

    // implied OPTIONS
    if (!route && 'OPTIONS' == req.method) return self._options(req, res);

    // no route
    if (!route) return next(err);
    debug('matched %s %s', route.method, route.path);

    // we have a route
    // start at param 0
    req.params = route.params;
    keys = route.keys;
    i = 0;

    // param callbacks
    function param(err) {
      paramIndex = 0;
      key = keys[i++];
      paramVal = key && req.params[key.name];
      paramCallbacks = key && params[key.name];

      try {
        if ('route' == err) {
          nextRoute();
        } else if (err) {
          i = 0;
          callbacks(err);
        } else if (paramCallbacks && undefined !== paramVal) {
          paramCallback();
        } else if (key) {
          param();
        } else {
          i = 0;
          callbacks();
        }
      } catch (err) {
        param(err);
      }
    };

    param(err);
    
    // single param callbacks
    function paramCallback(err) {
      var fn = paramCallbacks[paramIndex++];
      if (err || !fn) return param(err);
      fn(req, res, paramCallback, paramVal, key.name);
    }

    // invoke route callbacks
    function callbacks(err) {
      var fn = route.callbacks[i++];
      try {
        if ('route' == err) {
          nextRoute();
        } else if (err && fn) {
          if (fn.length < 4) return callbacks(err);
          fn(err, req, res, callbacks);
        } else if (fn) {
          fn(req, res, callbacks);
        } else {
          nextRoute(err);
        }
      } catch (err) {
        callbacks(err);
      }
    }
  })(0);
};

/**
 * Respond to __OPTIONS__ method.
 *
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 * @api private
 */

Router.prototype._options = function(req, res){
  var path = parse(req.url).pathname
    , body = this._optionsFor(path).join(',');
  res.set('Allow', body).send(body);
};

/**
 * Return an array of HTTP verbs or "options" for `path`.
 *
 * @param {String} path
 * @return {Array}
 * @api private
 */

Router.prototype._optionsFor = function(path){
  var self = this;
  return methods.filter(function(method){
    var routes = self.map[method];
    if (!routes || 'options' == method) return;
    for (var i = 0, len = routes.length; i < len; ++i) {
      if (routes[i].match(path)) return true;
    }
  }).map(function(method){
    return method.toUpperCase();
  });
};

/**
 * Attempt to match a route for `req`
 * with optional starting index of `i`
 * defaulting to 0.
 *
 * @param {IncomingMessage} req
 * @param {Number} i
 * @return {Route}
 * @api private
 */

Router.prototype.match = function(req, i, head){
  var method = req.method.toLowerCase()
    , url = parse(req.url)
    , path = url.pathname
    , routes = this.map
    , i = i || 0
    , route;

  // HEAD support
  // TODO: clean this up
  if (!head && 'head' == method) {
    // attempt lookup
    route = this.match(req, i, true);
    if (route) return route;

    // default to GET as res.render() / res.send()
    // etc support HEAD
     method = 'get';
  }

  // routes for this method
  if (routes = routes[method]) {

    // matching routes
    for (var len = routes.length; i < len; ++i) {
      route = routes[i];
      if (route.match(path)) {
        req._route_index = i;
        return route;
      }
    }
  }
};

/**
 * Route `method`, `path`, and one or more callbacks.
 *
 * @param {String} method
 * @param {String} path
 * @param {Function} callback...
 * @return {Router} for chaining
 * @api private
 */

Router.prototype.route = function(method, path, callbacks){
  var method = method.toLowerCase()
    , callbacks = utils.flatten([].slice.call(arguments, 2));

  // ensure path was given
  if (!path) throw new Error('Router#' + method + '() requires a path');

  // create the route
  debug('defined %s %s', method, path);
  var route = new Route(method, path, callbacks, {
      sensitive: this.caseSensitive
    , strict: this.strict
  });

  // add it
  (this.map[method] = this.map[method] || []).push(route);
  return this;
};
