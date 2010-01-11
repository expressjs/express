
describe 'Express'
  before_each
    reset()
    use(require('express/plugins/cache').Cache)
    cache = require('express/plugins/cache')
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
  
  describe 'Store'
    describe 'Memory'
      describe '#toString()'
        it 'should return [Memory Store]'
          (new cache.Store.Memory).toString().should.eql '[Memory Store]'
        end
      end
    end
  end
end