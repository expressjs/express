
describe 'Express'
  before_each
    reset()
    use(require('express/plugins/cookie').Cookie)
    use(require('express/plugins/session').Session)
  end
  
  describe 'Session'
    describe 'when sid cookie is not present'
      it 'should set sid cookie'
        get('/login', function(){ return '' })
        get('/login').headers['set-cookie'].should.match(/^sid=(\w+);/)
      end
    end
    
    describe 'when sid cookie is present'
      it 'should not set sid'
        get('/login', function(){ return '' })
        get('/login', { headers: { cookie: 'sid=123' }}).headers.should.not.have_property 'set-cookie'
      end
    end
  
    describe 'with MemoryStore'
      it 'should persist'
        post('/login', function(){
          return this.session.name = 'tj'
        })
        get('/login', function(){
          return this.session.name
        })
        var headers = { headers: { cookie: 'sid=123' }}
        post('/login', headers)
        get('/login', headers).status.should.eql 200
        get('/login', headers).body.should.eql 'tj'
      end
    end
  end
end