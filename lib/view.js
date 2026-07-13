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
 * Lookup the view file, calling `cb` with the resolved
 * path or `null` when not found.
 *
 * @param {function} cb
 * @private
 */

View.prototype.lookup = function lookup(cb) {
  const roots = [].concat(this.root);
  const ext = this.ext;

  // append the default-engine extension unless the name already has one
  const name = extname(this.name)
    ? this.name
    : this.name + ext;

  debug('lookup "%s"', name);

  tryNextRoot();

  function tryNextRoot() {
    const root = roots.shift();

    if (!root) {
      return cb(null);
    }

    // resolve the path
    const loc = resolve(root, name);

    // resolve the file
    resolveView(dirname(loc), basename(loc), ext, onResolved);
  }

  function onResolved(filePath) {
    if (filePath) {
      return cb(filePath);
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
  const view = this;

  if (this.path) {
    return renderFile(this, options, callback);
  }

  // lookup path on first render
  this.lookup(onLookup);

  function onLookup(filePath) {
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
  let sync = true;

  debug('render "%s"', view.path);

  try {
    // render, normalizing sync callbacks
    view.engine(view.path, options, onRender);
  } catch (err) {
    // deliver sync engine throws through the callback
    return onRender(err);
  }

  sync = false;

  function onRender() {
    if (!sync) {
      return callback.apply(this, arguments);
    }

    // copy arguments
    const args = new Array(arguments.length);
    const cntx = this;

    for (let i = 0; i < arguments.length; i++) {
      args[i] = arguments[i];
    }

    // force callback to be async
    return process.nextTick(function renderTick() {
      return callback.apply(cntx, args);
    });
  }
}

/**
 * Build the error for a failed view lookup.
 *
 * @param {View} view
 * @return {Error}
 * @private
 */

function lookupFailedError(view) {
  const dirs = Array.isArray(view.root) && view.root.length > 1
    ? 'directories "' + view.root.slice(0, -1).join('", "') + '" or "' + view.root[view.root.length - 1] + '"'
    : 'directory "' + view.root + '"'
  const err = new Error('Failed to lookup view "' + view.name + '" in views ' + dirs);
  err.view = view;
  return err;
}

/**
 * Resolve the file within the given directory, calling `cb`
 * with the resolved path or `null` when not found.
 *
 * @param {string} dir
 * @param {string} file
 * @param {string} ext
 * @param {function} cb
 * @private
 */

function resolveView(dir, file, ext, cb) {
  const filePath = join(dir, file);
  const indexPath = join(dir, basename(file, ext), 'index' + ext);

  // <path>.<ext>
  limitStat(filePath, onFileStat);

  function onFileStat(err, stat) {
    if (!err && stat.isFile()) {
      return cb(filePath);
    }

    // <path>/index.<ext>
    limitStat(indexPath, onIndexStat);
  }

  function onIndexStat(err, stat) {
    if (!err && stat.isFile()) {
      return cb(indexPath);
    }

    // treat any stat error as a miss, like the sync implementation did
    cb(null);
  }
}

/**
 * Module variables for stat concurrency limiting.
 * @private
 */

const MAX_PENDING_STATS = 10;
const pendingStats = [];
let numPendingStats = 0;

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

  const next = pendingStats.shift();
  const path = next[0];
  const cb = next[1];

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
