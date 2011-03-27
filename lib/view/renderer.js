var union = require('../utils').union,
    utils = require('connect').utils,
    partial = require('../view/partial'),
    View = require('../view/view'),
    cache = {},
    merge = utils.merge;

module.exports = function (res) {

  var RENDERER = {};

  /**
   * Renders a template
   *
   * @api public
   */
  RENDERER.render = function render(view, opts, fn, parent, sub) {

    var options = {},
        app = res.app,
        helpers = app.viewHelpers,
        dynamicHelpers = app.dynamicViewHelpers,
        viewOptions = app.set('view options'),
        cacheTemplates = app.set('cache views'),
        root,
        layout,

        /**
         * Hint at view path resolution, outputting the
         * paths that Express has tried.
         *
         * @api private
         */
        _hintAtViewPaths = function (view, options) {
          console.error();
          console.error('failed to locate view "' + view.view + '", tried:');
          console.error('  - ' + new View(view.path, options).path);
          console.error('  - ' + new View(view.prefixPath, options).path);
          console.error('  - ' + new View(view.indexPath, options).path);
          if (!options.isLayout) console.error('  - ' + new View(view.upIndexPath, options).path);
          if (options.isLayout) console.error('  - ' + new View(view.rootPath, options).path);
          console.error();
        };

    // merge "view options"
    if (viewOptions) {
      merge(options, viewOptions);
    }

    // merge res._locals
    if (RENDERER._locals) {
      merge(options, RENDERER._locals);
    }

    // merge render() options
    if (opts) {
      merge(options, opts);
    }

    // merge render() .locals
    if (opts && opts.locals) {
      merge(options, opts.locals);
    }

    // status support
    if (options.status) {
      RENDERER.statusCode = options.status;
    }

    // Defaults
    root = app.set('views') || process.cwd() + '/views';
    layout = options.layout;

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
    if (options.charset) {
      RENDERER.charset = options.charset;
    }

    // Populate view
    var view = new View(view, options),
        orig = view;

    // Try _ prefix ex: ./views/_user.jade
    if (!view.exists) {
      view = new View(orig.prefixPath, options);
    }

    // Try index ex: ./views/user/index.jade
    if (!view.exists) {
      view = new View(orig.indexPath, options);
    }

    // Try ../<name>/index ex: ../user/index.jade
    // when calling partial('user') within the same dir
    if (!view.exists && !options.isLayout) {
      view = new View(orig.upIndexPath, options);
    }

    // Try layout relative to the "views" dir
    if (!view.exists && options.isLayout) {
      view = new View(orig.rootPath, options);
    }

    // Does not exist
    if (!view.exists) {
      if (app.enabled('hints')) {
        _hintAtViewPaths(orig, options);
      }
      throw new Error('failed to locate view "' + orig.view + '"');
    }

    // Dynamic helper support
    if (false !== options.dynamicHelpers) {
      // cache
      if (!RENDERER.__dynamicHelpers) {
        RENDERER.__dynamicHelpers = {};
        for (var key in dynamicHelpers) {
          RENDERER.__dynamicHelpers[key] = dynamicHelpers[key].call(app, res.req, res);
        }
      }

      // apply
      merge(options, RENDERER.__dynamicHelpers);
    }

    // Merge view helpers
    union(options, helpers);

    // Always expose partial() as a local
    options.partial = function (path, opts) {
      return RENDERER.partial(path, opts, options, view);
    };

    // Provide filename to engine
    options.filename = view.path;

    // Attempt render
    var engine = view.templateEngine,
        template = cacheTemplates
          ? cache[view.path] || (cache[view.path] = engine.compile(view.contents, options))
          : engine.compile(view.contents, options),
        str = template.call(options.scope, options);

    // layout expected
    if (layout) {
      options.isLayout = true;
      options.layout = false;
      options.body = str;
      return RENDERER.render(layout, options, fn, view, true);
    // render complete, and
    // callback given
    } else if (fn) {
      return fn(null, str);
    } else {
      return str;
    }
  };

  RENDERER.partial = function (view, options, parentLocals, parent) {
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
      if ('Object' !== options.constructor.name) {
        object = options;
        options = {};
      } else if (undefined !== options.object) {
        object = options.object;
        delete options.object;
      }
    } else {
      options = {};
    }

    // Inherit locals from parent
    union(options, parentLocals);

    // Merge locals
    if (locals) {
      merge(options, locals);
    }

    // Partials dont need layouts
    options.renderPartial = true;
    options.layout = false;

    // Deduce name from view path
    var name = options.as || partial.resolveObjectName(view);

    // Render partial
    function render() {
      if (object) {
        if ('string' === typeof name) {
          options[name] = object;
        } else if (name === global) {
          merge(options, object);
        } else {
          options.scope = object;
        }
      }
      return RENDERER.render(view, options, null, parent, true);
    }

    // Collection support
    if (collection) {
      var len = collection.length,
          buf = '';

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

  return RENDERER;
};
