
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

exports.set = function(option, val) {
  return val === undefined ?
    Express.settings[option] :
      Express.settings[option] = val
}

exports.enable = function(option) {
  set(option, true)
}

exports.disable = function(option) {
  set(option, false)
}

exports.run = function() {
  Express.server.run()
}

exports.get  = exports.view    = route('get')
exports.post = exports.create  = route('post')
exports.del  = exports.destroy = route('delete')
exports.put  = exports.update  = route('put')