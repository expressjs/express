
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
    end
  end
end