
CSSColors = Plugin.extend({
  on: {
    response: function(e) {
      if (e.response.headers['content-type'] == mime('css'))
        e.response.body = e.response.body.replace('black', '#000')
    }
  }
})

describe 'Express'
  describe 'use()'
    before_each
      reset()
      use(CSSColors)
    end
    
    describe 'events'
      describe 'onResponse'
        it 'should be triggered before headers and body are sent'
          get('/style.css', function(){
            contentType('css')
            return 'body { color: black; }'
          })
          get('/style.css').body.should.eql 'body { color: #000; }'
        end
      end
    end
  end
end