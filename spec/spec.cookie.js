
use(Express.Cookie)

describe 'Express'
  describe 'Cookie'
    before_each
      Express.routes = []
    end
    
    describe 'settings'
      it 'should maxAge'
        Express.settings.cookie.maxAge.should.be_a Number
      end
    end
    
    describe 'onRequest'
      it 'should parse cookie fields'
        get('foo', function() {
            utilities.cookie('q')
        })
        response = get('foo', { headers : [['Cookie', 'path=/; q=something; domain=.example.net']] })
        response.body.should.eql 'something'
      end
    end
  
    describe 'utilities'
      describe 'cookie()'
        before_each
          Express.response.cookie = Express.parseCookie('path=/; q=foo%3dbar; domain=.example.net')
        end

        it 'should return cookie value when key passed'
          Express.Cookie.utilities.cookie('path').should.eql '/'
          Express.Cookie.utilities.cookie('domain').should.eql '.example.net'
        end

        it 'should set response cookies when value passed'
          Express.Cookie.utilities.cookie('foo', 'bar')
          Express.Cookie.utilities.cookie('foo').should.eql 'bar'
        end
      end
    end
  end
end
