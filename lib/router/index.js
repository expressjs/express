
/*!
 * Express - router
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var utils = require('../utils')
  , parse = require('url').parse
  , _methods = require('./methods')
  , Route = require('./route');

/**
 * Expose router.
 */

exports = module.exports = router;

/**
 * Expose methods.
 */

exports.methods = _methods;

/**
 * Provides Sinatra-like routing capabilities.
 *
 * @param {Function} fn
 * @return {Function}
 * @api private
 */

function router(fn){
  var self = this
    , methods = {}
    , routes = {}
    , params = {};

  if (!fn) throw new Error('router provider requires a callback function');

  // Generate method functions
  _methods.forEach(function(method){
    methods[method] = generateMethodFunction(method.toUpperCase());
  });

  // Alias del -> delete
  methods.del = methods.delete;

  // Apply callback to all methods
  methods.all = function(){
    var args = arguments;
    _methods.forEach(function(name){
      methods[name].apply(this, args);
    });
    return self;
  };

  // Register param callback
  methods.param = function(name, fn){
    params[name] = fn;
  };
      
  fn.call(this, methods);

  function generateMethodFunction(name) {
    var localRoutes = routes[name] = routes[name] || [];
    return function(path, fn){
      var keys = []
        , middleware = [];

      // slice middleware
      if (arguments.length > 2) {
        middleware = Array.prototype.slice.call(arguments, 1, arguments.length);
        fn = middleware.pop();
        middleware = utils.flatten(middleware);
      }

      fn.middleware = middleware;

      if (!path) throw new Error(name + ' route requires a path');
      if (!fn) throw new Error(name + ' route ' + path + ' requires a callback');

      var route = new Route(name, path, fn);
      localRoutes.push(route);
      return self;
    };
  }

  function router(req, res, next){
    var route
      , self = this;

    (function pass(i){
      if (route = match(req, routes, i)) {
        var i = 0
          , keys = route.keys;

        req.params = route.params;

        // Param preconditions
        (function param(err) {
          try {
            var key = keys[i++]
              , val = req.params[key]
              , fn = params[key];

            if ('route' == err) {
              pass(req._route_index + 1);
            // Error
            } else if (err) {
              next(err);
            // Param has callback
            } else if (fn) {
              // Return style
              if (1 == fn.length) {
                req.params[key] = fn(val);
                param();
              // Middleware style
              } else {
                fn(req, res, param, val);
              }
            // Finished processing params
            } else if (!key) {
              // route middleware
              i = 0;
              (function nextMiddleware(err){
                var fn = route.callback.middleware[i++];
                if ('route' == err) {
                  pass(req._route_index + 1);
                } else if (err) {
                  next(err);
                } else if (fn) {
                  fn(req, res, nextMiddleware);
                } else {
                  route.callback.call(self, req, res, function(err){
                    if (err) {
                      next(err);
                    } else {
                      pass(req._route_index + 1);
                    }
                  });
                }
              })();
            // More params
            } else {
              param();
            }
          } catch (err) {
            next(err);
          }
        })();
      } else if ('OPTIONS' == req.method) {
        options(req, res, routes);
      } else {
        next();
      }
    })();
  };

  router.remove = function(path, method, ret){
    var ret = ret || []
      , route;

    // method specific remove
    if (method) {
      method = method.toUpperCase();
      if (routes[method]) {
        for (var i = 0; i < routes[method].length; ++i) {
          route = routes[method][i];
          if (path == route.path) {
            route.index = i;
            routes[method].splice(i, 1);
            ret.push(route);
            --i;
          }
        }
      }
    // global remove
    } else {
      _methods.forEach(function(method){
        router.remove(path, method, ret);
      });
    }

    return ret;
  };

  router.lookup = function(path, method, ret){
    ret = ret || [];

    // method specific lookup
    if (method) {
      method = method.toUpperCase();
      if (routes[method]) {
        routes[method].forEach(function(route, i){
          if (path == route.path) {
            route.index = i;
            ret.push(route);
          }
        });
      }
    // global lookup
    } else {
      _methods.forEach(function(method){
        router.lookup(path, method, ret);
      });
    }

    return ret;
  };

  router.match = function(url, method, ret){
    var ret = ret || []
      , i = 0
      , route
      , req;

    // method specific matches
    if (method) {
      method = method.toUpperCase();
      req = { url: url, method: method };
      while (route = match(req, routes, i)) {
        i = req._route_index + 1;
        route.index = i;
        ret.push(route);
      } 
    // global matches
    } else {
      _methods.forEach(function(method){
        router.match(url, method, ret);
      });
    }

    return ret;
  };

  return router;
}

/**
 * Respond to OPTIONS.
 *
 * @param {ServerRequest} req
 * @param {ServerResponse} req
 * @param {Array} routes
 * @api private
 */

function options(req, res, routes) {
  var pathname = parse(req.url).pathname
    , body = optionsFor(pathname, routes).join(',');
  res.send(body, { Allow: body });
}

/**
 * Return OPTIONS array for the given `path`, matching `routes`.
 *
 * @param {String} path
 * @param {Array} routes
 * @return {Array}
 * @api private
 */

function optionsFor(path, routes) {
  return _methods.filter(function(method){
    var arr = routes[method.toUpperCase()];
    for (var i = 0, len = arr.length; i < len; ++i) {
      if (arr[i].regexp.test(path)) return true;
    }
  }).map(function(method){
    return method.toUpperCase();
  });
}

/**
 * Attempt to match the given request to
 * one of the routes. When successful
 * a route function is returned.
 *
 * @param  {ServerRequest} req
 * @param  {Object} routes
 * @return {Function}
 * @api private
 */

function match(req, routes, i) {
  var captures
    , method = req.method
    , i = i || 0;

  // pass HEAD to GET routes
  if ('HEAD' == method) method = 'GET';

  // routes for this method
  if (routes = routes[method]) {
    var url = parse(req.url)
      , pathname = url.pathname;

    // matching routes
    for (var len = routes.length; i < len; ++i) {
      var route = routes[i]
        , fn = route.callback
        , path = route.regexp
        , keys = route.keys;

      // match
      if (captures = path.exec(pathname)) {
        route.params = [];
        for (var j = 1, l = captures.length; j < l; ++j) {
          var key = keys[j-1],
            val = 'string' == typeof captures[j]
              ? decodeURIComponent(captures[j])
              : captures[j];
          if (key) {
            route.params[key] = val;
          } else {
            route.params.push(val);
          }
        }
        req._route_index = i;
        return route;
      }
    }
  }
}
