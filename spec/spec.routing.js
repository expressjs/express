
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
    
    describe '.routeMatches()'
      before_each
        request = { method : 'GET', uri : { path : '/user/1/edit'}}
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
  end
end