
describe 'Express'
  before_each
    reset()
  end
  
  describe 'Logger'
    describe 'events'
      it 'should output in common log format'
        GLOBAL.stub('puts')
        GLOBAL.should.receive('puts')
        use(require('express/plugins/logger').Logger)
        get('/style.css', function(){
          contentType('css')
          return 'body { background: #000; }'
        })
        get('/style.css')
      end
    end
  end
end