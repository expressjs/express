
describe 'Express'
  describe 'route'
    before
      reset()
      method = 'get'
    end
    
    describe 'with callback function'
      it 'should respond with a body string'
        GLOBAL[method]('/user', function(){
          return 'test'
        })
        GLOBAL[method]('/user').body.should.eql 'test'
      end
    end
    
    describe 'with options and callback function'
      it 'should respond with a body string'
        GLOBAL[method]('/user', {}, function(){
          return 'test with options'
        })
        GLOBAL[method]('/user').body.should.eql 'test with options'
      end
    end
    
    describe 'with an exception thrown'
      it 'should provide display route method and path in the stacktrace'
        GLOBAL[method]('/user', {}, function(){
          throw new Error('access denied')
        })
        -{ GLOBAL[method]('/user') }.should.throw_error
        try { GLOBAL[method]('/user') }
        catch (e){ 
          e.stack.should.include('get')
          e.stack.should.include('"/user"')
        }
      end
    end
    
  end
end