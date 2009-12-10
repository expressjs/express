
describe 'Express'
  before_each
    reset()
    use(require('express/plugins/method-override').MethodOverride)
  end
  
  describe 'MethodOverride'
    describe 'on'
      describe 'request'
        it 'should consider __method__ as the HTTP method'
          put('/user', function(){
            return 'updated user'
          })
          post('/user', { __method__: 'put' }).body.should.eql 'updated user'
        end
      end
    end
  end
end