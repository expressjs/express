
describe 'Express'
  before_each
    reset()
    use(require('express/plugins/cookie').Cookie)
    use(Session = require('express/plugins/session').Session)
    Session.store.clear()
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
  
    describe 'session Store.Memory'
      before_each
        memory = new (require('express/plugins/session').Store.Memory)
      end
      
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
      
      describe '#toString()'
        it 'should return [Memory Store]'
          memory.toString().should.eql '[Memory Store]'
        end
      end
      
      describe '#fetch()'
        describe 'when the session does not exist'
          it 'should return a new Session'
            memory.fetch('1').should.have_property 'lastAccess'
          end
        end
        
        describe 'when the session does exist'
          it 'should return the previous session'
            memory.commit({ id: '1', same: true })
            memory.fetch('1').should.have_property 'same', true
          end
        end
      end
      
      describe '#clear()'
        it 'should remove all sessions'
          memory.commit({ id: '1' })
          memory.commit({ id: '2' })
          memory.clear()
          memory.should.not.have_property '1'
          memory.should.not.have_property '2'
        end
      end
      
      describe '#length()'
        it 'should return the number of session'
          memory.commit({ id: '1' })
          memory.commit({ id: '2' })
          memory.length().should.eql 2
        end
      end
      
      describe '#destroy()'
        it 'should destroy a single session'
          memory.commit({ id: '1' })
          memory.commit({ id: '2' })
          memory.destroy('1')
          memory.store.should.not.have_property '1'
          memory.store.should.have_property '2'
        end
      end
      
      describe '#reap()'
        it 'should destroy sessions older than the given age in milliseconds'
          memory.commit({ id: '1', lastAccess: Number(new Date) - 300 })
          memory.commit({ id: '2', lastAccess: Number(new Date) - 250 })
          memory.commit({ id: '3', lastAccess: Number(new Date) - 100 })
          memory.commit({ id: '4', lastAccess: Number(new Date) })
          memory.reap(200)
          memory.store.should.not.have_property '1'
          memory.store.should.not.have_property '2'
          memory.store.should.have_property '3'
          memory.store.should.have_property '4'
        end
      end
    end
    
  end
end