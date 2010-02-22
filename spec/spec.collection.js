
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
    
    describe 'shorthand expressions'
      describe 'with 3 or less chars'
        it 'should be considered binary operator between a / b'
          $(5..1).sort('-').toArray().should.eql 1..5
          $(5..1).reduce(0, '+').should.eql 15
        end
      end
      
      describe 'with over 3 chars'
        it 'should be considered a return expression'
          $(5..1).sort('a - b').toArray().should.eql 1..5
          $(5..1).reduce(0, 'a + b').should.eql 15
        end
        
        it 'should consider a single word a property on a'
          $(['foo', 'foobar']).map('length').toArray().should.eql [3, 6]
        end
        
        it 'should consider a single function a method on a'
          $(['foo', 'foobar']).map('charAt(0)').toArray().should.eql ['f', 'f']
        end
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
      
      it 'should allow shorthand expressions'
        $([1,2,3]).reduce(0, '+').should.eql 6
        $([1,2,3]).reduce(0, 'a + b').should.eql 6
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
      
      it 'should allow shorthand expressions'
        $(['foo', 'bar']).map('a.toUpperCase()').toArray().should.eql ['FOO', 'BAR']
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
    
    describe '#last()'
      it 'should return the last value'
        $(['foo', 'bar']).last().should.eql 'bar'
      end
      
      it 'should return the last n values'
        $([5,4,3,2,1]).last(2).at(0).should.eql 2
        $([5,4,3,2,1]).last(2).at(1).should.eql 1
      end
      
      it 'should work with objects'
        $({ a: 'foo', b: 'bar' }).last(2).at(0).should.eql 'foo'
        $({ a: 'foo', b: 'bar' }).last(2).at(1).should.eql 'bar'
        $({ a: 'foo', b: 'bar' }).last().should.eql 'bar'
      end  
    end
    
    describe '#drop()'
      it 'should drop the first n values'
        $(1..5).drop(2).arr.should.eql 3..5
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
      
      it 'should allow shorthand expressions'
        $(['foo', 'bar']).find("a.charAt(0) == 'b'").should.eql 'bar'
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
      
      it 'should allow shorthand expressions'
        $(['foo', 'bar']).all('a.length > 2').should.be_true
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
      
      it 'should allow shorthand expressions'
        $(['foo', 'bar']).any('a.length > 2').should.be_true
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
      
      it 'should allow shorthand expressions'
        $([1,2,3,4,5]).select('a % 2').toArray().should.eql [1,3,5]
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
      
      it 'should allow shorthand expressions'
        $(['foo', 'bar']).reject('a.charAt(0) == "b"').toArray().should.eql ['foo']
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
        $(['foo', 'bar']).keys().at(0).should.eql '0'
        $(['foo', 'bar']).keys().at(1).should.eql '1'
      end
      
      it 'should return keys when an object'
        $({ foo: 'bar', baz: 'raz' }).keys().at(0).should.eql 'foo'
        $({ foo: 'bar', baz: 'raz' }).keys().at(1).should.eql 'baz'
      end
    end
    
    describe '#toArray()'
      it 'should return an array'
        $(['foo', 'bar']).keys().toArray().should.eql ['0', '1']
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
    
    describe '#avg()'
      it 'should return the average of numeric values'
        $([3,1]).avg().should.eql 2
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
        b.arr.should.not.equal a.arr
      end
      
      it 'should clone an object collection'
        var a = $({ foo: 'bar' })
        var b = a.clone()
        a.should.not.equal b
        b.arr.should.eql { foo: 'bar' }
        b.arr.should.not.equal a.arr
      end
    end
    
    describe '#sample()'
      it 'should return a random value'
        Math.stub('random').and_return(0.1)
        $([1,2,3,4]).sample().should.eql 1
      end
    end
    
    describe '#reverse()'
      it 'should reverse a collection'
        $([1,2,3]).reverse().toArray().should.eql [3,2,1]
      end
    end
    
    describe '#sort()'
      it 'should sort a collection'
        $([3,1,2]).sort().toArray().should.eql [1,2,3]
      end
      
      it 'should sort with a function'
        $([3,1,2]).sort(function(a, b){ return b - a }).toArray().should.eql [3,2,1]
      end
      
      it 'should allow shorthand expressions'
        $([3,1,2]).sort('-').toArray().should.eql [1,2,3]
      end
    end
    
    describe '#join()'
      it 'should join a collection with "" by default'
        $([1,2,3]).join().should.eql '123'
      end
      
      it 'should join with an arbitrary string'
        $([1,2,3]).join(' ').should.eql '1 2 3'
      end
      
      it 'should work with objects'
        $({ foo: 'bar', baz: 'raz' }).join(' ').should.eql 'bar raz'
      end
    end
    
    describe '#includes()'
      it 'should return true when the value is present'
        $([1,2,3]).includes(2).should.be_true
      end
      
      it 'should return true when all values are present'
        $([1,2,3]).includes(2, 3).should.be_true
      end
      
      it 'should return false when the value is not present'
        $([1,2,3]).includes(4).should.be_false
      end
      
      it 'should return false when the any value is not present'
        $([1,2,3]).includes(1,2,4).should.be_false
        $([1,2,3]).includes(1,4,2).should.be_false
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