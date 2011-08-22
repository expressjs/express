
/*!
 * Express - Router
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var Route = require('./route')
  , Collection = require('./collection')
  , utils = require('../utils')
  , parse = require('url').parse
  , toArray = utils.toArray;

/**
 * Expose `Router` constructor.
 */

exports = module.exports = Router;

/**
 * Expose HTTP methods.
 */

var methods = exports.methods = require('./methods');

/**
 * Initialize a new `Router` with the given `app`.
 * 
 * @param {express.HTTPServer} app
 * @api private
 */

function Router(app) {
  var self = this;
  this.app = app;
  this.routes = {};
  this.params = {};
  this._params = [];

  this.middleware = function(req, res, next){
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
 * Return a `Collection` of all routes defined.
 *
 * @return {Collection}
 * @api public
 */

Router.prototype.all = function(){
  return this.find(function(){
    return true;
  });
};

/**
 * Remove the given `route`, returns
 * a bool indicating if the route was present
 * or not.
 *
 * @param {Route} route
 * @return {Boolean}
 * @api public
 */

Router.prototype.remove = function(route){
  var routes = this.routes[route.method]
    , len = routes.length;

  for (var i = 0; i < len; ++i) {
    if (route == routes[i]) {
      routes.splice(i, 1);
      return true;
    }
  }
};

/**
 * Return routes with route paths matching `path`.
 *
 * @param {String} method
 * @param {String} path
 * @return {Collection}
 * @api public
 */

Router.prototype.lookup = function(method, path){
  return this.find(function(route){
    return path == route.path
      && (route.method == method
      || method == 'all');
  });
};

/**
 * Return routes with regexps that match the given `url`.
 *
 * @param {String} method
 * @param {String} url
 * @return {Collection}
 * @api public
 */

Router.prototype.match = function(method, url){
  return this.find(function(route){
    return route.match(url)
      && (route.method == method
      || method == 'all');
  });
};

/**
 * Find routes based on the return value of `fn`
 * which is invoked once per route.
 *
 * @param {Function} fn
 * @return {Collection}
 * @api public
 */

Router.prototype.find = function(fn){
  var len = methods.length
    , ret = new Collection(this)
    , method
    , routes
    , route;

  for (var i = 0; i < len; ++i) {
    method = methods[i];
    routes = this.routes[method];
    if (!routes) continue;
    for (var j = 0, jlen = routes.length; j < jlen; ++j) {
      route = routes[j];
      if (fn(route)) ret.push(route);
    }
  }

  return ret;
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
    req.route = route = self._match(req, i);

    // implied OPTIONS
    if (!route && 'OPTIONS' == req.method) return self._options(req, res);

    // no route
    if (!route) return next(err);

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
  res.send(body, { Allow: body });
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
    var routes = self.routes[method];
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
 * starting from offset `i`.
 *
 * @param {IncomingMessage} req
 * @param {Number} i
 * @return {Route}
 * @api private
 */

Router.prototype._match = function(req, i){
  var method = req.method.toLowerCase()
    , url = parse(req.url)
    , path = url.pathname
    , routes = this.routes
    , captures
    , route
    , keys;

  // pass HEAD to GET routes
  if ('head' == method) method = 'get';

  // routes for this method
  if (routes = routes[method]) {

    // matching routes
    for (var len = routes.length; i < len; ++i) {
      route = routes[i];
      if (captures = route.match(path)) {
        keys = route.keys;
        route.params = [];

        // params from capture groups
        for (var j = 1, jlen = captures.length; j < jlen; ++j) {
          var key = keys[j-1]
            , val = 'string' == typeof captures[j]
              ? decodeURIComponent(captures[j])
              : captures[j];
          if (key) {
            route.params[key.name] = val;
          } else {
            route.params.push(val);
          }
        }

        // all done
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

Router.prototype._route = function(method, path, callbacks){
  var app = this.app
    , callbacks = utils.flatten(toArray(arguments, 2));

  // ensure path was given
  if (!path) throw new Error('app.' + method + '() requires a path');

  // create the route
  var route = new Route(method, path, callbacks, {
      sensitive: app.enabled('case sensitive routes')
    , strict: app.enabled('strict routing')
  });

  // add it
  (this.routes[method] = this.routes[method] || [])
    .push(route);
  return this;
};
