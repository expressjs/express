
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
  , partial = require('./view/partial')
  , union = require('./utils').union
  , merge = utils.merge
  , http = require('http')
  , res = http.ServerResponse.prototype;

/**
 * Expose constructors.
 */

exports = module.exports = View;

/**
 * Export template engine registrar.
 */

exports.register = View.register;

/**
 * Lookup and compile `view` with cache support by supplying
 * both the `cache` object and `cid` string,
 * followed by `options` passed to `exports.lookup()`.
 *
 * @param {String} view
 * @param {Object} cache
 * @param {Object} cid
 * @param {Object} options
 * @return {View}
 * @api private
 */

exports.compile = function(view, cache, cid, options){
  if (cache && cid && cache[cid]) return cache[cid];

  // lookup
  view = exports.lookup(view, options);

  // hints
  if (!view.exists) {
    if (options.hint) hintAtViewPaths(view.original, options);
    var err = new Error('failed to locate view "' + view.original.view + '"');
    err.view = view.original;
    throw err;
  }    

  // compile
  options.filename = view.path;
  view.fn = view.templateEngine.compile(view.contents, options);
  cache[cid] = view;
  
  return view;
};

/**
 * Lookup `view`, returning an instanceof `View`.
 *
 * Options:
 *
 *   - `root` root directory path
 *   - `defaultEngine` default template engine
 *   - `parentView` parent `View` object
 *   - `cache` cache object
 *   - `cacheid` optional cache id
 *
 * Lookup:
 *
 *   - partial `_<name>` 
 *   - any `<name>/index` 
 *   - non-layout `../<name>/index` 
 *   - any `<root>/<name>` 
 *   - partial `<root>/_<name>` 
 *
 * @param {String} view
 * @param {Object} options
 * @return {View}
 * @api private
 */

exports.lookup = function(view, options){
  var orig = view = new View(view, options)
    , partial = options.isPartial
    , layout = options.isLayout;

  // Try _ prefix ex: ./views/_<name>.jade
  // taking precedence over the direct path
  if (partial) {
    view = new View(orig.prefixPath, options);
    if (!view.exists) view = orig;
  }

  // Try index ex: ./views/user/index.jade
  if (!layout && !view.exists) view = new View(orig.indexPath, options);

  // Try ../<name>/index ex: ../user/index.jade
  // when calling partial('user') within the same dir
  if (!layout && !view.exists) view = new View(orig.upIndexPath, options);

  // Try root ex: <root>/user.jade
  if (!view.exists) view = new View(orig.rootPath, options);

  // Try root _ prefix ex: <root>/_user.jade
  if (!view.exists && partial) view = new View(view.prefixPath, options);

  view.original = orig;
  return view;
};

/**
 * Partial render helper.
 *
 * @api private
 */

function renderPartial(res, view, options, parentLocals, parent){
  var collection, object, locals;

  if (options) {
    // collection
    if (options.collection) {
      collection = options.collection;
      delete options.collection;
    } else if ('length' in options) {
      collection = options;
      options = {};
    }

    // locals
    if (options.locals) {
      locals = options.locals;
      delete options.locals;
    }

    // object
    if ('Object' != options.constructor.name) {
      object = options;
      options = {};
    } else if (undefined != options.object) {
      object = options.object;
      delete options.object;
    }
  } else {
    options = {};
  }

  // Inherit locals from parent
  union(options, parentLocals);
  
  // Merge locals
  if (locals) merge(options, locals);

  // Partials dont need layouts
  options.isPartial = true;
  options.layout = false;

  // Deduce name from view path
  var name = options.as || partial.resolveObjectName(view);

  // Render partial
  function render(){
    if (object) {
      if ('string' == typeof name) {
        options[name] = object;
      } else if (name === global) {
        merge(options, object);
      }
    }
    return res.render(view, options, null, parent, true);
  }

  // Collection support
  if (collection) {
    var len = collection.length
      , buf = ''
      , keys
      , key
      , val;

    options.collectionLength = len;

    if ('number' == typeof len || Array.isArray(collection)) {
      for (var i = 0; i < len; ++i) {
        val = collection[i];
        options.firstInCollection = i == 0;
        options.indexInCollection = i;
        options.lastInCollection = i == len - 1;
        object = val;
        buf += render();
      }      
    } else {
      keys = Object.keys(collection);
      len = keys.length;
      options.collectionLength = len;
      options.collectionKeys = keys;
      for (var i = 0; i < len; ++i) {
        key = keys[i];
        val = collection[key];
        options.keyInCollection = key;
        options.firstInCollection = i == 0;
        options.indexInCollection = i;
        options.lastInCollection = i == len - 1;
        object = val;
        buf += render();
      }
    }

    return buf;
  } else {
    return render();
  }
};

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

res.partial = function(view, options, fn){
  var app = this.app
    , options = options || {}
    , viewEngine = app.set('view engine')
    , parent = {};

  // accept callback as second argument
  if ('function' == typeof options) {
    fn = options;
    options = {};
  }

  // root "views" option
  parent.dirname = app.set('views') || process.cwd() + '/views';

  // utilize "view engine" option
  if (viewEngine) parent.engine = viewEngine;

  // render the partial
  try {
    var str = renderPartial(this, view, options, null, parent);
  } catch (err) {
    if (fn) {
      fn(err);
    } else {
      this.req.next(err);
    }
    return;
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
  // support callback function as second arg
  if ('function' == typeof opts) {
    fn = opts, opts = null;
  }

  try {
    return this._render(view, opts, fn, parent, sub);
  } catch (err) {
    // callback given
    if (fn) {
      fn(err);
    // unwind to root call to prevent multiple callbacks
    } else if (sub) {
      throw err;
    // root template, next(err)
    } else {
      this.req.next(err);
    }
  }
};

// private render()

res._render = function(view, opts, fn, parent, sub){
  var options = {}
    , self = this
    , app = this.app
    , helpers = app._locals
    , dynamicHelpers = app.dynamicViewHelpers
    , viewOptions = app.set('view options')
    , root = app.set('views') || process.cwd() + '/views';

  // cache id
  var cid = app.enabled('view cache')
    ? view + (parent ? ':' + parent.path : '')
    : false;

  // merge "view options"
  if (viewOptions) merge(options, viewOptions);

  // merge res._locals
  if (this._locals) merge(options, this._locals);

  // merge render() options
  if (opts) merge(options, opts);

  // merge render() .locals
  if (opts && opts.locals) merge(options, opts.locals);

  // status support
  if (options.status) this.statusCode = options.status;

  // capture attempts
  options.attempts = [];

  var partial = options.isPartial
    , layout = options.layout;

  // Layout support
  if (true === layout || undefined === layout) {
    layout = 'layout';
  }

  // Default execution scope to a plain object
  options.scope = options.scope || {};

  // Populate view
  options.parentView = parent;

  // "views" setting
  options.root = root;

  // "view engine" setting
  options.defaultEngine = app.set('view engine');

  // charset option
  if (options.charset) this.charset = options.charset;

  // Dynamic helper support
  if (false !== options.dynamicHelpers) {
    // cache
    if (!this.__dynamicHelpers) {
      this.__dynamicHelpers = {};
      for (var key in dynamicHelpers) {
        this.__dynamicHelpers[key] = dynamicHelpers[key].call(
            this.app
          , this.req
          , this);
      }
    }

    // apply
    merge(options, this.__dynamicHelpers);
  }

  // Merge view helpers
  union(options, helpers);

  // Always expose partial() as a local
  options.partial = function(path, opts){
    return renderPartial(self, path, opts, options, view);
  };

  // View lookup
  options.hint = app.enabled('hints');
  view = exports.compile(view, app.cache, cid, options);

  // layout helper
  options.layout = function(path){
    layout = path;
  };

  // render
  var str = view.fn.call(options.scope, options);

  // layout expected
  if (layout) {
    options.isLayout = true;
    options.layout = false;
    options.body = str;
    this.render(layout, options, fn, view, true);
  // partial return
  } else if (partial) {
    return str;
  // render complete, and 
  // callback given
  } else if (fn) {
    fn(null, str);
  // respond
  } else {
    this.send(str);
  }
}

/**
 * Hint at view path resolution, outputting the
 * paths that Express has tried.
 *
 * @api private
 */

function hintAtViewPaths(view, options) {
  console.error();
  console.error('failed to locate view "' + view.view + '", tried:');
  options.attempts.forEach(function(path){
    console.error('  - %s', path);
  });
  console.error();
}