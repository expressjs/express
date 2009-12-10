
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
          post('/user', { uri: { params: { __method__: 'put' }}}).body.should.eql 'updated user'
        end
        
        it 'should force __method__ to lowercase to conform to internal uses'
          put('/user', function(){
            return 'updated user'
          })
          post('/user', { uri: { params: { __method__: 'PUT' }}}).body.should.eql 'updated user'
        end
      end
    end
  end
end