
// Express - Core - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

;(function(){
  
  // --- Express
  
  Express = { version: '0.0.1' }
  
  // --- Locals
  
  var plugins = [],
      routes = []
      
  // --- Route
  
  Route = Class({
    init: function(method, path, fn, options){
      this.method = method
      this.path = path
      this.fn = fn
    }
  })
      
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
        callback = options, options = {}
      routes.push(new Route(method, path, fn, options))
    }
  }
  
  // --- Routing API
  
  get = view = route('get')
  post = create = route('post')
  del = destroy = route('delete')
  put = update = route('put')
  
})()