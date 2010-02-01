
describe 'Express'
  before_each
    reset()
    use(require('express/plugins/cookie').Cookie)
    use(require('express/plugins/session').Session)
  end
  
  describe 'Session'
    it 'should persist within specs'
      post('/login', function(){
        this.session.name = 'tj'
        return ''
      })
      get('/login', function(){
        return this.session.name
      })
      get('/login').status.should.eql 200
      get('/login').body.should.eql 'tj'
    end
  end
end