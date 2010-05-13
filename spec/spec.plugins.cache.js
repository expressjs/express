
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
          var result
          store.set('foo', 'bar', function(){
            store.get('foo', function(val){
              result = val
            })
          })
          result.should.eql 'bar'
        end
        
        it 'should work with regexp special characters'
          var result,
              result2
          store.set('page:/users/1/comments?page=2', 'html', function(){
            store.get('page:/users/1/comments?page=2', function(val){
              result = val
              store.get('page:*', function(vals){
                result2 = vals
              })
            })
          })
          result.should.eql 'html'
          result2.should.eql { 'page:/users/1/comments?page=2': 'html' }
        end
        
        it 'should override existing data'
          var result
          store.set('foo', 'bar', function(){
            store.set('foo', 'baz', function(){
              store.get('foo', function(val){
                result = val
              })
            })
          })
          result.should.eql 'baz'
        end
      end
      
      describe 'given an abitrary key'
        it 'should throw an error'
          -{ store.set({}, 'foo') }.should.throw_error
        end
      end
      
      describe 'given an abitrary value'
        it 'should serialize as JSON'
          var result
          store.set('user', { name: 'tj' }, function(val){
            result = val
          })
          result.should.eql { name: 'tj' }
        end
      end
    end
    
    describe '#get()'
      describe 'given a key'
        it 'should unserialize JSON data'
          var result
          store.set('user', { name: 'tj' }, function(){
            store.get('user', function(val){
              result = val
            })
          })
          result.should.eql { name: 'tj' }
        end
      end
      
      describe 'given wildcards'
        it 'should pass a set of caches'
          var result
          store.set('user:1', 'a', function(){
            store.set('user:2', 'b', function(){
              store.set('foo', 'bar', function(){
                store.get('user:*', function(val){
                  result = val
                })
              })
            })
          })
          result.should.eql { 'user:1': 'a', 'user:2': 'b' }
        end
      end
    end
    
    describe '#clear()'
      describe 'given a key'
        it 'should delete previous data'
          var result
          store.set('foo', 'bar', function(){
            store.clear('foo', function(){
              store.get('foo', function(val){
                result = val
              })
            })
          })
          result.should.be_null
        end
      end
      
      describe 'given wildcards'
        it 'should clear a set of caches'
          var results = []
          store.set('user:one', '1', function(){
            store.set('user:two', '2', function(){
              store.clear('user:*', function(){
                store.get('user:one', function(val){
                  results.push(val)
                  store.get('user:two', function(val){
                    results.push(val)
                  })
                })
              })
            })  
          })
          results.should.eql [null, null]
        end
      end
    end
    
    describe '#reap()'
      it 'should destroy caches older than the given age in milliseconds'
        store.set('user:one', '1')
        store.data['user:one'].created = Number((5).minutes.ago)
        store.set('user:two', '2')
        store.data['user:two'].created = Number((2).seconds.ago)
        store.reap((1).minute)
        store.get('user:one', function(val){
          val.should.be_null
        })
        store.get('user:two', function(val){
          val.should.not.be_null
        })
      end
    end
  end
end