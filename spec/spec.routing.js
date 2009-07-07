
describe 'Express'
  describe 'routing'
    describe '.routeFunctionFor()'
      it 'should return a routing function'
        Express.routes = []
        foo = Express.routeFunctionFor('get')
        foo('/some/path', function(){ return 'body' })
        foo('/something/else', function(){ return 'body' })
        Express.routes.should.have_length 2
      end
    end
    
    describe '.normalizePath()'
      it 'should strip leading / trailing slashes'
        Express.normalizePath('/foo/bar/').should.eql 'foo/bar'
      end

      it 'should strip leading / trailing whitespace'
        Express.normalizePath('  /foo/').should.eql 'foo'
      end
    end
    
    describe '.routeProvides()'
      it 'should match a route providing the correct encoding'
        route = { options : {}}
        request = mockRequest({ headers : { 'accept' : 'text/html' }})
        Express.routeProvides(route, request).should.be_true
        route = { options : { provides : 'text/html' }}
        request = mockRequest({ headers : { 'accept' : 'application/javascript,text/html,text/plain' }})
        Express.routeProvides(route, request).should.be_true
        request = mockRequest({ headers : { 'accept' : 'text/plain' }})
        Express.routeProvides(route, request).should.be_false
        route.options.provides = 'text/plain'
        Express.routeProvides(route, request).should.be_true
        route.options.provides = ['text/html', 'text/plain']
        Express.routeProvides(route, request).should.be_true
      end
    end
        
    describe '.routeMatches()'
      before_each
        request = mockRequest({ uri : { path : '/user/1/edit' }})
      end
      
      it 'should return true when the route passed is valid for the request passed'
        route = { path : '/user/1/edit', method : 'get' }
        Express.routeMatches(route, request).should.be_true
      end
      
      it 'should return false when method is incorrect'
        route = { path : '/user/1/edit', method : 'post' }
        Express.routeMatches(route, request).should.be_false
      end
      
      it 'should return false when path is invalid'
        route = { path : '/user/1', method : 'get' }
        Express.routeMatches(route, request).should.be_false
      end
      
      it 'should return true when path is a valid regexp'
        route = { path : /user\/(\d+)\/edit/, method : 'get' }
        Express.routeMatches(route, request).should.be_true
      end
      
      it 'should return false when path is invalid regexp'
        route = { path : /user\/(\d+)\/view/, method : 'get' }
        Express.routeMatches(route, request).should.be_false
      end
    end
    
    describe '.pathToRegexp()'
      it 'should return a regexp with capture groups when using the :foo syntax'
        Express.pathToRegexp('/user/:name').should.eql(/^\/user\/(.*?)$/i)
        Express.regexpKeys.should.have_length 1
        Express.pathToRegexp('/user/:name/edit').should.eql(/^\/user\/(.*?)\/edit$/i)
        Express.regexpKeys.should.have_length 1
      end
      
      it 'should populate Express.regexpKeys with key names'
        Express.pathToRegexp('user/:name/:op')
        Express.regexpKeys.should.eql ['name', 'op']
        Express.pathToRegexp('admin/:page')
        Express.regexpKeys.should.eql ['page']
      end
    end
    
    describe 'routing functions'
      before_each
        Express.routes = []
      end
      
      it 'should set last expression as response body'
        get('user', function(){ 'tj' })
        get('user').body.should.eql 'tj'
      end
      
      it 'should disregard leading and trailing slashes'
        get('/one', function(){ 'tj' })
        get('one').body.should.eql 'tj'
        
        get('/two/', function(){ 'tj' })
        get('two').body.should.eql 'tj'
        
        get('three/', function(){ 'tj' })
        get('three').body.should.eql 'tj'
      end
      
      it 'should populate params hash when using param keys'
        get('/user/:name', function(){ param('name') })
        get('/user/tj').body.should.eql 'tj'
        get('/user/joe').body.should.eql 'joe'
      end
      
      it 'should populate several param keys'
        get('/admin/:section/:page', function(){
          param('section') + ' ' + param('page')
        })
        get('admin/report/users').body.should.eql 'report users'
      end
      
      it 'should match strings literally'
        get('foo', function(){ 'bar' })
        get('foobar').body.should.not.eql 'bar'
      end
      
      it 'should match using regexp and populate captures array'
        get(/foo(bar)?/, function(){
          captures[1] ? 'got bar' : 'no bar'
        })
        get('foo').body.should.eql 'no bar'
        get('foobar').body.should.eql 'got bar'
      end
    end
    
  end
end