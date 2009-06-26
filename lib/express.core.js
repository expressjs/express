
(function(){
  Express = { 
    version : '0.0.1',
    response : {
      body : null,
      status : 200,
      headers : {},
      statuses : {
        'ok'                 : 200,
        'created'            : 201,
        'accepted'           : 202,
        'no content'         : 204,
        'reset content'      : 205,
        'partial content'    : 206,
        'moved permanently'  : 301,
        'found'              : 302,
        'see other'          : 303,
        'not modified'       : 304,
        'use proxy'          : 305,
        'switch proxy'       : 306,
        'temporary redirect' : 307,
        'bad request'        : 400,
        'unauthorized'       : 401,
        'forbidden'          : 403,
        'not found'          : 404
      }
    },
    
    /**
     * Start express, binding to _port_.
     *
     * @param {int} port
     * @api public
     */
    
    start : function(port) {
      this.server.listen(port || 3000, function(request, response){
        Express.callRouteFor(request)
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
        new node.http.Server(callback).listen(port)
        puts('Express running at http://localhost:' + port)
      }
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
      for (var i = 0, len = array.length; i < len; ++i)
        hash[array[i][0]] = array[i][1]
      return hash
    },
    
    /**
     * Set response status to _value_. Where value may be
     * a case-insensitive string such as 'Not Found', 'forbidden',
     * or a numeric HTTP response status code.
     *
     * @param  {int, string} value
     * @api public
     */
    
    status : function(value) {
      this.response.status = this.response.statuses[value.toString().toLowerCase()] || value
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
     * Return the contents of a function body.
     *
     * @param  {function} body
     * @return {string}
     * @api public
     */
    
    contentsOf : function(body) {
      return body.toString().match(/^[^\{]*{((.*\n*)*)}/m)[1]
    },
    
    dump : function(object) {
      puts(JSON.stringify(object))
    },
    
    callRouteFor : function(request) {
      // method GET
      // uri.directory
      // uri.path
      // uri.relative
      // uri.source
      // uri.params
      // headers [[foo, bar]]
      var route = findRouteFor(request)
    },
    
    findRouteFor : function(request) {
      
    },
    
    routeFunctionFor : function(method) {
      
    }
  }
  
  get = Express.routeFunctionFor('get')
  post = Express.routeFunctionFor('post')
  
})()

Express.response.body = 'test'
Express.start()