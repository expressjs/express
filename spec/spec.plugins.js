
CSSColors = Plugin.extend({
  on: {
    response: function(event) {
      if (event.response.headers['content-type'] == mime('css'))
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
    
    describe 'with options provided'
      it 'should merge properties'
        use(CSSColors, { foo: 'bar' })
        $(Express.plugins).last().should.have_property 'foo', 'bar'
      end
    end
    
    describe 'Event'
      describe '#init()'
        it 'should accept arbitrary data'
          var event = new Event('foo', { bar: 'baz' })
          event.bar.should.eql 'baz'
        end
      end
    end
    
    describe 'events'
      describe 'response'
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