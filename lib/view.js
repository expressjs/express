
/*!
 * Express - view
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var path = require('path')
  , extname = path.extname
  , dirname = path.dirname
  , basename = path.basename
  , utils = require('connect').utils
  , View = require('./view/view')
  , renderer = require('./view/renderer')
  , partial = require('./view/partial')
  , union = require('./utils').union
  , merge = utils.merge
  , http = require('http')
  , res = http.ServerResponse.prototype;

/**
 * Memory cache.
 *
 * @type Object
 */

var cache = {};

/**
 * Expose constructors.
 */

exports = module.exports = View;

/**
 * Export template engine registrar.
 */

exports.register = View.register;

/**
 * Render `view` partial with the given `options`. Optionally a 
 * callback `fn(err, str)` may be passed instead of writing to
 * the socket.
 *
 * Options:
 *
 *   - `object` Single object with name derived from the view (unless `as` is present) 
 *
 *   - `as` Variable name for each `collection` value, defaults to the view name.
 *     * as: 'something' will add the `something` local variable
 *     * as: this will use the collection value as the template context
 *     * as: global will merge the collection value's properties with `locals`
 *
 *   - `collection` Array of objects, the name is derived from the view name itself. 
 *     For example _video.html_ will have a object _video_ available to it.
 *
 * @param  {String} view
 * @param  {Object|Array|Function} options, collection, callback, or object
 * @param  {Function} fn
 * @return {String}
 * @api public
 */

res.partial = function (view, options, fn) {
  var app = this.app
    , options = options || {}
    , str = ''
    , parent = {};

  // accept callback as second argument
  if ('function' == typeof options) {
    fn = options;
    options = {};
  }

  // root "views" option
  parent.dirname = app.set('views') || process.cwd() + '/views';

  // utilize "view engine" option
  if (app.set('view engine')) {
    parent.extension = '.' + app.set('view engine');
  }

  // render the partial
  try {
    str = renderer(this).partial(view, options, null, parent);
  } catch (err) {
    if (fn) {
      fn(err);
    } else {
      throw err;
    }
  }

  // callback or transfer
  if (fn) {
    fn(null, str);
  } else {
    this.send(str);
  }
};

/**
 * Render `view` with the given `options` and optional callback `fn`.
 * When a callback function is given a response will _not_ be made
 * automatically, however otherwise a response of _200_ and _text/html_ is given.
 *
 * Options:
 *
 *  - `scope`     Template evaluation context (the value of `this`)
 *  - `debug`     Output debugging information
 *  - `status`    Response status code
 *
 * @param  {String} view
 * @param  {Object|Function} options or callback function
 * @param  {Function} fn
 * @api public
 */

res.render = function(view, opts, fn, parent, sub){
  var str = '';

  // support callback function as second arg
  if ('function' == typeof opts) {
    fn = opts, opts = null;
  }

  try {
    str = renderer(this).render(view, opts, fn, parent, sub);
  } catch (err) {
    // callback given
    if (fn) {
      fn(err);
    // unwind to root call
    } else if (sub) {
      throw err;
    // root template, next(err)
    } else {
      this.req.next(err);
    }
  }


  // callback or transfer
  if (fn) {
    fn(null, str);
  } else {
    this.send(str);
  }
};
