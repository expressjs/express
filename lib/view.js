
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
  , join = path.join
  , utils = require('connect').utils
  , union = require('./utils').union
  , merge = utils.merge
  , http = require('http')
  , fs = require('fs')
  , res = http.ServerResponse.prototype;

/**
 * Render `view` with the given `options` and optional callback `fn`.
 * When a callback function is given a response will _not_ be made
 * automatically, otherwise a response of _200_ and _text/html_ is given.
 *
 * Options:
 *  
 *  - `status`    Response status code (`res.statusCode`)
 *  - `charset`   Set the charset (`res.charset`)
 *
 * Reserved locals:
 *
 *  - `cache`     boolean hinting to the engine it should cache
 *  - `filename`  filename of the view being rendered
 *
 * @param  {String} view
 * @param  {Object|Function} options or callback function
 * @param  {Function} fn
 * @api public
 */

res.render = function(view, opts, fn){
  var self = this
    , options = {}
    , app = this.app
    , req = this.req
    , cache = app.cache
    , engines = app.engines
    , root = app.set('views') || process.cwd() + '/views';

  // support callback function as second arg
  if ('function' == typeof opts) {
    fn = opts, opts = null;
  }

  // merge app.locals
  union(options, app.locals);

  // merge res.locals
  merge(options, this.locals);

  // merge render() options
  if (opts) merge(options, opts);

  // status support
  if (options.status) this.statusCode = options.status;

  // charset option
  if (options.charset) this.charset = options.charset;

  // join "view engine" if necessary
  var ext = extname(view);
  if (!ext) view += '.' + (ext = app.set('view engine'));

  // pass .cache to the engine
  options.cache = app.enabled('view cache');

  // when no extension nor "view engine" is given warn
  if (!ext) {
    console.warn('Warning: cannot determine view engine for "%s"', view);
    console.warn('provide the "view engine" setting or an');
    console.warn('extension such as "foo.jade".');
    return this.end();
  }

  // callback
  fn = fn || function(err, str){
    if (err) return req.next(err);
    self.send(str);
  };

  // render
  try {
    var engine = cache[ext] = cache[ext] || require(ext);
    options.filename = join(root, view);
    view = fs.readFileSync(options.filename, 'utf8');
    engine.render(view, options, fn);
  } catch (err) {
    fn(err);
  }
};
