
describe 'Express'
  before_each
    reset()
    use(require('express/plugins/cookie').Cookie)
  end
  
  describe 'Cookie'
    describe 'parse()'
      it 'should parse cookie key/value pairs'
        var attrs = 'expires=Fri, 31-Dec-2010 23:59:59 GMT; path=/; domain=.example.net'
        var expected = {
          expires: 'Fri, 31-Dec-2010 23:59:59 GMT',
          path: '/',
          domain: '.example.net'
        }
        parse(attrs).should.eql expected
      end
      
      it 'should normalize keys to lowercase'
        var attrs = 'Expires=Fri, 31-Dec-2010 23:59:59 GMT; Path=/; DOMAIN=.example.net'
        var expected = {
          expires: 'Fri, 31-Dec-2010 23:59:59 GMT',
          path: '/',
          domain: '.example.net'
        }
        parse(attrs).should.eql expected
      end
      
      it 'should disregard ad-hoc whitespace'
        var attrs = '  expires    = Fri, 31-Dec-2010 23:59:59 GMT  ;  path   = /; domain = .example.net  '
        var expected = {
          expires: 'Fri, 31-Dec-2010 23:59:59 GMT',
          path: '/',
          domain: '.example.net'
        }
        parse(attrs).should.eql expected
      end
    end
    
    describe 'on'
      describe 'request'
        it 'should parse the Cookie header'
          get('/user', function(){
            return Express.server.request.cookie['foo']
          })
          get('/user', { headers: { cookie: 'foo=bar' }}).body.should.eql 'bar'
        end
      end
    end
    
    describe 'cookie()'
      it 'should get request cookie values'
        get('/user', function(){
          return cookie('foo')
        })
        get('/user', { headers: { cookie: 'foo=bar' }}).body.should.eql 'bar'
      end
    end
      
  end
end