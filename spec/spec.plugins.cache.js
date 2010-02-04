
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
  
  describe 'cache Store.Memory'
    before_each
      store = new cache.Store.Memory
    end
    
    describe '#toString()'
      it 'should return [Memory Store]'
        store.toString().should.eql '[Memory Store]'
      end
    end
    
    describe '#set()'
      describe 'given a key and value'
        it 'should set the cache data'
          store.set('foo', 'bar')
          store.get('foo').should.eql 'bar'
        end
        
        it 'should override existing data'
          store.set('foo', 'bar')
          store.set('foo', 'baz')
          store.get('foo').should.eql 'baz'
        end
        
        it 'should return data'
          store.set('foo', 'bar').should.eql 'bar'
        end
      end
      
      describe 'given an abitrary key'
        it 'should throw an error'
          -{ store.set({}, 'foo') }.should.throw_error
        end
      end
      
      describe 'given an abitrary value'
        it 'should serialize as JSON'
          store.set('user', { name: 'tj' }).should.eql { name: 'tj' }
        end
      end
    end
    
    describe '#get()'
      describe 'given a key'
        it 'should return cached value'
          store.set('foo', 'bar')
          store.get('foo').should.eql 'bar'
        end
        
        it 'should unserialize JSON data'
          store.set('user', { name: 'tj' })
          store.get('user').should.eql { name: 'tj' }
        end
      end
      
      describe 'given wildcards'
        it 'should return a set of caches'
          store.set('user:1', 'a')
          store.set('user:2', 'b')
          store.set('foo', 'bar')
          store.get('user:*').should.eql { 'user:1': 'a', 'user:2': 'b' }
        end
      end
    end
    
    describe '#clear()'
      describe 'given a key'
        it 'should delete previous data'
          store.set('foo', 'bar')
          store.clear('foo')
          store.get('foo').should.be_null
        end
      end
      
      describe 'given wildcards'
        it 'should clear a set of caches'
          store.set('user:one', '1')
          store.set('user:two', '2')
          store.clear('user:*')
          store.get('user:one').should.be_null
          store.get('user:two').should.be_null
        end
      end
    end
    
    describe '#reap()'
      it 'should destroy caches older than the given age in milliseconds'
        store.set('user:one', '1')
        store.data['user:one'].created = Number(new Date) - 300
        store.set('user:two', '2')
        store.data['user:two'].created = Number(new Date) - 100
        store.reap(200)
        store.get('user:one').should.be_null
        store.get('user:two').should.not.be_null
      end
    end
  end
end