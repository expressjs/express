
(function(){
  Express = { 
    version : '0.0.1',
    response : { 
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
        response.sendHeader(200, [['Content-Type', 'text/plain']])
        response.sendBody('Testing')
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
    }
  }
  
  Express.start()
})()