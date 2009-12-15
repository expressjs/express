
describe 'Express'
  before_each
    reset()
    use(require('express/plugins/common-logger').CommonLogger)
  end
  
  describe 'CommonLogger'
    describe 'on'
      describe 'response'
        it 'should output in common log format'
          GLOBAL.stub('puts')
          GLOBAL.should.receive('puts')
          get('/style.css', function(){
            this.contentType('css')
            return 'body { background: #000; }'
          })
          get('/style.css')
        end
      end
    end
  end
end