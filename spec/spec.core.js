
describe 'Express'
  describe '.version'
    it 'should be properly formatted'
      Express.version.should.match /\d+\.\d+\.\d+/
    end
  end
  
  describe '.contentsOf()'
    it 'should return the body of a function as a string'
      Express.contentsOf(function(){ return 'foo' }).should.include 'return', 'foo'
    end
  end
  
  describe '.header()'
    it 'should set / get headers'
      Express.header('Content-Type', 'text/html')
      Express.header('Content-Type').should.eql 'text/html'
    end
  end
  
  describe '.status()'
    after_each
      Express.response.status = 200
    end
    
    it 'should set response status code by number'
      Express.status(404)
      Express.response.status.should.eql 404
    end
    
    it 'should set using the status string map'
      Express.status('Not Found')
      Express.response.status.should.eql 404
    end
    
    it 'should be case insensitive'
      Express.status('forbidden')
      Express.response.status.should.eql 403
    end
  end
end