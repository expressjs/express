
describe 'Express'
  before_each
    reset()
    hooks = require('express/plugins/hooks')
    use(hooks.Hooks)
    hooks.callbacks.before = []
    hooks.callbacks.after = []
  end
  
  describe 'Hooks'
    describe 'before()'
      it 'should be called before every request'
        GLOBAL.before(function(){
          this.response.body = 'foo'
        })
        GLOBAL.before(function(){
          this.response.body += 'bar'
        })
        get('/user', function(){})
        get('/user').body.should.eql 'foobar'
      end
      
      it 'should be able to halt the request'
        GLOBAL.before(function(){
          this.respond(404, 'woo!')
        })
        get('/user', function(){ return 'fail' })
        get('/user').status.should.eql 404
        get('/user').body.should.eql 'woo!'
      end
    end
    
    describe 'after()'
      it 'should be called after every request'
        var body
        GLOBAL.after(function(){
          body = this.response.body
        })
        get('/user', function(){ return 'test' })
        get('/user').body.should.eql 'test'
        body.should.eql 'test'
      end
    end
  end
end