
describe 'Express'
  describe 'route'
    before
      method = 'get'
    end
    
    it 'should accept a path with callback function'
      -{ this[method]('/user', function(){}) }.should.not.throw_error 
    end
    
    it 'should accept options hash and a callback function'
      -{ this[method]('/user', {}, function(){}) }.should.not.throw_error 
    end
  end
end