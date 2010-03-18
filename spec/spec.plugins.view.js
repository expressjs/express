
describe 'Express'
  before_each
    reset()
  end
  
  describe 'View'
    describe 'set("views")'
      it 'should default to <root>/views'
        set('root', 'spec')
        set('views').should.eql 'spec/views'
      end
    end
    
    describe '#render()'
      before_each
        set('views', 'spec/fixtures')
      end
      
      describe 'given a valid view name'
        describe 'and layout of the same type exists'
          it 'should render the layout and view'
            get('/', function(){
              this.render('hello.haml.html')
            })
            get('/').body.should.include '<html><body>'
            get('/').body.should.include '<h2>Hello'
          end
          
          it 'should default context to the current request'
            get('/', function(){
              this.title = 'Welcome'
              this.render('page.haml.html', { layout: false })
            })
            get('/').body.should.include '<title>Welcome'
          end
          
          it 'should set the content type based on the last path segment'
            get('/', function(){
              this.render('hello.haml.html')
            })
            get('/').headers['content-type'].should.eql 'text/html'
          end
        end
        
        describe 'and layout of the same type does not exist'
          it 'should throw an error'
            get('/', function(){
              this.render('hello.haml.html', { layout: 'front' })
            })
            -{ get('/') }.should.throw_error 'No such file or directory'
          end
        end
        
        describe 'given a custom layout name'
          it 'should render the layout and view'
            get('/', function(){
              this.title = 'Express'
              this.render('hello.haml.html', { layout: 'page' })
            })
            get('/').body.should.include '<title>Express'
            get('/').body.should.include '<h2>Hello'
          end
        end
        
        describe 'when layout: false'
          it 'should render the view only'
            get('/', function(){
              this.render('hello.haml.html', { layout: false })
            })
            get('/').body.should.not.include '<body>'
            get('/').body.should.include '<h2>Hello'
          end
        end
        
        describe 'when "cache view contents" is enabled'
          it 'should read the views into memory only once'
            enable('cache view contents')
            get('/', function(){
              this.render('hello.haml.html')
            })
            get('/cached', function(){
              return this.cache.get('view:spec/fixtures/hello.haml.html') ? 'yes' : 'no'
            })
            get('/cached').body.should.eql 'no'
            get('/')
            get('/cached').body.should.eql 'yes'
            get('/')
            get('/cached').body.should.eql 'yes'
          end
        end
        
        describe 'when engine cannot be found'
          it 'should throw an error'
            get('/', function(){
              this.render('user.invalid.html')
            })
            -{ get('/') }.should.throw_error "Cannot find module 'invalid'"
          end
        end
        
        describe 'when locals are passed'
          it 'should have direct access to locals'
            get('/user', function(){
              this.render('user.haml.html', {
                locals: {
                  name: 'tj',
                  email: 'tj@vision-media.ca'
                }
              })
            })
            get('/user').body.should.include '<h1>tj'
            get('/user').body.should.include '<p>tj@vision-media.ca'
          end
          
          it 'should have direct access to locals within the layout'
            get('/user', function(){
              this.render('user.haml.html', {
                layout: 'layout.user',
                locals: {
                  name: 'tj',
                  email: 'tj@vision-media.ca'
                }
              })
            })
            get('/user').body.should.include '<title>Viewing tj'
            get('/user').body.should.include '<h1>tj'
            get('/user').body.should.include '<p>tj@vision-media.ca'
          end
        end
        
        describe 'when context is passed'
          it 'should evaluate in context to that object'
            get('/article', function(){
              this.render('article.haml.html', {
                context: {
                  name: 'Writing a Node.js Web Application'
                }
              })
            })
            get('/article').body.should.include '<h2>Writing a Node.js Web Application'
          end
        end
        
      end
      
    end
  end
end