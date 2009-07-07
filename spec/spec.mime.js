
use(Express.Mime)

describe 'Express'
  describe '.mime()'
    it 'should return media type of extensions passed'
      Express.utilities.mime('jpeg').should.eql 'image/jpeg'
    end
    
    it 'should return application/octet-stream when invalid'
      Express.utilities.mime('foobar').should.eql 'application/octet-stream'
    end
    
    it 'should parse extension of basename or path passed'
      Express.utilities.mime('images/profile.png').should.eql 'image/png'
      Express.utilities.mime('foo.bar.something-else.png').should.eql 'image/png'
    end
  end
end