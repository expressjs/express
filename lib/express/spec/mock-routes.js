
// Express - MockRequest - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

function request(path, options, fn) {
  
}

/**
 * Return a mock routing function for _method_.
 *
 * @param  {string} method
 * @return {function}
 * @api private
 */

function route(method) {
  return function(path, options, fn){
    if (options instanceof Function)
      fn = options, options = {}
    if (fn instanceof Function)
      Express.routes.push(new Route(method, path, fn, options))
    else
      request(path, options, fn)
  }
}

// --- Mock routing API

get = view = route('get')
post = create = route('post')
del = destroy = route('delete')
put = update = route('put')