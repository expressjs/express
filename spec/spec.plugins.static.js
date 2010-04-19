
describe 'Express'
  describe 'Static'
    before
      use(require('express/plugins/static').Static, { path: 'spec/fixtures' })
    end
    
    // TODO: spec again when JSpec has async support ... mocking out FileReadStream
    // is to much of a hassle
    
    // describe 'GET /public/*'
    //    it 'should transfer static files'
    //      get('/public/user.json').body.should.include '"name":'
    //    end
    //  end
    //  
    //  describe '#sendfile()'
    //    describe 'when the file exists'
    //      it 'should throw an InvalidPathError when .. is found'
    //        get('/public/*', function(file){
    //          this.sendfile(file)
    //        })
    //        try { get('/public/../foobar') }
    //        catch (e) {
    //          e.name.should.eql 'InvalidPathError'
    //          e.message.should.eql "`spec/fixtures/../foobar' is not a valid path"
    //        }
    //      end
    //      
    //      it 'should transfer the file'
    //        get('/public/*', function(file){
    //          this.sendfile('spec/fixtures/' + file)
    //        })
    //        get('/public/user.json').body.should.include '"name":'
    //      end
    //      
    //      it 'should automatically set the content type based on extension'
    //        get('/public/*', function(file){
    //          this.sendfile('spec/fixtures/' + file)
    //        })
    //        get('/public/user.json').headers['content-type'].should.eql 'application/json'
    //      end
    //    end
    //  end
    //  
    //  describe '#download()' 
    //    describe 'when the file exists'
    //      it 'should set attachment filename'
    //        get('/report', function(){
    //          this.download('report.pdf')
    //          return 'foo'
    //        })
    //        get('/report').headers['content-disposition'].should.eql 'attachment; filename="report.pdf"'
    //      end
    //      
    //      it 'should transfer the file'
    //        get('/public/*', function(file){
    //          this.download('spec/fixtures/' + file)
    //        })
    //        get('/public/user.json').body.should.include '"name":'
    //      end
    //      
    //      it 'should automatically set the content type based on extension'
    //        get('/public/*', function(file){
    //          this.download('spec/fixtures/' + file)
    //        })
    //        get('/public/user.json').headers['content-type'].should.eql 'application/json'
    //      end
    //    end
    //  end
    //     
  end
end