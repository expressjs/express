/*!
 * express
 * Copyright(c) 2009-2013 TJ Holowaychuk
 * Copyright(c) 2013 Roman Shtylman
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */

'use strict';

/**
 * Module dependencies.
 * @private
 */

var debug = require('debug')('express:view');
var path = require('node:path');
var fs = require('node:fs');

/**
 * Module variables.
 * @private
 */

var dirname = path.dirname;
var basename = path.basename;
var extname = path.extname;
var join = path.join;
var resolve = path.resolve;

/**
 * Module exports.
 * @public
 */

module.exports = View;

/**
 * Initialize a new `View` with the given `name`.
 *
 * Options:
 *
 *   - `defaultEngine` the default template engine name
 *   - `engines` template engine require() cache
 *   - `root` root path for view lookup
 *
 * @param {string} name
 * @param {object} options
 * @public
 */

function View(name, options) {
  var opts = options || {};

  this.defaultEngine = opts.defaultEngine;
  this.ext = extname(name);
  this.name = name;
  this.root = opts.root;

  if (!this.ext && !this.defaultEngine) {
    throw new Error('No default engine was specified and no extension was provided.');
  }

  if (!this.ext) {
    // get extension from default engine name
    this.ext = this.defaultEngine[0] !== '.'
      ? '.' + this.defaultEngine
      : this.defaultEngine;
  }

  if (!opts.engines[this.ext]) {
    // load engine
    var mod = this.ext.slice(1)
    debug('require "%s"', mod)

    // default engine export
    var fn = require(mod).__express

    if (typeof fn !== 'function') {
      throw new Error('Module "' + mod + '" does not provide a view engine.')
    }

    opts.engines[this.ext] = fn
  }

  // store loaded engine
  this.engine = opts.engines[this.ext];
}

/**
 * Lookup view by the given `name` and `ext`
 *
 * @param {string} name
 * @param {String} ext
 * @param {Function} cb
 * @private
 */

View.prototype.lookup = function lookup(name, cb) {
  var roots = [].concat(this.root);

  debug('lookup "%s"', name);

  var ext = this.ext;

  function lookup(roots, callback) {
    var root = roots.shift();
    if (!root) {
      return callback(null, null);
    }
    debug("looking up '%s' in '%s'", name, root);

    // resolve the path
    var loc = resolve(root, name);
    var dir = dirname(loc);
    var file = basename(loc);

    // resolve the file
    resolveView(dir, file, ext, function (err, resolved) {
      if (err) {
        return callback(err);
      } else if (resolved) {
        return callback(null, resolved);
      } else {
        return lookup(roots, callback);
      }
    });

  }

  return lookup(roots, cb);
};

/**
 * Render with the given options.
 *
 * @param {object} options
 * @param {function} callback
 * @private
 */

View.prototype.render = function render(options, callback) {
  var sync = true;

  debug('render "%s"', this.path);

  if (!this.path) return fn(new Error("View has not been fully initialized yet"));

  // render, normalizing sync callbacks
  this.engine(this.path, options, function onRender() {
    if (!sync) {
      return callback.apply(this, arguments);
    }

    // copy arguments
    var args = new Array(arguments.length);
    var cntx = this;

    for (var i = 0; i < arguments.length; i++) {
      args[i] = arguments[i];
    }

    // force callback to be async
    return process.nextTick(function renderTick() {
      return callback.apply(cntx, args);
    });
  });

  sync = false;
};

/** Resolve the main template for this view
 *
 * @param {function} cb
 * @private
 */
View.prototype.lookupMain = function lookupMain(cb) {
  if (this.path) return cb();
  var view = this;
  var name = path.extname(this.name) === this.ext
    ? this.name
    : this.name + this.ext;
  this.lookup(name, function (err, path) {
    if (err) {
      return cb(err);
    } else if (!path) {
      var dirs = Array.isArray(view.root) && view.root.length > 1
        ? 'directories "' + view.root.slice(0, -1).join('", "') + '" or "' + view.root[view.root.length - 1] + '"'
        : 'directory "' + view.root + '"'
      var viewError = new Error('Failed to lookup view "' + view.name + '" in views ' + dirs);
      viewError.view = view;
      return cb(viewError);
    } else {
      view.path = path;
      cb();
    }
  });
};

/**
 * Resolve the file within the given directory.
 *
 * @param {string} dir
 * @param {string} file
 * @param {string} ext
 * @param {function} cb
 * @private
 */

function resolveView(dir, file, ext, cb) {
  var path = join(dir, file);

  // <path>.<ext>
  limitStat(path, function (err, stat) {
    if (err && err.code !== 'ENOENT') {
      return cb(err);
    } else if (!err && stat && stat.isFile()) {
      return cb(null, path);
    }

    // <path>/index.<ext>
    path = join(dir, basename(file, ext), 'index' + ext);
    limitStat(path, function (err, stat) {
      if (err && err.code === 'ENOENT') {
        return cb(null, null);
      } else if (!err && stat && stat.isFile()) {
        return cb(null, path);
      } else {
        return cb(err || new Error("error looking up '" + path + "'"));
      }
    });
  });
}

var pendingStats = [];
var numPendingStats = 0;
/**
 * an fs.stat call that limits the number of outstanding requests to 10.
 *
 * @param {String} path
 * @param {Function} cb
 */
function limitStat(path, cb) {
  if (++numPendingStats > 10) {
    pendingStats.push([path, cb]);
  } else {
    fs.stat(path, cbAndDequeue(cb));
  }

  function cbAndDequeue(cb) {
    return function (err, stat) {
      cb(err, stat);
      var next = pendingStats.shift();
      if (next) {
        fs.stat(next[0], cbAndDequeue(next[1]));
      } else {
        numPendingStats--;
      }
    }
  }
}
