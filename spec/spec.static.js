
describe 'Express'
  describe 'StaticFile'
    before
      StaticFile = require('express/static').File
    end
    
    describe '#init'
      it 'should accept and assign #path'
        (new StaticFile('/foo/bar')).path.should.eql '/foo/bar'
      end
      
      it 'should throw an InvalidPathError when .. is found'
        -{ new StaticFile('/../foobar') }.should.throw_error(/InvalidPathError/)
      end
    end
  end
end