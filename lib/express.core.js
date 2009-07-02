
(function(){
  Express = { 
    version : '0.0.1',
    routes  : [],
    
    // --- Response
    
    response : {
      body : null,
      status : 200,
      headers : {},
      cookie : {}
    },
    
    // --- Defaults
    
    defaults : {
      cookie : {
        maxAge : 3600
      },
      route : {
        callback : function() {
          Express.status('Not Found')
          'Not Found'
        }
      }
    },
    
    hookCallbacks : {
      request : [
        
        // Headers hash
        
        function (request, response) {
          Express.request = request
          request.headers = Express.arrayToHash(request.headers)
        },
        
        // Cookie parsing
        
        function (request, response) {
          Express.response.cookie = request.cookie = Express.parseCookie(request.headers['Cookie'])
        }
      ],
      
      response : [
        function() {
          
        }
      ]
    },
    
    hook : function(name) {
      if (this.hookCallbacks[name])
        for (i = 0, len = this.hookCallbacks[name].length; i < len; ++i)
          this.hookCallbacks[name][i].apply(this, this.argsArray(arguments, 1))
    },
    
    /**
     * Start express, binding to _port_.
     *
     * @param {int} port
     * @api public
     */
    
    start : function(port) {
      this.server.listen(port || 3000, function(request, response){
        Express.hook('request', request, response)
        request.uri.params = Express.parseNestedParams(request.uri.params)
        request.uri.path = Express.normalizePath(request.uri.path)
        Express.response.body = Express.callRouteFor(request)
        Express.prepareCookie()
        Express.hook('response')
        response.sendHeader(Express.response.status, Express.hashToArray(Express.response.headers))
        response.sendBody(Express.response.body || '')
        response.finish()
      })
    },
    
    server : {
      
      /**
       * Listen to _port_ with _callback_.
       *
       * @param {int} port
       * @param {function} callback
       * @api private
       */
      
      listen : function(port, callback) {
        node.http.createServer(callback).listen(port)
        puts('Express listening to http://localhost:' + port)
      }
    },
    
    prepareCookie : function() {
      p (this.response)
      var cookie = []
      for (var key in this.response.cookie)
        if (this.response.cookie.hasOwnProperty(key))
          cookie.push(key + '=' + this.response.cookie[key])
      if (cookie.length)
        this.header('Set-Cookie', cookie.join('; '))
    },
    
    /**
     * Return an associative array generated
     * from the key / value pairs in _hash_.
     *
     * @param  {hash} hash
     * @return {array}
     * @api public
     */
    
    hashToArray : function(hash) {
      var array = []
      for (var key in hash)
        if (hash.hasOwnProperty(key))
          array.push([key, hash[key]])
      return array
    },
    
    /**
     * Return hash generated from an
     * associative array.
     *
     * @param  {array} array
     * @return {hash}
     * @api public
     */
    
    arrayToHash : function(array) {
      var hash = {}
      for (i = 0, len = array.length; i < len; ++i)
        hash[array[i][0]] = array[i][1]
      return hash
    },
    
    /**
     * Set response status to _value_. Where value may be
     * a case-insensitive string such as 'Not Found', 'forbidden',
     * or a numeric HTTP response status code.
     *
     * @param  {int, string} value
     * @return {int}
     * @api public
     */
    
    status : function(value) {
      if (typeof value == 'number') return this.response.status = value
      for (var code in node.http.STATUS_CODES)
        if (node.http.STATUS_CODES.hasOwnProperty(code))
          if (node.http.STATUS_CODES[code].toLowerCase() == value.toLowerCase())
            return this.response.status = code
    },
    
    /**
     * Sets _name_ header to _value_. When _value_
     * is not present the value of the header _name_
     * will be returned (if available).
     *
     * @param {string} name
     * @param {string} value
     * @api public
     */
    
    header : function(name, value) {
      return value ? this.response.headers[name] = value :
               this.response.headers[name]
    },
    
    /**
     * Return param _key_'s value or _defaultValue_ when
     * the param has not been set.
     *
     * @param  {string} key
     * @param  {mixed} defaultValue
     * @return {mixed}
     * @api public
     */
    
    param : function(key, defaultValue) {
      return this.request.uri.params[key] || defaultValue
    },
    
     
    /**
     * Return cookie _key_. When _value_ is present
     * then a response cookie field will be set.
     *
     * @param  {string} key
     * @param  {string} value
     * @return {string, hash}
     * @api public
     */

    cookie : function(key, value) {
      return value ? this.response.cookie[key] = value :
               this.response.cookie[key]
    },
    
    /**
     * Parse _params_, splitting { user[info][name] : 'tj' } into
     * { user : { info : { name : 'tj' }}}
     *
     * @param  {hash} params
     * @return {hash}
     * @api public
     */
    
    parseNestedParams : function(params) {
      for (var key in params)
        if (params.hasOwnProperty(key))
          if (parts = key.split('['))
            if (parts.length > 1)
              for (i = 0, prop = params, len = parts.length; i < len; ++i) {
                if (i == len - 1) {
                  var name = parts[i].replace(']', '')
                  prop[name] = params[key]
                  prop = params, delete params[key]
                }
                else {
                  var name = parts[i].replace(']', '')
                  prop = prop[name] = prop[name] || {}
                }
              }
                
      return params
    },
    
    /**
     * Parse _cookie_ string into an object (hash).
     *
     * @param  {string} cookie
     * @return {hash}
     * @api public
     */
    
    parseCookie : function(cookie) {
      var hash = {}
      if (!cookie) return hash
      var attrs = cookie.split(/\s*;\s*/)
      for (i = 0; i < attrs.length; ++i)
        hash[attrs[i].split('=')[0]] = unescape(attrs[i].split('=')[1])
      return hash
    },
    
    /**
     * Normalize a path. Strips trailing / leading whitespace
     * and slashes ('/').
     *
     * @param  {string} path
     * @return {string}
     * @api public
     */
    
    normalizePath : function(path) {
      if (typeof path != 'string') return path
      return path.replace(/^(\s|\/)*|(\s|\/)*$/g, '')
    },
    
    /**
     * Normalize _path_. When a RegExp it is simply returned,
     * otherwise a string is converted to a regular expression
     * surrounded by ^$. So /user/:id/edit would become:
     *
     * \^/user/(.*?)\/edit\$/
     *
     * Each param key (:id) will be captured and placed in the
     * params array, so param('id') would give the string captured.
     *
     * @param  {string} path
     * @return {regexp}
     * @api public
     */
    
    pathToRegexp : function(path) {
      Express.regexpKeys = []
      if (path.constructor == RegExp) return path
      path = path.replace(/:(\w+)/g, function(_, key){
        Express.regexpKeys.push(key)
        return '(.*?)'
      })
      return new RegExp('^' + this.escapeRegexp(path, '/ [ ]') + '$', 'i')
    },
    
    /**
     * Escape RegExp _chars_ in _string_. Where _chars_ 
     * defaults to regular expression special characters.
     *
     * _chars_ should be a space delimited list of characters,
     * for example '[ ] ( )'.
     *
     * @param  {string} string
     * @param  {string} chars
     * @return {Type}
     * @api public
     */
    
    escapeRegexp : function(string, chars) {
      var specials = (chars || '/ . * + ? | ( ) [ ] { } \\').split(' ').join('|\\')
      return string.replace(new RegExp('(\\' + specials + ')', 'g'), '\\$1')
    },
    
    /**
     * Return the contents of a function body.
     *
     * @param  {function} body
     * @return {string}
     * @api public
     */
    
    contentsOf : function(body) {
      return body.toString().match(/^[^\{]*{((.*\n*)*)}/m)[1]
    },
    
    /**
     * Eval _string_ in context of Express.
     *
     * @param  {string} string
     * @return {mixed}
     * @api public
     */
    
    eval : function(string) {
      return eval('with (Express){' + string + '}')
    },
        
    /**
     * Escape special characters in _html_.
     *
     * @param  {string} html
     * @return {string}
     * @api public
     */
    
    escape : function(html) {
      return html.
        replace(/&/g, '&amp;').
        replace(/"/g, '&quot;').
        replace(/</g, '&lt;').
        replace(/>/g, '&gt;')
    },
    
    /**
     * Convert native arguments object into an
     * array with optional _offset_.
     *
     * @param  {arguments} args
     * @param  {int} offset
     * @return {array}
     * @api public
     */
    
    argsArray : function(args, offset) {
      return Array.prototype.slice.call(args, offset)
    },
    
    /**
     * Check if _route_ matches the proper _request_ method.
     *
     * @param  {hash} route
     * @param  {hash} request
     * @return {bool}
     * @api private
     */
    
    routeMethod : function(route, request) {
      return route.method.toUpperCase() == request.method
    },
    
    /**
     * Check if _route_ matches provides the proper
     * encoding types listed in _request_'s Accept header.
     *
     * @param  {hash} route
     * @param  {hash} request
     * @return {bool}
     * @api private
     */
    
    routeProvides : function(route, request) {
      if (!route.options.provides) return true
      if (route.options.provides.constructor != Array) 
        route.options.provides = [route.options.provides]
      for (i = 0, len = route.options.provides.length; i < len; ++i)
        if (request.headers['Accept'].match(route.options.provides[i]))
          return true
      return false
    },
    
    /**
     * Attept to match and call a route for 
     * the given _request_, returning the data
     * returned by the route callback.
     *
     * @param  {object} request
     * @return {mixed}
     * @api private
     */
    
    callRouteFor : function(request) {
      var route = this.findRouteFor(request) || this.defaults.route
      if (route.keys)
        for (i = 0, len = route.keys.length; i < len; ++i) 
          this.request.uri.params[route.keys[i]] = Express.captures[i+1] || null
      return this.eval(Express.contentsOf(route.callback)).toString()
    },
    
    /**
     * Attemp to find and return a route matching _request_.
     *
     * @param  {object} request
     * @return {object}
     * @api private
     */
    
    findRouteFor : function(request) {
      for (i = 0, len = this.routes.length; i < len; ++i)
        if (this.routeMatches(this.routes[i], request))
          return this.routes[i]
    },
    
    /**
     * Check if _route_ matches _request_
     *
     * @param  {object} route
     * @param  {object} request
     * @return {bool}
     * @api private
     */
    
    routeMatches : function(route, request) {
      // var conditions = [Express.routeMethod]
      // for (i = 0, len = conditions.length; i < len; ++i)
      //   if (!conditions[i](route, request))
      //     return false
      switch (route.path.constructor) {
        case String: return route.path == request.uri.path
        case RegExp: return !! (Express.captures = request.uri.path.match(route.path))
      }
    },
    
    /**
     * Return a routing function for _method_.
     *
     * @param  {string} method
     * @return {function}
     * @api private
     */
    
    routeFunctionFor : function(method) {
      return function(path, options, callback) {
        if (options.constructor == Function) callback = options, options = {}
        path = Express.pathToRegexp(Express.normalizePath(path))
        Express.routes.push({
          keys : Express.regexpKeys,
          path : path,
          method : method,
          options : options,
          callback : callback
        })
      }
    },
    
    readFile : function(path, callback, errorCallback) {
      var promise = node.fs.cat(path, "utf8")
      errorCallback = errorCallback || function(){
        throw "failed to read file `" + path + "'"
      }
      promise.addCallback(callback)
      promise.addErrback(errorCallback)
    },
    
    parseView : function(contents, context) {
      
    },
    
    display : function(path) {
      
    }
  }
  
  get = Express.routeFunctionFor('get')
  post = Express.routeFunctionFor('post')
  del = Express.routeFunctionFor('delete')
  put = Express.routeFunctionFor('put')
  
})()

get('user/:name/:operation', function(){
 p(request.headers['User-Agent'])
 p(request.headers['Accept'])
 p(request.headers['Accept-Encoding'])
 p(request.headers['Cookie'])
 p(request.cookie)
 param('operation') + 'ing ' + param('name')
})

get('cookies', function(){
  cookie('foo', 'bar')
  cookie('some-thing', 'some value')
  cookie('max-age', '1000')
  p(request.headers)
  p(response.headers)
  'Wahoo!'
})

get('articles', function(){
  display('spec/data/example.html.js')
  'list of articles'
})

get(/articles\/(\d+)/, function(){
  'article id ' + captures[1]
})

get('articles/:name', function(){
  if (param('name') == 'tj')
    'hello tj'
  else
    'article name ' + param('name')
})

Express.start()
