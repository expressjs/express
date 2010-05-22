
describe 'Express'
  before_each
    reset()
    use(require('express/plugins/cookie').Cookie)
    compileCookie = require('express/plugins/cookie').compileCookie
    parseCookie = require('express/plugins/cookie').parseCookie
  end
  
  describe 'Cookie'
    describe 'compileCookie()'
      it 'should return a cookie string'
        var options = {
          path: '/',
          domain: '.vision-media.ca'
        }
        compileCookie('foo', 'bar', options).should.eql 'foo=bar; path=/; domain=.vision-media.ca'
      end
      
      it 'should correctly format any Date objects'
        var options = {
          expires: new Date(Date.parse('May 25, 1987 11:13:00 PDT')),
          path: '/foo',
          domain: '.vision-media.ca'
        }
        compileCookie('foo', 'bar', options).should.eql 'foo=bar; expires=Mon, 25 May 1987 18:13:00 GMT; path=/foo; domain=.vision-media.ca'
      end
      
      it 'should convert true to a key without a value'
        var options = {
          path: '/',
          secure: true,
          httpOnly: true
        }
        compileCookie('foo', 'bar', options).should.eql 'foo=bar; path=/; secure; httpOnly'
      end
      
      it 'should compile without options'
        compileCookie('foo', 'bar').should.eql 'foo=bar'
      end
    end
  
    describe 'parseCookie()'
      it 'should parse cookie key/value pairs'
        var attrs = 'sid=1232431234234; data=foo'
        parseCookie(attrs).should.eql { sid: '1232431234234', data: 'foo' }
      end
      
      it 'should preserve case'
        var attrs = 'SID=1232431234234; Data=foo'
        parseCookie(attrs).should.eql { SID: '1232431234234', Data: 'foo' }
      end
      
      it 'should disregard ad-hoc invalid whitespace'
        var attrs = ' SID     =  1232431234234 ;  data =  foo'
        parseCookie(attrs).should.eql { SID: '1232431234234', data: 'foo' }
      end

      it 'should support complex quoted values'
        var attrs = 'SID="123456789"; fbs_0011223355="uid=0987654321&name=Test+User"'
        parseCookie(attrs).should.eql { SID: '123456789', fbs_0011223355: 'uid=0987654321&name=Test User' }
      end
      
      it 'should not override when a duplicate key is found'
        var attrs = 'SID=1234; SID=9999'
        parseCookie(attrs).should.eql { SID: '1234' }
      end
      
      it 'should support malformed cookies'
        var attrs = 'SID'
        parseCookie(attrs).should.eql {}
      end
    end
    
    describe 'on'
      describe 'request'
        it 'should parse the Cookie header'
          get('/user', function(){
            return this.cookie('foo')
          })
          get('/user', { headers: { cookie: 'foo=bar' }}).body.should.eql 'bar'
        end
      end
      
      describe 'response'
        it 'should populate Set-Cookie'
          get('/user', function(){
            this.cookie('SID', '732423sdfs73243', { path: '/', secure: true })
            return ''  
          })
          get('/user').headers['Set-Cookie'].should.eql 'SID=732423sdfs73243; path=/; secure'
        end
        
        it 'should set multiple cookies'
          get('/user', function(){
            this.cookie('SID', '732423sdfs73243', { path: '/', secure: true })
            this.cookie('foo', 'bar')
            return ''  
          })
          get('/user').headers['Set-Cookie'].should.eql 'SID=732423sdfs73243; path=/; secure\r\nSet-Cookie: foo=bar; path=/'
        end
        
        it 'should delete the cookie'
          get('/user', function(){
            this.cookie('ninja', null)
            this.cookie('pirate', null)
            return ''  
          })
          get('/user').headers['Set-Cookie'].should.eql 'ninja=delete; path=/; expires=Thu, 01 Jan 1970 02:46:40 GMT\r\nSet-Cookie: pirate=delete; path=/; expires=Thu, 01 Jan 1970 02:46:40 GMT'
        end

        it 'should support URL unfriendly characters'
          get('/user', function(){
            this.cookie('spaceship', '<*==*>', { path: '/', secure: true })
            this.cookie(':)', 'smileyface')
            return ''  
          })
          get('/user').headers['Set-Cookie'].should.eql 'spaceship=%3C*%3D%3D*%3E; path=/; secure\r\nSet-Cookie: %3A)=smileyface; path=/'
        end
      end
    end
    
    describe 'cookie()'
      it 'should get request cookie values'
        get('/user', function(){
          return this.cookie('foo')
        })
        get('/user', { headers: { cookie: 'foo=bar%3D%3D' }}).body.should.eql 'bar=='
      end
    end
      
  end
end
