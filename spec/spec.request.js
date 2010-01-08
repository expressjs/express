
describe 'Express'
  before_each
    reset()
  end
  
  describe 'Request'
    describe '#status()'
      it 'should set the response status'
        get('/user', function(){ this.status(500) })
        get('/user').status.should.eql 500
      end
    end

    describe '#header()'
      describe 'when given a field name and value'
        it 'should set the header'
          get('/user', function(){
            this.header('x-foo', 'bar')
          })
          get('/user').headers.should.have_property 'x-foo', 'bar'
        end  
      end

      describe 'when given a field name'
        it 'should return a request header value'
          get('/user', function(){
            return this.header('host')
          })
          get('/user').body.should.eql 'localhost'
        end

        it 'should be case-insensitive'
          get('/user', function(){
            return this.header('Host')
          })
          get('/user').body.should.eql 'localhost'
        end
      end
    end
    
    describe '#accepts()'
      describe 'when the Accept header is present'
        it 'should return true if the mime type is acceptable'
          get('/user', function(){ return this.accepts('jpeg').toString() })
          get('/user', { headers: { accept: 'image/jpeg' }}).body.should.eql 'true'
        end
        
        it 'should return false if the mime type is not present'
          get('/user', function(){ return this.accepts('html').toString() })
          get('/user', { headers: { accept: 'image/jpeg' }}).body.should.eql 'false'
        end
      end
      
      describe 'when the Accept header is not present'
        it 'should return true'
          get('/user', function(){ return this.accepts('jpeg').toString() })
          get('/user', { headers: { accept: null }}).body.should.eql 'true'
        end
      end
    end
    
    describe '#halt()'
      describe 'when given no arguments'
        it 'should respond with 404 Not Found'
          get('/user', function(){ this.halt() })
          get('/user').status.should.eql 404
          get('/user').body.should.include('Not Found')
        end
      end

      describe 'when given a status code'
        it 'should respond with that status and its associated default body'
          get('/user', function(){ this.halt(400) })
          get('/user').status.should.eql 400
          get('/user').body.should.include('Bad Request')
        end
      end

      describe 'when given a status code and body'
        it 'should respond with the status and its body'
          get('/user', function(){ this.halt(400, 'Oh noes!') })
          get('/user').status.should.eql 400
          get('/user').body.should.include('Oh noes!')
        end
      end

      describe 'when given an invalid status code'
        it 'should throw an InvalidStatusCode exception'
          // TODO: use throw_error when fixed...
          get('/user', function(){ this.halt(123123) })
          try { get('/user') }
          catch (e) {
            e.should.be_an_instance_of ExpressError
            e.should.be_an_instance_of InvalidStatusCode
          }
        end
      end
    end

    describe '#contentType()'
      it 'should set Content-Type header with mime type passed'
        get('/style.css', function(){
          this.contentType('css')
          return 'body { background: white; }'
        })
        get('/style.css').headers['content-type'].should.eql 'text/css'
      end
    end
    
    describe '#attachment()'
      it 'should set Content-Disposition to attachment'
        get('/report', function(){
          this.attachment()
          return 'foo'
        })
        get('/report').headers['content-disposition'].should.eql 'attachment'
      end

      it 'should set attachment filename'
        get('/report', function(){
          this.attachment('report.pdf')
          return 'foo'
        })
        get('/report').headers['content-disposition'].should.eql 'attachment; filename="report.pdf"'
      end
    end

    describe '#param()'
      it 'should return a route placeholder value'
        get('/user/:id', function(){
          return 'user ' + this.param('id')
        })
        get('/user/12').body.should.eql 'user 12'
      end

      it 'should return several route placeholder values'
        get('/user/:id/:operation', function(){
          return this.param('operation') + 'ing user ' + this.param('id') 
        })
        get('/user/12/edit').body.should.eql 'editing user 12'
      end

      it 'should allow optional placeholders'
        get('/user/:id?', function(){
          return this.param('id') ? 'user ' + this.param('id') : 'users'
        })
        get('/user/12').body.should.eql 'user 12'
        get('/user').body.should.eql 'users'
      end

      it 'should allow placeholders as part of a segment'
        get('/report.:format', function(){
          return 'report as ' + this.param('format')
        })
        get('/report.csv').body.should.eql 'report as csv'
        get('/report.pdf').body.should.eql 'report as pdf'
      end

      it 'should allow optional placeholders in middle segments'
        get('/user/:id?/edit', function(){
          return this.param('id') ? 'editing ' + this.param('id') : 'editing your account'
        })
        get('/user/12/edit').body.should.eql 'editing 12'
        get('/user/edit').body.should.eql 'editing your account'
      end

      it 'should work with several routes'
        get('/user/:id', function(){ return this.param('id') })
        get('/product/:name', function(){ return this.param('name') })
        get('/user/12').body.should.eql '12'
        get('/product/ipod').body.should.eql 'ipod'
      end

      it 'should work with a query string'
        get('/user', function(){
          return this.param('page') || 'First page'
        })
        get('/user').body.should.eql 'First page'
        get('/user?page=2').body.should.eql '2'
        get('/user?foo[]=bar&page=5').body.should.eql '5'
      end

      it 'should work with splats'
        get('/:path/*.*', function(path, file, ext){
          return [path, file, ext].join(', ')
        })
        get('/public/app.js').body.should.eql 'public, app, js'
      end
    end    
  end
end