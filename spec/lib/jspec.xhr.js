
// JSpec - XHR - Copyright TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

(function(){

  var lastRequest

  // --- Original XMLHttpRequest

  var OriginalXMLHttpRequest = 'XMLHttpRequest' in this ?
                                 XMLHttpRequest :
                                   function(){}
  var OriginalActiveXObject = 'ActiveXObject' in this ?
                                 ActiveXObject :
                                   undefined

  // --- MockXMLHttpRequest

  var MockXMLHttpRequest = function() {
    this.requestHeaders = {}
  }

  MockXMLHttpRequest.prototype = {
    status: 0,
    async: true,
    readyState: 0,
	  responseXML: null,
    responseText: '',
    abort: function(){},
    onreadystatechange: function(){},

   /**
    * Return response headers hash.
    */

    getAllResponseHeaders : function(){
      return JSpec.inject(this.responseHeaders, '', function(buf, key, val){
        return buf + key + ': ' + val + '\r\n'
      })
    },

    /**
     * Return case-insensitive value for header _name_.
     */

    getResponseHeader : function(name) {
      return this.responseHeaders[name.toLowerCase()]
    },

    /**
     * Set case-insensitive _value_ for header _name_.
     */

    setRequestHeader : function(name, value) {
      this.requestHeaders[name.toLowerCase()] = value
    },

    /**
     * Open mock request.
     */

    open : function(method, url, async, user, password) {
      this.user = user
      this.password = password
      this.url = url
      this.readyState = 1
      this.method = method.toUpperCase()
      if (async != undefined) this.async = async
      if (this.async) this.onreadystatechange()
    },

    /**
     * Send request _data_.
     */

    send : function(data) {
      var self = this
      this.data = data
      this.readyState = 4
      if (this.method == 'HEAD') this.responseText = null
      this.responseHeaders['content-length'] = (this.responseText || '').length
      if(this.async) this.onreadystatechange()
	    this.populateResponseXML()
      lastRequest = function(){
        return self
      }
    },

	/**
	 * Parse request body and populate responseXML if response-type is xml
	 * Based on the standard specification : http://www.w3.org/TR/XMLHttpRequest/
	 */
	populateResponseXML: function() {
		var type = this.getResponseHeader("content-type")
		if (!type || !this.responseText || !type.match(/(text\/xml|application\/xml|\+xml$)/g))
			return
		this.responseXML = JSpec.parseXML(this.responseText)
	  }
  }

  // --- Response status codes

  JSpec.statusCodes = {
    100: 'Continue',
    101: 'Switching Protocols',
    200: 'OK',
    201: 'Created',
    202: 'Accepted',
    203: 'Non-Authoritative Information',
    204: 'No Content',
    205: 'Reset Content',
    206: 'Partial Content',
    300: 'Multiple Choice',
    301: 'Moved Permanently',
    302: 'Found',
    303: 'See Other',
    304: 'Not Modified',
    305: 'Use Proxy',
    307: 'Temporary Redirect',
    400: 'Bad Request',
    401: 'Unauthorized',
    402: 'Payment Required',
    403: 'Forbidden',
    404: 'Not Found',
    405: 'Method Not Allowed',
    406: 'Not Acceptable',
    407: 'Proxy Authentication Required',
    408: 'Request Timeout',
    409: 'Conflict',
    410: 'Gone',
    411: 'Length Required',
    412: 'Precondition Failed',
    413: 'Request Entity Too Large',
    414: 'Request-URI Too Long',
    415: 'Unsupported Media Type',
    416: 'Requested Range Not Satisfiable',
    417: 'Expectation Failed',
    422: 'Unprocessable Entity',
    500: 'Internal Server Error',
    501: 'Not Implemented',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    504: 'Gateway Timeout',
    505: 'HTTP Version Not Supported'
  }

  /**
   * Mock XMLHttpRequest requests.
   *
   *   mockRequest().and_return('some data', 'text/plain', 200, { 'X-SomeHeader' : 'somevalue' })
   *
   * @return {hash}
   * @api public
   */

  function mockRequest() {
    return { and_return : function(body, type, status, headers) {
      XMLHttpRequest = MockXMLHttpRequest
      ActiveXObject = false
      status = status || 200
      headers = headers || {}
      headers['content-type'] = type
      JSpec.extend(XMLHttpRequest.prototype, {
        responseText: body,
        responseHeaders: headers,
        status: status,
        statusText: JSpec.statusCodes[status]
      })
    }}
  }

  /**
   * Unmock XMLHttpRequest requests.
   *
   * @api public
   */

  function unmockRequest() {
    XMLHttpRequest = OriginalXMLHttpRequest
    ActiveXObject = OriginalActiveXObject
  }

  JSpec.include({
    name: 'Mock XHR',

    // --- Utilities

    utilities : {
      mockRequest: mockRequest,
      unmockRequest: unmockRequest
    },

    // --- Hooks

    afterSpec : function() {
      unmockRequest()
    },

    // --- DSLs

    DSLs : {
      snake : {
        mock_request: mockRequest,
        unmock_request: unmockRequest,
        last_request: function(){ return lastRequest() }
      }
    }

  })
})()
