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

  var fileName = name;

  if (!this.ext) {
    // get extension from default engine name
    this.ext = this.defaultEngine[0] !== '.'
      ? '.' + this.defaultEngine
      : this.defaultEngine;

    fileName += this.ext;
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

  // file name to lookup on first render
  this.fileName = fileName;
}

/**
 * Lookup view by the given `name`
 *
 * @param {string} name
 * @param {function} cb
 * @private
 */

View.prototype.lookup = function lookup(name, cb) {
  var roots = [].concat(this.root);
  var ext = this.ext;

  debug('lookup "%s"', name);

  tryNextRoot();

  function tryNextRoot() {
    var root = roots.shift();

    if (!root) {
      return cb(null, null);
    }

    // resolve the path
    var loc = resolve(root, name);

    // resolve the file
    resolveView(dirname(loc), basename(loc), ext, onResolved);
  }

  function onResolved(err, filePath) {
    if (err || filePath) {
      return cb(err, filePath);
    }

    // not found; try the next root
    tryNextRoot();
  }
};

/**
 * Render with the given options.
 *
 * Resolves the view path on first render and memoizes it
 * on the instance for subsequent renders.
 *
 * @param {object} options
 * @param {function} callback
 * @private
 */

View.prototype.render = function render(options, callback) {
  var view = this;

  if (this.path) {
    return renderFile(this, options, callback);
  }

  // lookup path on first render
  this.lookup(this.fileName, onLookup);

  function onLookup(err, filePath) {
    if (err) {
      return callback(err);
    }

    if (!filePath) {
      return callback(lookupFailedError(view));
    }

    view.path = filePath;
    renderFile(view, options, callback);
  }
};

/**
 * Render the resolved view path with the given options.
 *
 * @param {View} view
 * @param {object} options
 * @param {function} callback
 * @private
 */

function renderFile(view, options, callback) {
  var sync = true;

  debug('render "%s"', view.path);

  // render, normalizing sync callbacks
  view.engine(view.path, options, function onRender() {
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
}

/**
 * Build the error for a failed view lookup.
 *
 * @param {View} view
 * @return {Error}
 * @private
 */

function lookupFailedError(view) {
  var dirs = Array.isArray(view.root) && view.root.length > 1
    ? 'directories "' + view.root.slice(0, -1).join('", "') + '" or "' + view.root[view.root.length - 1] + '"'
    : 'directory "' + view.root + '"'
  var err = new Error('Failed to lookup view "' + view.name + '" in views ' + dirs);
  err.view = view;
  return err;
}

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
  var filePath = join(dir, file);
  var indexPath = join(dir, basename(file, ext), 'index' + ext);

  // <path>.<ext>
  limitStat(filePath, onFileStat);

  function onFileStat(err, stat) {
    if (!err && stat.isFile()) {
      return cb(null, filePath);
    }

    // <path>/index.<ext>
    limitStat(indexPath, onIndexStat);
  }

  function onIndexStat(err, stat) {
    if (!err && stat.isFile()) {
      return cb(null, indexPath);
    }

    // treat any stat error as a miss, like the sync implementation did
    cb(null, null);
  }
}

/**
 * Module variables for stat concurrency limiting.
 * @private
 */

var MAX_PENDING_STATS = 10;
var pendingStats = [];
var numPendingStats = 0;

/**
 * An fs.stat call that limits the number of outstanding requests.
 *
 * @param {string} path
 * @param {function} cb
 * @private
 */

function limitStat(path, cb) {
  pendingStats.push([path, cb]);
  statNext();
}

function statNext() {
  if (numPendingStats >= MAX_PENDING_STATS || pendingStats.length === 0) {
    return;
  }

  var next = pendingStats.shift();
  var path = next[0];
  var cb = next[1];

  numPendingStats++;
  debug('stat "%s"', path);

  fs.stat(path, function onStat(err, stat) {
    numPendingStats--;

    // dispatch the next queued stat before invoking the callback so a
    // throwing callback cannot stall the queue
    statNext();

    cb(err, stat);
  });
}
