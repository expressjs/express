
describe 'Express'
  describe 'StaticFile'
    before
      StaticFile = require('express/plugins/static').File
      use(require('express/plugins/static').Static, { path: 'spec/fixtures' })
    end
    
    describe '#constructor'
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
    
    describe 'GET /public/*'
      it 'should transfer static files'
        get('/public/user.json').body.should.include '"name":'
      end
    end
    
    describe '#sendfile()'
      describe 'when the file exists'
        it 'should transfer the file'
          get('/public/*', function(file){
            this.sendfile('spec/fixtures/' + file)
          })
          get('/public/user.json').body.should.include '"name":'
        end
        
        it 'should automatically set the content type based on extension'
          get('/public/*', function(file){
            this.sendfile('spec/fixtures/' + file)
          })
          get('/public/user.json').headers['content-type'].should.eql 'application/json'
        end
      end
      
      describe 'when "cache static files" is enabled'
        it 'should transfer the file'
          enable('cache static files')
          get('/public/*', function(file){
            this.sendfile('spec/fixtures/' + file)
          })
          get('/cached', function(){
            var self = this
            this.cache.get('static:spec/fixtures/user.json', function(val){
              self.halt(200, val ? 'yes' : 'no')
            })
          })
          get('/cached').body.should.eql 'no'
          get('/public/user.json').body.should.include '"name":'
          get('/cached').body.should.eql 'yes'
          get('/cached').body.should.eql 'yes'
        end
        
        it 'should automatically set the content type based on extension'
          enable('cache static files')
          get('/public/*', function(file){
            this.sendfile('spec/fixtures/' + file)
          })
          get('/public/user.json').headers['content-type'].should.eql 'application/json'
          get('/public/user.json').headers['content-type'].should.eql 'application/json'
          get('/public/user.json').headers['content-type'].should.eql 'application/json'
        end
      end
    end
    
    describe '#download()' 
      describe 'when the file exists'
        it 'should set attachment filename'
          get('/report', function(){
            this.download('report.pdf')
            return 'foo'
          })
          get('/report').headers['content-disposition'].should.eql 'attachment; filename="report.pdf"'
        end
        
        it 'should transfer the file'
          get('/public/*', function(file){
            this.download('spec/fixtures/' + file)
          })
          get('/public/user.json').body.should.include '"name":'
        end
        
        it 'should automatically set the content type based on extension'
          get('/public/*', function(file){
            this.download('spec/fixtures/' + file)
          })
          get('/public/user.json').headers['content-type'].should.eql 'application/json'
        end
      end
    end
    
  end
end