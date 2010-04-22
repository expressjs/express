
// Express - DSL - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

/**
 * Return a routing function for _method_.
 *
 * @param  {string} method
 * @return {function}
 * @api private
 */

function route(method) {
  return function(path, options, callback){
    if (options instanceof Function)
      callback = options, options = {}
    Express.routes.push(new Route(method, path, callback, options))
  }
}

/**
 * Set _option_ to _val_. When only _option_ is
 * present its current value will be returned.
 *
 * @param  {string} option
 * @param  {mixed} val
 * @return {mixed}
 * @api public
 */

exports.set = function(option, val) {
  return val === undefined
    ? Express.settings[option] instanceof Function
      ? Express.settings[option]()
      : Express.settings[option]
    : Express.settings[option] = val
}

/**
 * Enable _options_.
 *
 * @param  {string} option
 * @api public
 */

exports.enable = function(option) {
  set(option, true)
}

/**
 * Disable _option_.
 *
 * @param  {string} option
 * @api public
 */

exports.disable = function(option) {
  set(option, false)
}

/**
 * Run Express, view Server#run() for parameters.
 *
 * All configuration handlers for EXPRESS_ENV or 'development'
 * are called before starting the server.
 *
 * @see Server#run()
 * @api public
 */

exports.run = function() {
  configure(Express.environment = process.env.EXPRESS_ENV || 'development')
  Express.plugins.each(function(plugin){
    if ('init' in plugin.klass)
      plugin.klass.init(plugin.options)
  })
  return Express.server.run.apply(Express.server, arguments)
}

/**
 * Configure _env_ with _callback_.
 *
 * Global configuration, disregards which
 * environment is active:
 *
 *    configure(function(){
 *      // ...
 *    })
 *
 * Environment specific configuration:
 *
 *    configure('development', function(){
 *      // ...
 *    })
 *
 * Running configurations:
 * 
 *    configure('development')
 *
 * @param  {string, function} env
 * @param  {function} callback
 * @api public
 */

exports.configure = function(env, callback) {
  if (env instanceof Function)
    callback = env, env = 'all'
  if (callback instanceof Function)
    return Express.config.push([env, callback])
  if (typeof env !== 'string')
    throw new TypeError('environment required')
  Express.config.each(function(conf){
    if (conf[0] === env ||
        conf[0] === 'all')
      conf[1].call(Express)
  })
}

/**
 * Pre-process param _key_ with _callback_.
 *
 * @param  {string} key
 * @param  {function} callback
 * @api public
 */

exports.param = function(key, callback) {
  if (typeof key !== 'string')
    throw new TypeError('param key must be a string')
  if (typeof callback !== 'function')
    throw new TypeError('param must pass a function to process "' + key + '"')
  Express.params[key] = callback
}

/**
 * Register a "Not Found" route with the given _callback_.
 *
 * @param  {function} callback
 * @api public
 */

exports.notFound = function(callback) {
  Express.notFound = callback
}

/**
 * Register an "error" route with the given _callback_.
 *
 * @param  {function} callback
 * @api public
 */

exports.error = function(callback) {
  Express.error = callback
}

// --- Routing API

exports.get  = exports.view    = route('get')
exports.post = exports.create  = route('post')
exports.del  = exports.destroy = route('delete')
exports.put  = exports.update  = route('put')
