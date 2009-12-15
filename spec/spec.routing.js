
describe 'Express'
  before_each
    reset()
  end
  
  describe 'route'
    describe 'with callback function'
      it 'should respond with a body string'
        get('/user', function(){
          return 'test'
        })
        get('/user').body.should.eql 'test'
      end
    end
    
    describe 'with options and callback function'
      it 'should respond with a body string'
        get('/user', {}, function(){
          return 'test with options'
        })
        get('/user').body.should.eql 'test with options'
      end
    end
    
    describe 'with a trailing slash in request path'
      it 'should still match'
        get('/user', {}, function(){
          return 'test with options'
        })
        get('/user/').body.should.eql 'test with options'
      end
    end
    
    describe 'with a trailing slash in route path'
      it 'should still match'
        get('/user/', {}, function(){
          return 'test with options'
        })
        get('/user').body.should.eql 'test with options'
      end
    end
    
    describe 'with a trailing whitespace in request path'
      it 'should still match'
        get('/user', {}, function(){
          return 'test with options'
        })
        get('/user/   ').body.should.eql 'test with options'
      end
    end
    
    describe 'with a trailing whitespace in route path'
      it 'should still match'
        get('/user/   ', {}, function(){
          return 'test with options'
        })
        get('/user').body.should.eql 'test with options'
      end
    end
    
    describe 'with several similar routes'
      it 'should match them properly'
        get('/foo', function(){
          return 'bar'
        })
        get('/foos', function(){
          return 'baz'
        })
        get('/foo').body.should.eql 'bar'
        get('/foos').body.should.eql 'baz'
      end
    end
    
    describe 'with several identical routes'
      it 'should match the first route'
        get('/foo', function(){
          return 'bar'
        })
        get('/foo', function(){
          return 'baz'
        })
        get('/foo').body.should.eql 'bar'
      end
    end
    
    describe 'with no response body'
      it 'should throw a InvalidResponseBody'
        get('/user', function(){
          Express.server.respond()
        })
        -{ get('/user') }.should.throw_error(/InvalidResponseBody: get "\/user" did not respond with a body string/)
      end
    end
    
    describe 'with a placeholder'
      it 'should still match'
        get('/user/:id', function(){ return 'yay' })
        get('/user/12').body.should.eql 'yay'
      end
      
      it 'should not match with an additional path segment'
        get('/user/:id', function(){ return 'yay' })
        get('/user/12/edit').body.should.eql 'Not Found'
      end
      
      it 'should pass it to the route function'
        get('/user/:id', function(id){
          return id
        })
        get('/user/12').body.should.eql '12'
      end
    end
    
    describe 'with several placeholders'
      it 'should still match'
        get('/user/:id/:op', function(){ return 'yay' })
        get('/user/12/edit').body.should.eql 'yay'
      end
      
      it 'should pass them to the route function'
        get('/user/:id/:op', function(id, op){
          return op + 'ing user ' + id
        })
        get('/user/12/edit').body.should.eql 'editing user 12'
      end
    end
    
    describe 'with an optional placeholder'
      it 'should match with a value'
        get('/user/:id?', function(){ return 'yay' })
        get('/user/1').body.should.eql 'yay'
      end
      
      it 'should pass it to the route function'
        get('/user/:id?', function(id){
          return id || 'You'
        })
        get('/user/12').body.should.eql '12'
        get('/user').body.should.eql 'You'
      end
      
      it 'should match without a value'
        get('/user/:id?', function(){ return 'yay' })
        get('/user').body.should.eql 'yay'
      end
      
      it 'should not match with an additional path segment'
        get('/user/:id?', function(){ return 'yay' })
        get('/user/12/edit').body.should.eql 'Not Found'
      end
    end
    
    describe 'with partial placeholder'
      it 'should still match'
        get('/report.:format', function(){
          return 'yay'
        })
        get('/report.csv').body.should.eql 'yay'
        get('/report.pdf').body.should.eql 'yay'
      end
      
      it 'should not match without value'
        get('/report.:format', function(){
          return 'yay'
        })
        get('/report.').body.should.eql 'Not Found'
      end
    end
    
    describe 'with an unmatchable request path'
      describe 'with "helpful 404" enabled'
        it 'should show the help html'
          enable('helpful 404')
          get('/something').status.should.eql 404
          get('/something').body.should.include('<h1>Express</h1>')
          get('/something').body.should.include('<h2><em>404</em> Not Found</h2>')
        end
      end
      
      describe 'with "helpful 404" disabled'
        it 'should respond with 404 Not Found'
          get('/something').status.should.eql 404
          get('/something').body.should.eql 'Not Found'
        end
      end
    end
    
    describe 'with an exception thrown'
      describe 'with "show exceptions" enabled'
        it 'should show the exception html'
          enable('show exceptions')
          get('/user', function(){
            throw new Error('Access Denied')
          })
          get('/user').status.should.eql 500
          get('/user').body.should.include('<h1>Express</h1>')
          get('/user').body.should.include('<h2><em>500</em> Error: Access Denied</h2>')
        end
      end
      
      describe 'with "show exceptions" disabled'
        disable('show exceptions')
        it 'should show the regular body'
          get('/user', function(){
            throw new Error('Access Denied')
          })
          get('/user').status.should.eql 500
          get('/user').body.should.include('Internal Server Error')
        end
      end
      
      describe 'with "throw exceptions" enabled'
        it 'should propegate to the global scope'
          enable('throw exceptions')
          get('/user', function(){
            throw new Error('Access Denied')
          })
          -{ get('/user') }.should.throw_error
        end
      end
      
      describe 'with "throw exceptions" disabled'
        it 'should not propegate to the global scope'
          disable('throw exceptions')
          get('/user', function(){
            throw new Error('Access Denied')
          })
          -{ get('/user') }.should.not.throw_error
        end
      end
    end
    
  end
end