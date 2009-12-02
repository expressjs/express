
// Express - Core - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

;(function(){
  
  // --- Express
  
  Express = { version: '0.0.1' }
  
  // --- Locals
  
  var plugins = [],
      routes = []
      
  /**
   * Return a routing function for _method_.
   *
   * @param  {string} method
   * @return {function}
   * @api private
   */
  
  function route(method) {
    // return function(path, options, callback) {
    //   if (options.constructor == Function) callback = options, options = {}
    //   path = Express.pathToRegexp(Express.normalizePath(path))
    //   var route = {
    //     keys : Express.regexpKeys,
    //     path : path,
    //     method : method,
    //     options : options,
    //     callback : callback
    //   }
    //   Express.routes.push(route)
    //   Express.hook('onRouteAdded', route)
    }
    
    // --- Routing API
    
    get = view = route('get')
    post = create = route('post')
    del = destroy = route('delete')
    put = update = route('put')
  
})()