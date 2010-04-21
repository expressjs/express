
var mime = require('express/mime')

CSSColors = Plugin.extend({
  extend: {
    init: function() {
      this.initialized = true
    }
  },
  on: {
    response: function(event) {
      if (event.response.headers['Content-Type'] === mime.type('css'))
        event.response.body = event.response.body.replace('black', '#000')
    }
  }
})

describe 'Express'
  describe 'use()'
    before_each
      reset()
      use(CSSColors)
    end
    
    it 'should call .init on plugins when available'
      CSSColors.initialized.should.be_true
    end
    
    describe 'events'
      describe 'response'
        it 'should be triggered before headers and body are sent'
          get('/style.css', function(){
            this.contentType('css')
            return 'body { color: black; }'
          })
          get('/style.css').body.should.eql 'body { color: #000; }'
        end
      end
    end
  end
end