
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
    
    describe 'with an exception thrown'
      it 'should provide display route method and path in the stacktrace'
        get('/user', {}, function(){
          throw new Error('access denied')
        })
        -{ get('/user') }.should.throw_error
        try { get('/user') }
        catch (e){
          print(e.stack)
          e.stack.should.include('get')
          e.stack.should.include('("/user")')
        }
      end
    end
    
  end
end