
// Express - Spec Helpers - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

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
      method : 'GET',
      uri : {
        params : {}
      }
    }
    JSpec.extend(mock, request)
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
      sendHeader : function(){},
      sendBody : function(){},
      finish : function(){ this.finished = true }
    }
    JSpec.extend(mock, response)
    return mock
  }
  
  function mockRouteFunctionFor(method) {
    var orig = Express.routeFunctionFor(method)
    return function(path, options, callback) {
      p(Express.argsArray(arguments))
      if (options.constructor == Function) callback = options, options = {}
      if (callback) orig.apply(Express, arguments)
    }
  }
  
  JSpec.include({
    init : function() {
      var orig = Express.server.callback
      Express.server.callback = function(request, response) {
        orig(mockRequest(request), mockResponse(response))
      }
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