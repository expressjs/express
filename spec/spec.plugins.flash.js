
describe 'Express'
  before_each
    reset()
    use(require('express/plugins/cookie').Cookie)
    use(require('express/plugins/session').Session)
    use(require('express/plugins/flash').Flash)
    Session.store.clear()
  end
  
  describe 'Flash'
    describe 'flash()'
      it 'should push a flash message'
        var headers = { headers: { cookie: 'sid=123' }}
        post('/', function(){ return this.flash('info', 'email sent') })
        get('/', function(){ return this.flash('info', 'email received') })
        get('/info', function(){ return this.flash('info').join(', ') || 'empty' })
        get('/messages', function(){ return this.flash('info').join(', ') || 'empty' })
        
        post('/', headers).body.should.eql 'email sent'
        get('/', headers).body.should.eql 'email received'
        get('/info', headers).body.should.eql 'email sent, email received'
        // TODO: seperate once segfault is fixed...
      end
      
      it 'should return the message pushed'
        get('/', function(){ return this.flash('info', 'email sent') })
        get('/').body.should.eql 'email sent'
      end
    end
  end
end