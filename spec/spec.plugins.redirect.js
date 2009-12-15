
describe 'Express'
  before_each
    reset()
    use(require('express/plugins/redirect').Redirect)
  end
  
  describe 'Redirect'
    describe 'redirect()'
      it 'should set status to 302'
        get('/logout', function(){
          redirect('/')
        })
        get('/logout').status.should.eql 302
        get('/logout').headers['location'].should.eql '/'
      end
    end
    
    describe 'redirect("back")'
      it 'should check Referrer header'
        get('/logout', function(){
          this.redirect('back')
        })
        var response = get('/logout', { headers: { referrer: '/login' }})
        response.headers['location'].should.eql '/login'
      end
      
      it 'should check referer header'
        get('/logout', function(){
          this.redirect('back')
        })
        var response = get('/logout', { headers: { referer: '/login' }})
        response.headers['location'].should.eql '/login'
      end
    end
    
    describe 'redirect(home)'
      it 'should check set("home")'
        set('home', '/login')
        get('/logout', function(){
          this.redirect('home')
        })
        get('/logout').headers['location'].should.eql '/login'
      end
      
      it 'should check set("basepath")'
        set('basepath', '/web/')
        get('/logout', function(){
          this.redirect('home')
        })
        get('/logout').headers['location'].should.eql '/web/'
      end
      
      it 'should default to "/"'
        get('/logout', function(){
          this.redirect('home')
        })
        get('/logout').headers['location'].should.eql '/'
      end
    end
  end
end