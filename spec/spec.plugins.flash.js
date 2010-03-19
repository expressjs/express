
describe 'Express'
  before_each
    reset()
    use(require('express/plugins/cookie').Cookie)
    use(require('express/plugins/session').Session)
    use(require('express/plugins/flash').Flash)
    Session.store.clear()
    var sess = new Base(123)
    Session.store.commit(sess, function(){})
  end
  
  describe 'Flash'
    describe '#flash()'
      describe 'given a type and msg'
        it 'should push a flash message'
          var headers = { headers: { cookie: 'sid=123' }}
          post('/', function(){ return this.flash('info', 'email sent') })
          get('/', function(){ return this.flash('info').join(', ') })
          post('/', headers)
          post('/', headers)
          get('/', headers).body.should.eql 'email sent, email sent'
        end
      end
      
      describe 'given a type'
        describe 'when no messages have been pushed'
          it 'should return null'
            var headers = { headers: { cookie: 'sid=123' }}
            get('/', function(){ return this.flash('info') || 'empty' })
            get('/', headers).body.should.eql 'empty'
          end
        end
        
        describe 'when messages have been pushed'
          it 'should persist only until flushed'
            var headers = { headers: { cookie: 'sid=123' }}
            post('/', function(){ return this.flash('info', 'email sent') })
            get('/', function(){ return (this.flash('info') || ['nope!']).join(', ') })
            post('/', headers)
            post('/', headers)
            get('/', headers).body.should.eql 'email sent, email sent'
            get('/', headers).body.should.eql 'nope!'
          end
        end
        
        describe 'given no arguments'
          it 'should provide access to all types'
            var flash, headers = { headers: { cookie: 'sid=123' }}
            post('/', function(){ return this.flash('info', 'email sent') })
            post('/error', function(){ return this.flash('error', 'email failed to send') })
            get('/', function(){ return flash = this.flash(), '' })
            post('/', headers)
            post('/', headers)
            post('/error', headers)
            get('/')
            flash.should.eql { info: ['email sent', 'email sent'], error: ['email failed to send'] }
          end
          
          it 'should persist only until flushed'
            var flash, headers = { headers: { cookie: 'sid=123' }}
            post('/', function(){ return this.flash('info', 'email sent') })
            post('/error', function(){ return this.flash('error', 'email failed to send') })
            get('/', function(){ return flash = this.flash(), '' })
            post('/', headers)
            post('/', headers)
            post('/error', headers)
            get('/', headers)
            flash.should.eql { info: ['email sent', 'email sent'], error: ['email failed to send'] }
            get('/', headers)
            flash.should.eql {}
          end
        end
        
      end
    end
  end
end