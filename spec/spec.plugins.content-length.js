
describe 'Express'
  before_each
    reset()
    use(require('express/plugins/content-length').ContentLength)
  end
  
  describe 'ContentLength'
    describe 'on'
      describe 'response'
        it 'should set the content-length header'
          get('/style.css', function(){
            return 'body { background: #000; }'
          })
          get('/style.css').headers['Content-Length'].should.eql 26
        end
        
        it 'should not override when manually set'
          get('/style.css', function(){
            this.header('Content-Length', 10)
            return 'body { background: #000; }'
          })
          get('/style.css').headers['Content-Length'].should.eql 10
        end
      end
    end
  end
end