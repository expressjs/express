/**
 * Module dependencies.
 */

var path = require('path')
  , fs = require('fs')
  , utils = require('./utils')
  , dirname = path.dirname
  , basename = path.basename
  , extname = path.extname
  , exists = fs.existsSync || path.existsSync
  , join = path.join;

/**
 * Expose `View`.
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
 *   - `aliases` object contains aliases for paths
 *   - `aliasSeparator` separator used for aliased path, defaults to '::'
 *
 * @param {String} name
 * @param {Object} options
 * @api private
 */

function View(name, options) {
  options = options || {};
  this.name = name;
  this.root = options.root;
  this.aliases = options.aliases;
  this.aliasSeparator = options.aliasSeparator || '::';
  var engines = options.engines;
  this.defaultEngine = options.defaultEngine;
  var ext = this.ext = extname(name);
  if (!ext && !this.defaultEngine) throw new Error('No default engine was specified and no extension was provided.');
  if (!ext) name += (ext = this.ext = ('.' != this.defaultEngine[0] ? '.' : '') + this.defaultEngine);
  this.engine = engines[ext] || (engines[ext] = require(ext.slice(1)).__express);
  this.path = this.lookup(name);
}

/**
 * Lookup view by the given `path`
 *
 * @param {String} path
 * @return {String}
 * @api private
 */

View.prototype.lookup = function(path){
  var ext = this.ext;

  // resolve aliased path (check only if aliases are defined)
  if (this.aliases) {
    var pos = path.indexOf(this.aliasSeparator);
    // at least one character for alias name and separator is not on the end!
    if (pos > 0 && pos + this.aliasSeparator.length < path.length) {
      var aliasName = path.substring(0, pos);
      var resolvedAliasPath = this.aliases[aliasName];
      if (!resolvedAliasPath) throw new Error('Alias "' + aliasName + '" for path "' + path + '" does not exist');
      path = join(resolvedAliasPath, path.substring(pos + this.aliasSeparator.length));
    } else throw new Error('Invalid aliased path "' + path + '"');
  }
  
  // <path>.<engine>
  if (!utils.isAbsolute(path)) path = join(this.root, path);
  if (exists(path)) return path;

  // <path>/index.<engine>
  path = join(dirname(path), basename(path, ext), 'index' + ext);
  if (exists(path)) return path;
};

/**
 * Render with the given `options` and callback `fn(err, str)`.
 *
 * @param {Object} options
 * @param {Function} fn
 * @api private
 */

View.prototype.render = function(options, fn){
  this.engine(this.path, options, fn);
};
