
describe 'Express'
  before_each
    Express.routes = []
  end
  
  describe '.version'
    it 'should be properly formatted'
      Express.version.should.match /\d+\.\d+\.\d+/
    end
  end
  
  describe '.parseParams()'
    it 'should parse a string of parameters'
      string = 'user[name]=tj&user[pass]=test&foo=some bar stuff&cookies=awesome'
      params = Express.parseParams(string)
      params.user.name.should.eql 'tj'
      params.user.pass.should.eql 'test'
      params.foo.should.eql 'some bar stuff'
      params.cookies.should.eql 'awesome'
    end
  end
  
  describe '.parseNestedParams()'
    it 'should parse nested params hash provided by node'
      params = { 'foo' : 'bar', 'user[name]' : 'tj', 'user[info][email]' : 'tj@vision-media.ca', 'user[info][city]' : 'Victoria' }
      nested = Express.parseNestedParams(params)
      nested.foo.should.eql 'bar'
      nested.user.name.should.eql 'tj'
      nested.user.info.email.should.eql 'tj@vision-media.ca'
      nested.user.info.city.should.eql 'Victoria'
    end
  end
  
  describe '.parseCookie()'
    it 'should parse cookie pairs'
      var cookie = 'expires=Fri, 31-Dec-2010 23:59:59 GMT; path=/; q=foo%3dbar; domain=example.net'
      parts = Express.parseCookie(cookie)
      parts.expires.should.eql 'Fri, 31-Dec-2010 23:59:59 GMT'
      parts.path.should.eql '/'
      parts.q.should.eql 'foo=bar'
      parts.domain.should.eql 'example.net'
    end
  end
  
  describe '.argsArray()'
    it 'should return an array of arguments'
      Express.argsArray(-{ return arguments }('foo', 'bar')).should.eql ['foo', 'bar']
    end
    
    it 'should allow an offset'
      Express.argsArray(-{ return arguments }('foo', 'bar'), 1).should.eql ['bar']
    end
  end
  
  describe '.escape()'
    it 'should escape html'
      Express.escape('<>&""').should.eql '&lt;&gt;&amp;&quot;&quot;'
    end
  end
  
  describe '.escapeRegexp()'
    it 'should escape regexp special characters'
      Express.escapeRegexp('/users/(name)').should.eql '\\/users\\/\\(name\\)'
    end
    
    it 'should accept a string of space-delimited characters'
      Express.escapeRegexp('/foo/#bar?user[name]=tj', '/ [ ]').should.eql '\\/foo\\/#bar?user\\[name\\]=tj'
    end
  end
  
  describe '.contentsOf()'
    it 'should return the body of a function as a string'
      Express.contentsOf(function(){ return 'foo' }).should.include 'return', 'foo'
    end
  end
  
  describe '.header()'
    it 'should set / get headers'
      Express.header('Content-Type', 'text/html')
      Express.header('Content-Type').should.eql 'text/html'
      Express.header('content-type').should.eql 'text/html'
    end
  end
  
  describe '.arg()'
    it 'should return the given path segment'
      Express.request = mockRequest({ uri : { path : 'some/foo-bar/baz' }})
      Express.arg(0).should.eql 'some'
      Express.arg(1).should.eql 'foo-bar'
      Express.arg(2).should.eql 'baz'
    end
    
    it 'should return null when segment does not exist'
      Express.arg(12).should.be_null
    end
  end
  
  describe '.status()'
    after_each
      Express.response.status = 200
    end
    
    it 'should set response status code by number'
      Express.status(404)
      Express.response.status.should.eql 404
    end
    
    it 'should set using the status string map'
      Express.status('Not Found')
      Express.response.status.should.eql 404
    end
    
    it 'should be case insensitive'
      Express.status('forbidden')
      Express.response.status.should.eql 403
    end
  end
  
  describe '.respond()'
    after_each
      Express.response.status = 200
    end
    
    it 'should set response status and body'
      -{ Express.respond('Page or file cannot be found', 'Not Found') }.should.throw_error
      Express.response.status.should.eql 404
      Express.response.body.should.eql 'Page or file cannot be found'
    end
    
    it 'should allow specific status to be passed'
      -{ Express.respond('File cannot be found', 404) }.should.throw_error
      Express.response.status.should.eql 404
      Express.response.body.should.eql 'File cannot be found'
    end
  end
  
  describe '.hashToArray()'
    it 'should map hash key / value pairs to an array'
      headers = { 'Content-Type' : 'text/plain' }
      Express.hashToArray(headers).should.eql [['Content-Type', 'text/plain']]
    end
  end
  
  describe '.arrayToHash()'
    it 'should map an assoc array to an object'
      headers = [['Content-Type', 'text/plain']]
      Express.arrayToHash(headers).should.eql { 'Content-Type' : 'text/plain' }
    end
  end
  
  describe '.redirect()'
    it 'should redirect to the url specified'
      get('foo', function(){ redirect('http://google.com') })
      response = get('foo')
      response.headers.location.should.eql 'http://google.com'
      response.status.should.eql 302
    end
  end
  
  describe 'RedirectHelpers'
    describe '.home'
      it 'should redirect home'
        get('foo', function(){ redirect(home) })
        get('foo').headers.location.should.eql '/'
      end
      
      it 'should not always set location'
        get('foo', function(){ 'bar' })
        get('foo').headers.should.not.have_property 'location'
      end
    end
    
    describe '.back'
      it 'should redirect to the reeferrer'
        uri = 'http://vision-media.ca'
        request = mockRequest({ headers : [['Referer', uri]] })
        get('foo', function(){ redirect(back) })
        get('foo', { request : request }).headers.location.should.eql uri
        Express.back.should.eql uri
      end
    end
  end
  
  describe 'BodyDecoder'
    it 'should parse urlencoded bodies'
      request = mockRequest({ 
          headers : [['Content-Type', 'application/x-www-form-urlencoded']],
          body : 'user[name]=foo%20bar&status=1'
        })
      post('admin', function(){ param('user').name + ' ' + param('status') })
      post('admin', { request : request }).body.should.eql 'foo bar 1'
    end

    it 'should parse JSON bodies'
      request = mockRequest({ 
          headers : [['Content-Type', 'application/json']],
          body : '{ foo : "bar" }'
        })
      post('foo', function(){ param('foo') })
      post('foo', { request : request }).body.should.eql 'bar'
    end
  end
  
  describe 'ContentLength'
    it 'should set the content length header'
      get('foo', function(){ 'foo bar' })
      get('foo').headers['content-length'].should.eql 7
    end
  end
  
  describe 'MethodOverride'
    it 'should override request method when _method param is present'
      request = mockRequest({ 
          headers : [['Content-Type', 'application/x-www-form-urlencoded']],
          body : '_method=delete'
        })
      del('foo', function(){ 'Deleted' })
      post('foo', { request : { body : '_method=delete' }}).body.should.eql 'Deleted'
    end
  end
  
  describe 'DefaultContentType'
    it 'should default to text/html'
      get('foo', function(){ 'bar' })
      get('foo').headers['content-type'].should.eql 'text/html'
    end
    
    it 'should be overridable'
      get('foo', function(){ header('Content-Type', 'application/json'); 'bar' })
      get('foo').headers['content-type'].should.eql 'application/json'
    end
  end
  
end
