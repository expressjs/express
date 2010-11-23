
/*!
 * Express - view
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var extname = require('path').extname
  , dirname = require('path').dirname
  , basename = require('path').basename
  , utils = require('connect').utils
  , clone = require('./utils').clone
  , View = require('./view/view')
  , Partial = require('./view/partial')
  , merge = utils.merge
  , http = require('http')
  , mime = utils.mime;

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
 * Register the given template engine `exports`
 * as `ext`. For example we may wish to map ".html"
 * files to jade:
 *
 *    app.register('.html', require('jade'));
 *
 * This is also useful for libraries that may not
 * match extensions correctly. For example my haml.js
 * library is installed from npm as "hamljs" so instead
 * of layout.hamljs, we can register the engine as ".haml":
 *
 *    app.register('.haml', require('haml-js'));
 *
 * For engines that do not comply with the Express
 * specification, we can also wrap their api this way.
 *
 *    app.register('.foo', {
 *        render: function(str, options) {
 *            // perhaps their api is
 *            // return foo.toHTML(str, options);
 *        }
 *    });
 *
 * @param {String} ext
 * @param {Object} obj
 * @api public
 */

exports.register = function(ext, exports) {
  cache[ext] = exports;
};

/**
 * Render `view` partial with the given `options`.
 *
 * Options:
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

http.ServerResponse.prototype.partial = function(view, options, locals, parent){

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
  merge(options, locals);

  // Merge locals
  if (options.locals) {
    merge(options, options.locals);
  }

  // Partials dont need layouts
  options.renderPartial = true;
  options.layout = false;

  // Deduce name from view path
  var name = options.as || Partial.resolveObjectName(view);

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
      buf += this.partial(view, options);
    }
    return buf;
  } else {
    if (options.object) {
      if ('string' == typeof name) {
        options[name] = options.object;
      } else if (name === global) {
        merge(options, options.object);
      } else {
        options.scope = options.object;
      }
    }
    return this.render(view, options);
  }
};

/**
 * Render `view` with the given `options` and optional callback `fn`.
 * When a callback function is given a response will _not_ be made
 * automatically, however otherwise a response of _200_ and _text/html_ is given.
 *
 * Options:
 *  
 *  Most engines accept one or more of the following options,
 *  both _haml_ and _jade_ accept all:
 *
 *  - `scope`     Template evaluation context (the value of `this`)
 *  - `debug`     Output debugging information
 *  - `status`    Response status code, defaults to 200
 *  - `headers`   Response headers object
 *
 * @param  {String} view
 * @param  {Object|Function} options or callback function
 * @param  {Function} fn
 * @api public
 */

http.ServerResponse.prototype.render = function(view, options, fn, parent){
  // Support callback function as second arg
  if (typeof options === 'function') {
    fn = options, options = {};
  }
  
  var self = this
    , app = this.app
    , options = options || {}
    , helpers = app.viewHelpers
    , dynamicHelpers = app.dynamicViewHelpers
    , viewOptions = app.settings['view options'];

  // Mixin "view options"
  if (viewOptions) options = merge(clone(viewOptions), options);

  // Defaults
  var self = this
    , root = app.settings.views || process.cwd() + '/views'
    , partial = options.renderPartial
    , layout = options.layout;

  // Layout support
  if (true === layout || undefined === layout) {
    layout = 'layout';
  }

  // Default execution scope to the response
  options.scope = options.scope || this.req;

  // Populate view
  options.parentView = parent;

  // "views" setting
  options.root = root;

  // "view engine" setting
  options.defaultEngine = app.settings['view engine'];

  // Populate view
  view = partial
    ? new Partial(view, options)
    : new View(view, options);

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
  options = merge(clone(helpers), options);

  // Always expose partial() as a local
  options.partial = function(path, opts){
    return self.partial(path, opts, options, view);
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
    var template = view.templateEngine.compile(view.contents, options);
    str = template.call(options.scope, options);
  } catch (err) {
    return error(err);
  }

  // Layout support
  if (layout) {
    options.layout = false;
    options.body = str;
    options.relative = false;
    self.render(layout, options, fn, view);
  } else if (partial) {
    return str;
  } else if (fn) {
    fn(null, str);
  } else {
    this.send(str, options.headers, options.status);
  }
};
