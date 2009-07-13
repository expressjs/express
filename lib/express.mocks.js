
// Express - Mocks - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

(function(){
  
  /**
   * Mock _request_ object. Optionally pass hash of properties.
   *
   * @param  {hash} request
   * @return {hash}
   * @api public
   */
  
  function mockRequest(request) {
    var mock = {
      listeners : [],
      method : 'GET',
      headers : [],
      uri : {
        path : '/',
        params : {}
      },
      setBodyEncoding : function(type) {
        this.bodyEncoding = type 
      },
      addListener : function(event, callback) {
        this.listeners.push({ event : event, callback : callback })
        if (event == 'body') {
          var body = this.body
          this.body = ''
          callback(body)
        }
        else
          callback()
      }
    }
    JSpec.extend(mock, request)
    mock.uri.params = mock.uri.params || {}
    return mock
  }
  
  /**
   * Mock _response_ object. Optionally pass hash of properties.
   *
   * @param  {hash} response
   * @return {hash}
   * @api public
   */
     
  function mockResponse(response) {
    var mock = {
      body : null,
      status : 200,
      headers : [],
      sendHeader : function(){},
      sendBody : function(){},
      finish : function(){ this.finished = true }
    }
    JSpec.extend(mock, response)
    return mock
  }
  
  /**
   * Mock server callback.
   *
   * @param  {object} request
   * @param  {object} response
   * @api private
   */
  
  var orig = Express.server.callback
  function mockCallback(request, response) {
    orig(mockRequest(request), mockResponse(response))
  }
  
  /**
   * Mock route function for HTTP _method_.
   *
   * @param  {string} method
   * @return {function}
   * @api private
   */
  
  function mockRouteFunctionFor(method) {
    var orig =  Express.routeFunctionFor(method)
    return function(path, options, callback) {
      if ((options && options.constructor == Function) ||
          (callback && callback.constructor == Function)) 
            return orig.apply(Express, arguments)
      var request = mockRequest({ method : method.toUpperCase(), uri : { path : path }})
      if (options) JSpec.extend(request, options.request)
      var response = mockResponse()
      Express.server.callback(request, response)
      return Express.response
    }
  }
  
  // --- Module
  
  JSpec.include({
    init : function() {
      Express.server.callback = mockCallback
    },
    
    utilities : {
      mockRequest : mockRequest,
      mockResponse : mockResponse,
      get  : mockRouteFunctionFor('get'),
      post : mockRouteFunctionFor('post'),
      put  : mockRouteFunctionFor('put'),
      del  : mockRouteFunctionFor('delete')
    }
  })
  
})()