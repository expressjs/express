
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
        // TODO: use throw_error when fixed...
        get('/user', function(){
          this.respond()
        })
        try { get('/user') }
        catch (e) {
          e.should.be_an_instance_of InvalidResponseBody
        }
      end
    end
    
    describe 'with regular expression'
      it 'should match'
        get(/^\/user\/(\d+)\/(\w+)/, function(id, operation){
          return [id, operation].join(', ')
        })
        get('/user/12/edit').body.should.eql '12, edit'
        get('/user/12').status.should.eql 404
      end
    end
    
    describe 'with a wild-card'
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
    
    describe 'with several wild-cards'
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
    
    describe 'with an optional wild-card'
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
      
      it 'should match without leading character'
        get('/report.:format?', function(format){ return format || 'none' })
        get('/report.csv').body.should.eql 'csv'
        get('/report').body.should.eql 'none'
      end
      
      it 'should allow common regexp literals'
        get('/user/(\\d+)', function(id){ return id })
        get('/user/12').body.should.eql '12'
        get('/user/asdf').status.should.eql 404
      end
      
    end
    
    describe 'with partial wild-card'
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
    
    describe 'with a single splat'
      it 'should match a single segment'
        get('/public/*', function(file){
          return file
        })
        get('/public/app.js').body.should.eql 'app.js'
      end
      
      it 'should not match when there is nothing to capture'
        get('/public/*', function(file){
          return file
        })
        get('/public/').status.should.eql 404
        get('/public').status.should.eql 404
      end
      
      it 'should match a multiple segments'
        get('/public/*', function(file){
          return file
        })
        get('/public/javascripts/app.js').body.should.eql 'javascripts/app.js'
      end
    end
    
    describe 'with several splats'
      it 'should greedily match'
        get('/public/*.*', function(path, ext){
          return 'path: ' + path + ' ext: ' + ext
        })
        get('/public/app.js').body.should.eql 'path: app ext: js'
      end
      
      it 'should not match when there is nothing to capture'
        get('/public/*.*', function(file){
          return file
        })
        get('/public/foo.').status.should.eql 404
        get('/public/foo').status.should.eql 404
        get('/public/').status.should.eql 404
        get('/public').status.should.eql 404
      end
      
      it 'should greedily match several segments'
        get('/public/*.*', function(path, ext){
          return 'path: ' + path + ' ext: ' + ext
        })
        get('/public/javascripts/app.js').body.should.eql 'path: javascripts/app ext: js'
      end
      
      it 'should greedily match several segments'
        get('/public/*/*.*', function(dir, path, ext){
          return 'dir: ' + dir + ' path: ' + path + ' ext: ' + ext
        })
        get('/public/javascripts/app.js').body.should.eql 'dir: javascripts path: app ext: js'
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
          disable('throw exceptions')
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
        it 'should show the regular body'
          disable('throw exceptions')
          disable('show exceptions')
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