
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
          get('/style.css').headers['content-length'].should.eql 26
        end
        
        it 'should not override when manually set'
          get('/style.css', function(){
            header('content-length', 10)
            return 'body { background: #000; }'
          })
          get('/style.css').headers['content-length'].should.eql 10
        end
      end
    end
  end
end