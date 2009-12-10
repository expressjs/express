
process.mixin(require('express/collection'))

describe 'Express'
  describe 'Collection'
    describe '$(array)'
      it 'should return a Collection'
        $(['foo', 'bar']).should.be_an_instance_of Collection
      end
    end
    
    describe '$(object)'
      it 'should return a Collection'
        $({ foo: 'bar' }).should.be_an_instance_of Collection
      end
    end
    
    describe '$(Collection)'
      it 'should return the collection passed'
        var collection = $(['foo'])
        $(collection).should.equal collection
      end
    end
    
    describe '#at()'
      it 'should return the value at the given index'
        $(['foo', 'bar']).at(0).should.eql 'foo'
        $(['foo', 'bar']).at(1).should.eql 'bar'
        $(['foo', 'bar']).at(2).should.be_null
      end
      
      it 'should work with objects'
        $({ foo: 'bar', baz: 'raz' }).at(0).should.eql 'bar'
        $({ foo: 'bar', baz: 'raz' }).at(1).should.eql 'raz'
        $({ foo: 'bar', baz: 'raz' }).at(2).should.be_null
      end
    end
    
    describe '#each()'
      it 'should iterate passing index and value'
        var result = []
        $(['foo', 'bar']).each(function(val, i){
          result.push(i, val)
        })
        result.should.eql [0, 'foo', 1, 'bar']
      end
      
      it 'should work with objects'
        var result = []
        $({ foo: 'bar', baz: 'raz' }).each(function(val, key){
          result.push(key, val)
        })
        result.should.eql ['foo', 'bar', 'baz', 'raz']
      end
      
      it 'should return the collection'
        $([]).each(function(){}).should.be_an_instance_of Collection
      end
    end
    
    describe '#reduce()'
      it 'should iterate with memo object'
        var sum = $([1,2,3]).reduce(0, function(sum, n){ return sum + n })
        sum.should.eql 6
      end
    end
    
    describe '#map()'
      it 'should iterate collecting results into a new collection'
        var collection = $(['foo', 'bar']).map(function(val){ return val.toUpperCase() })
        collection.at(0).should.eql 'FOO'
        collection.at(1).should.eql 'BAR'
      end
      
      it 'should work with objects'
        var collection = $({ foo: 'bar', baz: 'raz' }).map(function(val){ return val.toUpperCase() })
        collection.at(0).should.eql 'BAR'
        collection.at(1).should.eql 'RAZ'
      end
    end
    
    describe '#first()'
      it 'should return the first value'
        $(['foo']).first().should.eql 'foo'
      end
      
      it 'should return the first n values'
        $([5,4,3,2,1]).first(2).at(0).should.eql 5
        $([5,4,3,2,1]).first(2).at(1).should.eql 4
      end
      
      it 'should work with objects'
        $({ foo: 'bar' }).first().should.eql 'bar'
      end  
    end
    
    describe '#find()'
      it 'should return the value of the first match'
        var result = $(['foo', 'bar']).find(function(val){ return val.charAt(0) == 'b' })
        result.should.eql 'bar'
      end
      
      it 'should return null when nothing matches'
        var result = $(['foo', 'bar']).find(function(val){ return val.charAt(0) == 'a' })
        result.should.be_null
      end
      
      it 'should work with objects'
        var result = $({ foo: 'bar', baz: 'raz' }).find(function(val, key){
          return val.charAt(0) == 'r'
        })
        result.should.eql 'raz'
      end
    end
    
    describe '#all()'
      it 'should return true when all evaluate to true'
        $(['foo', 'foobar']).all(function(val){ return val.charAt(0) == 'f' }).should.be_true
      end
      
      it 'should return false when any evaluate to false'
        $(['foo', 'bar', 'foobar']).all(function(val){ return val.charAt(0) == 'f' }).should.be_false
      end
      
      it 'should work with objects'
        $({ a: 'foo', b: 'foobar' }).all(function(val){ return val.charAt(0) == 'f' }).should.be_true
      end
    end
    
    describe '#any()'
      it 'should return true when found'
        $(['foo', 'bar']).any(function(val){ return val.charAt(0) == 'b' }).should.be_true
      end
      
      it 'should return false when not found'
        $(['foo', 'bar']).any(function(val){ return val.charAt(0) == 'r' }).should.be_false
      end
      
      it 'should work with objects'
        $({ foo: 'bar' }).any(function(val){ return val.charAt(0) == 'b' }).should.be_true
        $({ foo: 'bar' }).any(function(val){ return val.charAt(0) == 'c' }).should.be_false
      end
    end
    
    describe '#select()'
      it 'should return values which evaluate to true'
        var result = $([1,2,3,4,5]).select(function(n){ return n % 2 })
        result.at(0).should.eql 1
        result.at(1).should.eql 3
        result.at(2).should.eql 5
      end
      
      it 'should return a Collection'
        var result = $([1,2,3,4,5]).select(function(n){ return n % 2 })
        result.should.be_an_instance_of Collection
      end
    end
    
    describe '#reject()'
      it 'should return values which evaluate to false'
        var result = $([1,2,3,4,5,6]).reject(function(n){ return n % 2 })
        result.at(0).should.eql 2
        result.at(1).should.eql 4
        result.at(2).should.eql 6
      end
      
      it 'should return a Collection'
        var result = $([1,2,3,4,5]).reject(function(n){ return n % 2 })
        result.should.be_an_instance_of Collection
      end
    end
        
    describe '#slice()'
      it 'should return a slice of values'
        var collection = $(['foo', 'bar', 'baz']).slice(1, 3)
        collection.at(0).should.eql 'bar'
        collection.at(1).should.eql 'baz'
      end
      
      it 'should work with objects'
        var collection = $({ foo: 1, bar: 2, baz: 3, raz: 4 }).slice(1, 3)
        collection.at(0).should.eql 2
        collection.at(1).should.eql 3        
      end
    end
    
    describe '#grep()'
      it 'should select values matching the regular expression passed'
        var result = $(['foo', 'bar', 'foobar', 'baz']).grep(/foo(bar)?/)
        result.at(0).should.eql 'foo'
        result.at(1).should.eql 'foobar'
        result.at(2).should.be_null
      end
    end
    
    describe '#keys()'
      it 'should return indices when array-like'
        $(['foo', 'bar']).keys().at(0).should.eql 0
        $(['foo', 'bar']).keys().at(1).should.eql 1
      end
      
      it 'should return keys when an object'
        $({ foo: 'bar', baz: 'raz' }).keys().at(0).should.eql 'foo'
        $({ foo: 'bar', baz: 'raz' }).keys().at(1).should.eql 'baz'
      end
    end
    
    describe '#toArray()'
      it 'should return an array'
        $(['foo', 'bar']).keys().toArray().should.eql [0, 1]
      end
      
      it 'should work on nested collections'
        $([$(['foo']), $(['bar'])]).toArray().should.eql [['foo'], ['bar']]
      end
      
      it 'should work with objects'
        $({ foo: 'bar', baz: { name: 'wahoo' }}).toArray().should.eql ['bar', { name: 'wahoo' }]
      end
    end
    
    describe '#min()'
      it 'should return the min value'
        $([4,5,2,3,62]).min().should.eql 2
      end
    end
    
    describe '#max()'
      it 'should return the max value'
        $([3,5,2,3,43,2]).max().should.eql 43
      end
    end
    
    describe '#length()'
      it 'should work with arrays'
        $([1,2,3]).length().should.eql 3
      end
      
      it 'should work with objects'
        $({ a: 'b', c: 'd', e: 'f' }).length().should.eql 3
      end
    end
    
    describe '#chunk()'
      it 'should group into chunks of the given size'
        $([1,1,2,2,3,3]).chunk(2).toArray().should.eql [[1,1],[2,2],[3,3]]
        $([1,1,2,2,3,3]).chunk(4).toArray().should.eql [[1,1,2,2],[3,3]]
      end
    end
    
    describe '#sum()'
      it 'should return the sum of the numeric values'
        $([1,2,3]).sum().should.eql 6
      end
    end
    
    describe '#merge()'
      it 'should merge two array collections'
        var a = $([1,2,3])
        var b = $([4,5,6])
        a.merge(b).toArray().should.eql [1,2,3,4,5,6]
        
        var a = $([1,2,3])
        var b = [4,5,6]
        a.merge(b).toArray().should.eql [1,2,3,4,5,6]
      end
      
      it 'should merge two object collections'
        var a = $({ a: 'b' })
        var b = $({ c: 'd' })
        a.merge(b).arr.should.eql { a: 'b', c: 'd' }
        
        var a = $({ a: 'b' })
        var b = { c: 'd' }
        a.merge(b).arr.should.eql { a: 'b', c: 'd' }
      end
      
      it 'should merge an array and object collection'
        var a = $([1,2])
        var b = $({ a: 'b', c: 'd' })
        a.merge(b).arr.should.eql [1, 2, 'b', 'd']
        
        var a = $([1,2])
        var b = { a: 'b', c: 'd' }
        a.merge(b).arr.should.eql [1, 2, 'b', 'd']
      end
      
      it 'should merge an object and array collection'
        var a = $({ a: 'b', c: 'd' })
        var b = $([1,2])
        a.merge(b).arr.should.eql { a: 'b', c: 'd', 0: 1, 1: 2 }
        
        var a = $({ a: 'b', c: 'd' })
        var b = [1,2]
        a.merge(b).arr.should.eql { a: 'b', c: 'd', 0: 1, 1: 2 }
      end
    end
    
    describe '#clone()'
      it 'should clone an array collection'
        var a = $([1,2,3])
        var b = a.clone()
        a.should.not.equal b
        b.arr.should.eql [1,2,3]
      end
      
      it 'should clone an object collection'
        var a = $({ foo: 'bar' })
        var b = a.clone()
        a.should.not.equal b
        b.arr.should.eql { foo: 'bar' }
      end
    end
    
    describe '#sample()'
      it 'should return a random value'
        var a = $([1,2,3,4]).sample()
        var b = $([1,2,3,4]).sample()
        a.should.not.eql b
      end
    end
    
    describe '#toString()'
      it 'should output [Collection ...] for array'
        $([1,2,3]).toString().should.eql '[Collection 1,2,3]'
      end
      
      it 'should output [Collection [object Object]] for object'
        $({ foo: "bar" }).toString().should.eql '[Collection [object Object]]'
      end
      
      it 'should output [Collection [[Collection ...]]] for nested collections'
        $([$([1,2,3])]).toString().should.eql '[Collection [Collection 1,2,3]]'
      end
    end
    
  end
end