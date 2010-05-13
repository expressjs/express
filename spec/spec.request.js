
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
    
    describe '#charset'
      describe 'when defined'
        it 'should append "; charset=CHARSET'
          get('/user', function(){
            this.contentType('html')
            this.charset = 'UTF-8'
            return '∂'
          })
          get('/user').headers['Content-Type'].should.eql 'text/html; charset=UTF-8'
        end
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
    
    describe '#isXHR'
      it 'should return false unless X-Requested-With is "XMLHttpRequest"'
        get('/', function(){ return this.isXHR ? 'yay' : 'nope' })
        get('/').body.should.eql 'nope'
      end
      
      it 'should return true when X-Requested-With is "XMLHttpRequest"'
        get('/', function(){ return this.isXHR ? 'yay' : 'nope' })
        get('/', { headers: { 'x-requested-with': 'XMLHttpRequest' }}).body.should.eql 'yay'
      end
      
      it 'should be case insensitive'
        get('/', function(){ return this.isXHR ? 'yay' : 'nope' })
        get('/', { headers: { 'x-requested-with': 'xmlhttprequest' }}).body.should.eql 'yay'
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
          get('/user', { headers: { accept: '' }}).body.should.eql 'true'
        end
      end
      
      describe 'should allow multiple arguments'
        it 'should return true if any mime type is present'
          get('/user', function(){ return this.accepts('jpeg', 'png').toString() })
          get('/user', { headers: { accept: 'image/gif,image/png' }}).body.should.eql 'true'
        end
        
        it 'should return false if none of the mime types are present'
          get('/user', function(){ return this.accepts('jpeg', 'png').toString() })
          get('/user', { headers: { accept: 'text/plain,text/html' }}).body.should.eql 'false'
        end
      end
      
      describe 'when a media type range was sent'
        it 'should return true if the group media type matches'
          get('/user', function(){ return this.accepts('html').toString() })
          get('/user', { headers: { accept: 'text/plain,text/*' }}).body.should.eql 'true'
        end
        it 'should return false if the group media type does not match'
          get('/user', function(){ return this.accepts('ogg').toString() })
          get('/user', { headers: { accept: 'text/plain,text/*' }}).body.should.eql 'false'
        end
      end
    end
    
    describe '#contentType()'
      it 'should set Content-Type header with mime type passed'
        get('/style.css', function(){
          this.contentType('css')
          return 'body { background: white; }'
        })
        get('/style.css').headers['Content-Type'].should.eql 'text/css'
      end
    end
    
    describe '#attachment()'
      it 'should set Content-Disposition to attachment'
        get('/report', function(){
          this.attachment()
          return 'foo'
        })
        get('/report').headers['Content-Disposition'].should.eql 'attachment'
      end

      it 'should set attachment filename'
        get('/report', function(){
          this.attachment('report.pdf')
          return 'foo'
        })
        get('/report').headers['Content-Disposition'].should.eql 'attachment; filename="report.pdf"'
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
          var page = this.param('page')
          return page === undefined ? 'First page' : String(page)
        })
        get('/user').body.should.eql 'First page'
        get('/user?page=0').body.should.eql '0'
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
    
    describe '#pass()'
      it 'should pass control to the next matching route'
        get('/user', function(){ 
          this.pass()
        })
        get('/user', function(){
          this.pass()
          return 'nodejs'
        })
        get('/user', function(){ return 'success'})
        get('/user').body.should.eql 'success'
      end
      
      describe 'given a string'
        it 'should pass to the given route'
          get('/user', function(){
            this.pass('/user/1')
          })
          get('/user/:id', function(){
            return 'Supa doopa usa'
          })
          get('/user').body.should.eql 'Supa doopa usa'
        end
      end
    end
    
    describe '#error()'
      describe 'when an error route is defined'
        it 'should be called'
          var err
          disable('throw exceptions')
          global.error(function(e){
            err = e
            this.respond(500, 'FAIL!')
          })
          get('/', function(){ this.error(new Error('whoop')) })
          get('/').body.should.eql 'FAIL!'
          err.message.should.eql 'whoop'
        end
      end
      
      describe 'when not accepting common mime types'
        it 'should render the default 500 status body'
          var headers = { headers: { accept: 'text/xml' }}
          disable('throw exceptions')
          enable('show exceptions')
          get('/', function(){
            this.error(new Error('fail!'))
          })
          get('/', headers).body.should.eql 'Internal Server Error'
          get('/', headers).status.should.eql 500
        end
      end
      
      describe 'when accepting "html"'
        describe 'with "show exceptions" enabled'
          it 'should render the show-exceptions page'
            disable('throw exceptions')
            enable('show exceptions')
            get('/', function(){
              this.error(new Error('fail!'))
            })
            get('/').body.should.include '<em>500</em> Error: fail!'
            get('/').status.should.eql 500
          end
          
          it 'should render the show-exceptions page with errors thrown within the route'
            disable('throw exceptions')
            enable('show exceptions')
            get('/', function(){
              throw new Error('fail!')
            })
            get('/').body.should.include '<em>500</em> Error: fail!'
            get('/').status.should.eql 500
          end
        end
        
        describe 'with "throw exceptions" enabled'
          it 'should re-throw the exception'
            enable('show exceptions')
            enable('throw exceptions')
            get('/', function(){
              this.error(new Error('fail!'))
            })
            -{ get('/') }.should.throw_error Error, 'fail!'
          end
        end
      end
      
      describe 'when accepting "text/plain"'
        describe 'with "show exceptions" enabled'
          it 'should render a text representation of the error'
            disable('throw exceptions')
            enable('show exceptions')
            get('/', function(){
              this.error(new Error('fail!'))
            })
            get('/', { headers: { accept: 'text/plain' }}).body.should.include '500 Error: fail!'
            get('/').status.should.eql 500
          end
        end
      end
      
      describe 'when accepting "application/json"'
        describe 'with "show exceptions" enabled'
          it 'should render a text representation of the error'
            disable('throw exceptions')
            enable('show exceptions')
            get('/', function(){
              this.error(new Error('fail!'))
            })
            get('/', { headers: { accept: 'application/json' }}).body.should.include '{"error":{"message":"fail!"'
            get('/').status.should.eql 500 
          end
        end
      end
      
      describe 'with "show exceptions" disabled'
        it 'should render the default 500 status body'
          disable('throw exceptions')
          get('/', function(){
            this.error(new Error('fail!'))
          })
          get('/').body.should.eql 'Internal Server Error'
          get('/').status.should.eql 500
        end
      end
      
      describe 'with "throw exceptions" enabled'
        it 'should re-throw the exception'
          enable('throw exceptions')
          get('/', function(){
            this.error(new Error('fail!'))
          })
          -{ get('/') }.should.throw_error Error, 'fail!'
        end
      end
    end
    
    describe '#notFound()'
      describe 'when a notFound route is defined'
        it 'should be called'
          notFound(function(){
            this.respond(404, 'Sorry your page was not found')
          })
          get('/', function(){ this.notFound() })
          get('/').body.should.eql 'Sorry your page was not found'
        end
      end
    
      describe 'when accepting "html"'
        describe 'with "helpful 404" enabled'
          it 'should render the not-found page'
            enable('helpful 404')
            get('/', function(){ this.notFound() })
            get('/').body.should.include '<em>404</em> Not Found'
            get('/').status.should.eql 404
          end
        end
      end
      
      describe 'when not accepting "html"'
        describe 'with "helpful 404" enabled'
          it 'should render defaulat 404 status body'
            var headers = { headers: { accept: 'text/plain' }}
            enable('helpful 404')
            get('/', function(){ this.notFound() })
            get('/', headers).body.should.eql 'Not Found'
            get('/', headers).status.should.eql 404
          end
        end
      end
      
      describe 'when "helpful 404" is disabled'
        it 'should render defaulat 404 status body'
          var headers = { headers: { accept: 'text/plain' }}
          enable('helpful 404')
          get('/', function(){ this.notFound() })
          get('/', headers).body.should.eql 'Not Found'
          get('/', headers).status.should.eql 404
        end
      end
    end
        
  end
end