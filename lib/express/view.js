
/*!
 * Express - View
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var extname = require('path').extname
  , basename = require('path').basename
  , utils = require('connect').utils
  , http = require('http')
  , fs = require('fs')
  , mime = utils.mime;

/**
 * Cache supported template engine exports to
 * increase performance by lowering the number
 * of calls to `require()`.
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

http.ServerResponse.prototype.partial = function(view, options, ext, locals){
  locals = locals || {};

  // Inherit parent view extension when not present
  if (ext && !~basename(view).indexOf('.')) {
    view += ext;
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
  options.locals = options.locals
    ? utils.merge(locals, options.locals)
    : locals;

  // Partials dont need layouts
  options.partial = true;
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
    options.locals.collectionLength = len;
    for (var i = 0; i < len; ++i) {
      var val = collection[i];
      options.locals.firstInCollection = i === 0;
      options.locals.indexInCollection = i;
      options.locals.lastInCollection = i === len - 1;
      options.object = val;
      buf += this.partial(view, options);
    }
    return buf;
  } else {
    if (options.object) {
      if ('string' == typeof name) {
        options.locals[name] = options.object;
      } else if (name === global) {
        utils.merge(options.locals, options.object);
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
 *  - `locals`    Object containing local variables
 *  - `debug`     Output debugging information
 *  - `status`    Response status code, defaults to 200
 *  - `headers`   Response headers object
 *
 * @param  {String} view
 * @param  {Object|Function} options or callback function
 * @param  {Function} fn
 * @api public
 */

http.ServerResponse.prototype.render = function(view, options, fn){
  // Support callback function as second arg
  if (typeof options === 'function') {
    fn = options, options = {};
  }
  
  var options = options || {}
    , app = this.app
    , viewOptions = app.set('view options')
    , defaultEngine = app.set('view engine');

  // Mixin "view options"
  if (viewOptions) options.__proto__ = viewOptions;

  // Support "view engine" setting
  if (!~basename(view).indexOf('.') && defaultEngine) {
    view += '.' + defaultEngine;
  }

  // Defaults
  var self = this
    , helpers = this.app.viewHelpers
    , dynamicHelpers = this.app.dynamicViewHelpers
    , root = viewRoot(this.app)
    , ext = extname(view)
    , partial = options.partial
    , layout = options.layout === undefined ? true : options.layout
    , layout = layout === true
      ? 'layout' + ext
      : layout;

  // Allow layout name without extension
  if (typeof layout === 'string' && layout.indexOf('.') < 0) {
    layout += ext;
  }

  // Default execution scope to the response
  options.scope = options.scope || this.req;

  // Auto-cache in production
  if ('production' == app.set('env')) {
    options.cache = true;
  }

  // Partials support
  if (options.partial) {
    root = app.set('partials') || root + '/partials';
  }

  // View path
  var path = view[0] === '/'
    ? view
    : root + '/' + view;

  // Pass filename to the engine and view
  var locals = options.locals = options.locals || {};
  options.locals.__filename = options.filename = path;

  // Dynamic helper support
  if (false !== options.dynamicHelpers) {
    // cache
    if (!this.__dynamicHelpers) {
      this.__dynamicHelpers = {};
      var keys = Object.keys(dynamicHelpers);
      for (var i = 0, len = keys.length; i < len; ++i) {
        var key = keys[i]
          , val = dynamicHelpers[key];
        if (typeof val === 'function') {
          this.__dynamicHelpers[key] = val.call(
                this.app
              , this.req
              , this);
        }
      }
    }

    // apply
    helpers.__proto__ = this.__dynamicHelpers;
  }

  // Merge view helpers
  options.locals.__proto__ = helpers;

  // Always expose partial() as a local
  options.locals.partial = function(view, options){
    return self.partial.call(self, view, options, ext, locals);
  };

  function error(err) {
    if (fn) {
      fn(err);
    } else {
      self.req.next(err);
    }
  }

  // Cache contents
  try {
    var str = (options.cache ? viewCache[path] : null) || cacheViewSync(path);
  } catch (err) {
    return error(err);
  }

  // Cache template engine exports
  var engine = cache[ext] || (cache[ext] = require(ext.substr(1)));

  // Attempt render
  try {
    var str = engine.render(str, options);
  } catch (err) {
    return error(err);
  }

  // Layout support
  if (layout) {
    options.layout = false;
    options.locals.body = str;
    options.isLayout = true;
    self.render(layout, options, fn);
  } else if (partial) {
    return str;
  } else if (fn) {
    fn(null, str);
  } else {
    this.send(str, options.headers, options.status);
  }
};
