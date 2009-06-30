
describe 'Express'
  describe 'routing'
    describe '.routeFunctionFor()'
      it 'should return a routing function'
        Express.routes = []
        foo = Express.routeFunctionFor('get')
        foo('/some/path', function(){ return 'body' })
        Express.routes.should.have_length 1
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
        
    describe '.routeMatches()'
      before_each
        request = { method : 'GET', uri : { path : '/user/1/edit' }}
      end
      
      it 'should return true when the route passed is valid for the request passed'
        route = { path : '/user/1/edit', method : 'get' }
        Express.routeMatches(route, request).should.be_true
      end
      
      it 'should return false when invalid method'
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
    
  end
end