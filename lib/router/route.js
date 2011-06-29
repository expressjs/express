
/*!
 * Express - router - Route
 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
 * MIT Licensed
 */

/**
 * Expose `Route`.
 */

module.exports = Route;

/**
 * Initialize `Route` with the given HTTP `method`, `path`,
 * and callback `fn` and `options`.
 *
 * Options:
 *
 *   - `sensitive`    enable case-sensitive routes
 *   - `strict`       enable strict matching for trailing slashes
 *   - `middleware`   array of middleware
 *
 * @param {String} method
 * @param {String} path
 * @param {Function} fn
 * @param {Object} options.
 * @api private
 */

function Route(method, path, fn, options) {
  options = options || {};
  this.callback = fn;
  this.path = path;
  this.method = method;
  this.middleware = options.middleware;
  this.regexp = normalize(path
    , this.keys = []
    , options.sensitive
    , options.strict);
}

/**
 * Check if this route matches `path` and return captures made.
 *
 * @param {String} path
 * @return {Array}
 * @api private
 */

Route.prototype.match = function(path){
  return this.regexp.exec(path);
};

/**
 * Normalize the given path string,
 * returning a regular expression.
 *
 * An empty array should be passed,
 * which will contain the placeholder
 * key names. For example "/user/:id" will
 * then contain ["id"].
 *
 * @param  {String|RegExp} path
 * @param  {Array} keys
 * @param  {Boolean} sensitive
 * @param  {Boolean} strict
 * @return {RegExp}
 * @api private
 */

function normalize(path, keys, sensitive, strict) {
  if (path instanceof RegExp) return path;
  path = path
    .concat(strict ? '' : '/?')
    .replace(/\/\(/g, '(?:/')
    .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, function(_, slash, format, key, capture, optional){
      keys.push({ name: key, optional: !! optional });
      slash = slash || '';
      return ''
        + (optional ? '' : slash)
        + '(?:'
        + (optional ? slash : '')
        + (format || '') + (capture || '([^/]+?)') + ')'
        + (optional || '');
    })
    .replace(/([\/.])/g, '\\$1')
    .replace(/\*/g, '(.+)');
  return new RegExp('^' + path + '$', sensitive ? '' : 'i');
}