
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
  , Partial = require('./view/partial')
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
exports.Partial = Partial;

/**
 * Export template engine registrar.
 */

exports.register = View.register;

/**
 * Partial render helper.
 *
 * @api private
 */

function renderPartial(res, view, options, locals, parent){
  // Inherit parent view extension when not present
  if (parent && !~view.indexOf('.')) {
    view += parent.extension;
  }

  // Allow collection to be passed as second param
  if (options) {
    if ('length' in options) {
      options = { collection: options };
    } else if (!options.collection && !options.locals && !options.object) {
      options = { object: options };
    }
  } else {
    options = {};
  }

  // Inherit locals from parent
  union(options, locals);
  
  // Merge locals
  if (options.locals) {
    merge(options, options.locals);
  }

  // Partials dont need layouts
  options.renderPartial = true;
  options.layout = false;

  // Deduce name from view path
  var name = options.as || Partial.resolveObjectName(view);

  // Render partial
  function render(){
    if (options.object) {
      if ('string' == typeof name) {
        options[name] = options.object;
      } else if (name === global) {
        merge(options, options.object);
      } else {
        options.scope = options.object;
      }
    }
    return res.render(view, options, null, parent);
  }

  // Collection support
  var collection = options.collection;
  if (collection) {
    var len = collection.length
      , buf = '';
    delete options.collection;
    options.collectionLength = len;
    for (var i = 0; i < len; ++i) {
      var val = collection[i];
      options.firstInCollection = i === 0;
      options.indexInCollection = i;
      options.lastInCollection = i === len - 1;
      options.object = val;
      buf += render();
    }
    return buf;
  } else {
    return render();
  }
};

/**
 * Render `view` partial with the given `options`.
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
 * @param  {Object|Array} options, collection, or object
 * @return {String}
 * @api public
 */

res.partial = function(view, options){
  var app = this.app
    , options = options || {}
    , parent = {};

  // root "views" option
  parent.dirname = app.set('views') || process.cwd() + '/views';

  // utilize "view engine" option
  if (app.set('view engine')) {
    parent.extension = '.' + app.set('view engine');
  }

  var str = renderPartial(this, view, options, null, parent);
  this.send(str);
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
 *
 * @param  {String} view
 * @param  {Object|Function} options or callback function
 * @param  {Function} fn
 * @api public
 */

res.render = function(view, opts, fn, parent){
  // support callback function as second arg
  if (typeof opts === 'function') {
    fn = opts, opts = null;
  }
  
  var options = {}
    , self = this
    , app = this.app
    , helpers = app.viewHelpers
    , dynamicHelpers = app.dynamicViewHelpers
    , viewOptions = app.set('view options')
    , cacheTemplates = app.set('cache views');

  // merge "view options"
  if (viewOptions) merge(options, viewOptions);

  // merge res.locals
  if (this.locals) merge(options, this.locals);

  // merge render() options
  if (opts) merge(options, opts);

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

  // Populate view
  // TODO: move this logic into the protos
  var orig = view = partial
    ? new Partial(view, options)
    : new View(view, options);

  // Ensure view exists, otherwise try _ prefix
  if (!view.exists) {
    view = partial
      ? new Partial(view.prefixPath, options)
      : new View(view.prefixPath, options);
  }
  
  // Ensure view _ prefix exists, otherwise try index
  if (!view.exists) {
    view = partial
      ? new Partial(orig.indexPath, options)
      : new View(orig.indexPath, options);
  }

  // Ensure view exists, or try ../index
  if (!view.exists && !options.isLayout) {
    view = partial
      ? new Partial(orig.upIndexPath, options)
      : new View(orig.upIndexPath, options);
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

  function error(err) {
    if (fn) {
      fn(err);
    } else {
      self.req.next(err);
    }
  }

  // Attempt render
  try {
    var engine = view.templateEngine
      , template = cacheTemplates
        ? cache[view.path] || (cache[view.path] = engine.compile(view.contents, options))
        : engine.compile(view.contents, options)
      , str = template.call(options.scope, options);
  } catch (err) {
    return error(err);
  }

  // Layout support
  if (layout) {
    options.isLayout = true;
    options.layout = false;
    options.body = str;
    options.relative = false;
    self.render(layout, options, fn, view);
  } else if (partial) {
    return str;
  } else if (fn) {
    fn(null, str);
  } else {
    this.send(str);
  }
};
