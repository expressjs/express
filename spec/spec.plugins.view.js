
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
              this.render('hello.haml.html', { layout: 'page' })
            })
            get('/').body.should.include '<title>Express'
            get('/').body.should.include '<h2>Hello'
          end
        end
      end
      
    end
  end
end