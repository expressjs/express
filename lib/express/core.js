
// Express - Core - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

;(function(){
  
  process.mixin(GLOBAL, require('sys'))
  
  // --- Route
  
  Route = Class({
    init: function(method, path, fn, options){
      this.method = method
      this.path = path
      this.fn = fn
    }
  })
  
  // --- Server
  
  Server = Class({
    port: 3000,
    host: 'localhost',
    start: function(host, port){
      var self = this
      if (host) this.host = host
      if (port) this.port = port
      require('http')
        .createServer(function(request, response){
          self.request = request
          self.response = response
          request.addListener('body', function(chunk){ request.body += chunk })
          request.addListener('complete', function(){ self.route() })
        })
        .listen(this.port, this.host)
      puts('Express started at http://' + this.host + ':' + this.port + '/')
    },
    route: function(){
      this.response.body = route(request)
      if (typeof this.response.body == 'string')
        this.respond()
    },
    respond: function(body){
      if (body) this.response.body = body
      this.response.sendHeader(200, { 'content-length': 6 })
      this.response.sendBody(this.response.body || '')
      this.response.finish()
    }
  })
  
  // --- Express
  
  Express = { 
    version: '0.0.1',
    routes: [],
    server: new Server
  }
  
  // --- Utilities
      
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
      Express.routes.push(new Route(method, path, fn, options))
    }
  }
  
  // --- Routing API
  
  get = view = route('get')
  post = create = route('post')
  del = destroy = route('delete')
  put = update = route('put')
  
})()