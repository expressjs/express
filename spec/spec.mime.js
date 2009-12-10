
describe 'Express'
  before_each
    reset()
  end
  
  describe 'mime()'
    describe 'when given an extension with leading dot'
      it 'should return the associated mime type'
        mime('.png').should.eql 'image/png'
      end
    end
    
    describe 'when given an extension without leading dot'
      it 'should return the associated mime type'
        mime('png').should.eql 'image/png'
      end
    end
    
    describe 'when given a file path'
      it 'should return the associated mime type'
        mime('/path/to/an/image.png').should.eql 'image/png'
      end
    end
    
    describe 'when given an unknown extension'
      it 'should default to the "default mime type" setting'
        set('default mime type', 'text/plain')
        mime('meow').should.eql 'text/plain'
      end
      
      it 'should default to "application/octet-stream" otherwise'
        mime('meow').should.eql 'application/octet-stream'
      end
    end
  end
end