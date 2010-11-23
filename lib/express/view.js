
/*!
 * Express - View
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
  , merge = utils.merge
  , http = require('http')
  , fs = require('fs')
  , mime = utils.mime;

/**
 * Memory cache.
 *
 * @type Object
 */

var cache = {};

/**
 * Cache view contents to prevent I/O hits.
 *
 * @type Object
 */

var viewCache = {};

/**
 * Cache view path derived names.
 *
 * @type Object
 */

var viewNameCache = {};

/**
 * Initialize a new `View` with the given `view` path and `options`.
 *
 * @param {String} view
 * @param {Object} options
 * @api private
 */

var View = exports = module.exports = function View(view, options) {
  options = options || {};
  // TODO: memoize basename etc
  this.view = view;
  this.root = options.root;
  this.defaultEngine = options.defaultEngine;
  this.parent = options.parentView;
  this.basename = basename(view);
  this.engine = this.resolveEngine();
  this.extension = '.' + this.engine;
  this.path = this.resolvePath();
  this.dirname = dirname(this.path);
};

/**
 * Resolve view engine.
 *
 * @return {String}
 * @api private
 */

View.prototype.resolveEngine = function(){
  // Explicit
  if (~this.basename.indexOf('.')) return extname(this.basename).substr(1);
  // Inherit from parent
  if (this.parent) return this.parent.engine;
  // Default
  return this.defaultEngine;
};

/**
 * Resolve view path.
 *
 * @return {String}
 * @api private
 */

View.prototype.resolvePath = function(){
  var path = this.view;
  // Implicit engine
  if (!~this.basename.indexOf('.')) path += this.extension;
  // Absolute
  if ('/' == path[0]) return path;
  // Relative to parent
  if (this.parent) return this.parent.dirname + '/' + path;
  // Relative to root
  return this.root
    ? this.root + '/' + path
    : path;
};

/**
 * Get view contents. This is a one-time hit, so we
 * can afford to be sync.
 *
 * @return {String}
 * @api public
 */

View.prototype.__defineGetter__('contents', function(){
  return fs.readFileSync(this.path, 'utf8');
});

/**
 * Get template engine api, cache exports to reduce
 * require() calls.
 *
 * @return {Object}
 * @api public
 */

View.prototype.__defineGetter__('templateEngine', function(){
  var ext = this.extension;
  return cache[ext]
    || (cache[ext] = require(this.engine));
});

/**
 * Initialize a new `Partial` for the given `view` and `options`.
 *
 * @param {String} view
 * @param {Object} options
 * @api private
 */

var Partial = exports.Partial = function Partial(view, options) {
  options = options || {};
  View.call(this, view, options);
  this.objectName = options.as || this.resolveObjectName();
  this.path = this.dirname + '/_' + basename(this.path);
};

/**
 * Inherit from `View.prototype`.
 */

Partial.prototype.__proto__ = View.prototype;

/**
 * Resolve partial object name from the view path.
 *
 * Examples:
 *
 *   "user.ejs" becomes "user"
 *   "forum thread.ejs" becomes "forumThread"
 *   "forum/thread/post.ejs" becomes "post"
 *   "blog-post.ejs" becomes "blogPost"
 *
 * @return {String}
 * @api private
 */

Partial.prototype.resolveObjectName = function(){
  // TODO: cache
  return this.view
    .split('/')
    .slice(-1)[0]
    .split('.')[0]
    .replace(/[^a-zA-Z0-9 ]+/g, ' ')
    .split(/ +/).map(function(word, i){
      return i
        ? word[0].toUpperCase() + word.substr(1)
        : word;
    }).join('');
};

/**
 * Synchronously cache view at the given `path`.
 *
 * @param {String} path
 * @return {String}
 * @api private
 */

function cacheViewSync(path) {
  return viewCache[path] = fs.readFileSync(path, 'utf8');
}

/**
 * Return view root path for the given `app`.
 *
 * @param {express.Server} app
 * @return {String}
 * @api private
 */

function viewRoot(app) {
  return app.set('views') || process.cwd() + '/views';
}

/**
 * Return object name deduced from the given `view` path.
 *
 * Examples:
 *
 *    "movie/director" -> director
 *    "movie.director" -> director
 *    "forum/thread/post" -> post
 *    "forum/thread.post" -> post
 *
 * @param {String} view
 * @return {String}
 * @api private
 */

function objectName(view) {
  return view.split('/').slice(-1)[0].split('.')[0];
}

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
  var name = options.as
    || viewNameCache[view]
    || (viewNameCache[view] = objectName(view));

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
  if (viewOptions) options.__proto__ = viewOptions;

  // Defaults
  var self = this
    , root = viewRoot(this.app)
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
  options.root = app.settings.views || process.cwd() + '/views';

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
    self.render(layout, options, fn, view);
  } else if (partial) {
    return str;
  } else if (fn) {
    fn(null, str);
  } else {
    this.send(str, options.headers, options.status);
  }
};
