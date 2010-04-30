
ejs = require('ejs')

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
    
    describe 'set("partials")'
      it 'should default to <views>/partials'
        set('root', 'spec')
        set('partials').should.eql 'spec/views/partials'
        set('views', 'magicland')
        set('partials').should.eql 'magicland/partials'
      end
    end
    
    describe 'ejs'
      it 'should work without options'
        var str = '<h2><%= "Title" %></h2>'
        ejs.render(str).should.eql '<h2>Title</h2>'
      end
      
      it 'should work with locals'
        var str = '<h2><%= title %></h2>'
        ejs.render(str, { locals: { title: 'Title' }}).should.eql '<h2>Title</h2>'
      end
    end
    
    describe '#partial()'
      before_each
        set('views', 'spec/fixtures')
        set('partials', 'spec/fixtures/partials')
      end
      
      describe 'given a valid view name'
        it 'should render a partial'
          get('/', function(){
            this.render('list.html.haml', { locals: { items: ['foo', 'bar'] }})
          })
          get('/').body.should.include '<ul>'
          get('/').body.should.include '<li>foo'
          get('/').body.should.include '<li>bar'
        end
        
        it 'should render collections'
          get('/', function(){
            return this.partial('item.html.haml', {
              collection: ['foo', 'bar']
            })
          })
          get('/').body.should.include '<li>foo'
          get('/').body.should.include '<li>bar'
        end
        
        it 'should render collections with a given object name'
          get('/', function(){
            return this.partial('video.html.haml', {
              collection: ['im a movie', 'im another movie'],
              as: 'vid'
            })
          })
          get('/').body.should.include '<li>im a movie'
          get('/').body.should.include '<li>im another movie'
        end
        
        it 'should pass __isFirst__, __isLast__, and __index__ to partials as locals'
          get('/', function(){
            return this.partial('article.html.haml', {
              collection: ['a', 'b', 'c']
            })
          })
          get('/').body.should.include '<li class="first">a'
          get('/').body.should.include '<li class="1">b'
          get('/').body.should.include '<li class="last">c'
        end
      end
    end
    
    describe '#render()'
      before_each
        set('views', 'spec/fixtures')
      end
      
      describe 'given a callback'
        it 'should be passed the rendered content'
          get('/', function(){
            this.render('hello.html.haml', {}, function(err, content){
              if (err) this.error(err)
              else this.respond(203, content)
            })
          })
          get('/').body.should.include '<html>\n<body>'
          get('/').status.should.eql 203
        end
      end
      
      describe 'given a valid view name'
        describe 'and layout of the same type exists'
          it 'should render the layout and view'
            get('/', function(){
              this.render('hello.html.haml')
            })
            get('/').body.should.include '<html>\n<body>'
            get('/').body.should.include '<h2>Hello'
          end
          
          it 'should default context to the current request'
            get('/', function(){
              this.title = 'Welcome'
              this.render('page.html.haml', { layout: false })
            })
            get('/').body.should.include '<title>Welcome'
          end
          
          it 'should set the content type based on the last path segment'
            get('/', function(){
              this.render('hello.html.haml')
            })
            get('/').headers['Content-Type'].should.eql 'text/html'
          end
        end
        
        describe 'and layout of the same type does not exist'
          it 'should throw an error'
            get('/', function(){
              this.render('hello.html.haml', { layout: 'front' })
            })
            -{ get('/') }.should.throw_error 'ENOENT, No such file or directory'
          end
        end
        
        describe 'given a custom layout name'
          it 'should render the layout and view'
            get('/', function(){
              this.title = 'Express'
              this.render('hello.html.haml', { layout: 'page' })
            })
            get('/').body.should.include '<title>Express'
            get('/').body.should.include '<h2>Hello'
          end
        end
        
        describe 'when layout: false'
          it 'should render the view only'
            get('/', function(){
              this.render('hello.html.haml', { layout: false })
            })
            get('/').body.should.not.include '<body>'
            get('/').body.should.include '<h2>Hello'
          end
        end
        
        describe 'when engine cannot be found'
          it 'should throw an error'
            get('/', function(){
              this.render('user.html.invalid')
            })
            -{ get('/') }.should.throw_error "Cannot find module 'invalid'"
          end
        end
        
        describe 'when locals are passed'
          it 'should have direct access to locals'
            get('/user', function(){
              this.render('user.html.haml', {
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
              this.render('user.html.haml', {
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
              this.render('article.html.haml', {
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