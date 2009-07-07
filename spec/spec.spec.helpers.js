
describe 'Express'
  describe 'Spec'
    describe 'Helpers'
      describe 'mockRequest()'
        it 'should return a mock request'
          mockRequest().method.should.eql 'GET'
        end
        
        it 'should merge hash passed'
          mockRequest({ method : 'POST' }).method.should.eql 'POST'
        end
      end
      
      describe 'mockResponse()'
        it 'should return a mock response'
          mockResponse().status.should.eql 200
        end
        
        it 'should merge hash passed'
          mockResponse({ status : 404 }).status.should.eql 404
        end
      end
      
      describe 'get()'
        it 'should get route when available'
          get('users', function(){ 'User list' })
          get('users').body.should.eql 'User list'
          get('other').status.should.eql 404
        end
      end
      
      describe 'post()'
        it 'should post route when available'
          post('users', function(){ 'User list' })
          post('users').body.should.eql 'User list'
          post('other').status.should.eql 404          
        end
      end

      describe 'put()'
        it 'should put route when available'
          put('users', function(){ 'User list' })
          put('users').body.should.eql 'User list'
          put('other').status.should.eql 404          
        end
      end
      
      describe 'del()'
        it 'should delete route when available'
          del('users', function(){ 'User list' })
          del('users').body.should.eql 'User list'
          del('other').status.should.eql 404          
        end
      end
            
    end
  end
end