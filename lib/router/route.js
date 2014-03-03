
/**
 * Module dependencies.
 */

var debug = require('debug')('express:router:route')
  , methods = require('methods')

/**
 * Expose `Route`.
 */

module.exports = Route;

/**
 * Initialize `Route` with the given `path`,
 *
 * @param {String} path
 * @api private
 */

function Route(path) {
  debug('new %s', path);
  this.path = path;
  this.stack = undefined;

  // route handlers for various http methods
  this.methods = {};
}

/**
 * @return {Array} supported HTTP methods
 * @api private
 */

Route.prototype._options = function(){
  return Object.keys(this.methods).map(function(method) {
    return method.toUpperCase();
  });
};

/**
 * dispatch req, res into this route
 *
 * @api private
 */

Route.prototype.dispatch = function(req, res, done){
  var self = this;
  var method = req.method.toLowerCase();

  if (method === 'head' && !this.methods['head']) {
    method = 'get';
  }

  req.route = self;

  // single middleware route case
  if (typeof this.stack === 'function') {
    this.stack(req, res, done);
    return;
  }

  var stack = self.stack;
  if (!stack) {
    return done();
  }

  var idx = 0;
  (function next_layer(err) {
    if (err && err === 'route') {
      return done();
    }

    var layer = stack[idx++];
    if (!layer) {
      return done(err);
    }

    if (layer.method && layer.method !== method) {
      return next_layer(err);
    }

    var arity = layer.handle.length;
    if (err) {
      if (arity < 4) {
        return next_layer(err);
      }

      return layer.handle(err, req, res, next_layer);
    }

    if (arity > 3) {
      return next_layer();
    }

    layer.handle(req, res, next_layer);
  })();
};

/**
 * Add a handler for all HTTP verbs to this route.
 *
 * Behaves just like middleware and can respond or call `next`
 * to continue processing.
 *
 * You can use multiple `.all` call to add multiple handlers.
 *
 *   function check_something(req, res, next){
 *     next();
 *   };
 *
 *   function validate_user(req, res, next){
 *     next();
 *   };
 *
 *   route
 *   .all(validate_user)
 *   .all(check_something)
 *   .get(function(req, res, next){
 *     res.send('hello world');
 *   });
 *
 * @param {function} handler
 * @return {Route} for chaining
 * @api public
 */

Route.prototype.all = function(fn){
  if (typeof fn !== 'function') {
    var type = {}.toString.call(fn);
    var msg = 'Route.use() requires callback functions but got a ' + type;
    throw new Error(msg);
  }

  if (!this.stack) {
    this.stack = fn;
  }
  else if (typeof this.stack === 'function') {
    this.stack = [{ handle: this.stack }, { handle: fn }];
  }
  else {
    this.stack.push({ handle: fn });
  }

  return this;
};

methods.forEach(function(method){
  Route.prototype[method] = function(fn){
    debug('%s %s', method, this.path);

    if (!this.methods[method]) {
      this.methods[method] = true;
    }

    if (!this.stack) {
      this.stack = [];
    }
    else if (typeof this.stack === 'function') {
      this.stack = [{ handle: this.stack }];
    }

    this.stack.push({ method: method, handle: fn })
    return this;
  };
});
