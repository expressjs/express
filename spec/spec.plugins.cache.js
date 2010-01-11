
describe 'Express'
  before_each
    reset()
    require('express/plugins/cache')
  end
  
  describe 'Cache'
    describe 'Request'
      describe '#cache'
        it 'should use memory store by default'
          get('/item', function(){
            return this.cache.toString()
          })
          get('/item').body.should.eql '[Memory Store]'
        end
      end
    end
  end
end