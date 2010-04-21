
describe 'Express'
  before_each
    reset()
    use(require('express/plugins/redirect').Redirect)
  end
  
  describe 'Redirect'
    describe 'redirect()'
      it 'should set status to 303'
        get('/logout', function(){
          this.redirect('/')
        })
        get('/logout').status.should.eql 303
        get('/logout').headers['Location'].should.eql '/'
      end
      
      it 'should allow optional status code'
        get('/logout', function(){
          this.redirect('/', 304)
        })
        get('/logout').status.should.eql 304
        get('/logout').headers['Location'].should.eql '/'
      end
    end
    
    describe 'redirect("back")'
      it 'should check Referrer header'
        get('/logout', function(){
          this.redirect('back')
        })
        var response = get('/logout', { headers: { referrer: '/login' }})
        response.headers['Location'].should.eql '/login'
      end
      
      it 'should check referer header'
        get('/logout', function(){
          this.redirect('back')
        })
        var response = get('/logout', { headers: { referer: '/login' }})
        response.headers['Location'].should.eql '/login'
      end
    end
    
    describe 'redirect(home)'
      it 'should check set("home")'
        set('home', '/login')
        get('/logout', function(){
          this.redirect('home')
        })
        get('/logout').headers['Location'].should.eql '/login'
      end
      
      it 'should check set("basepath")'
        set('basepath', '/web/')
        get('/logout', function(){
          this.redirect('home')
        })
        get('/logout').headers['Location'].should.eql '/web/'
      end
      
      it 'should default to "/"'
        get('/logout', function(){
          this.redirect('home')
        })
        get('/logout').headers['Location'].should.eql '/'
      end
    end
  end
end