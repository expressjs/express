
describe 'Express'
  describe '.mime()'
    it 'should return media type of extensions passed'
      Express.mime('jpeg').should.eql 'image/jpeg'
    end
    
    it 'should return null when invalid'
      Express.mime('foobar').should.be_null
    end
  end
end