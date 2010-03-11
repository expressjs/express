
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
        // TODO: use throw_error when fixed...
        try { new StaticFile('/../foobar') }
        catch (e) {
          e.name.should.eql 'InvalidPathError'
          e.message.should.eql "`/../foobar' is not a valid path"
        }
      end
    end
  end
end