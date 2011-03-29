
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
 * Partial render helper.
 *
 * @api private
 */

function renderPartial(res, view, options, parentLocals, parent){
  var collection, object, locals;

  // Inherit parent view extension when not present
  if (parent && !~view.indexOf('.')) {
    view += parent.extension;
  }

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
  options.renderPartial = true;
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
      } else {
        options.scope = object;
      }
    }
    return res.render(view, options, null, parent, true);
  }

  // Collection support
  if (collection) {
    var len = collection.length
      , buf = '';
    options.collectionLength = len;
    for (var i = 0; i < len; ++i) {
      var val = collection[i];
      options.firstInCollection = i === 0;
      options.indexInCollection = i;
      options.lastInCollection = i === len - 1;
      object = val;
      buf += render();
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
    // unwind to root call to prevent
    // several next(err) calls
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
    , helpers = app.viewHelpers
    , dynamicHelpers = app.dynamicViewHelpers
    , viewOptions = app.set('view options')
    , cacheTemplates = app.set('cache views');

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

  // Defaults
  var self = this
    , root = app.set('views') || process.cwd() + '/views'
    , partial = options.renderPartial
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

  // Populate view
  var orig = view = new View(view, options);

  // Try _ prefix ex: ./views/_<name>.jade
  if (!view.exists) view = new View(orig.prefixPath, options);
  
  // Try index ex: ./views/user/index.jade
  if (!view.exists) view = new View(orig.indexPath, options);

  // Try ../<name>/index ex: ../user/index.jade
  // when calling partial('user') within the same dir
  if (!view.exists && !options.isLayout) view = new View(orig.upIndexPath, options);

  // Try root ex: <root>/user.jade
  if (!view.exists) view = new View(orig.rootPath, options);

  // Try root _ prefix ex: <root>/_user.jade
  if (!view.exists && partial) view = new View(view.prefixPath, options);

  // Does not exist
  if (!view.exists) {
    if (app.enabled('hints')) hintAtViewPaths(orig, options);
    var err = new Error('failed to locate view "' + orig.view + '"');
    err.view = orig;
    throw err;
  }

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

  // Provide filename to engine
  options.filename = view.path;

  // Attempt render
  var engine = view.templateEngine
    , template = cacheTemplates
      ? cache[view.path] || (cache[view.path] = engine.compile(view.contents, options))
      : engine.compile(view.contents, options)
    , str = template.call(options.scope, options);

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
  console.error('  - ' + new View(view.path, options).path);
  console.error('  - ' + new View(view.prefixPath, options).path);
  console.error('  - ' + new View(view.indexPath, options).path);
  if (!options.isLayout) console.error('  - ' + new View(view.upIndexPath, options).path);
  if (options.isLayout) console.error('  - ' + new View(view.rootPath, options).path);
  console.error();
}