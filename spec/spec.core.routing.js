
describe 'Express'
  describe 'route'
    before
      method = 'get'
    end
    
    describe 'with callback function'
      it 'should respond with a body string'
        this[method]('/user', function(){
          return 'test'
        })
        this[method]('/user').body.should.eql 'test'
      end
    end
    
    describe 'with options and callback function'
      it 'should respond with a body string'
        this[method]('/user', {}, function(){
          return 'test with options'
        })
        this[method]('/user').body.should.eql 'test with options'
      end
    end
    
  end
end