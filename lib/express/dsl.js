
// Express - DSL - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

/**
 * Return a routing function for _method_.
 *
 * @param  {string} method
 * @return {function}
 * @api private
 */

function route(method) {
  return function(path, options, fn){
    if (options instanceof Function)
      fn = options, options = {}
    Express.routes.push(new Route(method, path, fn, options))
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
  Express.server.run.apply(Express.server, arguments)
}

/**
 * Configure _env_ with _fn_.
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
 * @param  {function} fn
 * @api public
 */

exports.configure = function(env, fn) {
  if (env instanceof Function)
    fn = env, env = 'all'
  if (fn instanceof Function)
    return Express.config.push([env, fn])
  if (typeof env !== 'string')
    throw new Error('environment required')
  Express.config.each(function(conf){
    if (conf[0] === env ||
        conf[0] === 'all')
      conf[1].call(Express)
  })
}

// --- Routing API

exports.get  = exports.view    = route('get')
exports.post = exports.create  = route('post')
exports.del  = exports.destroy = route('delete')
exports.put  = exports.update  = route('put')
