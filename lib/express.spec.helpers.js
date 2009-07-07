
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
  
  JSpec.include({
    init : function() {
      var oldCallback = Express.server.callback
      Express.server.callback = function(request, response) {
        oldCallback(mockRequest(request), mockResponse(response))
      }
    },
    
    utilities : {
      mockRequest : mockRequest,
      mockResponse : mockResponse
    }
  })
})()